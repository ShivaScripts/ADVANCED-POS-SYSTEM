// pos-frontend-vite/src/pages/cashier/ShiftSummary/ShiftSummaryPage.jsx

import React, { useEffect, useState } from 'react'; // <-- 1. Removed useRef
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner'; // <-- 2. Switched to Sonner for toasts
// import { useReactToPrint } from 'react-to-print'; // <-- 3. REMOVED react-to-print
import {
  ShiftInformationCard,
  SalesSummaryCard,
  PaymentSummaryCard,
  TopSellingItemsCard,
  RecentOrdersCard,
  RefundsCard,
  ShiftHeader,
  LogoutConfirmDialog,
  PrintDialog
} from './components';
import { getCurrentShiftProgress, endShift } from '../../../Redux Toolkit/features/shiftReport/shiftReportThunks';
import { logout } from '../../../Redux Toolkit/features/user/userThunks';
import { useNavigate } from 'react-router-dom';
// --- START: 4. Import the new Excel exporter ---
import { exportShiftSummaryToExcel } from '../../../utils/excelExporter';
// --- END: 4. ---

const ShiftSummaryPage = () => {
  const dispatch = useDispatch();
  // const { toast } = useToast(); // <-- Switched to Sonner
  const [showLogoutConfirmDialog, setShowLogoutConfirmDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const navigate = useNavigate();

  const { currentShift, loading, error } = useSelector((state) => state.shiftReport);

  // --- START: 5. REMOVE print refs ---
  // const printComponentRef = useRef(null);
  // const handleActualPrint = useReactToPrint(...);
  // --- END: 5. ---

  // --- START: 6. Update handlePrintSummary ---
  const handlePrintSummary = () => {
    setShowPrintDialog(false); // Close the confirmation dialog
    
    if (!currentShift) {
      toast.error("Error", { description: "No shift data to export." });
      return;
    }

    try {
      exportShiftSummaryToExcel(currentShift);
      toast.success("Export Successful", {
        description: "Your shift summary is downloading.",
      });
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export Failed", { description: "Could not generate the Excel file." });
    }
  };
  // --- END: 6. ---

  useEffect(() => {
    dispatch(getCurrentShiftProgress());
  }, [dispatch]);

  const handleEndShift = async () => {
    setShowLogoutConfirmDialog(false);
    if (true) {
       dispatch(endShift());
       dispatch(logout());
       navigate("/");
      toast.success('Shift Ended', { // <-- Switched to Sonner
        description: 'You have been logged out successfully',
      });
      
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ShiftHeader 
        onPrintClick={() => setShowPrintDialog(true)}
        onEndShiftClick={() => setShowLogoutConfirmDialog(true)}
      />
      
      {/* --- START: 7. REMOVE print ref --- */}
      {/* The ref is no longer needed on this div */}
      <div className="flex-1 overflow-auto p-4">
      {/* --- END: 7. --- */}
        {loading ? (
          <div className="flex justify-center items-center h-full text-lg">Loading shift summary...</div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-destructive">{error}</div>
        ) : currentShift ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <ShiftInformationCard shiftData={currentShift} />
              <SalesSummaryCard shiftData={currentShift} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <PaymentSummaryCard shiftData={currentShift} />
              <TopSellingItemsCard shiftData={currentShift} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecentOrdersCard shiftData={currentShift} />
              <RefundsCard shiftData={currentShift} />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">No shift data available.</div>
        )}
      </div>

      <LogoutConfirmDialog 
        isOpen={showLogoutConfirmDialog}
        onClose={() => setShowLogoutConfirmDialog(false)}
        onConfirm={handleEndShift}
      />
      <PrintDialog 
        isOpen={showPrintDialog}
        onClose={() => setShowPrintDialog(false)}
        onConfirm={handlePrintSummary}
      />
    </div>
  ); 
};

export default ShiftSummaryPage;