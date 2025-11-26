import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { resetOrder, addCustomItemToCart } from "@/Redux Toolkit/features/cart/cartSlice";

// Import components
import POSHeader from "./components/POSHeader";
import ProductSection from "./product/ProductSection";
import CartSection from "./cart/CartSection";
import PaymentDialog from "./payment/PaymentDialog";
import HeldOrdersDialog from "./components/HeldOrdersDialog";
import CustomerDialog from "./customer/CustomerDialog";
import InvoiceDialog from "./order/OrderDetails/InvoiceDialog";
import CustomItemDialog from "./components/CustomItemDialog";

const CreateOrderPage = () => {
  const { toast } = useToast();
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();
  const { error: orderError } = useSelector((state) => state.order);

  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showHeldOrdersDialog, setShowHeldOrdersDialog] = useState(false);
  const [showCustomItemDialog, setShowCustomItemDialog] = useState(false);
  const [orderForReceipt, setOrderForReceipt] = useState(null);

  useEffect(() => {
    if (orderError) {
      toast({ title: "Order Error", description: orderError, variant: "destructive" });
    }
  }, [orderError, toast]);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleReceiptDialogClose = () => {
    setShowReceiptDialog(false);
    setOrderForReceipt(null);
    dispatch(resetOrder());
    toast({ title: "Order Completed", description: "Ready for next order." });
  };
  
  const handleAddCustomItem = ({ name, price }) => {
    if (!name || price <= 0) {
      toast({ title: "Invalid Item", description: "Please provide a valid name and price.", variant: "destructive" });
      return;
    }
    dispatch(addCustomItemToCart({ name, price }));
    toast({ title: "Item Added", description: `${name} (₹${price}) added to cart.` });
    setShowCustomItemDialog(false);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <POSHeader />
      
      {/* MAIN CONTENT AREA - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Products (Flexible width) */}
        <div className="flex-1 relative">
             <ProductSection 
                searchInputRef={searchInputRef}
                onCustomItemClick={() => setShowCustomItemDialog(true)} 
            />
        </div>

        {/* RIGHT: The Unified Receipt Sidebar (Wider & Fixed) */}
        <div className="w-[35%] min-w-[420px] max-w-[500px] flex-shrink-0 h-full border-l border-border/50 bg-card shadow-2xl z-20">
            <CartSection 
                setShowHeldOrdersDialog={setShowHeldOrdersDialog}
                setShowPaymentDialog={setShowPaymentDialog}
                setShowCustomerDialog={setShowCustomerDialog}
            />
        </div>
      </div>

      {/* DIALOGS */}
      <CustomerDialog showCustomerDialog={showCustomerDialog} setShowCustomerDialog={setShowCustomerDialog} />
      <PaymentDialog showPaymentDialog={showPaymentDialog} setShowPaymentDialog={setShowPaymentDialog} setShowReceiptDialog={setShowReceiptDialog} setOrderForReceipt={setOrderForReceipt} />
      <InvoiceDialog showInvoiceDialog={showReceiptDialog} setShowInvoiceDialog={setShowReceiptDialog} orderData={orderForReceipt} onClose={handleReceiptDialogClose} />
      <HeldOrdersDialog showHeldOrdersDialog={showHeldOrdersDialog} setShowHeldOrdersDialog={setShowHeldOrdersDialog} />
      <CustomItemDialog isOpen={showCustomItemDialog} onClose={() => setShowCustomItemDialog(false)} onConfirm={handleAddCustomItem} />
    </div>
  );
};

export default CreateOrderPage;