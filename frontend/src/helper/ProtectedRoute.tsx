// src/components/RoleProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface RoleProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(authUser.role_name)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
