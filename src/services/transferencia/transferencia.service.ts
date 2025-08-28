import { Api } from "@/config/axios_base.config";
import { CreateTransferencia } from "@/interface/transferencia/transferencia.interface";

// services/transferencia/transferencia.service.ts
export const CreateTransferencias = async (data: CreateTransferencia) => {
  try {
    // Transforma los datos al formato que espera el backend
    const payload = {
      id_deportista: data.deportista.id,
      id_club_origen: data.clubOrigen.id,
      id_club_destino: data.clubDestino.id,
      fechaTransferencia: data.fechaTransferencia,
      motivo: data.motivo,
      id_usuario_registra: data.usuarioRegistra.id,
    };

    const response = await Api.post("/transferencia", payload);
    return response.data;
  } catch (error) {
    console.error("Error al crear transferencia:", error);
    throw error;
  }
};

export const ConsultarTransferencias = () => {
  return Api.get("/transferencia");
};

export const AprobarTransferencia = async (id: number, idUsuario: number) => {
  try {
    // Opción 1: Enviar como query parameter (si el backend lo espera así)
    const response = await Api.post(
      `/transferencia/${id}/aprobar?idUsuario=${idUsuario}`
    );

    return response.data;
  } catch (error) {
    console.error("Error al aprobar transferencia:", error);
    throw error;
  }
};

export const RechazarTransferencia = async (
  id: number,
  idUsuario: number,
  motivo?: string
) => {
  try {
    // Opción 1: Con parámetros en URL
    const response = await Api.post(
      `/transferencia/${id}/rechazar?idUsuario=${idUsuario}`,
      { motivo }
    );

    return response.data;
  } catch (error) {
    console.error("Error al rechazar transferencia:", error);
    throw error;
  }
};
