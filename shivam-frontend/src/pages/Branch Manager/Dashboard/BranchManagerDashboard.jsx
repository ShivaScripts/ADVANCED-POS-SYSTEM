// pos-frontend-vite/src/pages/Branch Manager/BranchManagerDashboard.jsx

import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBranchById } from "@/Redux Toolkit/features/branch/branchThunks";
import BranchManagerSidebar from "./BranchManagerSidebar";
import BranchManagerTopbar from "./BranchManagerTopbar";

// --- START: ADD THIS IMPORT (added by AI) ---
import { getTodayOverview } from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks";
// --- END: ADD THIS IMPORT ---

export default function BranchManagerDashboard({ children }) {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  
  useEffect(() => {
    // Fetch branch data when component mounts
    if (localStorage.getItem("jwt") && userProfile?.branchId) {
      dispatch(getBranchById({ id: userProfile.branchId, jwt: localStorage.getItem("jwt") }));

      // --- START: ADD THIS DISPATCH (added by AI) ---
      // This will fetch the overview data, including low stock alerts
      dispatch(getTodayOverview(userProfile.branchId));
      // --- END: ADD THIS DISPATCH ---
    }
  }, [dispatch, userProfile]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <BranchManagerSidebar />
      <div className="flex-1 flex flex-col">
        <BranchManagerTopbar />
        <main className="flex-1 overflow-y-auto p-8 md:p-10 lg:p-12 bg-background/80 rounded-tl-3xl shadow-xl m-4">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
