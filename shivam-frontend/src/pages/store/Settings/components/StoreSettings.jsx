import React from "react";
// --- START: REMOVE UNUSED IMPORTS ---
// import { useDispatch, useSelector } from "react-redux";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { toast } from "@/components/ui/use-toast";
// import { updateStore } from "@/Redux Toolkit/features/store/storeThunks";
// import { getInitialValues } from "./formUtils";
// --- END: REMOVE UNUSED IMPORTS ---

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store } from "lucide-react";
import StoreSettingsForm from "./StoreSettingsForm";


// --- START: FIX ---
// 1. Accept 'onSubmit' and 'isSubmitting' as props
const StoreSettings = ({ settings, onSubmit, isSubmitting }) => {
  // 2. Remove the local dispatch, store, loading, and isSubmitting state
  // 3. Remove the buggy local 'handleFormSubmit' function
  // --- END: FIX ---

  return (
    <Card id="store-settings">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Store className="mr-2 h-5 w-5 text-emerald-500" />
          Store Settings
        </CardTitle>
        <CardDescription>
          Configure your store's basic information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* --- START: FIX --- */}
        {/* 4. Pass the 'onSubmit' and 'isSubmitting' props directly to the form */}
        <StoreSettingsForm
          initialValues={settings}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        {/* --- END: FIX --- */}
      </CardContent>
    </Card>
  );
};

export default StoreSettings;