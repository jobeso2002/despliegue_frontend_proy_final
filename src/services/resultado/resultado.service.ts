// En src/services/resultado/resultado.service.ts
import { Api } from "@/config/axios_base.config";
import { CreateResultado, } from "@/interface/resultado/resultado.interface";
import axios from "axios";

export const CrearResultado = async (data: CreateResultado) => {
  try {
    const response = await Api.post("/resultado", {
      ...data,
      partidoId: data.partidoId,
      usuarioRegistraId: data.usuarioRegistraId,
      sets: data.sets.map(set => ({
        numeroSet: set.numeroSet,
        puntosLocal: set.puntosLocal,
        puntosVisitante: set.puntosVisitante
      }))
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al crear resultado:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al crear resultado");
    }
    throw error;
  }
};

export const ObtenerResultadoPorPartido = async (partidoId: number) => {
  try {
    const response = await Api.get(`/resultado/partido/${partidoId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null; // Resultado no existe es un caso válido
      }
      console.error("Error al obtener resultado:", error.response?.data);
      throw new Error(error.response?.data?.message || "Error al obtener resultado");
    }
    throw error;
  }
};