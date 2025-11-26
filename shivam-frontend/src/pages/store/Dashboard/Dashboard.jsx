// === Merged: Dashboard.jsx ===
// Merged AI-updated Dashboard with placeholders filled from the old version.
// Fetches recent sales from storeAnalytics slice and passes data to RecentSales component.

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardStats from "./DashboardStats";
import RecentSales from "./RecentSales";
import SalesTrend from "./SalesTrend";
// --- START: Add Imports ---
import { getRecentSales } from "../../../Redux Toolkit/features/storeAnalytics/storeAnalyticsThunks";
import { clearStoreAnalyticsState } from "../../../Redux Toolkit/features/storeAnalytics/storeAnalyticsSlice";
// --- END: Add Imports ---

export default function Dashboard() {
  // --- START: Add Hooks ---
  const dispatch = useDispatch();
  
  // Get the storeAdminId (assuming it's the logged-in user's ID)
  // We get this from the 'user' slice, which should be populated on login
  const storeAdminId = useSelector((state) => state.user.userProfile?.id);
  
  // Get the data from the 'storeAnalytics' slice
  const { recentSales, loading, error } = useSelector(
    (state) => state.storeAnalytics
  );
  // --- END: Add Hooks ---

  // --- START: Add useEffect to fetch data ---
  useEffect(() => {
    // Only fetch if we have the storeAdminId
    if (storeAdminId) {
      dispatch(getRecentSales(storeAdminId));
    }

    // Optional: Clear analytics state on component unmount
    return () => {
      // If you want data to be fresh every time you visit,
      // you can dispatch(clearStoreAnalyticsState());
      // For now, we'll let it cache.
    };
  }, [dispatch, storeAdminId]);
  // --- END: Add useEffect ---

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Stats Overview */}
      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recent Sales - Now with dynamic data! */}
        <RecentSales 
          recentSales={recentSales}
          loading={loading}
          error={error}
        />

        {/* Sales Trend */}
        <SalesTrend />
      </div>
    </div>
  );
}
