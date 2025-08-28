import { Api } from "@/config/axios_base.config";
import { CreateContacto } from "@/interface/contactos/contacto.interface";

export const CreatContacto = async (data: CreateContacto) => {
  try {
    const response = await Api.post("/contacto", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear contacto:", error);
    throw error; // Re-lanzar el error para manejo en el store
  }
};

export const consultarContactoDeportista = (id_deportista: number) => {
  return Api.get(`/contacto/deportista/${id_deportista}`); // Cambia la URL según tu API
};
