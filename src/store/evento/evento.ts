import {
  Evento,
  CreateEvento,
  UpdateEvento,
} from "@/interface/evento/evento.interface";
import {
  CrearEvento,
  ConsultarEventos,
  ConsultarEventoPorId,
  actualizarEvento,
  cancelarEvento,
  inscribirClubEnEvento,
  CambiarEstadoEvento,
  obtenerInscripcionesEvento,
  obtenerClubesPorEvento,
} from "@/services/evento/evento.service";
import { create } from "zustand";

interface EventoProp {
  eventos: Evento[];
  eventoActual?: Evento;
  loading: boolean;
  error: string | null;
  consultarEventos: (params?: {
    tipo?: string;
    estado?: string;
    proximos?: boolean;
    activos?: boolean;
    todos?: boolean;
  }) => Promise<void>;
  consultarEventoPorId: (id: number) => Promise<void>;
  crearEvento: (data: CreateEvento) => Promise<Evento>;
  actualizarEvento: (id: number, data: UpdateEvento) => Promise<Evento>;
  cancelarEvento: (id: number) => Promise<void>;
  inscribirClub: (
    idEvento: number,
    idClub: number,
    idUsuario: number
  ) => Promise<void>;
  cambiarEstadoEvento: (
    id: number,
    estado: string,
    idUsuario: number
  ) => Promise<void>;
  obtenerInscripciones: (idEvento: number, estado?: string) => Promise<any[]>;
  obtenerClubesInscritos: (idEvento: number) => Promise<any[]>;
}

export const useEventoStore = create<EventoProp>((set) => ({
  eventos: [],
  eventoActual: undefined,
  loading: false,
  error: null,

  consultarEventos: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await ConsultarEventos(params);
      set({ eventos: response, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al consultar eventos",
        loading: false,
      });
      console.error("Error al consultar eventos:", error);
    }
  },

  consultarEventoPorId: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await ConsultarEventoPorId(id);
      set({ eventoActual: response, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al consultar evento",
        loading: false,
      });
      console.error("Error al consultar evento:", error);
    }
  },

  crearEvento: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await CrearEvento(data);

      // Actualizar lista de eventos
      const newResponse = await ConsultarEventos();
      set({ eventos: newResponse, loading: false });

      return response;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al crear evento",
        loading: false,
      });
      console.error("Error al crear evento:", error);
      throw error;
    }
  },

  actualizarEvento: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const eventoActualizado = await actualizarEvento(id, data);
      set((state) => ({
        eventos: state.eventos.map((e) =>
          e.id === id ? eventoActualizado : e
        ),
        eventoActual: eventoActualizado,
        loading: false,
      }));
      return eventoActualizado;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  cancelarEvento: async (id) => {
    set({ loading: true, error: null });
    try {
      await cancelarEvento(id);
      set((state) => ({
        eventos: state.eventos.map((e) =>
          e.id === id ? { ...e, estado: "cancelado" } : e
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
    }
  },

  inscribirClub: async (idEvento, idClub, idUsuario) => {
    set({ loading: true, error: null });
    try {
      await inscribirClubEnEvento(idEvento, idClub, idUsuario);
      set({ loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
    }
  },

  cambiarEstadoEvento: async (id, estado, idUsuario) => {
    set({ loading: true, error: null });
    try {
      const evento = await CambiarEstadoEvento(id, estado, idUsuario);
      set((state) => ({
        eventos: state.eventos.map((e) => (e.id === id ? evento : e)),
        eventoActual: evento,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
    }
  },

  obtenerInscripciones: async (idEvento, estado) => {
    set({ loading: true, error: null });
    try {
      const inscripciones = await obtenerInscripcionesEvento(idEvento, estado);
      set({ loading: false });
      return inscripciones;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },
  obtenerClubesInscritos: async (idEvento: number) => {
    set({ loading: true, error: null });
    try {
      const clubesInscritos = await obtenerClubesPorEvento(idEvento);
      set({ loading: false });
      return clubesInscritos;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },
}));
