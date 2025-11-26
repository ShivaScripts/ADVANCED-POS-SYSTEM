import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

// --- Helper to format date ---
const formatSaleDate = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${format(date, "p")}`; // e.g., "Today, 4:30 PM"
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${format(date, "p")}`; // e.g., "Yesterday, 10:15 AM"
  }
  return format(date, "MMM d, yyyy"); // e.g., "Oct 27, 2025"
};

// --- Helper to format currency ---
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "₹0.00";

  // If it's already a formatted string (like "$1,234"), return it as-is
  if (typeof amount === "string") {
    // Try to extract numeric value; if fails, return original string
    const numeric = Number(amount.toString().replace(/[^0-9.-]+/g, ""));
    if (!isNaN(numeric)) {
      return numeric.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      });
    } else {
      return amount;
    }
  }

  if (typeof amount === "number") {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  }

  // Fallback: try to coerce to number
  const coerced = Number(amount);
  if (!isNaN(coerced)) {
    return coerced.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  }

  return "₹0.00";
};

const RecentSales = ({ recentSales, loading, error }) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-48 text-destructive">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p>Error loading sales</p>
        </div>
      );
    }

    if (!recentSales || recentSales.length === 0) {
      return (
        <div className="flex justify-center items-center h-48">
          <p className="text-muted-foreground">No recent sales found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {recentSales.map((sale, index) => {
          // Support multiple payload shapes coming from different versions
          const branchName = sale.branchName || sale.branch || sale.branch?.name || "Unknown Branch";
          const createdAt = sale.createdAt || sale.date || sale.createdAtString;
          const amount = sale.totalAmount ?? sale.amount ?? sale.value;

          return (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{branchName}</p>
                <p className="text-sm text-muted-foreground">{formatSaleDate(createdAt)}</p>
              </div>
              <p className="font-semibold">{formatCurrency(amount)}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
};

export default RecentSales;
