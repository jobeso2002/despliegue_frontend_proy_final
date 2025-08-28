export interface Club {
  id: number;
  nombre: string;
  fundacion: string;
  direccion: string;
  telefono: string;
  rama: string;
  categoria: string;
  email: string;
  logo: string;
  id_usuario_responsable: number;
  logoFile: File | null;
  responsable?: {
    // Agrega esta propiedad hace parte de otro Dto
    id: number;
    username: string;
    email: string;
  };
}

export type CreateClub = Omit<Club, "id">;
