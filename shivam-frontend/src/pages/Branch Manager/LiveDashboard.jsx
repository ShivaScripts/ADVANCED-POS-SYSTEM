import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Loader2 } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import api from '@/lib/api';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'; // No new imports needed

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount || 0);
};

// Recharts data formatter (no changes)
const formatChartData = (salesMap) => {
  if (!salesMap) return [];
  return Object.entries(salesMap)
    .map(([name, sales]) => ({
      name,
      sales,
    }))
    .sort((a, b) => b.sales - a.sales);
};

const SOCKET_URL = 'ws://localhost:5000/ws';

const LiveDashboard = () => {
  // --- All your existing state and data logic (no changes) ---
  const { userProfile } = useSelector((state) => state.user);
  const [totalSales, setTotalSales] = useState(0.0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const stompClientRef = useRef(null);

  // useEffect for Initial Data "Hydration" (no changes)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userProfile) return;
      try {
        setIsLoading(true);
        const response = await api.get('/dashboard/current');
        setTotalSales(response.data.totalSalesToday);
        setTotalOrders(response.data.totalOrdersToday);
        setCategoryData(formatChartData(response.data.salesByCategory));
      } catch (error) {
        console.error('Failed to fetch initial dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [userProfile]);

  // useEffect for WebSocket Connection (no changes)
  useEffect(() => {
    if (userProfile && userProfile.branchId) {
      const topic = `/topic/dashboard/branch/${userProfile.branchId}`;
      const client = new Client({
        brokerURL: SOCKET_URL,
        reconnectDelay: 5000,
        debug: (str) => { /* console.log('STOMP: ' + str); */ },
        onConnect: (frame) => {
          setIsConnected(true);
          console.log('Connected to WebSocket, subscribing to:', topic);
          client.subscribe(topic, (message) => {
            const payload = JSON.parse(message.body);
            setTotalSales(payload.totalSalesToday);
            setTotalOrders(payload.totalOrdersToday);
            setCategoryData(formatChartData(payload.salesByCategory));
          });
        },
        onDisconnect: () => {
          setIsConnected(false);
          console.log('Disconnected from WebSocket');
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
        },
      });
      client.activate();
      stompClientRef.current = client;
      return () => {
        if (stompClientRef.current) {
          stompClientRef.current.deactivate();
          console.log('WebSocket client deactivated');
        }
      };
    }
  }, [userProfile]);
  // --- End of existing logic ---


  // --- START: MODIFIED JSX ---
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Live Branch Dashboard</h1>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            isConnected
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isConnected ? '● Live' : '● Disconnected'}
        </span>
      </div>

      {/* Top "Big Number" Cards (no changes) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="shadow-lg">
          {/* ... Total Sales Card ... */}
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales Today
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(totalSales)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Live updates from all cashiers
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          {/* ... Total Orders Card ... */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders Today
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-2xl font-bold">{totalOrders}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Total transactions processed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- START: UPDATED BAR CHART CARD --- */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  {/* 1. Define the gradient */}
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* 2. Style the grid and axes */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
                  <XAxis
                    dataKey="name"
                    fontSize={12}
                    tick={{ fill: '#f1f1f1' }} // Light text for dark mode
                    stroke="#555555"
                  />
                  <YAxis
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    fontSize={12}
                    tick={{ fill: '#f1f1f1' }} // Light text for dark mode
                    stroke="#555555"
                  />

                  {/* 3. Style the Tooltip */}
                  <Tooltip
                    cursor={{ fill: 'rgba(110, 110, 110, 0.3)' }} // Hover highlight
                    contentStyle={{
                      backgroundColor: '#222222', // Dark tooltip background
                      borderColor: '#555555',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Legend />

                  {/* 4. Style the Bar */}
                  <Bar
                    dataKey="sales"
                    fill="url(#colorSales)" // Use the gradient
                    name="Total Sales"
                    radius={[4, 4, 0, 0]} // Rounded top corners
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      {/* --- END: UPDATED BAR CHART CARD --- */}
    </div>
  );
  // --- END: MODIFIED JSX ---
};

export default LiveDashboard;