// pos-frontend-vite/src/routes/StoreRoutes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Store Admin/Manager pages
import StoreDashboard from "../pages/store/Dashboard/StoreDashboard";
import Branches from "../pages/store/Branch/Branches";
import Categories from "../pages/store/Category/Categories";
import Products from "../pages/store/Product/Products";
import { Dashboard } from "../pages/store/Dashboard";
import {
  Reports,
  Sales,
  Settings
} from "../pages/store/store-admin";
import StoreEmployees from "../pages/store/Employee/StoreEmployees";
import Stores from "../pages/store/storeInformation/Stores";
// REMOVED: PricingSection import was causing the crash
import Upgrade from "../pages/store/upgrade/Upgrade";
import Alerts from "../pages/store/Alerts/Alerts";

const StoreRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StoreDashboard />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="branches" element={<Branches />} />
        <Route path="categories" element={<Categories />} />
        <Route path="employees" element={<StoreEmployees />} />
        <Route path="products" element={<Products />} />
        <Route path="stores" element={<Stores />} />
        
        <Route path="sales" element={<Sales />} />
      
        <Route path="reports" element={<Reports />} />
        <Route path="upgrade" element={<Upgrade />} />
        <Route path="settings" element={<Settings />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
};

export default StoreRoutes;