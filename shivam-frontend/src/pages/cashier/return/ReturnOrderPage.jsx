// pos-frontend-vite/src/pages/cashier/return/ReturnOrderPage.jsx

import React, { useState, useEffect } from "react";
// --- START: 1. Import useNavigate and Button ---
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
// --- END: 1. ---
import {
  OrderDetailsSection,
  ReturnItemsSection,
  ReturnReceiptDialog,
} from "./components";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersByBranch } from "../../../Redux Toolkit/features/order/orderThunks";
import OrderTable from "./components/OrderTable";

const ReturnOrderPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- 2. Initialize hook
  const { branch } = useSelector((state) => state.branch);

  // Fetch orders (no change)
  useEffect(() => {
    console.log("branch ", branch);
    if (branch?.id) {
      dispatch(getOrdersByBranch({ branchId: branch.id }));
    }
  }, [dispatch, branch]);

  const handleSelectOrder = (order) => {
    console.log("selected order", order);
    setSelectedOrder(order);
  };

  return (
    <div className="h-full flex flex-col">
      {/* --- START: 3. MODIFIED Header --- */}
      <div className="p-4 bg-card border-b flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate("/cashier")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Return / Refund</h1>
      </div>
      {/* --- END: 3. MODIFIED Header --- */}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Order Search & Selection */}
        {!selectedOrder ? (
          <OrderTable handleSelectOrder={handleSelectOrder} />
        ) : (
          <>
            <OrderDetailsSection
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
            <ReturnItemsSection
              setShowReceiptDialog={setShowReceiptDialog}
              selectedOrder={selectedOrder}
            />
          </>
        )}
      </div>

      {selectedOrder && (
        <ReturnReceiptDialog
          showReceiptDialog={showReceiptDialog}
          setShowReceiptDialog={setShowReceiptDialog}
          selectedOrder={selectedOrder}
        />
      )}
    </div>
  );
};

export default ReturnOrderPage;