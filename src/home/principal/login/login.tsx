"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import liga from "@/assets/liga.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authstore";
import { useForm } from "@/components/hooks/useform";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const { login, error, loading, isAuthenticated, passwordStatus } =
    useAuthStore();
  const navigate = useNavigate();
  const { form, handleChange } = useForm({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Efecto para redirigir cuando la autenticación cambia
  useEffect(() => {
    if (isAuthenticated) {
      // Si la contraseña está expirada, redirigir al cambio de contraseña
      if (passwordStatus?.expired) {
        navigate("/cambiar-contrasena-forzada");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, passwordStatus, navigate]);

  // Efecto para redirigir cuando la autenticación cambia

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(form);

      // navigate("/dasboard");
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img
            src={liga}
            alt="Logo"
            className="w-16 h-16 object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-green-800">Bienvenido</h1>
          <p className="text-sm text-gray-600">Inicie sesión en su cuenta</p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="p-3 rounded block border-gray-300 focus:ring-green-500 focus:border-green-500 w-full"
              placeholder="email@example.com"
            />
          </div>
          <div className="mb-4 relative">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="p-3 rounded block border-gray-300 focus:ring-green-500 focus:border-green-500 w-full"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-8 text-sm text-gray-600 hover:text-gray-900"
            >
              {showPassword ?  <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <Label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-800"
              >
                Recordar mi correo
              </Label>
            </div>
            <Link
              to="/olvide-contrasena"
              className="text-sm text-green-600 hover:underline"
            >
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
