import {
  CreateTransferencia,
  Transferencia,
} from "@/interface/transferencia/transferencia.interface";
import {
  AprobarTransferencia,
  ConsultarTransferencias,
  CreateTransferencias,
  RechazarTransferencia,
} from "@/services/transferencia/transferencia.service";
import { create } from "zustand";

interface TransferenciaProp {
  transferencias: Transferencia[];
  transferenciaConsulta: Transferencia | null;
  ConsultarTransferencias: () => Promise<void>;
  crear_transferencia: (data: CreateTransferencia) => Promise<void>;
  aprobar_transferencia: (
    id: string | number,
    idUsuario: number
  ) => Promise<void>;
  rechazar_transferencia: (
    id: string | number,
    idUsuario: number,
    motivo?: string
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useTransferenciaStore = create<TransferenciaProp>((set) => ({
  transferencias: [],
  transferenciaConsulta: null,
  loading: false,
  error: null,

  ConsultarTransferencias: async () => {
    set({ loading: true, error: null });
    try {
      const response = await ConsultarTransferencias();
      set({ transferencias: response.data, loading: false });
    } catch (error) {
      set({ error: "Error al cargar transferencias", loading: false });
      console.error("Error al consultar transferencias:", error);
    }
  },

  crear_transferencia: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await CreateTransferencias(data);
      const updated = await ConsultarTransferencias();
      set({ transferencias: updated.data, loading: false });
      return response;
    } catch (error: any) {
      let errorMessage = "Error al crear transferencia";

      if (error.response) {
        // Manejo específico de errores del backend
        if (error.response.status === 409) {
          errorMessage =
            error.response.data.message ||
            "El deportista ya tiene una transferencia pendiente o no pertenece al club de origen";
        }
      }

      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  aprobar_transferencia: async (id, idUsuario) => {
    set({ loading: true, error: null });
    try {
      const response = await AprobarTransferencia(
        Number(id),
        Number(idUsuario)
      );
      const updated = await ConsultarTransferencias();
      set({ transferencias: updated.data, loading: false });
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al aprobar transferencia";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  rechazar_transferencia: async (id, idUsuario, motivo) => {
    set({ loading: true, error: null });
    try {
      const response = await RechazarTransferencia(
        Number(id),
        Number(idUsuario),
        motivo
      );
      const updated = await ConsultarTransferencias();
      set({ transferencias: updated.data, loading: false });
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al rechazar transferencia";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },
}));
