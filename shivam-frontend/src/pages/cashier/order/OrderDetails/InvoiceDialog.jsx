import React from "react"; // Removed useRef, useEffect
import { useToast } from "../../../../components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, PrinterIcon } from "lucide-react";
// Removed Redux imports
import OrderDetails from "./OrderDetails";
import { Separator } from "@/components/ui/separator"; // Import Separator

const InvoiceDialog = ({
  showInvoiceDialog,
  setShowInvoiceDialog,
  orderData, // Use this prop
  onClose, // Use this prop
 }) => {

  const { toast } = useToast();
  const currentOrder = orderData;

  // --- START FIX: Use window.print() ---
  const handlePrintOrSave = () => {
    console.log("Triggering browser print for invoice...", currentOrder);
    toast({ title: "Print/Save Invoice", description: "Opening print dialog...", variant: "info" });
    // Add a small delay to ensure dialog content is stable before printing
    setTimeout(() => {
        window.print();
    }, 150); // Small delay
  };
  // --- END FIX ---


  const finishOrder = () => {
    if (onClose) onClose();
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
       console.log("InvoiceDialog closing via onOpenChange, calling onClose.");
       if (onClose) onClose();
    }
  };

  const shouldRenderDialog = showInvoiceDialog && currentOrder;

  if (!showInvoiceDialog) console.log("  InvoiceDialog: showInvoiceDialog is false, NOT rendering dialog.");
  else if (!currentOrder) console.log("  InvoiceDialog: orderData prop is null, NOT rendering content yet.");

  return (
    <Dialog open={shouldRenderDialog} onOpenChange={handleOpenChange}>
      {currentOrder && (
        // Add print styles to DialogContent to ensure it doesn't interfere
        <DialogContent className="max-w-2xl print:shadow-none print:border-none print:p-0">
          <DialogHeader className="no-print"> {/* Add no-print */}
            <DialogTitle>Order Details - Invoice #{currentOrder.id}</DialogTitle>
          </DialogHeader>

          {/* --- Receipt Content Area --- */}
          {/* Add 'printable-area' class */}
          <div id="printable-invoice" className="printable-area bg-white text-gray-900 p-4 md:p-6 text-sm print:text-black print:bg-white print:p-0 print:m-0 print:shadow-none">
            {/* Header */}
            <div className="text-center mb-4 print:mb-2">
              <h3 className="font-bold text-lg uppercase tracking-wide">Zosh POS</h3> {/* Use Your Store Name */}
              <p>Store Address Line 1</p> {/* Add your address */}
              <p>Store Phone Number</p> {/* Add your phone */}
            </div>
            <Separator className="my-3 print:my-1" />
            <div className="text-center mb-4 print:mb-2">
              <h4 className="font-semibold text-base uppercase tracking-wide">TAX INVOICE</h4>
            </div>

            {/* Use OrderDetails component directly */}
            {/* Ensure OrderDetails itself doesn't have interfering print styles */}
             <OrderDetails selectedOrder={currentOrder} isPrinting={true}/> {/* Pass flag if needed */}

            {/* Optional: Add a simple footer message directly */}
            <Separator className="my-3 print:my-1" />
            <div className="text-center text-xs text-gray-600 mt-4 print:mt-2">
              <p>Thank you for your purchase!</p>
              {/* Add any other policy/footer text */}
            </div>
          </div>
          {/* --- End Receipt Content Area --- */}


          <DialogFooter className="no-print gap-2 sm:gap-0 sm:space-x-2"> {/* Add no-print */}
             {/* The "Download PDF" button now effectively becomes another Print button */}
            <Button variant="outline" onClick={handlePrintOrSave}>
               <Download className="h-4 w-4 mr-2" />
               Save as PDF {/* Change text slightly */}
            </Button>
            <Button variant="outline" onClick={handlePrintOrSave}>
               <PrinterIcon className="h-4 w-4 mr-2" /> Print Invoice
            </Button>
            <Button onClick={finishOrder}>Start New Order</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default InvoiceDialog;