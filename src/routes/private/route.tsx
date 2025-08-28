import { Outlet, Navigate } from "react-router-dom";
import React from "react";
import { RoleType } from "@/enums/roles/role";
import { Path } from "@/enums/path/path";


interface RuteProps {
  IsAuth: boolean;
  role?: string; // Rol actual del usuario
  loading?: boolean; // Estado de carga, opcional
  allowedRoles: string[]; // Roles permitidos para la ruta
}

type PublicPropsRute = Omit<RuteProps, "allowedRoles">;

export const RutePrivate: React.FC<RuteProps> = ({
  IsAuth,
  role,
  loading,
  allowedRoles,
}) => {
  // Muestra un spinner o mensaje de carga si el estado loading es true
  if (loading) {
    return <div>Loading...</div>; // Puedes reemplazar esto con un spinner real si lo deseas
  }

  if (!IsAuth) {
    return <Navigate to="/login" />;
  }

  // Verifica si el usuario está autenticado y si su rol está en los roles permitidos
  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  // Si todo está bien, renderiza el contenido de la ruta protegida
  return <Outlet />;
};

export const RutePrublic = React.memo<PublicPropsRute>(
  ({ IsAuth, role }) => {
    
    if (IsAuth) {
      return (
        <Navigate
          to={
            role === RoleType.ADMIN
              ? Path.ADMIN
              : role === RoleType.USER
              ? Path.DEPORTISTA
              : Path.PRESIDENTE_CLUB
          }
        />
      );
    }
    return <Outlet />;
  }
);
