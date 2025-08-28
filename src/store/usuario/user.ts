import {
  AuthResponse,
  RegisterData,
  User,
} from "@/interface/user/user.interface";
import {
  actualizarUsuario,
  cambiarPassword,
  ConsultarUsuario,
  eliminarUsuario,
  registrarusuario,
} from "@/services/user/usuario.service";
import { create } from "zustand";

interface UserProp {
  persona: User[];
  personaConsulta: User | null;
  consultarUsuario: () => Promise<void>;
  crear_persona: (data: RegisterData) => Promise<AuthResponse>;
  actualizarUsuario: (id: number, data: Partial<RegisterData>) => Promise<void>;
  eliminarUsuario: (id: number) => Promise<void>;
  cambiarPassword: (id: number, newPassword: string) => Promise<void>;
}

export const useUserStore = create<UserProp>((set) => ({
  persona: [],
  personaConsulta: null,

  consultarUsuario: async () => {
    try {
      const response = await ConsultarUsuario();
      const personas_consultar: User[] = response.data;
      set({ persona: personas_consultar }); // Asegurarse de que persona recibe un array válido
    } catch (error) {
      console.error("Error al consultar personas:", error);
    }
  },

  crear_persona: async (data: RegisterData) => {
    try {
      const response = await registrarusuario(data);
      console.log("Respuesta del servidor usuario registrado:", response);

      // Si el backend devuelve un token después del registro
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      return response;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  },

  actualizarUsuario: async (id: number, data: Partial<RegisterData>) => {
    try {
      await actualizarUsuario(id, data);
      // Actualizar el estado local
      set((state) => ({
        persona: state.persona.map((user) =>
          user.id === id ? { ...user, ...data } : user
        ),
      }));
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  },

  eliminarUsuario: async (id: number) => {
    try {
      await eliminarUsuario(id);
      // Actualizar la lista de usuarios después de eliminar
      set((state) => ({
        persona: state.persona.filter((user) => user.id !== id),
      }));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  },

  cambiarPassword: async (id: number, newPassword: string) => {
    try {
      await cambiarPassword(id, newPassword);
      // Puedes agregar lógica adicional si necesitas actualizar el estado local
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      throw error;
    }
  },
}));
