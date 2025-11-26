import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDiscount, setDiscount } from '../../../Redux Toolkit/features/cart/cartSlice'; // Adjust path
import { Tag, Percent, IndianRupee } from 'lucide-react';
import { Button } from '../../../components/ui/button'; // Adjust path
import { Input } from "@/components/ui/input"; // Adjust path

const DiscountSection = () => {
  const dispatch = useDispatch();
  const discount = useSelector(selectDiscount);

  const handleSetDiscount = (e) => {
    dispatch(setDiscount({ ...discount, value: parseFloat(e.target.value) || 0 }));
  };

  const handleDiscountTypeChange = (type) => {
    dispatch(setDiscount({ ...discount, type: type }));
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-2 text-muted-foreground min-w-[80px]">
        <Tag size={14} />
        <span className="text-xs font-medium">Discount</span>
      </div>
      
      <div className="flex-1 flex items-center gap-1">
        <Input
          type="number"
          placeholder="0"
          className="h-8 text-right font-mono text-sm bg-background/50"
          value={discount.value || ""}
          onChange={handleSetDiscount}
        />
        <div className="flex border rounded-md overflow-hidden shrink-0 h-8">
          <Button
            variant={discount.type === "percentage" ? "secondary" : "ghost"}
            size="icon"
            className={`h-full w-8 rounded-none ${discount.type === 'percentage' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
            onClick={() => handleDiscountTypeChange("percentage")}
          >
            <Percent size={12} />
          </Button>
          <div className="w-px bg-border"></div>
          <Button
            variant={discount.type === "fixed" ? "secondary" : "ghost"}
            size="icon"
            className={`h-full w-8 rounded-none ${discount.type === 'fixed' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
            onClick={() => handleDiscountTypeChange("fixed")}
          >
            <IndianRupee size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DiscountSection;