import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item, updateCartItemQuantity, removeFromCart }) => {
  return (
    <div className="group flex items-start gap-3 py-3 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors px-2 rounded-md">
      
      {/* Qty Controls (Vertical or Compact) */}
      <div className="flex flex-col items-center border border-border rounded-md bg-background h-16 w-8 shrink-0 overflow-hidden shadow-sm">
        <button 
            className="h-6 w-full flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
        >
            <Plus size={10} strokeWidth={3} />
        </button>
        <div className="flex-1 flex items-center justify-center text-xs font-bold font-mono bg-muted/20 w-full">
            {item.quantity}
        </div>
        <button 
            className="h-6 w-full flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
        >
            <Minus size={10} strokeWidth={3} />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-sm leading-tight text-foreground">{item.name}</h3>
            <span className="font-bold text-sm font-mono tabular-nums">
                ₹{(item.sellingPrice * item.quantity).toFixed(2)}
            </span>
        </div>
        
        <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider">
                    {item.sku || '---'}
                </span>
                <span>@ ₹{item.sellingPrice}</span>
            </div>
            
            {/* Delete Button (Visible on Hover) */}
            <button 
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromCart(item.id)}
            >
                <Trash2 size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;