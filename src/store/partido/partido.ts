import { Partido, CreatePartido } from "@/interface/partido/partido.interface";
import {
  CrearPartido,
  ConsultarPartidos,
  ConsultarPartidoPorId,
  CambiarEstadoPartido,
  RegistrarResultado,
  ActualizarPartido,
} from "@/services/partido/partido.service";
import { create } from "zustand";

interface PartidoState {
  partidos: Partido[];
  partidoActual?: Partido;
  loading: boolean;
  error: string | null;

  // Métodos
  obtenerPartidos: (params?: {
    evento?: number;
    club?: number;
    fechaInicio?: string;
    fechaFin?: string;
  }) => Promise<void>;
  obtenerPartidoPorId: (id: number) => Promise<void>;
  crearPartido: (data: CreatePartido) => Promise<Partido>;
  cambiarEstadoPartido: (
    id: number,
    estado: string,
    motivo?: string
  ) => Promise<void>;
  registrarResultado: (
    idPartido: number,
    resultado: {
      setsLocal: number;
      setsVisitante: number;
      ganador: string;
      destacados?: string;
    }
  ) => Promise<void>;
  actualizarPartido: (id: number, data: Partial<CreatePartido>) => Promise<void>;
}

export const usePartidoStore = create<PartidoState>((set) => ({
  partidos: [],
  partidoActual: undefined,
  loading: false,
  error: null,

  obtenerPartidos: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await ConsultarPartidos(params);
      set({ partidos: response, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  obtenerPartidoPorId: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await ConsultarPartidoPorId(id);
      set({ partidoActual: response, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  crearPartido: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await CrearPartido(data);
      // Actualizar lista de partidos
      const newResponse = await ConsultarPartidos();
      set({ partidos: newResponse, loading: false });
      return response;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  actualizarPartido: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await ActualizarPartido(id, data);
      // Actualizar la lista de partidos y el partido actual
      const [partidos, partidoActual] = await Promise.all([
        ConsultarPartidos(),
        ConsultarPartidoPorId(id),
      ]);
      set({ partidos, partidoActual, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  cambiarEstadoPartido: async (id, estado, motivo) => {
    set({ loading: true, error: null });
    try {
      await CambiarEstadoPartido(id, estado, motivo);
      // Actualizar partido actual y lista
      const [partidoActual, partidos] = await Promise.all([
        ConsultarPartidoPorId(id),
        ConsultarPartidos(),
      ]);
      set({ partidoActual, partidos, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },

  registrarResultado: async (idPartido, resultado) => {
    set({ loading: true, error: null });
    try {
      await RegistrarResultado(idPartido, resultado);
      // Actualizar partido actual y lista
      const [partidoActual, partidos] = await Promise.all([
        ConsultarPartidoPorId(idPartido),
        ConsultarPartidos(),
      ]);
      set({ partidoActual, partidos, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },
}));
