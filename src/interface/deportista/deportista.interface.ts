export interface Deportista {
  id: number;
  documentoIdentidad: string;
  tipoDocumento: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fechaNacimiento: string;
  genero: string;
  foto: string;
  tipo_sangre: string;
  telefono: string;
  posicion: string;
  numero_camiseta: number;
  email: string;
  direccion: string;
  documentoIdentidadPdf: string;
  registroCivilPdf: string;
  afiliacionPdf: string;
  certificadoEpsPdf: string;
  permisoResponsablePdf: string;
  estado: string;
}

export interface DeportistaForm extends Omit<Deportista, "id"> {
  fotoFile?: File | null;
  documentoIdentidadFile?: File | null;
  registroCivilFile?: File | null;
  afiliacionFile?: File | null;
  certificadoEpsFile?: File | null;
  permisoResponsableFile?: File | null;
}