import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "@/home/principal/login/login";
import Inicio from "@/home/principal/banner_inicio/inicio";
import Dashboard from "@/home/principal/dasboard/dasboard";
import Layout from "@/layout";
import Nosotros from "@/home/principal/nosotros/nosotros";
import RegDeportista from "@/home/principal/dasboard/deportista/regdeportista";
import ListaDeportista from "@/home/principal/dasboard/deportista/listadeportista";
import ContactoFamiliarDep from "@/home/principal/dasboard/deportista/contacto/contactofamiliardep";

import Club from "@/home/principal/dasboard/club/club";
import { useAuthStore } from "@/store/authstore";
import { RoleType } from "@/enums/roles/role";

import ListaClub from "@/home/principal/dasboard/club/listaclub";
import DashboardHome from "@/home/principal/dasboard/dashboard-home";
import ListaUsuarios from "@/home/principal/dasboard/gestion_usuarios/listausuario";
import { useEffect } from "react";

import ListarDeportistasPorClub from "@/home/principal/dasboard/club/listarclubdeportista";
import { GestionPartidos } from "@/home/principal/dasboard/partido/partido";

import EditarClub from "@/home/principal/dasboard/club/actualizarclub";
import ListaContactosDeportista from "@/home/principal/dasboard/deportista/contacto/listacontacto";

import EditarDeportista from "@/home/principal/dasboard/deportista/actualizardeportista";
import GestionTransferencias from "@/home/principal/dasboard/club/transferenciapage";
import { EditarUsuario } from "@/home/principal/dasboard/gestion_usuarios/editarusuario";
import { GestionEventos } from "@/home/principal/dasboard/eventos/GestionEventos";
import { Path } from "@/enums/path/path";
import { CambiarPassword } from "@/home/principal/login/cambiarcontrasena";
import CrearUsuario from "@/home/principal/registrar/crearusuario";

// src/routes/route.tsx
export const RoutesIndex = () => {
  const { isAuthenticated, user, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <Inicio />
              ) : (
                <Navigate to={getDefaultRoute(user?.role?.name)} replace />
              )
            }
          />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/login" element={<Login />} />

          <Route path="/cambiar-contrasena" element={<CambiarPassword />} />
        </Route>

        {/* Rutas protegidas - Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<DashboardHome />} />

          {/* Rutas accesibles para ADMIN (todas las rutas) */}
          {user?.role?.name === RoleType.ADMIN && (
            <>
              {/* Gestión de usuarios */}
              <Route path="crear-usuario" element={<CrearUsuario />} />
              <Route path="listausuario" element={<ListaUsuarios />} />
              <Route
                path="/dashboard/editar-usuario/:id"
                element={<EditarUsuario />}
              />

              {/* Gestión de deportistas */}
              <Route path="regdeportista" element={<RegDeportista />} />
              <Route path="listadeportista" element={<ListaDeportista />} />
              <Route
                path="/dashboard/editar-deportista/:id"
                element={<EditarDeportista />}
              />
              <Route
                path="contactofamiliar"
                element={<ContactoFamiliarDep />}
              />
              <Route
                path="listarcontactofamiliar"
                element={<ListaContactosDeportista />}
              />

              {/* Gestión de clubes */}
              <Route path="club" element={<Club />} />
              <Route path="listaclub" element={<ListaClub />} />
              <Route
                path="listaclubdeportista"
                element={<ListarDeportistasPorClub />}
              />
              <Route
                path="/dashboard/editar-club/:id"
                element={<EditarClub />}
              />

              {/* Gestión de eventos */}
              <Route path="registrar-evento" element={<GestionEventos />} />

              {/* Gestión de partidos */}
              <Route path="partidos" element={<GestionPartidos />} />

              {/* Otras */}

              <Route path="transferencia" element={<GestionTransferencias />} />
            </>
          )}

          {/* Rutas accesibles para USER */}
          {user?.role?.name === RoleType.USER && (
            <>
              <Route
                path="contactofamiliar"
                element={<ContactoFamiliarDep />}
              />
              <Route
                path="listarcontactofamiliar"
                element={<ListaContactosDeportista />}
              />
            </>
          )}

          {/* Rutas accesibles para PRESIDENTE_CLUB */}
          {user?.role?.name === RoleType.PRESIDENTE_CLUB && (
            <>
              <Route path="club" element={<Club />} />
              <Route path="listaclub" element={<ListaClub />} />
              <Route
                path="listaclubdeportista"
                element={<ListarDeportistasPorClub />}
              />
              <Route
                path="/dashboard/editar-club/:id"
                element={<EditarClub />}
              />
              
              

              <Route path="regdeportista" element={<RegDeportista />} />
              <Route path="listadeportista" element={<ListaDeportista />} />
              <Route
                path="/dashboard/editar-deportista/:id"
                element={<EditarDeportista />}
              />
              <Route
                path="contactofamiliar"
                element={<ContactoFamiliarDep />}
              />
              <Route
                path="listarcontactofamiliar"
                element={<ListaContactosDeportista />}
              />
            </>
          )}

          {/* Rutas accesibles para DIRECTOR_TECNICO */}
          {user?.role?.name === RoleType.DIRECTOR_TECNICO && (
            <>
              <Route path="regdeportista" element={<RegDeportista />} />
              <Route path="listadeportista" element={<ListaDeportista />} />
              <Route
                path="/dashboard/editar-deportista/:id"
                element={<EditarDeportista />}
              />
              <Route
                path="contactofamiliar"
                element={<ContactoFamiliarDep />}
              />
              <Route
                path="listarcontactofamiliar"
                element={<ListaContactosDeportista />}
              />
              <Route path="club" element={<Club />} />
              <Route path="listaclub" element={<ListaClub />} />
              <Route
                path="listaclubdeportista"
                element={<ListarDeportistasPorClub />}
              />
              <Route
                path="/dashboard/editar-club/:id"
                element={<EditarClub />}
              />

              
            </>
          )}

          {/* Rutas accesibles para DEPORTISTA */}
          {user?.role?.name === RoleType.DEPORTISTA && (
            <>
              <Route path="regdeportista" element={<RegDeportista />} />
              <Route path="listadeportista" element={<ListaDeportista />} />
              <Route
                path="/dashboard/editar-deportista/:id"
                element={<EditarDeportista />}
              />
              <Route
                path="contactofamiliar"
                element={<ContactoFamiliarDep />}
              />
              <Route
                path="listarcontactofamiliar"
                element={<ListaContactosDeportista />}
              />
            </>
          )}
        </Route>

        {/* Ruta de fallback */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />}
        />
      </Routes>
    </Router>
  );
};

// Función auxiliar para obtener la ruta por defecto según el rol
const getDefaultRoute = (role?: string) => {
  switch (role) {
    case RoleType.ADMIN:
      return Path.ADMIN;
    case RoleType.USER:
      return Path.USER;
    case RoleType.PRESIDENTE_CLUB:
      return Path.PRESIDENTE_CLUB;
    case RoleType.DIRECTOR_TECNICO:
      return Path.DIRECTOR_TECNICO;
    case RoleType.DEPORTISTA:
      return Path.DEPORTISTA;
    default:
      return "/";
  }
};
