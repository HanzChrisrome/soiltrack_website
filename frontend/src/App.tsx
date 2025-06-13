import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import MainPage from "./pages/mun_admin/dashboard/MainPage";
import UserPage from "./pages/mun_admin/dashboard/UserPage";
import AuthLayout from "./pages/AuthLayout";
import LoginForm from "./pages/auth/LoginForm";
import SignupForm from "./pages/auth/SignupForm";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import useThemeStore from "./store/useThemeStore";
import AreaPage from "./pages/mun_admin/dashboard/AreaPage";
import SpecificPlotPage from "./pages/mun_admin/plots/SpecificPlotPage";
import AddUserPage from "./components/mun_admin/UserPage/AddUserWidget";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div
        data-theme={theme}
        className="bg-base-100 flex items-center justify-center h-screen"
      >
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<MainPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="area-page" element={<AreaPage />} />
          <Route path="specific-area" element={<SpecificPlotPage />} />
          <Route path="add-user" element={<AddUserPage />} />
        </Route>

        <Route
          path="/"
          element={!authUser ? <AuthLayout /> : <Navigate to="/" />}
        >
          <Route index element={<Navigate to="login" />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
