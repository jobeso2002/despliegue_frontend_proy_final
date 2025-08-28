// src/stores/inscripcion.store.ts
import { create } from "zustand";

import {
  CreateInscripcion,
  Inscripcion,
  UpdateInscripcion,
} from "@/interface/inscripcion/inscripcion.interfaces";
import {
  actualizarInscripcion,
  aprobarInscripcion,
  consultarInscripciones,
  consultarInscripcionesPorClub,
  consultarInscripcionesPorEvento,
  consultarInscripcionPorId,
  crearInscripcion,
  eliminarInscripcion,
  rechazarInscripcion,
} from "@/services/inscripcion/inscripcion.service";

interface InscripcionState {
  inscripciones: Inscripcion[];
  inscripcionSeleccionada: Inscripcion | null;
  loading: boolean;
  error: string | null;

  // Consultas
  obtenerInscripciones: () => Promise<void>;
  obtenerInscripcionesPorEvento: (
    idEvento: number,
    estado?: string
  ) => Promise<void>;
  obtenerInscripcionesPorClub: (idClub: number) => Promise<void>;
  obtenerInscripcionPorId: (id: number) => Promise<void>;

  // CRUD
  crearInscripcion: (data: CreateInscripcion) => Promise<Inscripcion>;
  actualizarInscripcion: (id: number, data: UpdateInscripcion) => Promise<void>;
  eliminarInscripcion: (id: number) => Promise<void>;

  // Acciones específicas
  aprobarInscripcion: (id: number, idUsuarioAprueba: number) => Promise<void>;
  rechazarInscripcion: (id: number, idUsuarioRechaza: number) => Promise<void>;
}

export const useInscripcionStore = create<InscripcionState>((set) => ({
  inscripciones: [],
  inscripcionSeleccionada: null,
  loading: false,
  error: null,

  obtenerInscripciones: async () => {
    set({ loading: true, error: null });
    try {
      const response = await consultarInscripciones();
      set({ inscripciones: response.data, loading: false });
    } catch (error) {
      set({ error: "Error al obtener inscripciones", loading: false });
      console.error(error);
    }
  },

  // En inscripcion.store.ts
  obtenerInscripcionesPorEvento: async (idEvento, estado) => {
    set({ loading: true, error: null });
    try {
      const response = await consultarInscripcionesPorEvento(idEvento, estado);
      set({
        inscripciones: response.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: "Error al obtener inscripciones por evento",
        loading: false,
      });
      console.error(error);
    }
  },

  obtenerInscripcionesPorClub: async (idClub) => {
    set({ loading: true, error: null });
    try {
      const response = await consultarInscripcionesPorClub(idClub);
      set({ inscripciones: response.data, loading: false });
    } catch (error) {
      set({ error: "Error al obtener inscripciones por club", loading: false });
      console.error(error);
    }
  },

  obtenerInscripcionPorId: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await consultarInscripcionPorId(id);
      set({ inscripcionSeleccionada: response.data, loading: false });
    } catch (error) {
      set({ error: "Error al obtener inscripción", loading: false });
      console.error(error);
    }
  },

  crearInscripcion: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await crearInscripcion(data);
      // Actualizar la lista de inscripciones
      await useInscripcionStore.getState().obtenerInscripciones();
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: "Error al crear inscripción", loading: false });
      console.error(error);
      throw error;
    }
  },

  actualizarInscripcion: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await actualizarInscripcion(id, data);
      // Actualizar la lista de inscripciones
      await useInscripcionStore.getState().obtenerInscripciones();
      set({ loading: false });
    } catch (error) {
      set({ error: "Error al actualizar inscripción", loading: false });
      console.error(error);
      throw error;
    }
  },

  eliminarInscripcion: async (id) => {
    set({ loading: true, error: null });
    try {
      await eliminarInscripcion(id);
      // Actualizar la lista de inscripciones
      await useInscripcionStore.getState().obtenerInscripciones();
      set({ loading: false });
    } catch (error) {
      set({ error: "Error al eliminar inscripción", loading: false });
      console.error(error);
      throw error;
    }
  },

  aprobarInscripcion: async (id, idUsuarioAprueba) => {
    set({ loading: true, error: null });
    try {
      await aprobarInscripcion(id, idUsuarioAprueba);
      // Actualizar la lista de inscripciones
      await useInscripcionStore.getState().obtenerInscripciones();
      set({ loading: false });
    } catch (error) {
      set({ error: "Error al aprobar inscripción", loading: false });
      console.error(error);
      throw error;
    }
  },

  rechazarInscripcion: async (id, idUsuarioRechaza) => {
    set({ loading: true, error: null });
    try {
      await rechazarInscripcion(id, idUsuarioRechaza);
      // Actualizar la lista de inscripciones
      await useInscripcionStore.getState().obtenerInscripciones();
      set({ loading: false });
    } catch (error) {
      set({ error: "Error al rechazar inscripción", loading: false });
      console.error(error);
      throw error;
    }
  },
}));
