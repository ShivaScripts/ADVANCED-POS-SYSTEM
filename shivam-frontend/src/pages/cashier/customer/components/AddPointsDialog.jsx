// pos-frontend-vite/src/pages/cashier/customer/components/AddPointsDialog.jsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AddPointsDialog = ({ 
  isOpen, 
  onClose, 
  customer, 
  pointsToAdd, 
  onPointsChange, 
  onAddPoints 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Loyalty Points</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            {/* --- START: FIX --- */}
            <p><span className="font-medium">Customer:</span> {customer?.fullName}</p>
            <p><span className="font-medium">Current Points:</span> {customer?.loyaltyPoints || 0}</p>
            {/* --- END: FIX --- */}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="points" className="text-sm font-medium">Points to Add</label>
            <Input
              id="points"
              type="number"
              min="1"
              value={pointsToAdd}
              onChange={(e) => onPointsChange(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onAddPoints}>Add Points</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPointsDialog;