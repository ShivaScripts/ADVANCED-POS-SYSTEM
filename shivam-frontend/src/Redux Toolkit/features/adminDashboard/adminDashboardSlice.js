import { createSlice } from '@reduxjs/toolkit';
import {
  getDashboardSummary,
  getStoreRegistrationStats,
  getStoreStatusDistribution,
  getRecentActivity // <-- START: ADD THIS
} from './adminDashboardThunks';

const initialState = {
  dashboardSummary: null,
  storeRegistrationStats: [],
  storeStatusDistribution: null,
  recentActivity: [], // <-- START: ADD THIS
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    clearAdminDashboardState: (state) => {
      state.dashboardSummary = null;
      state.storeRegistrationStats = [];
      state.storeStatusDistribution = null;
      state.error = null;
      state.recentActivity = []; // keep consistent when clearing
    },
    clearDashboardSummary: (state) => {
      state.dashboardSummary = null;
    },
    clearRegistrationStats: (state) => {
      state.storeRegistrationStats = [];
    },
    clearStatusDistribution: (state) => {
      state.storeStatusDistribution = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Summary
      .addCase(getDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardSummary = action.payload;
        state.error = null;
      })
      .addCase(getDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Store Registration Stats
      .addCase(getStoreRegistrationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreRegistrationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.storeRegistrationStats = action.payload;
        state.error = null;
      })
      .addCase(getStoreRegistrationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Store Status Distribution
      .addCase(getStoreStatusDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreStatusDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.storeStatusDistribution = action.payload;
        state.error = null;
      })
      .addCase(getStoreStatusDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- START: ADD THESE ---
      // Recent Activity
      .addCase(getRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivity = action.payload;
        state.error = null;
      })
      .addCase(getRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- END: ADD THESE ---

      // Global error handler for all adminDashboard actions
      .addMatcher(
        (action) => action.type.startsWith('adminDashboard/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { 
  clearAdminDashboardState, 
  clearDashboardSummary, 
  clearRegistrationStats, 
  clearStatusDistribution 
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;
