// En src/store/resultado/resultado.store.ts
import { create } from "zustand";
import { CrearResultado, ObtenerResultadoPorPartido } from "@/services/resultado/resultado.service";
import { CreateResultado, Resultado } from "@/interface/resultado/resultado.interface";
import axios from "axios";
interface ResultadoState {
  resultados: Record<number, Resultado | null>; // Mapeo de partidoId a resultado
  loading: boolean;
  error: string | null;

  obtenerResultadoPorPartido: (partidoId: number) => Promise<void>;
  crearResultado: (data: CreateResultado) => Promise<CreateResultado>;
}

export const useResultadoStore = create<ResultadoState>((set,) => ({
  resultados: {},
  loading: false,
  error: null,

  obtenerResultadoPorPartido: async (partidoId) => {
    set({ loading: true, error: null });
    try {
      const response = await ObtenerResultadoPorPartido(partidoId);
      set((state) => ({
        resultados: {
          ...state.resultados,
          [partidoId]: response || null,
        },
        loading: false,
      }));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        set({
          error: error instanceof Error ? error.message : "Error desconocido",
          loading: false,
        });
      } else {
        set((state) => ({
          resultados: {
            ...state.resultados,
            [partidoId]: null,
          },
          loading: false,
        }));
      }
    }
  },

  crearResultado: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await CrearResultado(data);
      set((state) => ({
        resultados: {
          ...state.resultados,
          [data.partidoId]: response,
        },
        loading: false,
      }));
      return response;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error desconocido",
        loading: false,
      });
      throw error;
    }
  },
}));