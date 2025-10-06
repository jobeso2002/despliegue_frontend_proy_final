// src/home/principal/login/forgot-password-email.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuthStore } from "@/store/authstore";
import { toast } from "sonner";

export function ForgotPasswordEmail() {
  const navigate = useNavigate();
  const { forgotPassword, loading, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    clearError();
    
    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }

    try {
      console.log('📤 Enviando solicitud para:', email);
      const result = await forgotPassword(email);
      console.log('✅ Respuesta recibida:', result);
      
      if (result.success && result.resetToken) {
        console.log('🎯 Token recibido, navegando a paso 2...');
        
        // Navegar a la ruta de reset con los parámetros
        navigate(`/reset-password-direct?email=${encodeURIComponent(email)}&token=${result.resetToken}`);
        
      } else {
        setError(result.message || "Error en la verificación");
        toast.error("Error en la verificación");
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      setError(error.message || "Error al verificar el correo");
      toast.error("Error al verificar correo");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            Recuperar Contraseña
          </h1>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Ingresa tu email para verificar tu identidad
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitEmail}>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 rounded block border-gray-300 focus:ring-green-500 focus:border-green-500 w-full"
              placeholder="email@example.com"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Continuar"}
          </Button>
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