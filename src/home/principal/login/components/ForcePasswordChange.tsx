import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authstore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const ForcePasswordChange = () => {
  const { changePassword, user, logout, loading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });

  // estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Si no hay usuario autenticado, redirigir al login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.newPasswordConfirmation) {
      toast.error("Las contraseñas nuevas no coinciden");
      return;
    }

    try {
      await changePassword(form);
      toast.success(
        "Contraseña cambiada exitosamente. Ahora puedes acceder al sistema."
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error("Error al cambiar la contraseña");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-red-300 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-red-800">
            Contraseña Expirada
          </h1>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Por seguridad, debes cambiar tu contraseña para continuar usando el
            sistema.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <Input
              type={showPassword.current ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Ingresa tu contraseña actual"
              className="pr-20"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, current: !prev.current }))
              }
              className="absolute right-2 top-8 text-sm text-gray-600 hover:text-gray-900"
            >
              {showPassword.current ?  <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mb-4 relative">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              type={showPassword.new ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres 1 mayúscula"
              className="pr-20"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, new: !prev.new }))
              }
              className="absolute right-2 top-8 text-sm text-gray-600 hover:text-gray-900"
            >
              {showPassword.new ?  <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mb-6">
            <Label htmlFor="newPasswordConfirmation">
              Confirmar Nueva Contraseña
            </Label>
            <Input
              type={showPassword.confirm ? "text" : "password"}
              id="newPasswordConfirmation"
              name="newPasswordConfirmation"
              value={form.newPasswordConfirmation}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Repite la nueva contraseña"
              className="pr-20"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              className="absolute right-2 top-8 text-sm text-gray-600 hover:text-gray-900"
            >
              {showPassword.confirm ?  <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300 mb-2"
            disabled={loading}
          >
            {loading ? "Cambiando..." : "Cambiar Contraseña"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleLogout}
            disabled={loading}
          >
            Cerrar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
};
