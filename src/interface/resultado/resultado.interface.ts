export interface SetResultado {
  numeroSet: number;
  puntosLocal: number;
  puntosVisitante: number;
}

export interface Resultado {
  id: number;
  setsLocal: number;
  setsVisitante: number;
  duracion?: number;
  observaciones?: string;
  partidoId: number;
  usuarioRegistraId: number;
  sets: SetResultado[];
  usuarioRegistra?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

export type CreateResultado = Omit<Resultado, "id" | "usuarioRegistra"> & {
  sets: Omit<SetResultado, "id">[];
};
