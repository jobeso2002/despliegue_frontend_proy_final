import { useAuthStore } from "@/store/authstore";
import { decryptData } from "@/store/decrypt/decryptData";
import axios from "axios";

// Asegúrate de que esta URL coincida con tu backend (puerto 4001 según tu código)
const config = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";

export const Api = axios.create({
  baseURL: config,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Lista de endpoints que NO requieren token
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password'
];

// Función para verificar si la URL es pública
const isPublicEndpoint = (url: string) => {
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Interceptor para añadir el token SOLO si no es endpoint público
Api.interceptors.request.use((config) => {
  // Si es un endpoint público, no añadir token
  if (isPublicEndpoint(config.url || '')) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    // Solo desencripta si no parece un JWT (no contiene puntos)
    const authToken = token.includes(".") ? token : decryptData(token);
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
  }
  return config;
});

// Interceptor para manejar errores
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es un endpoint público, no hacer logout
    if (isPublicEndpoint(error.config?.url || '')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Token inválido o expirado
      useAuthStore.getState().logout();
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      // Permisos insuficientes
      window.location.href = "/dashboard"; // O a una ruta de "acceso denegado"
    }
    return Promise.reject(error);
  }
);
