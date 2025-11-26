// pos-frontend-vite/src/utils/excelExporter.js

import * as XLSX from 'xlsx';
import { format } from 'date-fns'; // pnpm add date-fns (if you don't have it)

// Helper to format dates and times
const formatDate = (date) => date ? format(new Date(date), "MMM d, yyyy, h:mm a") : 'N/A';
const formatTime = (date) => date ? format(new Date(date), "h:mm a") : 'N/A';

export const exportShiftSummaryToExcel = (shiftData) => {
  if (!shiftData) {
    console.error("Export failed: No shift data provided.");
    return;
  }

  // 1. --- Summary Sheet ---
  const summary = [
    { Field: "Cashier", Value: shiftData.cashier?.fullName || 'N/A' },
    { Field: "Branch", Value: shiftData.branch?.name || 'N/A' },
    { Field: "Shift Start", Value: formatDate(shiftData.shiftStart) },
    { Field: "Shift End", Value: shiftData.shiftEnd ? formatDate(shiftData.shiftEnd) : 'Ongoing' },
    { Field: "", Value: "" }, // Spacer
    { Field: "Total Orders", Value: shiftData.totalOrders || 0 },
    { Field: "Total Sales", Value: shiftData.totalSales || 0 },
    { Field: "Total Refunds", Value: shiftData.totalRefunds || 0 },
    { Field: "Net Sales", Value: shiftData.netSales || 0 },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summary, { skipHeader: true });
  // Set column widths
  wsSummary['!cols'] = [{ wch: 20 }, { wch: 30 }];

  // 2. --- Payment Summary Sheet ---
  const payments = (shiftData.paymentSummaries || []).map(p => ({
    "Payment Type": p.type,
    "Transactions": p.transactionCount,
    "Amount (₹)": p.totalAmount?.toFixed(2),
    "Percentage": `${p.percentage?.toFixed(1)}%`,
  }));
  const wsPayments = XLSX.utils.json_to_sheet(payments);
  wsPayments['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

  // 3. --- Top Selling Items Sheet ---
  const topItems = (shiftData.topSellingProducts || []).map((item, index) => ({
    "Rank": index + 1,
    "Product": item.name,
    "SKU": item.sku || 'N/A',
    "Price (₹)": item.sellingPrice?.toFixed(2),
    // "Units Sold": item.quantity || 'N/A' // We'll add this when you implement the DTO change
  }));
  const wsTopItems = XLSX.utils.json_to_sheet(topItems);
  wsTopItems['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];

  // 4. --- Recent Orders Sheet ---
  const recentOrders = (shiftData.recentOrders || []).map(order => ({
    "Order ID": order.id,
    "Time": formatTime(order.createdAt),
    "Payment": order.paymentType,
    "Amount (₹)": order.totalAmount?.toFixed(2),
  }));
  const wsRecentOrders = XLSX.utils.json_to_sheet(recentOrders);
  wsRecentOrders['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];

  // 5. --- Refunds Sheet ---
  const refunds = (shiftData.refunds || []).map(refund => ({
    "Refund ID": `RFD-${refund.id}`,
    "Order ID": `ORD-${refund.orderId}`,
    "Reason": refund.reason,
    "Amount (₹)": refund.amount?.toFixed(2),
  }));
  const wsRefunds = XLSX.utils.json_to_sheet(refunds);
  wsRefunds['!cols'] = [{ wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 15 }];

  // --- Create Workbook and Download ---
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
  XLSX.utils.book_append_sheet(wb, wsPayments, "Payment Summary");
  XLSX.utils.book_append_sheet(wb, wsTopItems, "Top Selling Items");
  XLSX.utils.book_append_sheet(wb, wsRecentOrders, "Recent Orders");
  XLSX.utils.book_append_sheet(wb, wsRefunds, "Refunds Processed");

  // Generate and download the file
  const fileName = `Shift_Report_${shiftData.cashier?.fullName || 'Cashier'}_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
  XLSX.writeFile(wb, fileName);
};