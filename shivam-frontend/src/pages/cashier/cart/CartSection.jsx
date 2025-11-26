import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Pause, Trash2, Receipt } from "lucide-react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, removeFromCart, selectCartItems, selectHeldOrders, updateCartItemQuantity } from "@/Redux Toolkit/features/cart/cartSlice";
import { toast } from "sonner";

// Imports
import CustomerSection from "../payment/CustomerSection"; 
import DiscountSection from "../payment/DiscountSection"; 
import PaymentSection from "../payment/PaymentSection"; 

const CartSection = ({ setShowHeldOrdersDialog, setShowPaymentDialog, setShowCustomerDialog }) => {
  const cartItems = useSelector(selectCartItems);
  const heldOrders = useSelector(selectHeldOrders);
  const dispatch = useDispatch();

  const handleUpdateCartItemQuantity = (id, newQuantity) => {
    dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
  };
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };
  const handleClearCart = () => {
    if(cartItems.length === 0) return;
    if(window.confirm("Are you sure you want to clear the cart?")) {
        dispatch(clearCart());
        toast.success("Cart Cleared");
    }
  };

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      
      {/* 1. TOP SECTION: Header + Customer */}
      <div className="flex-shrink-0 bg-background z-10 shadow-sm">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-border/40">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <ShoppingCart size={18} />
                </div>
                <div>
                    <h2 className="font-bold text-sm leading-none">Current Order</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                        Receipt #{Math.floor(Math.random() * 10000)}
                    </p>
                </div>
            </div>

            <div className="flex gap-1">
                {heldOrders.length > 0 && (
                    <Button variant="secondary" size="xs" className="h-7 text-xs px-2" onClick={() => setShowHeldOrdersDialog(true)}>
                        <Pause size={12} className="mr-1" /> Held ({heldOrders.length})
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={handleClearCart} disabled={cartItems.length === 0}>
                    <Trash2 size={16} />
                </Button>
            </div>
          </div>

          {/* Customer (Compact Row) */}
          <CustomerSection setShowCustomerDialog={setShowCustomerDialog} />
      </div>

      {/* 2. MIDDLE SECTION: Scrollable List */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent bg-muted/5 relative">
        {cartItems.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 space-y-2 pointer-events-none">
            <Receipt size={48} strokeWidth={1} />
            <p className="text-sm font-medium">Start scanning items</p>
          </div>
        ) : (
          <div className="space-y-1">
             {cartItems.map((item) => (
                <CartItem
                key={item.id}
                item={item}
                updateCartItemQuantity={handleUpdateCartItemQuantity}
                removeFromCart={handleRemoveFromCart}
                />
            ))}
          </div>
        )}
      </div>

      {/* 3. BOTTOM SECTION: Actions & Pay */}
      <div className="flex-shrink-0 bg-background border-t border-border shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
         {/* Compact Actions */}
         <div className="border-b border-border/50">
            <DiscountSection />
         </div>

         {/* Summary */}
         <CartSummary />
         
         {/* Payment Button */}
         <PaymentSection setShowPaymentDialog={setShowPaymentDialog} />
      </div>
    </div>
  );
};

export default CartSection;