// pos-frontend-vite/src/routes/AuthRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/common/Auth/Login';
// Removed: ResetPassword
import Onboarding from '../pages/onboarding/Onboarding';

// Removed: ForgotPasswordPage placeholder

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="onboarding" element={<Onboarding />} />
      {/* Removed: forgot-password route */}
      {/* Removed: reset-password route */}
      {/* Add more auth-specific routes here */}
    </Routes>
  );
};

export default AuthRoutes;