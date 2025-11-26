// pos-frontend-vite/src/routes/CashierRoutes.jsx

import React from "react";
// --- START: THE FIX ---
import { Navigate, Route, Routes } from "react-router-dom"; // <-- Changed from "react-router-dom"
// --- END: THE FIX ---
import CashierDashboardLayout from "../pages/cashier/CashierDashboardLayout";
import CreateOrderPage from "../pages/cashier/CreateOrderPage";
import ReturnOrderPage from "../pages/cashier/return/ReturnOrderPage";
import OrderHistoryPage from "../pages/cashier/order/OrderHistoryPage";
import CustomerLookupPage from "../pages/cashier/customer/CustomerLookupPage";
import ShiftSummaryPage from "../pages/cashier/ShiftSummary/ShiftSummaryPage";
import PageNotFound from "../pages/common/PageNotFound";

const CashierRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CashierDashboardLayout />}>
        <Route index element={<CreateOrderPage />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="returns" element={<ReturnOrderPage />} />
        <Route path="customers" element={<CustomerLookupPage />} />
        <Route path="shift-summary" element={<ShiftSummaryPage />} />
      </Route>
      <Route
        path="*"
        element={<PageNotFound/>}
      />
    </Routes>
  );
};

export default CashierRoutes;