import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart2, TrendingUp, Users } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, PieChart as RPieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import {
  getDailySalesChart,
  getPaymentBreakdown,
  getCategoryWiseSalesBreakdown,
  getTopCashiersByRevenue,
} from "@/Redux Toolkit/features/branchAnalytics/branchAnalyticsThunks";

// --- START: CSV Export Helper ---
// Helper function to convert data array to CSV and trigger download
function exportToCsv(filename, headers, rows) {
  if (!rows || rows.length === 0) {
    console.warn("No data available to export for", filename);
    alert(`No data available to export for ${filename.replace('.csv', '')}.`);
    return;
  }
  const headerRow = headers.map(h => `"${h.label}"`).join(',');
  const dataRows = rows.map(row =>
    headers.map(header => {
      let cellValue = row[header.key];
      if (cellValue === null || cellValue === undefined) cellValue = '';
      const cellString = String(cellValue).replace(/"/g, '""');
      return `"${cellString}"`;
    }).join(',')
  );
  const csvContent = [headerRow, ...dataRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
// --- END: CSV Export Helper ---


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const dispatch = useDispatch();
  const branch = useSelector((state) => state.branch.branch); // Get full branch object
  const branchId = branch?.id; // Safely access ID
  const {
    dailySales,
    paymentBreakdown,
    categorySales,
    topCashiers,
    loading, // Added loading state for feedback
    error // Added error state for feedback
  } = useSelector((state) => state.branchAnalytics);

  // Fetch data on load or when branchId changes
  useEffect(() => {
    if (branchId) {
      dispatch(getDailySalesChart({ branchId }));
      const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
      dispatch(getPaymentBreakdown({ branchId, date: today }));
      dispatch(getCategoryWiseSalesBreakdown({ branchId, date: today }));
      dispatch(getTopCashiersByRevenue(branchId));
    }
  }, [branchId, dispatch]);

  // --- START: Data formatting for charts ---
  const salesData = dailySales?.map((item) => ({
    date: item.date, // Assuming API returns 'date'
    sales: item.totalSales, // Assuming API returns 'totalSales'
  })) || [];

  // Assuming paymentBreakdown includes totalAmount now
  const paymentData = paymentBreakdown?.map((item) => ({
    name: item.type, // e.g., 'CASH', 'UPI'
    value: item.percentage, // Percentage for pie chart label
    amount: item.totalAmount // Actual amount for potential export
  })) || [];

  const paymentConfig = paymentBreakdown?.reduce((acc, item, idx) => {
    acc[item.type] = {
      label: item.type,
      color: COLORS[idx % COLORS.length],
    };
    return acc;
  }, {}) || {};

  // Assuming categorySales has categoryName and totalSales
  const categoryData = categorySales?.map((item) => ({
    name: item.categoryName,
    value: item.totalSales,
  })) || [];

  const categoryConfig = categorySales?.reduce((acc, item, idx) => {
    acc[item.categoryName] = {
      label: item.categoryName,
      color: COLORS[idx % COLORS.length],
    };
    return acc;
  }, {}) || {};

  // Assuming topCashiers has cashierName and totalRevenue
  const cashierData = topCashiers?.map((item) => ({
    name: item.cashierName,
    sales: item.totalRevenue,
  })) || [];

  const cashierConfig = { sales: { label: "Sales", color: "#4f46e5" } };
  const salesConfig = { sales: { label: "Sales", color: "#4f46e5" } };
  // --- END: Data formatting ---

  // --- START: Export Handlers ---
  const getFormattedDate = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const handleExportDailySales = () => {
    const headers = [
      { label: 'Date', key: 'date' },
      { label: 'Total Sales (INR)', key: 'sales' }
    ];
    exportToCsv(`daily_sales_${branch?.name}_${getFormattedDate()}.csv`, headers, salesData);
  };

  const handleExportPayments = () => {
    const headers = [
      { label: 'Payment Method', key: 'name' },
      { label: 'Total Amount (INR)', key: 'amount' },
      { label: 'Percentage (%)', key: 'value' } // 'value' holds the percentage
    ];
    // We need the paymentData that includes 'amount'
    exportToCsv(`payment_methods_${branch?.name}_${getFormattedDate()}.csv`, headers, paymentData);
  };

  const handleExportCategories = () => {
    const headers = [
      { label: 'Category Name', key: 'name' },
      { label: 'Total Sales (INR)', key: 'value' } // 'value' holds the total sales
    ];
    exportToCsv(`category_sales_${branch?.name}_${getFormattedDate()}.csv`, headers, categoryData);
  };

  const handleExportCashiers = () => {
    const headers = [
      { label: 'Cashier Name', key: 'name' },
      { label: 'Total Revenue (INR)', key: 'sales' } // 'sales' holds the revenue
    ];
    exportToCsv(`cashier_performance_${branch?.name}_${getFormattedDate()}.csv`, headers, cashierData);
  };

  const handleExportAll = () => {
    // Call each export function sequentially
    handleExportDailySales();
    handleExportPayments();
    handleExportCategories();
    handleExportCashiers();
  };
  // --- END: Export Handlers ---


  // Currency Formatter
  const formatCurrency = (amount) => { /* ... keep your formatter ... */ };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex gap-2">
          {/* "Today" button removed */}
          <Button variant="outline" size="sm" onClick={handleExportAll} disabled={loading}>
            <Download className="h-4 w-4 mr-1" /> Export All
          </Button>
        </div>
      </div>

      {/* Display loading or error state */}
      {loading && <p>Loading reports...</p>}
      {error && <p className="text-destructive">Error loading reports: {error}</p>}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          {/* ... TabsTriggers ... */}
           <TabsTrigger value="overview" className="flex items-center gap-2"><BarChart2 className="h-4 w-4" /> Overview</TabsTrigger>
           <TabsTrigger value="sales" className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Sales</TabsTrigger>
           <TabsTrigger value="products" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Products</TabsTrigger>
           <TabsTrigger value="cashier" className="flex items-center gap-2"><Users className="h-4 w-4" /> Cashier Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Daily Sales Trend</CardTitle>
                  {/* Wire up button */}
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleExportDailySales} disabled={loading || !dailySales?.length}>
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* ... ChartContainer for Daily Sales ... */}
                 <ChartContainer config={salesConfig} className="min-h-[200px] w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Payment Methods</CardTitle>
                  {/* Wire up button */}
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPayments} disabled={loading || !paymentBreakdown?.length}>
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                 {/* ... ChartContainer for Payment Methods ... */}
                 <ChartContainer config={paymentConfig} className="mx-auto aspect-square max-h-[300px]">
                    <ResponsiveContainer width="100%" height={300}>
                        <RPieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                        <Pie data={paymentData} dataKey="value" nameKey="name" labelLine={false} label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}>
                            {paymentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </RPieChart>
                    </ResponsiveContainer>
                 </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Sales Performance</CardTitle>
                {/* Wire up button */}
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportDailySales} disabled={loading || !dailySales?.length}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* ... ChartContainer for Sales Performance (same as Daily Sales) ... */}
              <ChartContainer config={salesConfig} className="min-h-[200px] w-full">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Product Category Performance</CardTitle>
                 {/* Wire up button */}
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCategories} disabled={loading || !categorySales?.length}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"> {/* Added items-center */}
                {/* ... ChartContainer for Category Pie ... */}
                 <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-[300px]">
                     <ResponsiveContainer width="100%" height={300}>
                        <RPieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                        <Pie data={categoryData} dataKey="value" nameKey="name" labelLine={false} label={({ name, value }) => `${name}: ${value > 0 ? (value/categoryData.reduce((sum, entry) => sum + entry.value, 0)*100).toFixed(0)+'%' : '0%'}`}>
                            {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </RPieChart>
                    </ResponsiveContainer>
                 </ChartContainer>

                <div className="space-y-4">
                    {/* ... Category list ... */}
                    {categoryData.map((category, index) => (
                        <div key={index} className="rounded-lg bg-muted p-4"> {/* Used muted bg */}
                            <div className="flex justify-between items-center">
                                <div>
                                <p className="text-sm font-medium text-muted-foreground">{category.name}</p>
                                <p className="text-2xl font-bold">₹{category.value?.toLocaleString('en-IN') ?? 0}</p> {/* Format currency */}
                                </div>
                                <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cashier Performance Tab */}
        <TabsContent value="cashier">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Cashier Performance</CardTitle>
                 {/* Wire up button */}
                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCashiers} disabled={loading || !topCashiers?.length}>
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
               {/* ... ChartContainer for Cashier Performance ... */}
                <ChartContainer config={cashierConfig} className="w-full" >
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={cashierData} layout="vertical" margin={{ left: 10, right: 10 }}> {/* Adjusted margin */}
                            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                            {/* --- THIS IS THE FIX --- */}
                            <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                            {/* --- THIS IS THE FIX --- */}
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} layout="vertical" />
                        </BarChart>
                    </ResponsiveContainer>
               </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;