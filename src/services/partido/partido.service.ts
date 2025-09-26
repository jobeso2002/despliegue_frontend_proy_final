import { Api } from "@/config/axios_base.config";
import { CreatePartido } from "../../interface/partido/partido.interface";
import axios from "axios";

export const CrearPartido = async (data: CreatePartido) => {
  try {
    const response = await Api.post("/partido", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al crear partido"
      );
    }
    throw error;
  }
};

export const ConsultarPartidos = async (params?: {
  evento?: number;
  club?: number;
  fechaInicio?: string;
  fechaFin?: string;
}) => {
  try {
    const response = await Api.get("/partido", {
      params: {
        ...params,
        includeEvento: true, // Siempre incluir el evento
        includeResultado: true, // Siempre incluir el resultado
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al consultar partidos:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al consultar partidos"
      );
    }
    throw error;
  }
};

export const ActualizarPartido = async (id: number, data: Partial<CreatePartido>) => {
  try {
    const response = await Api.patch(`/partido/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al actualizar partido:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al actualizar partido"
      );
    }
    throw error;
  }
};

export const ConsultarPartidoPorId = async (id: number) => {
  try {
    const response = await Api.get(`/partido/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al consultar partido:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al consultar partido"
      );
    }
    throw error;
  }
};

export const CambiarEstadoPartido = async (
  id: number,
  estado: string,
  motivo?: string
) => {
  try {
    const response = await Api.post(`/partido/${id}/cambiar-estado`, {
      estado,  // Asegúrate de que este campo se llama exactamente "estado"
      motivoCancelacion: motivo // Cambiado a motivoCancelacion para coincidir con el backend
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al cambiar estado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al cambiar estado del partido"
      );
    }
    throw error;
  }
};

export const RegistrarResultado = async (
  idPartido: number,
  resultado: {
    setsLocal: number;
    setsVisitante: number;
    ganador: string;
    destacados?: string;
  }
) => {
  try {
    const response = await Api.post(
      `/partido/${idPartido}/resultado`,
      resultado
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al registrar resultado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Error al registrar resultado"
      );
    }
    throw error;
  }
};
