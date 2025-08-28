import { Api } from "@/config/axios_base.config";
import {
  ContactoFamiliar,
  CreateContacto,
} from "@/interface/contactos/contacto.interface";
import {
  consultarContactoDeportista,
  CreatContacto,
} from "@/services/contactos/contactos.service";
import { create } from "zustand";

interface ContactoProp {
  contacto: ContactoFamiliar[];
  consultarContacto_Deportistas: (id_deportista: number) => Promise<void>; // Consultar contacto del deportista
  crear_contacto: (data: CreateContacto) => Promise<void>;
  actualizarContacto: (
    id: number,
    data: Partial<ContactoFamiliar>
  ) => Promise<void>;
  eliminarContacto: (id: number) => Promise<void>;
}

export const useContactoStore = create<ContactoProp>((set) => ({
  contacto: [],

  consultarContacto_Deportistas: async (id_deportista: number) => {
    try {
      const response = await consultarContactoDeportista(id_deportista);
      const consultarContacto_Deportista: ContactoFamiliar[] = response.data;
      set({ contacto: consultarContacto_Deportista }); // Asegurarse de que persona recibe un array válido
    } catch (error) {
      console.error("Error al consultar contacto del deportista:", error);
    }
  },

  crear_contacto: async (data: CreateContacto) => {
    try {
      const response = await CreatContacto(data);
      console.log("Respuesta completa del servidor:", response);
      // Actualizar lista de contacto
      const newResponse = await consultarContactoDeportista(data.id_deportista);
      set({ contacto: newResponse.data });
      return response; // Devolver respuesta para manejo en el componente
    } catch (error) {
      console.error("Error completo en store:", error);
      throw error; // Propagar el error
    }
  },

  actualizarContacto: async (id: number, data: Partial<ContactoFamiliar>) => {
    try {
      const response = await Api.patch(`/contacto/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar contacto:", error);
      throw error;
    }
  },

  eliminarContacto: async (id: number) => {
    try {
      await Api.delete(`/contacto/${id}`);
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      throw error;
    }
  },
}));
