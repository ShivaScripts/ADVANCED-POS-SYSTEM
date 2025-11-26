// pos-frontend-vite/src/pages/cashier/ShiftSummary/components/ShiftHeader.jsx

import React from 'react';
import { Button } from '@/components/ui/button';
// --- START: 1. Import new icons & hook ---
import { PrinterIcon, ArrowRightIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// --- END: 1. ---

const ShiftHeader = ({ onPrintClick, onEndShiftClick }) => {
  const navigate = useNavigate(); // <-- 2. Initialize hook
  
  return (
    <div className="p-4 bg-card border-b">
      <div className="flex justify-between items-center">
        {/* --- START: 3. Add Back button and title --- */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("/cashier")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Shift Summary</h1>
        </div>
        {/* --- END: 3. --- */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPrintClick}>
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print Summary
          </Button>
          <Button variant="destructive" onClick={onEndShiftClick}>
            <ArrowRightIcon className="h-4 w-4 mr-2" />
            End Shift & Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShiftHeader;