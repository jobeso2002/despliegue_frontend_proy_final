// src/services/deportista/deportista.service.ts
import { Api } from "@/config/axios_base.config";


export const CreateDeportistas = async (formData: FormData) => {
  try {
    const response = await Api.post("/deportista", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear deportista:", error);
    throw error;
  }
};

export const ConsultarDeportistas = () => {
  return Api.get("/deportista");
};

export const ActualizarDeportista = async (id: number, formData: FormData) => {
  try {
    const response = await Api.patch(`/deportista/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar deportista:", error);
    throw error;
  }
};

export const EliminarDeportista = async (id: number) => {
  try {
    const response = await Api.delete(`/deportista/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar deportista:", error);
    throw error;
  }
};