// pos-frontend-vite/src/routes/BranchManagerRoutes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Branch Manager Dashboard Layout
import BranchManagerDashboard from "../pages/Branch Manager/Dashboard/BranchManagerDashboard";

// Import Branch Manager pages
import {
  Dashboard,
  Orders,
  Transactions,
  Inventory,
  // Employees,
  Customers,
  Reports,
} from "../pages/Branch Manager";
import { BranchEmployees } from "../pages/Branch Manager/Employees";
import Refunds from "../pages/Branch Manager/Refunds/Refunds";

// --- START: ADD THIS IMPORT ---
import LiveDashboard from "../pages/Branch Manager/LiveDashboard";
// --- END: ADD THIS IMPORT ---

const BranchManagerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BranchManagerDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* --- START: ADD THIS NEW ROUTE --- */}
        <Route path="live-dashboard" element={<LiveDashboard />} />
        {/* --- END: ADD THIS NEW ROUTE --- */}
        
        <Route path="orders" element={<Orders />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="employees" element={<BranchEmployees />} />
        <Route path="customers" element={<Customers />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default BranchManagerRoutes;