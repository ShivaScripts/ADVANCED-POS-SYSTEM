// pos-frontend-vite/src/pages/store/Settings/components/validation.js

import * as Yup from "yup";

// Validation schema for store settings
export const StoreSettingsValidationSchema = Yup.object().shape({
  storeName: Yup.string()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must be less than 100 characters")
    .required("Store name is required"),
  storeEmail: Yup.string()
    .email("Please enter a valid email address")
    .required("Store email is required"),
  storePhone: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .required("Store phone is required"),
  storeAddress: Yup.string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters")
    .required("Store address is required"),
  storeDescription: Yup.string()
    .max(500, "Description must be less than 500 characters"),
  
  // --- START: FIX ---
  // The lines for 'currency', 'dateFormat', and 'receiptFooter' have been completely removed.
  // --- END: FIX ---

  taxRate: Yup.number()
    .min(0, "Tax rate must be 0 or greater")
    .max(100, "Tax rate cannot exceed 100%")
    .required("Tax rate is required"),
    
  // --- START: New Payment Toggle Validation ---
  acceptsCash: Yup.boolean(),
  acceptsCard: Yup.boolean(),
  acceptsUpi: Yup.boolean(),
  // --- END: New Payment Toggle Validation ---
});

// Currency options (keep as is)
export const CURRENCY_OPTIONS = [
  // ... your options ...
  { value: "INR", label: "INR - Indian Rupee" },
];

// --- REMOVED: TIMEZONE_OPTIONS ---

// Date format options (keep as is)
export const DATE_FORMAT_OPTIONS = [
  // ... your options ...
];