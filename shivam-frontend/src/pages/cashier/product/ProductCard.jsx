// pos-frontend-vite/src/pages/cashier/product/ProductCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { addToCart } from "@/Redux Toolkit/features/cart/cartSlice";
import { Plus } from "lucide-react"; // Added icon

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success(product.name, {
            description: "Added to cart",
            duration: 1500, // shorter toast
        });
    };

    return (
        <Card
            key={product.id}
            className="group relative cursor-pointer overflow-hidden border border-border/50 bg-card/50 hover:bg-accent/5 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
            onClick={() => handleAddToCart(product)}
        >
            {/* Quick Add Overlay Icon */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg">
                    <Plus size={16} strokeWidth={3} />
                </div>
            </div>

            <CardContent className="p-3">
                {/* Image Container */}
                <div className="aspect-square bg-muted/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                    {product.image ? (
                        <img 
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            src={product.image} 
                            alt={product.name} 
                        />
                    ) : (
                        <div className="text-muted-foreground text-xs">No Image</div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                    <h3 className="font-semibold text-sm truncate leading-tight text-foreground/90">
                        {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex flex-col">
                             <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                                {product.sku}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                             <span className="font-bold text-primary text-sm">
                                ₹{product.sellingPrice || product.price}
                            </span>
                        </div>
                    </div>
                     {/* Category Badge - Bottom Left */}
                     <div className="mt-2">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal bg-secondary/50 text-secondary-foreground hover:bg-secondary/70">
                            {product.category || 'General'}
                        </Badge>
                     </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;