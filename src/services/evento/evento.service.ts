// src/services/evento/evento.service.ts
import { Api } from "@/config/axios_base.config";
import {
  CreateEvento,
  Evento,
  UpdateEvento,
} from "@/interface/evento/evento.interface";
import axios from "axios";

export const CrearEvento = async (data: CreateEvento) => {
  try {
    const response = await Api.post("/evento", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || "Error al crear evento");
    }
    throw error;
  }
};

export const ConsultarEventos = async (params?: {
  tipo?: string;
  estado?: string;
  proximos?: boolean;
  activos?: boolean;
  todos?: boolean;
}) => {
  try {
    const response = await Api.get("/evento", { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al consultar eventos:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al consultar eventos"
      );
    }
    throw error;
  }
};

export const ConsultarEventoPorId = async (id: number) => {
  try {
    const response = await Api.get(`/evento/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al consultar evento:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al consultar evento"
      );
    }
    throw error;
  }
};

export const actualizarEvento = async (
  id: number,
  data: UpdateEvento
): Promise<Evento> => {
  try {
    const response = await Api.patch(`/evento/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al actualizar evento:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al actualizar evento"
      );
    }
    throw error;
  }
};

export const cancelarEvento = async (id: number): Promise<Evento> => {
  try {
    const response = await Api.delete(`/evento/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al cancelar evento:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al cancelar evento"
      );
    }
    throw error;
  }
};

export const inscribirClubEnEvento = async (
  idEvento: number,
  idClub: number,
  idUsuario: number
): Promise<any> => {
  try {
    const response = await Api.post(
      `/evento/${idEvento}/inscribir/${idClub}`,
      null,
      {
        params: { idUsuario },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al inscribir club:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al inscribir club"
      );
    }
    throw error;
  }
};

export const CambiarEstadoEvento = async (
  id: number,
  estado: string,
  idUsuario: number
): Promise<Evento> => {
  try {
    const response = await Api.post(`/evento/${id}/cambiar-estado`, {
      estado,
      idUsuario,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al cambiar estado:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al cambiar estado"
      );
    }
    throw error;
  }
};

export const obtenerInscripcionesEvento = async (
  idEvento: number,
  estado?: string
): Promise<any[]> => {
  try {
    const response = await Api.get(`/evento/${idEvento}/inscripciones`, {
      params: { estado },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener inscripciones:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al obtener inscripciones"
      );
    }
    throw error;
  }
};

// obtener clubes inscritos en un evento  
export const obtenerClubesPorEvento = async (idEvento: number) => {
  try {
    const response = await Api.get(`/evento/${idEvento}/clubes-inscritos`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener clubes del evento:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al obtener clubes del evento"
      );
    }
    throw error;
  }
};
