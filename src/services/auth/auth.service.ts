import { Api } from "@/config/axios_base.config";
import { AuthResponse, LoginData, } from "@/interface/user/user.interface";

export const loginService = async (data: LoginData) => {
  const response = await Api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ 
  success: boolean; 
  resetToken?: string; 
  message?: string 
}> => {
  try {
    console.log('📤 [FRONTEND] Enviando solicitud forgot-password para:', email);
    const response = await Api.post("/auth/forgot-password", { email });
    console.log('📥 [FRONTEND] Respuesta recibida:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [FRONTEND] Error en forgotPassword:', error);
    console.error('❌ [FRONTEND] Detalles del error:', error.response?.data);
    throw new Error(error.response?.data?.message || "Error al solicitar cambio de contraseña");
  }
};


// services/auth/auth.service.ts - VERIFICAR ESTA PARTE
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
    console.error("Error completo en resetPassword:", error);
    
    // Mensaje más específico según el error
    let errorMessage = "Error al restablecer la contraseña";
    
    if (error.response?.status === 400) {
      errorMessage = error.response.data?.message || "Datos inválidos";
    } else if (error.response?.status === 404) {
      errorMessage = "Usuario no encontrado";
    } else if (error.response?.status === 401) {
      errorMessage = "Token inválido o expirado";
    }
    
    throw new Error(errorMessage);
  }
};

// NUEVO: Servicio para cambiar contraseña cuando ya estás autenticado
export const changePasswordAuthenticated = async (data: {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}) => {
  return Api.post("/usuario/change-password", data);
};

// NUEVO: Servicio para verificar expiración
export const checkPasswordExpiration = async () => {
  return Api.get("/usuario/password/expiration");
};

