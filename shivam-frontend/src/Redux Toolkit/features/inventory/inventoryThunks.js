// pos-frontend-vite/src/Redux Toolkit/features/inventory/inventoryThunks.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

// 🔹 Create inventory
export const createInventory = createAsyncThunk(
  'inventory/create',
  async (dto, { rejectWithValue }) => {
    const token = localStorage.getItem('jwt');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.post('/api/inventories', dto, config);
      console.log('createInventory fulfilled:', res.data);
      return res.data;
    } catch (err) {
      console.error('createInventory rejected:', err.response?.data?.message || err);
      return rejectWithValue(err.response?.data?.message || 'Failed to create inventory');
    }
  }
);

// 🔹 Update inventory
export const updateInventory = createAsyncThunk(
  'inventory/update',
  async ({ id, dto }, { rejectWithValue }) => {
    const token = localStorage.getItem('jwt');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.put(`/api/inventories/${id}`, dto, config);
      console.log('updateInventory fulfilled:', res.data);
      return res.data;
    } catch (err) {
      console.error('updateInventory rejected:', err.response?.data?.message || err);
      return rejectWithValue(err.response?.data?.message || 'Failed to update inventory');
    }
  }
);

// 🔹 Delete inventory
export const deleteInventory = createAsyncThunk(
  'inventory/delete',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('jwt');
     const config = {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     };
    try {
      await api.delete(`/api/inventories/${id}`, config);
      console.log('deleteInventory fulfilled:', id);
      return id;
    } catch (err) {
      console.error('deleteInventory rejected:', err.response?.data?.message || err);
      return rejectWithValue(err.response?.data?.message || 'Failed to delete inventory');
    }
  }
);

// 🔹 Get inventory by ID
export const getInventoryById = createAsyncThunk(
  'inventory/getById',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('jwt');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.get(`/api/inventories/${id}`, config);
      console.log('getInventoryById fulfilled:', res.data);
      return res.data;
    } catch (err) {
      console.error('getInventoryById rejected:', err.response?.data?.message || err);
      return rejectWithValue(err.response?.data?.message || 'Inventory not found');
    }
  }
);

// 🔹 Get inventory by branch ID
export const getInventoryByBranch = createAsyncThunk(
  'inventory/getByBranch',
  async (branchId, { rejectWithValue }) => {
    const token = localStorage.getItem('jwt');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.get(`/api/inventories/branch/${branchId}`, config);
      console.log('getInventoryByBranch fulfilled:', res.data);
      return res.data;
    } catch (err) {
      console.error('getInventoryByBranch rejected:', err.response?.data?.message || err);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch branch inventory');
    }
  }
);

// 🔹 Get inventory by product ID
export const getInventoryByProduct = createAsyncThunk(
  'inventory/getByProduct',
  async (productId, { rejectWithValue }) => {
    const token = localStorage.getItem('jwt');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await api.get(`/api/inventories/product/${productId}`, config);
      console.log('getInventoryByProduct fulfilled:', res.data);
      return res.data;
    } catch (err) {
      console.error('getInventoryByProduct rejected:', err.response?.data?.message || err);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch product inventory');
    }
  }
);

// 🔹 Export Inventory by Branch
export const exportInventoryByBranch = createAsyncThunk(
  'inventory/exportByBranch',
  async (branchId, { rejectWithValue }) => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      return rejectWithValue('No JWT token found');
    }
            
    try {
      console.log('🔄 Exporting inventory...', { branchId });
              
      const res = await api.get(`/api/inventories/branch/${branchId}/export`, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob', // This is crucial for file downloads
      });
              
      // Create a blob URL
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
              
      // Set the filename
      const filename = `inventory_branch_${branchId}_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.href = url;
      link.setAttribute('download', filename);
              
      // Append to a-tag, click it, and remove it
      document.body.appendChild(link);
      link.click();
              
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
              
      console.log('✅ Inventory exported successfully.');
      
      // Return a success message
      return { success: true, filename };

    } catch (err) {
      console.error('❌ Failed to export inventory:', err.response?.data || err.message);
      return rejectWithValue('Failed to export inventory. Please try again.');
    }
  }
);
