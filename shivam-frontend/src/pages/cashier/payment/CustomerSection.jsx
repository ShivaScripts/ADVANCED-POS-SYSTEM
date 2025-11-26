import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedCustomer } from '../../../Redux Toolkit/features/cart/cartSlice'; // Adjust path if needed
import { User, UserPlus, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button'; // Adjust path if needed

const CustomerSection = ({ setShowCustomerDialog }) => {
  const selectedCustomer = useSelector(selectSelectedCustomer);

  return (
    <div 
      className="px-4 py-3 border-b border-dashed border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group"
      onClick={() => setShowCustomerDialog(true)}
    >
      {selectedCustomer ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
               <User size={16} />
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate text-foreground">
                    {selectedCustomer.fullName || selectedCustomer.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                    {selectedCustomer.phone || selectedCustomer.phoneNumber}
                </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground group-hover:text-primary">
            <ChevronRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between text-muted-foreground hover:text-primary transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
               <UserPlus size={16} />
            </div>
            <span className="text-sm font-medium">Add Customer to Order</span>
          </div>
          <ChevronRight size={16} />
        </div>
      )}
    </div>
  );
};

export default CustomerSection;