// pos-frontend-vite/src/pages/cashier/order/OrderHistoryPage.jsx

import { useState, useEffect, useMemo } from "react";
// --- START: 1. Import useNavigate (added by AI) ---
import { useLocation, useNavigate } from "react-router-dom";
// --- END: 1. ---
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  SearchIcon, PrinterIcon, EyeIcon, RotateCcwIcon, CalendarIcon, Loader2, RefreshCw, Download, X,
  // --- START: 2. Import Back Icon (added by AI) ---
  ArrowLeft
  // --- END: 2. ---
} from "lucide-react";
import { getOrdersByCashier } from "@/Redux Toolkit/features/order/orderThunks";
import OrderDetails from "./OrderDetails/OrderDetails";
import OrderTable from "./OrderTable";
import { handleDownloadOrderPDF } from "./pdf/pdfUtils";

console.log("THIS IS THE NEW FILE - V 1.2.4");

// Helper function to format date as YYYY-MM-DD (for input type="date")
const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  const year = d.getFullYear();
  return [year, month, day].join('-');
};

// Helper: create a local YYYY-MM-DDTHH:mm:ss string (no timezone offset)
const formatToLocalDateTimeString = (date) => {
  const pad = (num) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const location = useLocation();
  // --- START: 3. Initialize useNavigate hook (added by AI) ---
  const navigate = useNavigate();
  // --- END: 3. ---
  const { userProfile } = useSelector((state) => state.user);
  const { orders: allOrders, loading, error } = useSelector((state) => state.order);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [customDateRange, setCustomDateRange] = useState({
    start: formatDateForInput(new Date()),
    end: formatDateForInput(new Date()),
  });
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- Date Calculation and Fetching Logic ---
  const calculateDateRange = () => {
    const now = new Date();
    let fromDate = new Date();
    let toDate = new Date();

    switch (dateFilter) {
      case "today":
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        break;
      case "week": {
        const firstDayOfWeek = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1); // week starts Monday
        fromDate.setDate(firstDayOfWeek);
        fromDate.setHours(0, 0, 0, 0);
        toDate = new Date(fromDate);
        toDate.setDate(fromDate.getDate() + 6);
        toDate.setHours(23, 59, 59, 999);
        break;
      }
      case "month":
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case "custom":
        if (customDateRange.start && customDateRange.end) {
          fromDate = new Date(customDateRange.start);
          fromDate.setHours(0, 0, 0, 0);
          toDate = new Date(customDateRange.end);
          toDate.setHours(23, 59, 59, 999);
        } else {
          console.warn("Custom date range is incomplete.");
          return null;
        }
        break;
      default:
        return { from: null, to: null };
    }

    // Return local datetime strings (no timezone suffix)
    return { from: formatToLocalDateTimeString(fromDate), to: formatToLocalDateTimeString(toDate) };
  };

  const fetchOrders = () => {
    if (userProfile?.id) {
      const range = calculateDateRange();
      if (range !== null) {
        console.log(`Fetching orders for cashier ${userProfile.id} from ${range.from} to ${range.to}`);
        dispatch(getOrdersByCashier({
          cashierId: userProfile.id,
          from: range.from,
          to: range.to,
        }));
      }
    }
  };

  useEffect(() => {
    console.log("Running fetchOrders effect...");
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userProfile, dateFilter, customDateRange, location.key]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    }
  }, [error, toast]);

  // Frontend Filtering for Search
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return allOrders || [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (allOrders || []).filter(order =>
      (order.id && String(order.id).toLowerCase().includes(lowerSearchTerm)) ||
      (order.customer?.fullName && order.customer.fullName.toLowerCase().includes(lowerSearchTerm)) ||
      (order.customer?.phone && order.customer.phone.includes(lowerSearchTerm)) ||
      (order.customer?.email && order.customer.email.toLowerCase().includes(lowerSearchTerm))
    );
  }, [allOrders, searchTerm]);

  // Event Handlers
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };

  const handlePrintInvoice = (order) => {
    toast({
      title: "Printing Invoice",
      description: `Printing invoice for order ${order.id}`,
    });
    // Real print behavior would be implemented where applicable
  };

  const handleInitiateReturn = (order) => {
    toast({
      title: "Initiating Return",
      description: `Navigating to returns page for order ${order.id}`,
    });
    // Real navigation/integration with returns page should be added here
  };

  const handleDownloadPDF = async () => {
    if (selectedOrder) {
      try {
        await handleDownloadOrderPDF(selectedOrder, toast);
      } catch (err) {
        console.error("Failed to download PDF:", err);
        toast({ title: "Error", description: "Failed to download PDF", variant: "destructive" });
      }
    } else {
      toast({ title: "No order selected", description: "Please select an order before downloading", variant: "warning" });
    }
  };

  const handleRefreshOrders = () => {
    toast({
      title: "Refreshing Orders",
      description: "Fetching the latest order list...",
    });
    fetchOrders();
  };

  const handleDateFilterClick = (filter) => {
    console.log("Setting date filter to:", filter);
    setDateFilter(filter);
  };

  const handleClearCustomDate = () => {
    setCustomDateRange({ start: "", end: "" });
    setDateFilter("today");
  };

  return (
    <div className="h-full flex flex-col">
      {/* --- START: 4. MODIFIED Header (AI change) --- */}
      <div className="p-4 bg-card border-b flex justify-between items-center print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("/cashier")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>
        <Button variant="outline" onClick={handleRefreshOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>
      {/* --- END: 4. MODIFIED Header --- */}

      {/* Filters */}
      <div className="p-4 border-b print:hidden">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 min-w-[300px] relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search Order ID, Customer Name/Phone..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7" onClick={() => setSearchTerm('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Date Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button variant={dateFilter === "today" ? "default" : "outline"} onClick={() => handleDateFilterClick("today")}> Today </Button>
            <Button variant={dateFilter === "week" ? "default" : "outline"} onClick={() => handleDateFilterClick("week")}> This Week </Button>
            <Button variant={dateFilter === "month" ? "default" : "outline"} onClick={() => handleDateFilterClick("month")}> This Month </Button>
            <Button variant={dateFilter === "custom" ? "default" : "outline"} onClick={() => handleDateFilterClick("custom")}>
              <CalendarIcon className="h-4 w-4 mr-2" /> Custom
            </Button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {dateFilter === "custom" && (
          <div className="mt-4 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                min={customDateRange.start}
              />
            </div>
            <Button variant="outline" onClick={handleClearCustomDate}> Clear </Button>
          </div>
        )}
      </div>

      {/* Order Table Area */}
      <div className="flex-1 p-4 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Loader2 className="animate-spin h-16 w-16 text-primary" />
            <p className="mt-4">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <OrderTable
            orders={filteredOrders}
            handleInitiateReturn={handleInitiateReturn}
            handlePrintInvoice={handlePrintInvoice}
            handleViewOrder={handleViewOrder}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <SearchIcon size={48} strokeWidth={1} />
            <p className="mt-4">No orders found</p>
            <p className="text-sm">
              {searchTerm ? "Try adjusting your search term." : "Try adjusting your date filters or create a new order."}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        {selectedOrder && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details - Invoice #{selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <OrderDetails selectedOrder={selectedOrder} />
            <DialogFooter className="gap-2 sm:gap-0 space-x-3">
              <Button variant="outline" onClick={handleDownloadPDF} disabled={false}>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
              <Button variant="" onClick={() => handlePrintInvoice(selectedOrder)} disabled={false}>
                <PrinterIcon className="h-4 w-4 mr-2" /> Print Invoice
              </Button>
              <Button variant="outline" onClick={() => setShowOrderDetailsDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default OrderHistoryPage;
