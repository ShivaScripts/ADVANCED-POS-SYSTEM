// pos-frontend-vite/src/pages/cashier/PaymentSection.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { holdOrder, selectCartItems, selectSelectedCustomer, selectTotal } from "@/Redux Toolkit/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { CreditCard, Pause, Wallet } from "lucide-react";

const PaymentSection = ({ setShowPaymentDialog }) => {
  const cartItems = useSelector(selectCartItems);
  const selectedCustomer = useSelector(selectSelectedCustomer);
  const total = useSelector(selectTotal);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast({ title: "Empty Cart", description: "Please add items first", variant: "destructive" });
      return;
    }
    if (!selectedCustomer) {
      toast({ title: "Customer Required", description: "Select a customer first", variant: "destructive" });
      return;
    }
    setShowPaymentDialog(true);
  };

  const handleHoldOrder = () => {
    if (cartItems.length === 0) return;
    dispatch(holdOrder());
    toast({ title: "Order On Hold", description: "Order placed on hold" });
  };

  return (
    <div className="mt-auto pt-4 space-y-4 border-t border-border/50 bg-background/95 backdrop-blur p-4">
      {/* Total Display - Neon Style */}
      <div className="bg-card/50 rounded-xl p-4 border border-border/50 shadow-inner flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1 z-10">Total Payable</span>
        <div className="text-4xl font-bold tracking-tighter z-10 flex items-baseline gap-1">
             <span className="text-lg text-muted-foreground font-normal">₹</span>
             <span className="text-foreground">{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="secondary"
          className="col-span-1 h-14 flex flex-col gap-1 text-xs font-normal hover:bg-secondary/80 border border-border/50"
          onClick={handleHoldOrder}
          disabled={cartItems.length === 0}
        >
          <Pause size={18} />
          Hold
        </Button>

        <Button
          className="col-span-3 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={handlePayment}
          disabled={cartItems.length === 0}
        >
          <div className="flex items-center gap-2">
             <Wallet size={22} />
             <span>Pay ₹{total.toFixed(2)}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default PaymentSection;