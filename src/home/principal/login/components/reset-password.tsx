// src/home/principal/login/reset-password-direct.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authstore";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export function ResetPasswordDirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading, clearError } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Obtener email y token de la URL
  useEffect(() => {
    const urlEmail = searchParams.get("email");
    const urlToken = searchParams.get("token");

    if (urlEmail && urlToken) {
      setEmail(decodeURIComponent(urlEmail));
      setToken(urlToken);
    } else {
      setError("Parámetros inválidos o faltantes");
      toast.error("Enlace inválido");
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    clearError();

    if (!newPassword || !confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      console.log('🔄 Enviando nueva contraseña...');
      await resetPassword(email, token, newPassword);
      
      toast.success("¡Contraseña cambiada exitosamente!");
      setTimeout(() => navigate("/login"), 2000);
      
    } catch (error: any) {
      console.error("❌ Error:", error);
      setError(error.message || "Error al cambiar la contraseña");
      toast.error("Error al cambiar la contraseña");
    }
  };

  if (!email || !token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-white">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-4">Enlace inválido</h2>
          <p className="text-gray-600 mb-4">{error || "Faltan parámetros necesarios"}</p>
          <Link to="/olvide-contrasena" className="text-blue-600 hover:underline">
            Volver a solicitar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            Nueva Contraseña
          </h1>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Establece nueva contraseña para: <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-4 relative">
            <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nueva Contraseña
            </Label>
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="p-3 rounded block border-gray-300 focus:ring-green-500 focus:border-green-500 w-full"
              placeholder="1 mayúscula, mínimo 12 caracteres y 1 carácter especial"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mb-6 relative">
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Nueva Contraseña
            </Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="p-3 rounded block border-gray-300 focus:ring-green-500 focus:border-green-500 w-full"
              placeholder="Repite la contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/olvide-contrasena")}
              disabled={loading}
            >
              Volver
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-green-600 hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}