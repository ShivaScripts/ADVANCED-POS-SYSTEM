import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Store, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  getDashboardSummary,
  getStoreRegistrationStats,
  getStoreStatusDistribution,
  getRecentActivity // <-- START: ADD THIS
} from "../../Redux Toolkit/features/adminDashboard/adminDashboardThunks";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const StatCard = ({ title, value, icon, description, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        {trend !== undefined && (
          <span className={trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : ""}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
        {description}
      </p>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const {
    dashboardSummary,
    storeRegistrationStats,
    storeStatusDistribution,
    recentActivity, // <-- START: ADD THIS
    loading,
    error
  } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(getDashboardSummary());
    dispatch(getStoreRegistrationStats());
    dispatch(getStoreStatusDistribution());
    dispatch(getRecentActivity()); // <-- START: ADD THIS
  }, [dispatch]);

  // Prepare data for charts
  const barData = storeRegistrationStats?.map((item) => ({
    date: item.date || item.day || item.label,
    stores: item.count || item.value || 0
  })) || [];

  const pieData = storeStatusDistribution
    ? [
        { name: "Active", value: storeStatusDistribution.active, color: COLORS[0] },
        { name: "Pending", value: storeStatusDistribution.pending, color: COLORS[1] },
        { name: "Blocked", value: storeStatusDistribution.blocked, color: COLORS[2] },
      ]
    : [];

  // Helper to format time ago (you can make this more complex later)
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  // Helper to get dot color
  const getActivityColor = (activityType) => {
    if (activityType === "STORE_REGISTERED") return "bg-yellow-500";
    if (activityType === "STORE_APPROVED") return "bg-green-500";
    if (activityType === "STORE_BLOCKED") return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of all stores and system statistics
        </p>
      </div>

      {loading && <div className="text-center py-8">Loading dashboard...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Stores"
          value={dashboardSummary?.totalStores ?? "-"}
          icon={<Store className="h-4 w-4 text-muted-foreground" />}
          description="from last month"
          trend={undefined}
        />
        <StatCard
          title="Active Stores"
          value={dashboardSummary?.activeStores ?? "-"}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="currently operational"
          trend={undefined}
        />
        <StatCard
          title="Blocked Stores"
          value={dashboardSummary?.blockedStores ?? "-"}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
          description="suspended accounts"
          trend={undefined}
        />
        <StatCard
          title="Pending Requests"
          value={dashboardSummary?.pendingStores ?? "-"}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="awaiting approval"
          trend={undefined}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Store Registrations (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <Tooltip />
                <Bar
                  dataKey="stores"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Store Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* --- START: REPLACE THIS CARD --- */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity?.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className={`w-2 h-2 ${getActivityColor(activity.activityType)} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent activity.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* --- END: REPLACE THIS CARD --- */}
    </div>
  );
}
