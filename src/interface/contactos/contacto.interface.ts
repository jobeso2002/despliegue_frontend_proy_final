export interface ContactoFamiliar{
    id: number;
    nombres: string;
    apellidos: string;
    parentesco: string;
    telefono: string;
    email: string;
    direccion: string;
    esContactoEmergencia: boolean;
    id_deportista: number;
}

export type CreateContacto = Omit<ContactoFamiliar, "id">;