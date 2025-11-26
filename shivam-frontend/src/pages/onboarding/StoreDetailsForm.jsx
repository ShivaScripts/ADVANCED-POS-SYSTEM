import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Store, 
  MapPin, 
  Phone, 
  ArrowLeft, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StoreDetailsForm = ({ formData, handleChange, handleBack, handleSubmit, loading }) => {
  const [errors, setErrors] = useState({});

  const validateAndSubmit = () => {
    const newErrors = {};
    if (!formData.storeName) newErrors.storeName = "Store Name is required";
    if (!formData.storeType) newErrors.storeType = "Store Type is required";
    if (!formData.phone) newErrors.phone = "Phone Number is required";
    if (!formData.address) newErrors.address = "Address is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmit();
    }
  };

  // Wrapper to handle Select change since it doesn't pass a standard event object
  const handleSelectChange = (value) => {
    const event = { target: { name: 'storeType', value } };
    handleChange(event);
  };

  return (
    <div className="space-y-6">
      
      {/* Store Name */}
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name</Label>
        <div className="relative">
          <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="storeName"
            name="storeName"
            placeholder="My Awesome Shop"
            value={formData.storeName}
            onChange={handleChange}
            className={`pl-10 ${errors.storeName ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.storeName && <p className="text-xs text-red-500">{errors.storeName}</p>}
      </div>

      {/* Store Type (Dropdown) */}
      <div className="space-y-2">
        <Label htmlFor="storeType">Store Category</Label>
        <Select onValueChange={handleSelectChange} value={formData.storeType}>
          <SelectTrigger className={`w-full ${errors.storeType ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GROCERY">Grocery / Supermarket</SelectItem>
            <SelectItem value="CLOTHING">Clothing & Fashion</SelectItem>
            <SelectItem value="RESTAURANT">Restaurant / Cafe</SelectItem>
            <SelectItem value="ELECTRONICS">Electronics</SelectItem>
            <SelectItem value="PHARMACY">Pharmacy</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.storeType && <p className="text-xs text-red-500">{errors.storeType}</p>}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone">Business Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            name="phone"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Store Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="address"
            name="address"
            placeholder="123 Market Street, City"
            value={formData.address}
            onChange={handleChange}
            className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={handleBack} className="w-1/3 h-12" disabled={loading}>
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button onClick={validateAndSubmit} className="w-2/3 h-12 shadow-lg shadow-primary/20" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Creating...
            </>
          ) : (
            <>
              Complete Setup <CheckCircle2 className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StoreDetailsForm;