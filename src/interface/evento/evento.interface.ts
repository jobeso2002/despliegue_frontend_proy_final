export interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  tipo: "torneo" | "amistoso" | "clasificatorio" | "championship";
  ubicacion: string;
  estado: "planificado" | "en_curso" | "finalizado" | "cancelado";
  id_usuario_organizador: number;
  fechaInicioReal?: Date | string;
  fechaFinReal?: Date | string;
  organizador?: {
    id: number;
    username: string;
    email: string;
  };
  inscripciones?: number;
}

export type CreateEvento = Omit<
  Evento,
  | "id"
  | "estado"
  | "fechaInicioReal"
  | "fechaFinReal"
  | "organizador"
  | "inscripciones"
>;

export type UpdateEvento = Partial<CreateEvento>;
