import { Role } from "@/interface/roles/role.interface";
import { ConsultarRoles } from "@/services/roles/roles.service";
import { create } from "zustand";

interface RoleProps {
  roles: Role[];
  ConsultRole: () => Promise<void>;
}

export const RolesStore = create<RoleProps>((set) => ({
  roles: [],

  ConsultRole: async () => {
    try {
      const response = await ConsultarRoles();
      set({ roles: response.data });
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  },
}));
