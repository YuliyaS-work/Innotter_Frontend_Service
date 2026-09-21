import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignupPage } from './pages/auth/SignupPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ProfilePage } from './pages/user/ProfilePage';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route path="/me" element={<ProfilePage />} />

        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
};