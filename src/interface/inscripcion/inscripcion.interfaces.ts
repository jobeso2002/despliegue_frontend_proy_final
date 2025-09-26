import { Club } from "../club/club.interface";
import { Evento } from "../evento/evento.interface";
import { User } from "../user/user.interface";

export interface Inscripcion {
  id: number;
  fechaInscripcion: string | Date;
  fechaAprobacion?: string | Date;
  fechaRechazo?: string | Date;
  estado: "pendiente" | "aprobada" | "rechazada";
  evento: Evento;
  club: Club;
  usuarioRegistra: User;
  usuarioAprueba?: User;
  usuarioRechaza?: User;
}

export interface CreateInscripcion {
  id_evento: number;
  id_club: number;
  id_usuario_registra: number;
}

export interface UpdateInscripcion {
  fechaInscripcion: string | Date;
  evento: Evento;
  club: Club;
  usuarioRegistra: User;
}
