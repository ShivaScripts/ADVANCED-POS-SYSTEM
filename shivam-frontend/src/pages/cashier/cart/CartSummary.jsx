// pos-frontend-vite/src/pages/cashier/cart/CartSummary.jsx
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import { selectDiscountAmount, selectSubtotal, selectTax } from "@/Redux Toolkit/features/cart/cartSlice";
import { selectStoreTaxRate } from "@/Redux Toolkit/features/auth/authSlice";

const CartSummary = () => {
  const subtotal = useSelector(selectSubtotal);
  const tax = useSelector(selectTax);
  const discountAmount = useSelector(selectDiscountAmount);
  const taxRate = useSelector(selectStoreTaxRate);

  return (
    <div className="bg-muted/20 p-4 space-y-3 border-t border-border/50 backdrop-blur-sm">
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono text-foreground">₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-muted-foreground">
          <span>Tax ({taxRate.toFixed(1)}%)</span>
          <span className="font-mono text-foreground">₹{tax.toFixed(2)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-500 font-medium">
            <span>Discount</span>
            <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>
      <Separator className="bg-border/50" />
    </div>
  );
};

export default CartSummary;