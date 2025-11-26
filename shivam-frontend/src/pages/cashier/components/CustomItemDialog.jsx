// pos-frontend-vite/src/pages/cashier/components/CustomItemDialog.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const CustomItemDialog = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setPrice('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const itemPrice = parseFloat(price);
    if (name.trim() && itemPrice > 0) {
      onConfirm({ name: name.trim(), price: itemPrice });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Item</DialogTitle>
          <DialogDescription>
            Enter the item name and price to add it to the cart.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              placeholder="e.g., Loose Candy"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-price">Price (₹)</Label>
            <Input
              id="item-price"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g., 50.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add to Cart</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomItemDialog;