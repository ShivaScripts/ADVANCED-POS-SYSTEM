// pos-frontend-vite/src/Redux Toolkit/features/order/orderThunks.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

// Helper function to get JWT token
const getAuthToken = () => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    throw new Error('No JWT token found');
  }
  return token;
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// 🔹 Create Order
export const createOrder = createAsyncThunk(
  'order/create',
  async (dto, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState();
      const pointsToRedeem = cart?.pointsToRedeem || 0;

      const cartItems = cart?.items || [];
      const orderItemsDTO = cartItems.map(item => {
        if (item.isCustom) {
          return {
            productId: null,
            productName: item.name,
            price: item.sellingPrice,
            quantity: item.quantity,
          };
        } else {
          return {
            productId: item.id,
            quantity: item.quantity,
          };
        }
      });

      const finalOrderData = {
        ...dto,
        items: orderItemsDTO,
        pointsRedeemed: pointsToRedeem,
      };

      console.log('🔄 Creating order...', { dto: finalOrderData });
      
      const headers = getAuthHeaders();
      const res = await api.post('/api/orders', finalOrderData, { headers });
      
      console.log('✅ Order created successfully:', {
        orderId: res.data.id,
        totalAmount: res.data.totalAmount,
        customer: res.data.customer,
        pointsEarned: res.data.pointsEarned,
        pointsRedeemed: res.data.pointsRedeemed,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to create order:', {
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        requestData: dto
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

// 🔹 Get Order by ID
export const getOrderById = createAsyncThunk(
  'order/getById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching order by ID...', { orderId: id });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/${id}`, { headers });
      
      console.log('✅ Order fetched successfully:', {
        orderId: res.data.id,
        totalAmount: res.data.totalAmount,
        customer: res.data.customer,
        response: res.data
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch order by ID:', {
        orderId: id,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Order not found');
    }
  }
);

// 🔹 Get Orders by Branch (with optional filters)
export const getOrdersByBranch = createAsyncThunk(
  'order/getByBranch',
  async ({ branchId, customerId, cashierId, paymentType, status }, { rejectWithValue }) => {
    try {
      const headers = getAuthHeaders();
      // Build query params
      const params = [];
      if (customerId) params.push(`customerId=${customerId}`);
      if (cashierId) params.push(`cashierId=${cashierId}`);
      if (paymentType) params.push(`paymentType=${paymentType}`);
      if (status) params.push(`status=${status}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const res = await api.get(`/api/orders/branch/${branchId}${query}`, { headers });
      console.log('✅ Orders by branch response:', res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch orders by branch:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// 🔹 Get Orders by Cashier
export const getOrdersByCashier = createAsyncThunk(
  'order/getByCashier',
  async ({ cashierId, from, to }, { rejectWithValue }) => {
    if (!cashierId) {
      return rejectWithValue('Cashier ID is required');
    }
    try {
      console.log('🔄 Fetching orders by cashier...', { cashierId, from, to });
      const headers = getAuthHeaders();

      const params = new URLSearchParams();
      // TIMEZONE FIX: we expect local datetime strings (e.g., "2025-11-12T00:00:00")
      if (from) {
        params.append('from', from);
      }
      if (to) {
        params.append('to', to);
      }
      const queryString = params.toString();
      const url = `/api/orders/cashier/${cashierId}${queryString ? `?${queryString}` : ''}`;

      console.log('Fetching URL:', url);

      const res = await api.get(url, { headers });

      console.log('✅ Orders fetched successfully:', {
        cashierId, from, to,
        orderCount: Array.isArray(res.data) ? res.data.length : 0,
      });

      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch orders by cashier:', {
        cashierId, from, to,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// 🔹 Get Today's Orders by Branch
export const getTodayOrdersByBranch = createAsyncThunk(
  'order/getTodayByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching today\'s orders by branch...', { branchId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/today/branch/${branchId}`, { headers });
      
      console.log('✅ Today\'s orders fetched successfully:', {
        branchId,
        orderCount: res.data.length,
        totalSales: res.data.reduce((sum, order) => sum + order.totalAmount, 0),
        orders: res.data.map(order => ({
          id: order.id,
          totalAmount: order.totalAmount,
          customer: order.customer,
          createdAt: order.createdAt
        }))
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch today\'s orders by branch:', {
        branchId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch today\'s orders');
    }
  }
);

// 🔹 Delete Order
export const deleteOrder = createAsyncThunk(
  'order/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🔄 Deleting order...', { orderId: id });
      
      const headers = getAuthHeaders();
      await api.delete(`/api/orders/${id}`, { headers });
      
      console.log('✅ Order deleted successfully:', { orderId: id });
      
      return id;
    } catch (err) {
      console.error('❌ Failed to delete order:', {
        orderId: id,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to delete order');
    }
  }
);

// 🔹 Get Orders by Customer
export const getOrdersByCustomer = createAsyncThunk(
  'order/getByCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching orders by customer...', { customerId });
      
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/customer/${customerId}`, { headers });
      
      console.log('✅ Customer orders fetched successfully:', {
        customerId,
        orderCount: res.data.length,
        totalSpent: res.data.reduce((sum, order) => sum + order.totalAmount, 0),
        orders: res.data.map(order => ({
          id: order.id,
          totalAmount: order.totalAmount,
          customer: order.customer,
          createdAt: order.createdAt,
          paymentMethod: order.paymentMethod,
          status: order.status,
          items: order.items
        }))
      });
      
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch customer orders:', {
        customerId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch customer orders');
    }
  }
);

// 🔹 Get Top 5 Recent Orders by Branch
export const getRecentOrdersByBranch = createAsyncThunk(
  'order/getRecentByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching top 5 recent orders by branch...', { branchId });
      const headers = getAuthHeaders();
      const res = await api.get(`/api/orders/recent/${branchId}`, { headers });
      console.log('✅ Recent orders fetched successfully:', {
        branchId,
        orderCount: res.data.length,
        orders: res.data
      });
      return res.data;
    } catch (err) {
      console.error('❌ Failed to fetch recent orders by branch:', {
        branchId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch recent orders');
    }
  }
);

// 🔹 Export Transactions by Branch
export const exportTransactionsByBranch = createAsyncThunk(
  'order/exportByBranch',
  async (branchId, { rejectWithValue }) => {
    try {
      console.log('🔄 Exporting transactions...', { branchId });
      const token = getAuthToken();
      
      const res = await api.get(`/api/orders/branch/${branchId}/export`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob', // This is crucial for file downloads
      });
      
      // Create a blob URL
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      
      // Set the filename
      const filename = `transactions_branch_${branchId}_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.href = url;
      link.setAttribute('download', filename);
      
      // Append to a-tag, click it, and remove it
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Transactions exported successfully.');
      
      // Return a success message (won't be stored in state, but good for notifications)
      return { success: true, filename };

    } catch (err) {
      console.error('❌ Failed to export transactions:', {
        branchId,
        error: err.response?.data || err.message,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      // Since response is blob, error might be unreadable, so we provide a generic message.
      return rejectWithValue('Failed to export transactions. Please try again.');
    }
  }
);
