import { AuthResponse, RegisterData } from "@/interface/user/user.interface";
import { Api } from "../../config/axios_base.config";

export const registrarusuario = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await Api.post("/usuario", data);
  return response.data;
};

export const ConsultarUsuario = () => {
  return Api.get("/usuario");
};

export const actualizarUsuario = async (
  id: number,
  data: Partial<RegisterData>
) => {
  return Api.patch(`/usuario/${id}`, data);
};

// Añade esto en tu archivo de servicios
export const eliminarUsuario = async (id: number) => {
  return Api.delete(`/usuario/${id}`);
};

export const cambiarPassword = async (id: number, newPassword: string) => {
  return Api.patch(`/usuario/${id}/changepassword`, { newPassword });
};