// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to="/login" />;
  if (!allowedRoles.includes(authUser.role_name))
    return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
