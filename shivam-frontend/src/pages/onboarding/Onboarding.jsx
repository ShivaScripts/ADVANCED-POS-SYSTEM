// pos-frontend-vite/src/pages/onboarding/Onboarding.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  CheckCircle2, 
  Code2, 
  Store,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

// Child Forms
import OwnerDetailsForm from './OwnerDetailsForm';
import StoreDetailsForm from './StoreDetailsForm';

// Redux Actions
import { signup } from '@/Redux Toolkit/features/auth/authThunk';
import { createStore } from '@/Redux Toolkit/features/store/storeThunks';
import { getUserProfile } from '@/Redux Toolkit/features/user/userThunks';

const Onboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Owner Details
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_STORE_ADMIN',
    // Store Details
    storeName: '',
    storeType: '',
    address: '',
    phone: '',
    gstNumber: '' // Added if needed, or remove if not in your form
  });

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Navigation Handlers
  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  // Final Submission
  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // 1. Sign Up User
      const signupAction = await dispatch(signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }));

      if (signup.fulfilled.match(signupAction)) {
        const jwt = signupAction.payload.jwt;
        localStorage.setItem('jwt', jwt);

        // 2. Create Store
        const storeAction = await dispatch(createStore({
          name: formData.storeName,
          address: formData.address,
          phone: formData.phone,
          storeType: formData.storeType
          // Add other store fields your backend expects
        }));

        if (createStore.fulfilled.match(storeAction)) {
          // 3. Get Profile & Redirect
          await dispatch(getUserProfile(jwt));
          navigate('/store/dashboard');
        }
      }
    } catch (error) {
      console.error("Onboarding failed:", error);
      // You can add a toast error here
    }
  };

  // Steps Configuration for Visuals
  const steps = [
    { number: 1, title: "Account Setup", desc: "Create your admin credentials", icon: <User className="w-5 h-5" /> },
    { number: 2, title: "Business Details", desc: "Tell us about your store", icon: <Store className="w-5 h-5" /> },
    { number: 3, title: "All Set!", desc: "Start selling immediately", icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden">
      
      {/* --- LEFT PANEL: Progress & Info --- */}
      <div className="hidden lg:flex w-[400px] xl:w-[450px] bg-muted/30 border-r border-border flex-col relative p-12">
        {/* Animated Background */}
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Code2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">Z-<span className="text-primary">POS</span></span>
        </div>

        {/* Stepper Visual */}
        <div className="relative z-10 space-y-8">
          {steps.map((s, i) => (
            <div key={i} className={`flex gap-4 ${step === s.number ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300`}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                  ${step > s.number 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : step === s.number 
                      ? 'border-primary text-primary bg-primary/10' 
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {step > s.number ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
                </div>
                {/* Connector Line */}
                {i !== steps.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${step > s.number ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
                )}
              </div>
              <div className="pt-1">
                <h3 className={`font-bold text-lg ${step === s.number ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="relative z-10 mt-auto pt-10 border-t border-border/50">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Bank-grade security encryption</span>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © 2024 Z-POS Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* --- RIGHT PANEL: Forms --- */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center p-6 lg:p-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Home</span>
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">Already have an account?</span>
            <Button variant="outline" onClick={() => navigate('/auth/login')}>Log In</Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
          <div className="w-full max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {step === 1 ? "Create your account" : "Setup your store"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {step === 1 
                  ? "Get started with your 14-day free trial. No card required." 
                  : "Tell us a bit about your business to customize your dashboard."}
              </p>
            </div>

            {/* FORM RENDERER */}
            <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8">
              {step === 1 && (
                <OwnerDetailsForm 
                  formData={formData} 
                  handleChange={handleInputChange} 
                  handleNext={handleNext} 
                />
              )}
              
              {step === 2 && (
                <StoreDetailsForm 
                  formData={formData} 
                  handleChange={handleInputChange} 
                  handleBack={handleBack}
                  handleSubmit={handleFinalSubmit}
                  loading={loading}
                />
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Onboarding;