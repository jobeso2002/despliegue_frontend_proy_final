import { useAuthStore } from "@/store/authstore";
import { decryptData } from "@/store/decrypt/decryptData";
import axios from "axios";

// Usar la variable de entorno con un valor por defecto para desarrollo
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4001";

export const Api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
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
      useAuthStore.getState().logout();
      window.location.href = "/registrar";
    } else if (error.response?.status === 403) {
      window.location.href = "/dashboard";
    }
    return Promise.reject(error);
  }
);
