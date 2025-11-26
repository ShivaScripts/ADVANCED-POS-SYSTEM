import React from "react"; // Removed useRef
// Removed react-to-print import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrinterIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ReturnReceiptDialog = ({
  showReceiptDialog,
  setShowReceiptDialog,
  selectedOrder,
  returnItems,
  refundAmount,
  refundMethod,
  returnReason,
}) => {

  // Simple print function
  const handlePrint = () => {
    window.print();
    // Optionally close dialog after print command is sent
    // setShowReceiptDialog(false);
  };

  if (!selectedOrder) {
    return null;
  }

  const itemsToDisplay = returnItems || selectedOrder.items || [];
  const finalRefundAmount = refundAmount ?? selectedOrder.totalAmount ?? 0;
  const finalRefundMethod = refundMethod || selectedOrder.paymentType || 'N/A';

  return (
    // Add a class to the Dialog itself to help target CSS for hiding
    <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
      <DialogContent className="max-w-md md:max-w-lg print:shadow-none print:border-none print:p-0"> {/* Adjusted print styles for dialog */}
        <DialogHeader className="no-print"> {/* Hide header when printing */}
          <DialogTitle>Return Receipt</DialogTitle>
        </DialogHeader>

        {/* --- Receipt Content Area --- */}
        {/* Add 'printable-area' class */}
        <div id="printable-receipt" className="printable-area bg-white text-gray-900 p-4 md:p-6 text-sm print:text-black print:bg-white print:p-0 print:m-0 print:shadow-none">
          {/* Header */}
          <div className="text-center mb-4 print:mb-2">
            <h3 className="font-bold text-lg uppercase tracking-wide">POS System</h3>
            <p>123 Main Street, City</p>
            <p>Tel: 123-456-7890</p>
          </div>
          <Separator className="my-3 print:my-1" />
          <div className="text-center mb-4 print:mb-2">
            <h4 className="font-semibold text-base uppercase tracking-wide">Return Receipt</h4>
          </div>

          {/* Details */}
          <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-1 print:mb-2">
            <p><span className="font-medium">Return #:</span> RTN-{Date.now().toString().slice(-6)}</p>
            <p><span className="font-medium">Original Order:</span> {selectedOrder?.id || 'N/A'}</p>
            <p><span className="font-medium">Date:</span> {new Date().toLocaleString()}</p>
            <p><span className="font-medium">Customer:</span> {selectedOrder?.customer?.fullName || 'N/A'}</p>
          </div>
          <Separator className="my-3 print:my-1" />

          {/* Items Table */}
          <table className="w-full mb-4 border-collapse print:mb-2">
            <thead>
              <tr className="border-b-2 border-gray-300 print:border-b print:border-gray-500">
                <th className="text-left font-medium pb-2 pr-2 print:pb-1">Item</th>
                <th className="text-center font-medium pb-2 px-2 print:pb-1">Qty</th>
                <th className="text-right font-medium pb-2 px-2 print:pb-1">Price</th>
                <th className="text-right font-medium pb-2 pl-2 print:pb-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {itemsToDisplay.length > 0 ? itemsToDisplay.map((item) => (
                <tr key={item.id || item.productId} className="border-b last:border-b-0 print:border-b print:border-gray-300">
                  <td className="py-2 text-left pr-2 print:py-1">{item.product?.name ? item.product.name.slice(0, 20) + (item.product.name.length > 20 ? "..." : "") : "Unknown Item"}</td>
                  <td className="py-2 text-center px-2 print:py-1">{item.returnQuantity ?? item.quantity ?? 'N/A'}</td>
                  <td className="py-2 text-right px-2 print:py-1">₹{item.product?.sellingPrice?.toFixed(2) || '0.00'}</td>
                  <td className="py-2 text-right pl-2 print:py-1">
                    ₹{(item.product?.sellingPrice && (item.returnQuantity ?? item.quantity))
                      ? (item.product.sellingPrice * (item.returnQuantity ?? item.quantity)).toFixed(2)
                      : '0.00'}
                  </td>
                </tr>
              )) : (
                 <tr><td colSpan="4" className="text-center py-4 text-gray-500 print:py-2">No items returned</td></tr>
              )}
            </tbody>
          </table>
          <Separator className="my-3 print:my-1" />

          {/* Summary */}
          <div className="space-y-1 mb-4 print:mb-2">
            <div className="flex justify-between font-semibold">
              <span>Total Refund</span>
              <span>₹{finalRefundAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Refund Method</span>
              <span>{finalRefundMethod}</span>
            </div>
             {returnReason && (
                 <div className="flex justify-between">
                    <span>Return Reason</span>
                    <span>{returnReason}</span>
                 </div>
             )}
          </div>
          <Separator className="my-3 print:my-1" />

          {/* Footer Message */}
          <div className="text-center text-xs text-gray-600 mt-4 print:mt-2">
            <p>Thank you!</p>
            <p>Return Policy: Items can be returned within 7 days...</p>
          </div>
        </div>
        {/* --- End Receipt Content --- */}

        <DialogFooter className="no-print"> {/* Hide footer when printing */}
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <PrinterIcon className="h-4 w-4" />
            Print & Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnReceiptDialog;