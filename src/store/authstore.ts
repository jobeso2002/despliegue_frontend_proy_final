import { create } from "zustand";
import { decryptData, encryptData } from "./decrypt/decryptData";
import { jwtDecode } from "jwt-decode";
import {
  forgotPassword, loginService, resetPassword, changePasswordAuthenticated,
  checkPasswordExpiration
} from "@/services/auth/auth.service";

interface AuthState {
  user: {
    id: number;
    email: string;
    username: string;
    role: {
      id: number;
      name: string;
    };
    permisos?: string[]; // Añadir permisos si los necesitas
    passwordExpired?: boolean; // NUEVO: para controlar expiración
  } | null;
  token: string | null;
  error: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  passwordStatus: { // NUEVO: estado de expiración
    expired: boolean;
    daysRemaining?: number;
  } | null;


  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  forgotPassword: (email: string) => Promise<{ 
    success: boolean; 
    resetToken?: string; 
    message?: string 
  }>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
  }) => Promise<void>;
  checkPasswordExpirationStatus: () => Promise<void>;
  clearError: () => void;
}


export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  error: null,
  isAuthenticated: false,
  loading: true,
  passwordStatus: null,

  initializeAuth: () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      return set({ loading: false });
    }

    try {
      // Desencriptar token si es necesario
      const token = storedToken.includes(".")
        ? storedToken
        : decryptData(storedToken);
      if (!token) throw new Error("Token inválido");

      // Decodificar el token para obtener los datos del usuario
      const decoded = jwtDecode(token) as {
        id: number;
        email: string;
        username: string;
        role: { id: number; name: string };
        exp?: number;
      };

      // Verificar expiración
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expirado");
      }

      // Desencriptar usuario del localStorage para mantener consistencia
      const decryptedUser = decryptData(storedUser);

      // Validar que los datos del token coincidan con los del localStorage
      if (
        decryptedUser.id !== decoded.id ||
        decryptedUser.email !== decoded.email
      ) {
        throw new Error("Inconsistencia en los datos de usuario");
      }

      set({
        user: {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username, // Usamos el username del token
          role: decoded.role,
        },
        token,
        isAuthenticated: true,
        error: null,
        loading: false,
      });
      // Verificar expiración de contraseña después de inicializar
      get().checkPasswordExpirationStatus();
    } catch (error) {
      console.error("Error al inicializar auth:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await loginService(data);
      const token = response.token;

      // Decodificar para verificar
      const decoded = jwtDecode<{
        id: number;
        email: string;
        username: string;
        role: { id: number; name: string };
        permisos?: string[];
        exp: number;
      }>(token);

      // Verificar expiración
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expirado");
      }

      // Guardar en localStorage (encriptar solo si no es producción)
      const shouldEncrypt = import.meta.env.NODE_ENV !== "production";
      localStorage.setItem("token", shouldEncrypt ? encryptData(token) : token);

      // Guardar usuario en localStorage (encriptado)
      const userData = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
        permisos: decoded.permisos || [], // Asegurarse de que permisos sea un array
      };
      localStorage.setItem("user", encryptData(userData));

      set({
        user: userData,
        token,
        isAuthenticated: true,
        error: null,
        loading: false,
      });
      // Verificar expiración después del login
      get().checkPasswordExpirationStatus();
    } catch (error: any) {
      console.error("Detalles del error:", error.response?.data);
      set({
        error: error.response?.data?.message || "Credenciales inválidas",
        isAuthenticated: false,
        loading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      loading: false,
      passwordStatus: null,
    });
  },

  forgotPassword: async (email: string) => {
  set({ loading: true, error: null });
  try {
    const result = await forgotPassword(email);
    return result; // Devuelve el resultado con el token
  } catch (error: any) {
    set({ error: error.response?.data?.message || "Error al solicitar cambio de contraseña" });
    throw error;
  } finally {
    set({ loading: false });
  }
},

  resetPassword: async (email: string, token: string, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      await resetPassword(email, token, newPassword);
      // Puedes manejar el éxito aquí o en el componente
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error al restablecer contraseña" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // NUEVO: Cambiar contraseña cuando estás autenticado
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
  }) => {
    set({ loading: true, error: null });
    try {
      await changePasswordAuthenticated(data);
      // Si el cambio fue exitoso, actualizamos el estado de expiración
      await get().checkPasswordExpirationStatus();
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Error al cambiar contraseña" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // NUEVO: Verificar estado de expiración
  checkPasswordExpirationStatus: async () => {
    try {
      const response = await checkPasswordExpiration();
      set({ passwordStatus: response.data });
      
      // Si la contraseña está expirada, marcamos al usuario
      if (response.data.expired) {
        set(state => ({
          user: state.user ? { ...state.user, passwordExpired: true } : null
        }));
      }
    } catch (error) {
      console.error("Error al verificar expiración:", error);
    }
  },

  clearError: () => set({ error: null }),
}));
