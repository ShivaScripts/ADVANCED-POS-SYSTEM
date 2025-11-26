// pos-frontend-vite/src/routes/SuperAdminRoutes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// Import SuperAdmin pages
import SuperAdminDashboard from "../pages/SuperAdminDashboard/SuperAdminDashboard";
import Dashboard from "../pages/SuperAdminDashboard/Dashboard";

// Removed: SubscriptionPlansPage
import StoreListPage from "../pages/SuperAdminDashboard/store/StoreListPage";
import StoreDetailsPage from "../pages/SuperAdminDashboard/store/StoreDetailsPage";
import PendingRequestsPage from "../pages/SuperAdminDashboard/store/PendingRequestsPage";
// Removed: SettingsPage

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="stores" element={<StoreListPage />} />
        <Route path="stores/:id" element={<StoreDetailsPage />} />
        <Route path="requests" element={<PendingRequestsPage />} />
        {/* Removed: subscriptions route */}
        {/* Removed: settings route */}
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;