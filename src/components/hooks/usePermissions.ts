// src/hooks/usePermissions.ts
import { PermisoType } from "@/enums/permisotype/permiso";
import { useAuthStore } from "@/store/authstore";



export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission: PermisoType) => {
    if (!user) return false;
    return user.permisos?.includes(permission) || false;
  };

  return { hasPermission };
};