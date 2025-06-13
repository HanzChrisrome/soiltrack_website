import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ requiredRole }: { requiredRole?: string }) => {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to="/login" replace />;

  if (requiredRole && authUser.role_name !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
