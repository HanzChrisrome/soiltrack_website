import { Route } from "react-router-dom";
import MainPage from "../pages/mun_admin/dashboard/MainPage";
import UserPage from "../pages/mun_admin/dashboard/UserPage";
import AreaPage from "../pages/mun_admin/dashboard/AreaPage";
import SpecificPlotPage from "../pages/mun_admin/dashboard/SpecificPlotPage";
import AddUserPage from "../components/mun_admin/UserPage/AddUserWidget";
import RoleProtectedRoute from "../helper/ProtectedRoute";

const AdminRoutes = () => (
  <>
    <Route
      path="admin/dashboard"
      element={
        <RoleProtectedRoute allowedRoles={["MUNICIPALITY ADMIN"]}>
          <MainPage />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="admin/residents"
      element={
        <RoleProtectedRoute allowedRoles={["MUNICIPALITY ADMIN"]}>
          <UserPage />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="admin/area-page"
      element={
        <RoleProtectedRoute allowedRoles={["MUNICIPALITY ADMIN"]}>
          <AreaPage />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="admin/specific-area/:plotId"
      element={
        <RoleProtectedRoute allowedRoles={["MUNICIPALITY ADMIN"]}>
          <SpecificPlotPage />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="add-user"
      element={
        <RoleProtectedRoute allowedRoles={["MUNICIPALITY ADMIN"]}>
          <AddUserPage />
        </RoleProtectedRoute>
      }
    />
  </>
);

export default AdminRoutes;
