// pos-frontend-vite/src/pages/store/Settings/components/formUtils.js

// Transform settings data to API format
export const transformSettingsToApiFormat = (settings) => {
  return {
    brand: settings.storeName,
    description: settings.storeDescription,
    storeType: "Retail Store", // Default value
    contact: {
      address: settings.storeAddress,
      phone: settings.storePhone,
      email: settings.storeEmail,
    },
    // Updated fields
    currency: settings.currency,
    taxRate: parseFloat(settings.taxRate),
    dateFormat: settings.dateFormat,
    receiptFooter: settings.receiptFooter,
    // --- REMOVED: timezone ---
    
    // --- START: New Payment Toggle Fields ---
    acceptsCash: settings.acceptsCash,
    acceptsCard: settings.acceptsCard,
    acceptsUpi: settings.acceptsUpi,
    // --- END: New Payment Toggle Fields ---
  };
};

// Transform API data to settings format
export const transformApiToSettingsFormat = (apiData) => {
  return {
    storeName: apiData.brand || "",
    storeEmail: apiData.contact?.email || "",
    storePhone: apiData.contact?.phone || "",
    storeAddress: apiData.contact?.address || "",
    storeDescription: apiData.description || "",
    currency: apiData.currency || "USD",
    taxRate: apiData.taxRate?.toString() || "0",
    dateFormat: apiData.dateFormat || "MM/DD/YYYY",
    receiptFooter: apiData.receiptFooter || "",
    // --- REMOVED: timezone ---
    
    // --- START: New Payment Toggle Fields ---
    // Default to true if null/undefined from backend
    acceptsCash: apiData.acceptsCash ?? true,
    acceptsCard: apiData.acceptsCard ?? true,
    acceptsUpi: apiData.acceptsUpi ?? true,
    // --- END: New Payment Toggle Fields ---
  };
};

// Get initial values for the form
export const getInitialValues = (storeData) => {
  if (!storeData) {
    return {
      storeName: "",
      storeEmail: "",
      storePhone: "",
      storeAddress: "",
      storeDescription: "",
      currency: "USD",
      taxRate: "0",
      dateFormat: "MM/DD/YYYY",
      receiptFooter: "",
      // --- REMOVED: timezone ---
      
      // --- START: New Payment Toggle Fields ---
      acceptsCash: true,
      acceptsCard: true,
      acceptsUpi: true,
      // --- END: New Payment Toggle Fields ---
    };
  }

  return transformApiToSettingsFormat(storeData);
};