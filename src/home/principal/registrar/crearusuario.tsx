import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "@/components/hooks/useform";
import { RolesStore } from "@/store/role/role";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/usuario/user";
import liga from "@/assets/liga.jpg";

function CrearUsuario() {
  const { crear_persona } = useUserStore();
  const navigate = useNavigate();
  const { form, handleChange } = useForm({
    username: "",
    email: "",
    password: "",
    id_rol: 0,
  });

  const { ConsultRole, roles } = RolesStore();

  useEffect(() => {
    if (roles.length === 0) {
      ConsultRole();
    }
  }, [ConsultRole, roles.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await crear_persona(form);
      navigate("/dashboard/listausuario", {
        state: { success: "Usuario creado exitosamente" },
      });
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-md p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={liga}
            alt="Logo"
            className="w-12 h-12 md:w-16 md:h-16 object-contain mb-3"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">
            REGISTRAR
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              type="text"
              name="username"
              onChange={handleChange}
              required
              minLength={3}
              placeholder="Nombre de usuario"
            />
          </div>

          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              name="email"
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Contraseña"
            />
          </div>

          <div>
            <Label htmlFor="id_rol">Rol</Label>
            <select
              id="id_rol"
              name="id_rol"
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccione un Rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Crear Usuario
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/dashboard/listausuario")}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearUsuario;
