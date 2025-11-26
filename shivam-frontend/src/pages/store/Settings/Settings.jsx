// pos-frontend-vite/src/pages/store/Settings/Settings.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStoreByAdmin, updateStore } from "@/Redux Toolkit/features/store/storeThunks";
import { toast } from "@/components/ui/use-toast";
import {
  SettingsHeader,
  SettingsNavigation,
  SettingsContent
} from "./components";
// --- START: Import the transformation function ---
import { 
  getInitialValues, 
  transformApiToSettingsFormat, 
  transformSettingsToApiFormat // <-- We need this for auto-saving
} from "./components/formUtils";
// --- END: Import ---

// List of fields that trigger auto-save
const AUTO_SAVE_FIELDS = ["acceptsCash", "acceptsCard", "acceptsUpi"];

export default function Settings() {
  const dispatch = useDispatch();
  const { store, loading } = useSelector((state) => state.store);

  const [storeSettings, setStoreSettings] = useState(getInitialValues(null));
  const [activeSection, setActiveSection] = useState("store-settings");
  
  // 'isSubmitting' is for the main form, 'isAutoSaving' is for toggles
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // --- START: Add debounce timer ref ---
  const debounceTimer = useRef(null);
  // --- END: Add debounce timer ref ---

  // Fetch store data on load
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const data = await dispatch(getStoreByAdmin()).unwrap();
        setStoreSettings(transformApiToSettingsFormat(data));
      } catch (err) {
        toast({
          title: "Error",
          description: err.message || err || "Failed to fetch store data",
          variant: "destructive",
        });
      }
    };
    fetchStoreData();
  }, [dispatch]);

  // Update form state if 'store' in Redux changes (e.g., after a save)
  useEffect(() => {
    if (store) {
      setStoreSettings(transformApiToSettingsFormat(store));
    }
  }, [store]);

  // --- START: Create an "auto-save" function ---
  const handleAutoSave = useCallback(async (newSettings) => {
    if (!store?.id) {
      // Don't try to save if we don't have a store ID yet
      return;
    }
    
    setIsAutoSaving(true);
    
    try {
      // 1. Transform the new settings into the API format
      const apiData = transformSettingsToApiFormat(newSettings);
      
      // 2. Dispatch the update
      await dispatch(updateStore({ 
        id: store.id, 
        storeData: apiData 
      })).unwrap();
      
      toast({
        title: "Settings Saved",
        description: "Payment settings have been updated.",
      });

    } catch (err) {
      toast({
        title: "Auto-Save Failed",
        description: err.message || err || "Failed to save payment settings",
        variant: "destructive",
      });
      // Optional: Revert state to the last saved state from `store`
      // setStoreSettings(transformApiToSettingsFormat(store));
    } finally {
      setIsAutoSaving(false);
    }
  }, [dispatch, store]); // Dependencies
  // --- END: Create an "auto-save" function ---


  // --- START: Modify the single change handler ---
  const handleSettingsChange = (name, value) => {
    // 1. Create the new state object immediately
    const newSettings = {
      ...storeSettings,
      [name]: value,
    };
    
    // 2. Update the local React state
    setStoreSettings(newSettings);
    
    // 3. Check if this field should trigger an auto-save
    if (AUTO_SAVE_FIELDS.includes(name)) {
      
      // Clear any existing timer to debounce
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      
      // Set a new timer
      debounceTimer.current = setTimeout(() => {
        handleAutoSave(newSettings); // Pass the new settings to the save function
      }, 1000); // 1-second debounce
    }
  };
  // --- END: Modify the single change handler ---


  // Handle Form Submission (from StoreSettingsForm)
  const handleStoreSettingsSubmit = async (apiData, { setSubmitting, resetForm }) => {
    if (!store?.id) {
      toast({ title: "Error", description: "Store ID not found.", variant: "destructive" });
      setSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitting(true);
    try {
      // apiData is already transformed by Formik/formUtils
      const updatedStore = await dispatch(updateStore({ 
        id: store.id, 
        storeData: apiData
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Store settings updated successfully",
      });
      
      // Reset the form with the new, saved values from the server
      resetForm({ values: transformApiToSettingsFormat(updatedStore) });
      
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || err || "Failed to update store settings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SettingsNavigation 
            activeSection={activeSection} 
            setActiveSection={setActiveSection}
          />
        </div>

        <div className="md:col-span-2">
          <SettingsContent
            activeSection={activeSection}
            
            // Pass the single settings state and handler
            storeSettings={storeSettings}
            onStoreSettingsChange={handleSettingsChange}
            
            // Pass payment settings FROM the main state
            paymentSettings={storeSettings} // Pass the same object
            onPaymentSettingsChange={handleSettingsChange} // Use the same handler
            
            onStoreSettingsSubmit={handleStoreSettingsSubmit}
            
            // The main form save button OR the auto-save can show loading
            isSubmitting={isSubmitting || loading || isAutoSaving} 
          />
        </div>
      </div>
    </div>
  );
}