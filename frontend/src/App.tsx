import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import useThemeStore from "./store/useThemeStore";
import Unauthorized from "./pages/UnauthorizedPage";
import AuthRoutes from "./routes/AuthRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";

const App = () => {
  const { authUser, checkAuth, isAuthLoaded } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthLoaded) {
    return (
      <div
        data-theme={theme}
        className="bg-base-100 flex items-center justify-center h-screen"
      >
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        >
          <Route
            index
            element={
              authUser?.role_name === "SUPER ADMIN" ? (
                <Navigate to="master/dashboard" />
              ) : (
                <Navigate to="admin/dashboard" />
              )
            }
          />

          {AdminRoutes()}
          {SuperAdminRoutes()}
        </Route>

        {AuthRoutes(authUser)}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
