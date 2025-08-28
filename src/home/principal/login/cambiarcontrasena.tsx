"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@/components/hooks/useform";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authstore";

export function CambiarPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { forgotPassword, resetPassword, loading } = useAuthStore();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = useState("");

  const { form, handleChange, setForm } = useForm({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  // useEffect corregido
  useEffect(() => {
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (token && emailParam) {
      setStep("reset");
      setForm((prev) => ({
        ...prev,
        email: decodeURIComponent(emailParam),
      }));
    }
  }, [searchParams, setForm]);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(form.email);
      setSuccess(
        "Se ha enviado un correo con las instrucciones para restablecer tu contraseña"
      );
    } catch (error) {
      console.error("Error al enviar correo:", error);
      setSuccess("Error al enviar el correo. Por favor intenta nuevamente.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!form.newPassword || !form.confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const token = searchParams.get("token") || "";
      await resetPassword(form.email, token, form.newPassword);

      setSuccess(
        "¡Contraseña cambiada exitosamente! Serás redirigido al login..."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      console.error("Error completo:", error);
      setError(error.message || "Error al cambiar la contraseña");
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-green-600 mb-4">{success}</h2>
        <Link to="/login" className="text-blue-600 hover:underline">
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-300 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            {step === "email" ? "Recuperar Contraseña" : "Cambiar Contraseña"}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {step === "email"
              ? "Ingresa tu email para recibir instrucciones"
              : `Cambiando contraseña para: ${form.email}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSubmitEmail}>
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
            <Button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Instrucciones"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <Label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Nueva Contraseña
              </Label>
              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="p-3 rounded block border-gray-300 focus:ring-green-500 focus:border-green-500 w-full"
                placeholder="********"
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Nueva Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="p-3 rounded block border-gray-300 focus:ring-green-500 focus:border-green-500 w-full"
                placeholder="********"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Cambiar Contraseña"}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-green-600 hover:underline">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
