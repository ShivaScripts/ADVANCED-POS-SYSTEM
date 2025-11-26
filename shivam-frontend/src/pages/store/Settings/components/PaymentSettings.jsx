// pos-frontend-vite/src/pages/store/Settings/components/PaymentSettings.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Banknote, Smartphone } from "lucide-react"; // Added more icons
import ToggleSwitch from "./ToggleSwitch";

const PaymentSettings = ({ settings, onChange }) => {
  // --- START: Updated paymentOptions ---
  const paymentOptions = [
    {
      name: "acceptsCash",
      title: "Accept Cash",
      description: "Allow cash payments at checkout.",
      icon: Banknote,
    },
    {
      name: "acceptsCard",
      title: "Accept Card",
      description: "Allow card payments (via Razorpay).",
      icon: CreditCard,
    },
    {
      name: "acceptsUpi",
      title: "Accept UPI/Mobile",
      description: "Allow UPI/QR code payments.",
      icon: Smartphone,
    },
  ];
  // --- END: Updated paymentOptions ---

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    // Pass the name and the boolean value to the parent
    onChange(name, checked); 
  };

  return (
    <Card id="payment-settings">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5 text-emerald-500" />
          Payment Settings
        </CardTitle>
        <CardDescription>
          Configure which payment methods are enabled for cashiers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-medium">{option.title}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <ToggleSwitch
                  name={option.name}
                  // Read the value from the 'settings' prop
                  checked={settings[option.name]} 
                  onChange={handleToggleChange}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSettings;