// pos-frontend-vite/src/Redux Toolkit/features/cart/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { selectStoreTaxRate, selectStoreCurrency } from "../auth/authSlice";

const initialState = {
  items: [],
  selectedCustomer: null,
  note: "",
  discount: { type: "percentage", value: 0 },
  paymentMethod: "cash",
  heldOrders: [],
  currentOrder: null,
  pointsToRedeem: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      // Find by product ID, which is just 'id'
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const productWithPrice = {
          ...product,
          quantity: 1,
        };
        state.items.push(productWithPrice);
      }
    },

    // --- START: NEW REDUCER for Custom Items ---
    addCustomItemToCart: (state, action) => {
      const { name, price } = action.payload;
      
      // Create a unique ID for this custom item
      const customItemId = `custom-${Date.now()}`;
      
      const customItem = {
        id: customItemId, // Unique ID (e.g., "custom-1678886400000")
        name: name,
        sellingPrice: price,
        quantity: 1,
        isCustom: true, // Flag to identify it
        sku: "CUSTOM",
      };
      
      state.items.push(customItem);
    },
    // --- END: NEW REDUCER ---

    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      // ID can be a number (product) or a string (custom item)
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      // ID can be a number or a string
      state.items = state.items.filter((item) => item.id !== id);
    },

    clearCart: (state) => {
      state.items = [];
      state.selectedCustomer = null;
      state.note = "";
      state.discount = { type: "percentage", value: 0 };
      state.paymentMethod = "cash";
      state.pointsToRedeem = 0;
    },

    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
      state.pointsToRedeem = 0;
    },

    setNote: (state, action) => {
      state.note = action.payload;
    },

    setDiscount: (state, action) => {
      state.discount = action.payload;
    },

    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },

    setPointsToRedeem: (state, action) => {
      state.pointsToRedeem = action.payload;
    },

    holdOrder: (state) => {
      if (state.items.length > 0) {
        const heldOrder = {
          id: Date.now(),
          items: [...state.items],
          customer: state.selectedCustomer,
          note: state.note,
          discount: state.discount,
          pointsToRedeem: state.pointsToRedeem,
          timestamp: new Date().toISOString(),
        };
        state.heldOrders.push(heldOrder);
        // Reset current order
        state.items = [];
        state.selectedCustomer = null;
        state.note = "";
        state.discount = { type: "percentage", value: 0 };
        state.pointsToRedeem = 0;
      }
    },

    resumeOrder: (state, action) => {
      const order = action.payload;
      state.items = order.items;
      state.selectedCustomer = order.customer;
      state.note = order.note;
      state.discount = order.discount;
      state.pointsToRedeem = order.pointsToRedeem || 0;
      state.heldOrders = state.heldOrders.filter((o) => o.id !== order.id);
    },

    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },

    resetOrder: (state) => {
      state.items = [];
      state.selectedCustomer = null;
      state.note = "";
      state.discount = { type: "percentage", value: 0 };
      state.paymentMethod = "cash";
      state.currentOrder = null;
      state.pointsToRedeem = 0;
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectSelectedCustomer = (state) => state.cart.selectedCustomer;
export const selectNote = (state) => state.cart.note;
export const selectDiscount = (state) => state.cart.discount;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;
export const selectHeldOrders = (state) => state.cart.heldOrders;
export const selectCurrentOrder = (state) => state.cart.currentOrder;
export const selectPointsToRedeem = (state) => state.cart.pointsToRedeem;

// Calculation selectors
export const selectSubtotal = (state) => {
  return state.cart.items.reduce(
    (total, item) =>
      // Use item.sellingPrice which exists on both regular and custom items
      total + (Number(item.sellingPrice || 0) * Number(item.quantity || 0)),
    0
  );
};

export const selectTax = (state) => {
  const subtotal = selectSubtotal(state);
  const taxRate = selectStoreTaxRate(state);
  return subtotal * (Number(taxRate || 0) / 100);
};

export const selectDiscountAmount = (state) => {
  const subtotal = selectSubtotal(state);
  const discount = state.cart.discount;
  const discountValue = Number(discount.value) || 0;

  if (discount.type === "percentage") {
    const calculatedDiscount = subtotal * (discountValue / 100);
    return Math.min(calculatedDiscount, subtotal);
  } else {
    return Math.min(discountValue, subtotal);
  }
};

export const selectTotal = (state) => {
  const subtotal = selectSubtotal(state);
  const tax = selectTax(state);
  const discountAmount = selectDiscountAmount(state);
  const pointsDiscount = Number(state.cart.pointsToRedeem) || 0;
  
  const total = subtotal + tax - discountAmount - pointsDiscount;
  
  return total < 0 ? 0 : total;
};

// --- Currency Formatters (no change) ---
const getCurrencySymbol = (currencyCode) => {
  switch (currencyCode) {
    case "INR":
      return "₹";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return currencyCode ? `${currencyCode} ` : "₹";
  }
};

export const selectFormattedTotal = (state) => {
  const total = selectTotal(state);
  const currencyCode = selectStoreCurrency(state);
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${Number(total || 0).toFixed(2)}`;
};

export const formatCurrency = (amount, currencyCode = "INR") => {
  const symbol = getCurrencySymbol(currencyCode);
  const numAmount = Number(amount) || 0;
  return `${symbol}${numAmount.toFixed(2)}`;
};
// --- END Currency Formatters ---

export const {
  addToCart,
  addCustomItemToCart, // <-- Export new action
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  setSelectedCustomer,
  setNote,
  setDiscount,
  setPaymentMethod,
  setPointsToRedeem,
  holdOrder,
  resumeOrder,
  setCurrentOrder,
  resetOrder,
} = cartSlice.actions;

export default cartSlice.reducer;