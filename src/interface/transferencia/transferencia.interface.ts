export interface Transferencia {
  id: number;
  deportista: {
    id: number;
    primer_nombre: string;
    primer_apellido: string;
  };
  clubOrigen: {
    id: number;
    nombre: string;
  };
  clubDestino: {
    id: number;
    nombre: string;
  };
  fechaTransferencia: string;
  motivo: string;
  estado: "pendiente" | "aprobada" | "rechazada";
  usuarioRegistra: {
    id: number;
    username: string;
  };
  usuarioAprueba?: {
    id: number;
    username: string;
  };
  usuarioRechaza?: {
    id: number;
    username: string;
  };
  fechaAprobacion?: string;
  fechaRechazo?: string;
}

export type CreateTransferencia = Omit<Transferencia, "id">;
