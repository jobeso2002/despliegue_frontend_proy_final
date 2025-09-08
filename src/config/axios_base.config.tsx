import { useAuthStore } from "@/store/authstore";
import { decryptData } from "@/store/decrypt/decryptData";
import axios from "axios";

// Asegúrate de que esta URL coincida con tu backend (puerto 4001 según tu código)
const config = import.meta.env.VITE_API_BASE_URL;

export const Api = axios.create({
  baseURL: config,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token
Api.interceptors.request.use((config) => {
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
    if (error.response?.status === 401) {
      // Token inválido o expirado
      useAuthStore.getState().logout();
      window.location.href = "/registrar";
    } else if (error.response?.status === 403) {
      // Permisos insuficientes
      window.location.href = "/dashboard"; // O a una ruta de "acceso denegado"
    }
    return Promise.reject(error);
  }
);
