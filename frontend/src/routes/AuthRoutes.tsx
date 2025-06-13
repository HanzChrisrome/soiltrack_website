import { Route, Navigate } from "react-router-dom";
import AuthLayout from "../pages/AuthLayout";
import LoginForm from "../pages/auth/LoginForm";
import SignupForm from "../pages/auth/SignupForm";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import { AuthUser } from "../store/useAuthStore";

const AuthRoutes = (authUser: AuthUser | null) => (
  <Route path="/" element={!authUser ? <AuthLayout /> : <Navigate to="/" />}>
    <Route index element={<Navigate to="login" />} />
    <Route path="login" element={<LoginForm />} />
    <Route path="signup" element={<SignupForm />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
  </Route>
);

export default AuthRoutes;
