// pos-frontend-vite/src/Redux Toolkit/features/auth/authSlice.js

import { createSlice} from '@reduxjs/toolkit';
import { login, signup, forgotPassword, resetPassword } from './authThunk';
// Import the logout thunk from userThunks
import { logout } from '../user/userThunks'; 

const initialUser = null; 

const initialState = {
  user: initialUser, // This 'user' object will hold the entire AuthResponse payload
  loading: false,
  error: null,
  isAuthenticated: false,
  forgotPasswordLoading: false,
  forgotPasswordError: null,
  forgotPasswordSuccess: false,
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // We only keep the reducers that are NOT thunks
    clearForgotPasswordState: (state) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = false;
    },
    clearResetPasswordState: (state) => {
      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // action.payload is AuthResponse
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // action.payload is the full AuthResponse
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password cases
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.forgotPasswordLoading = true;
        state.forgotPasswordError = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordLoading = false;
        state.forgotPasswordSuccess = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordLoading = false;
        state.forgotPasswordError = action.payload;
        state.forgotPasswordSuccess = false;
        state.error = action.payload;
      })

      // Reset Password cases
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
        state.resetPasswordSuccess = false;
        state.error = action.payload;
      })
      
      // --- This 'addCase' handles the imported logout thunk ---
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.forgotPasswordSuccess = false;
        state.resetPasswordSuccess = false;
      });
  },
});

// --- START: CORRECTED SELECTORS ---
// This selector correctly points to the UserDTO object inside the AuthResponse
export const selectCurrentUser = (state) => state.auth.user?.user;

// This helper path finds the store settings, whether the user is an admin or an employee
// We need to check both paths, but for a cashier, it will be in user.branch.store
const selectStoreSettings = (state) => {
  const authData = state.auth.user;
  if (!authData) return null;
  
  // Path for Store Admin (Store is on the User object directly)
  // (We check this just in case, but your payload shows a cashier)
  // const adminStore = authData.user?.store; 
  // if (adminStore) return adminStore;

  // Path for Cashier/Branch Manager (Store is nested in Branch)
  const employeeStore = authData.user?.branch?.store;
  if (employeeStore) return employeeStore;
  
  // Fallback for Super Admin, etc.
  return null;
};

// Corrected selectors for tax and currency
export const selectStoreTaxRate = (state) => selectStoreSettings(state)?.taxRate ?? 0;
export const selectStoreCurrency = (state) => selectStoreSettings(state)?.currency ?? 'USD';

// Corrected selectors for the payment toggles
export const selectAcceptsCash = (state) => selectStoreSettings(state)?.acceptsCash ?? true;
export const selectAcceptsCard = (state) => selectStoreSettings(state)?.acceptsCard ?? true;
export const selectAcceptsUpi = (state) => selectStoreSettings(state)?.acceptsUpi ?? true;
// --- END: CORRECTED SELECTORS ---

export const { clearForgotPasswordState, clearResetPasswordState } = authSlice.actions;
export default authSlice.reducer;