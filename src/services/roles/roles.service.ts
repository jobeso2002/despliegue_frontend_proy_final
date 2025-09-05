import { Api } from "@/config/axios_base.config";
import { CreateRole } from "@/interface/roles/role.interface";

export const CreateRoleService = (data: CreateRole) => {
    return Api.post("/roles", data);
};
  
export const ConsultarRoles = () => {
  return Api.get("/roles");
};


