import { Api } from "@/config/axios_base.config";
import { AuthResponse, LoginData, } from "@/interface/user/user.interface";

export const loginService = async (data: LoginData) => {
  const response = await Api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  return Api.post("/auth/forgot-password", { email });
};

// En tu archivo de servicios (auth.service.ts)
export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await Api.post("/auth/reset-password", {
      email,
      token,
      newPassword
    });
    return response.data;
  } catch (error: any) {
    console.error("Error completo:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message ||
      "Error al restablecer la contraseña. Verifica que el enlace sea correcto y que no haya expirado."
    );
  }
};

export const changePassword = async (id: number, newPassword: string) => {
  return Api.patch(`/usuario/${id}/changepassword`, { newPassword });
};

