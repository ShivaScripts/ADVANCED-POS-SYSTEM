import React from "react";
import StoreSettings from "./StoreSettings";
import PaymentSettings from "./PaymentSettings";
// Removed: NotificationSettings, SecuritySettings, Save, Button
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

// --- Simple placeholder for Help & Support ---
const HelpSupport = () => (
  <Card id="help">
    <CardHeader>
      <CardTitle className="flex items-center">
        <HelpCircle className="mr-2 h-5 w-5 text-blue-500" />
        Help & Support
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>For assistance, please contact our support team at:</p>
      <a href="mailto:support@zoshpos.com" className="text-primary hover:underline">
        support@zoshpos.com
      </a>
      <p className="mt-2 text-sm text-muted-foreground">
        (This is a placeholder component.)
      </p>
    </CardContent>
  </Card>
);
// ---

const SettingsContent = ({
  activeSection, // Use this prop to show the correct section
  
  // Store Settings props
  storeSettings,
  onStoreSettingsSubmit, // This is the new prop from Settings.jsx
  isSubmitting, // This is the new prop from Settings.jsx
  onStoreSettingsChange, // This prop is passed to StoreSettings

  // Payment Settings props
  paymentSettings,
  onPaymentSettingsChange,
}) => {

  // --- START: Simplified Content ---
  // We now use activeSection to render the correct component
  return (
    <div className="space-y-6">
      {activeSection === "store-settings" && (
        <StoreSettings
          settings={storeSettings}
          onChange={onStoreSettingsChange} // Pass this down (Formik handles most)
          onSubmit={onStoreSettingsSubmit} // Pass the real submit handler
          isSubmitting={isSubmitting}     // Pass the submitting state
        />
      )}

      {activeSection === "payment-settings" && (
        <PaymentSettings
          settings={paymentSettings}
          onChange={onPaymentSettingsChange}
        />
      )}

      {activeSection === "help" && (
        <HelpSupport />
      )}
      
      {/* "Save All" Button is removed */}
    </div>
  );
  // --- END: Simplified Content ---
};

export default SettingsContent;