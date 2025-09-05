// src/components/RoleRoute.tsx
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authstore";
import { RoleType } from "@/enums/roles/role";

interface RoleRouteProps {
  allowedRoles: RoleType[];
  redirectPath?: string;
}

export const RoleRoute = ({
  allowedRoles,
  redirectPath = "/",
}: RoleRouteProps) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role?.name as RoleType)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
