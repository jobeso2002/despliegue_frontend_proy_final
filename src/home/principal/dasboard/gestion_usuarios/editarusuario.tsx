import { useEffect } from "react";
import { useForm } from "@/components/hooks/useform";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/usuario/user";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { RolesStore } from "@/store/role/role";

export function EditarUsuario() {
  const { id } = useParams<{ id: string }>();
  const { persona, actualizarUsuario } = useUserStore();
  const { roles, ConsultRole } = RolesStore(); // Obtener roles y función para consultarlos
  const navigate = useNavigate();

  // Encontrar el usuario a editar
  const usuario = persona.find((u) => u.id === Number(id));

  // Inicializar el formulario con valores por defecto
  const { form, handleChange, handleManualChange } = useForm({
    username: "",
    email: "",
    id_rol: 0,
  });

  // Efecto para cargar los datos iniciales y los roles
  useEffect(() => {
    const loadData = async () => {
      try {
        await ConsultRole(); // Cargar los roles disponibles
        if (usuario) {
          handleManualChange("username", usuario.username);
          handleManualChange("email", usuario.email);
          handleManualChange("id_rol", usuario.role?.id || 0);
        }
      } catch (error) {
        toast.error("Error al cargar datos");
        console.error(error);
      }
    };

    loadData();
  }, [usuario, ConsultRole, handleManualChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;

      // Preparar los datos para enviar
      const updateData = {
        username: form.username,
        email: form.email,
        id_rol: Number(form.id_rol), // Asegurar que es número
      };

      await actualizarUsuario(Number(id), updateData);
      toast.success("Usuario actualizado correctamente");
      navigate("/dashboard/listausuario");
    } catch (error) {
      toast.error("Error al actualizar el usuario");
      console.error(error);
    }
  };

  if (!usuario) {
    return <div className="p-6">Usuario no encontrado</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre de usuario
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            name="id_rol"
            value={form.id_rol}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={() => navigate("/dashboard/listausuario")}
            className="bg-gray-500 hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
