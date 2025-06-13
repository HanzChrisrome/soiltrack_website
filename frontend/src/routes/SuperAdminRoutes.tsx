import { Route } from "react-router-dom";
import SuperAdminDashboard from "../pages/sup_admin/Dashboard";
import RoleProtectedRoute from "../helper/ProtectedRoute";

const SuperAdminRoutes = () => (
  <Route
    path="master/dashboard"
    element={
      <RoleProtectedRoute allowedRoles={["SUPER ADMIN"]}>
        <SuperAdminDashboard />
      </RoleProtectedRoute>
    }
  />
);

export default SuperAdminRoutes;
