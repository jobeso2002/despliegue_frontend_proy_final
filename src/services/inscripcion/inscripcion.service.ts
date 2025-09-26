import { Api } from "@/config/axios_base.config";
import {
  CreateInscripcion,
  UpdateInscripcion,
} from "@/interface/inscripcion/inscripcion.interfaces";

export const crearInscripcion = async (data: CreateInscripcion) => {
  try {
    const response = await Api.post("/inscripcion", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear inscripción:", error);
    throw error;
  }
};

export const consultarInscripciones = async () => {
  return Api.get("/inscripcion");
};

export const consultarInscripcionesPorEvento = async (
  idEvento: number,
  estado?: string
) => {
  return Api.get(
    `/inscripcion?evento=${idEvento}${estado ? `&estado=${estado}` : ""}`
  );
};

export const consultarInscripcionesPorClub = async (idClub: number) => {
  return Api.get(`/inscripcion?club=${idClub}`);
};

export const consultarInscripcionPorId = async (id: number) => {
  return Api.get(`/inscripcion/${id}`);
};

export const actualizarInscripcion = async (
  id: number,
  data: UpdateInscripcion
) => {
  try {
    const response = await Api.patch(`/inscripcion/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar inscripción:", error);
    throw error;
  }
};

export const eliminarInscripcion = async (id: number) => {
  try {
    const response = await Api.delete(`/inscripcion/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar inscripción:", error);
    throw error;
  }
};

export const aprobarInscripcion = async (
  id: number,
  idUsuarioAprueba: number
) => {
  try {
    const response = await Api.post(`/inscripcion/${id}/aprobar`, {
      idUsuario: idUsuarioAprueba, // Enviar en el body en lugar de params
    });
    return response.data;
  } catch (error) {
    console.error("Error al aprobar inscripción:", error);
    throw error;
  }
};

export const rechazarInscripcion = async (
  id: number,
  idUsuarioRechaza: number
) => {
  try {
    const response = await Api.post(`/inscripcion/${id}/rechazar`, {
      idUsuario: idUsuarioRechaza, // Enviar en el body en lugar de params
    });
    return response.data;
  } catch (error) {
    console.error("Error al rechazar inscripción:", error);
    throw error;
  }
};
