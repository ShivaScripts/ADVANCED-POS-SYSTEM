// pos-frontend-vite/src/Redux Toolkit/features/customer/customerSlice.js

import { createSlice } from '@reduxjs/toolkit';
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  getAllCustomers,
  addLoyaltyPoints,
  getCustomerStatsByBranch, // <-- IMPORT NEW THUNK (existing)
  getCustomersByBranch      // <-- START: ADD THIS IMPORT
} from './customerThunks';

const initialState = {
  customers: [],
  selectedCustomer: null,
  overviewStats: null, // <-- START: ADD NEW STATE
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearCustomerState: (state) => {
      state.customers = [];
      state.selectedCustomer = null;
      state.overviewStats = null; // <-- RESET NEW STATE
      state.error = null;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    setSelectedCustomerFromList: (state, action) => {
      state.selectedCustomer = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(customer => customer.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.selectedCustomer && state.selectedCustomer.id === action.payload.id) {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(customer => customer.id !== action.payload);
        if (state.selectedCustomer && state.selectedCustomer.id === action.payload) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Customer by ID
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCustomer = action.payload;
      })
      .addCase(getCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Customers
      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        // NOTE: We intentionally do NOT set state.customers here anymore.
        // The main customer list will be controlled by getCustomersByBranch.
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- START: NEW CASES for Customers by Branch ---
      .addCase(getCustomersByBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomersByBranch.fulfilled, (state, action) => {
        state.loading = false;
        // This now correctly sets the customer list based on branch
        state.customers = action.payload;
      })
      .addCase(getCustomersByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- END: NEW CASES for Customers by Branch ---
      
      // --- START: NEW CASES for Customer Stats ---
      .addCase(getCustomerStatsByBranch.pending, (state) => {
        state.loading = true;
        state.overviewStats = null;
      })
      .addCase(getCustomerStatsByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.overviewStats = action.payload;
      })
      .addCase(getCustomerStatsByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.overviewStats = null;
      })
      // --- END: NEW CASES for Customer Stats ---

      // Add Loyalty Points
      .addCase(addLoyaltyPoints.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLoyaltyPoints.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCustomer = action.payload;
        const index = state.customers.findIndex(customer => customer.id === updatedCustomer.id);
        if (index !== -1) {
          state.customers[index] = updatedCustomer;
        }
        if (state.selectedCustomer && state.selectedCustomer.id === updatedCustomer.id) {
          state.selectedCustomer = updatedCustomer;
        }
      })
      .addCase(addLoyaltyPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generic error handling
      .addMatcher(
        (action) => action.type.startsWith('customer/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearCustomerState, clearSelectedCustomer, setSelectedCustomerFromList } = customerSlice.actions;
export default customerSlice.reducer;
