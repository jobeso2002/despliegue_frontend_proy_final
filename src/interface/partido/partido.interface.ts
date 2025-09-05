export interface Partido {
  id: number;
  fechaHora: Date | string;
  ubicacion: string;
  estado: "programado" | "en_juego" | "finalizado" | "cancelado";
  horaInicio?: Date | string;
  horaFin?: Date | string;
  motivoCancelacion?: string;

  // Relaciones
  id_evento: number;
  id_club_local: number;
  id_club_visitante: number;
  id_arbitro_principal?: number;
  id_arbitro_secundario?: number;

  // Objetos relacionados (opcionales, pueden venir en algunas consultas)
  evento?: {
    id: number;
    nombre: string;
    fechaInicio: string;
    fechaFin: string;
    tipo: string;
  };
  clubLocal?: {
    id: number;
    nombre: string;
    logo?: string;
  };
  clubVisitante?: {
    id: number;
    nombre: string;
    logo?: string;
  };
  arbitroPrincipal?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  arbitroSecundario?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  resultado?: {
    id: number;
    setsLocal: number;
    setsVisitante: number;
    ganador: string;
    destacados?: string;
  };
}

export type CreatePartido = Omit<Partido, "id" | "estado" | "resultado">;
