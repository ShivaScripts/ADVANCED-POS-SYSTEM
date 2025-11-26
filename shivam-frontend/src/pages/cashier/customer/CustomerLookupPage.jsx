// pos-frontend-vite/src/pages/cashier/customer/CustomerLookupPage.jsx

import React, { useState, useEffect } from "react";
// --- START: 1. Import useNavigate and Button (from AI) ---
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
// --- END: 1. ---
import { useDispatch, useSelector } from "react-redux";
// Replaced useToast hook with Sonner (AI change)
import { toast } from "sonner";
import {
  getAllCustomers,
  addLoyaltyPoints // <-- 1. Import new thunk
} from "@/Redux Toolkit/features/customer/customerThunks";
import {
  getOrdersByCustomer,
} from "@/Redux Toolkit/features/order/orderThunks";
import {
  filterCustomers,
  validatePoints,
  calculateCustomerStats,
} from "./utils/customerUtils";
import {
  CustomerSearch,
  CustomerList,
  CustomerDetails,
  PurchaseHistory,
  AddPointsDialog,
} from "./components";
import { clearCustomerOrders } from "../../../Redux Toolkit/features/order/orderSlice";
import { setSelectedCustomerFromList, clearSelectedCustomer } from "../../../Redux Toolkit/features/customer/customerSlice"; // <-- keep old imports
import CustomerForm from "./CustomerForm";

const CustomerLookupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- 2. Initialize hook (AI change)
  // NOTE: useToast removed in favor of Sonner: const { toast } = useToast();

  // (Redux state, local state, useEffects, and functions remain the same)
  const {
    customers,
    selectedCustomer,
    loading: customerLoading,
    error: customerError,
  } = useSelector((state) => state.customer);
  const {
    customerOrders,
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.order);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPointsDialog, setShowAddPointsDialog] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(1);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  
  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (customerError) {
      // switched to Sonner toast (AI change)
      toast.error("Error", { description: customerError });
    }
  }, [customerError]);

  useEffect(() => {
    if (orderError) {
      // switched to Sonner toast (AI change)
      toast.error("Error", { description: orderError });
    }
  }, [orderError]);

  const filteredCustomers = filterCustomers(customers, searchTerm);

  const handleSelectCustomer = async (customer) => {
    dispatch(setSelectedCustomerFromList(customer));
    dispatch(clearCustomerOrders());
    if (customer.id) {
      dispatch(getOrdersByCustomer(customer.id));
    }
  };

  // --- START: handleAddPoints (AI-provided implementation; replaces placeholder) ---
  const handleAddPoints = async () => {
    const error = validatePoints(pointsToAdd);
    if (error) {
      toast.warning("Invalid Points", { description: error });
      return;
    }
    
    if (!selectedCustomer) {
      toast.error("Error", { description: "No customer selected." });
      return;
    }

    try {
      const resultAction = await dispatch(addLoyaltyPoints({
        customerId: selectedCustomer.id,
        pointsToAdd: pointsToAdd
      }));

      if (addLoyaltyPoints.fulfilled.match(resultAction)) {
        toast.success("Points Added", {
          description: `${pointsToAdd} points added to ${
            selectedCustomer.fullName || selectedCustomer.name
          }'s account`,
        });
        setShowAddPointsDialog(false);
        setPointsToAdd(1);
      } else {
        toast.error("Error Adding Points", {
          description: resultAction.payload || "Could not add points.",
        });
      }
    } catch (err) {
      toast.error("Error", {
        description: err.message || "An error occurred.",
      });
    }
  };
  // --- END: handleAddPoints ---

  useEffect(() => {
    if (selectedCustomer) {
      dispatch(getOrdersByCustomer(selectedCustomer.id));
    }
  }, [selectedCustomer, dispatch]);

  const customerStats = selectedCustomer
    ? calculateCustomerStats(customerOrders)
    : null;
  const displayCustomer = selectedCustomer
    ? {
        ...selectedCustomer,
        ...customerStats,
      }
    : null;

  return (
    <div className="h-full flex flex-col">
      {/* --- START: 3. MODIFIED Header (AI change) --- */}
      <div className="p-4 bg-card border-b flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => navigate("/cashier")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Customer Management</h1>
      </div>
      {/* --- END: 3. MODIFIED Header --- */}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column (no change to original content) */}
        <div className="w-1/3 border-r flex flex-col ">
          {/* ... (rest of left column JSX) ... */}
          <CustomerSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddCustomer={() => setShowCustomerForm(true)}
          />

          <CustomerList
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={handleSelectCustomer}
            loading={customerLoading}
          />
        </div>

        {/* Right Column (no change to original content) */}
        <div className="w-2/3 flex flex-col overflow-y-auto">
          {/* ... (rest of right column JSX) ... */}
          <CustomerDetails
            customer={displayCustomer}
            onAddPoints={() => setShowAddPointsDialog(true)}
            loading={orderLoading}
          />

          {selectedCustomer && (
            <PurchaseHistory orders={customerOrders} loading={orderLoading} />
          )}
        </div>
      </div>

      {/* Dialogs (no change) */}
      <AddPointsDialog
        isOpen={showAddPointsDialog}
        onClose={() => setShowAddPointsDialog(false)}
        customer={selectedCustomer}
        pointsToAdd={pointsToAdd}
        onPointsChange={setPointsToAdd}
        onAddPoints={handleAddPoints}
      />
      <CustomerForm 
        showCustomerForm={showCustomerForm}
        setShowCustomerForm={setShowCustomerForm}
      />
    </div>
  );
};

export default CustomerLookupPage;
