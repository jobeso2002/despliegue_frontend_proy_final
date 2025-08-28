import { Api } from "@/config/axios_base.config";
import { Club, CreateClub } from "@/interface/club/club.interface";
import {

  ConsultarClub,
  CreaClub,
  EliminarClub,
} from "@/services/club/club.service";
import { create } from "zustand";

interface ClubProp {
  club: Club[];
  ConsultarClub: () => Promise<void>; // Consultar ahora devuelve una Promesa<void>
  crear_Club: (data: CreateClub) => Promise<void>;
  eliminar_Club: (id: number) => Promise<void>;
  actualizar_Club: (id: number, data: FormData) => Promise<void>;
}

export const useClubStore = create<ClubProp>((set) => ({
  club: [],

  ConsultarClub: async () => {
    try {
      const response = await ConsultarClub();
      const consultar: Club[] = response.data;
      set({ club: consultar }); // Asegurarse de que club recibe un array válido
    } catch (error) {
      console.error("Error al consultar club:", error);
    }
  },

  crear_Club: async (data: CreateClub) => {
    try {
      const response = await CreaClub(data);
      console.log("Respuesta completa del servidor:", response);

      // Actualizar lista de clubes
      const newResponse = await ConsultarClub();
      set({ club: newResponse.data });

      return response; // Devolver respuesta para manejo en el componente
    } catch (error) {
      console.error("Error completo en store:", error);
      throw error; // Propagar el error
    }
  },

  actualizar_Club: async (id, formData) => {
    try {
      await Api.patch(`/club/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Actualizar la lista de clubs después de editar
      const Response = await ConsultarClub();
      set({ club: Response.data });
    } catch (error) {
      console.error("Error al actualizar club:", error);
      throw error;
    }
  },

  eliminar_Club: async (id: number) => {
    try {
      await EliminarClub(id);
      // Actualizar la lista de clubs después de eliminar
      const newResponse = await ConsultarClub();
      set({ club: newResponse.data });
    } catch (error) {
      console.error("Error al eliminar club:", error);
      throw error;
    }
  },
}));
