import { Api } from "@/config/axios_base.config";
import { CreateClub } from "../../interface/club/club.interface";
import axios from "axios";

export const CreaClub = async (data: CreateClub) => {
  try {
    const response = await Api.post("/club", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || "Error al crear club");
    }
    throw error;
  }
};

export const ConsultarClub = () => {
  return Api.get("/club");
};

// En tu servicio (club.service.ts)
export const getDeportistasByClub = (clubId: number) => {
  return Api.get(`/club/${clubId}/deportistas?estado=activo`);
};

// Actualizar un club
export const ActualizarClub = async (id: number, formData: FormData) => {
  try {
    const response = await Api.patch(`/club/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al actualizar club"
      );
    }
    throw error;
  }
};

// club.service.ts
export const EliminarClub = async (id: number) => {
  try {
    const response = await Api.delete(`/club/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al eliminar club:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al eliminar club"
      );
    }
    throw error;
  }
};
