import { Api } from "@/config/axios_base.config";
import {

  Deportista,
} from "@/interface/deportista/deportista.interface";
import {

  ConsultarDeportistas,

  EliminarDeportista,
} from "@/services/deportista/deportista.service";
import { create } from "zustand";

interface DeportistaProp {
  deportistas: Deportista[];
  deportistaConsulta: Deportista | null;
  ConsultarDeportista: () => Promise<void>;
  crear_deportista: (data: FormData) => Promise<void>; // Cambiado a FormData
  eliminar_deportista: (id: number) => Promise<void>;
  actualizarDeportista: (id: number, data: FormData) => Promise<void>; // Cambiado a FormData
}

export const useDeportistaStore = create<DeportistaProp>((set) => ({
  deportistas: [],
  deportistaConsulta: null,

  ConsultarDeportista: async () => {
    try {
      const response = await ConsultarDeportistas();
      set({ deportistas: response.data });
    } catch (error) {
      console.error("Error al consultar deportista:", error);
    }
  },

  crear_deportista: async (formData: FormData) => {
    try {
      await Api.post("/deportista", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Actualizar lista
      const response = await ConsultarDeportistas();
      set({ deportistas: response.data });

      return response.data;
    } catch (error) {
      console.error("Error al crear deportista:", error);
      throw error;
    }
  },

  actualizarDeportista: async (id, formData) => {
    try {
      await Api.patch(`/deportista/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Actualizar lista
      const response = await ConsultarDeportistas();
      set({ deportistas: response.data });
    } catch (error) {
      console.error("Error al actualizar deportista:", error);
      throw error;
    }
  },

  eliminar_deportista: async (id: number) => {
    try {
      await EliminarDeportista(id);
      const response = await ConsultarDeportistas();
      set({ deportistas: response.data });
    } catch (error) {
      console.error("Error al eliminar deportista:", error);
      throw error;
    }
  },
}));