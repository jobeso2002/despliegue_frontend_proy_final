export interface Role {
    id: number;
    name: string;
}

export type CreateRole = Omit<Role, "id">;
