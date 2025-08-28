import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Partido } from "@/interface/partido/partido.interface";

interface CambiarEstadoPartidoProps {
  partido: Partido;
  onClose: () => void;
  onSubmit: (nuevoEstado: string, motivo?: string) => Promise<void>;
}

// En cambiarestado.tsx

const CambiarEstadoPartido: React.FC<CambiarEstadoPartidoProps> = ({
  partido,
  onClose,
  onSubmit,
}) => {
  const [nuevoEstado, setNuevoEstado] = useState<string>("");
  const [motivo, setMotivo] = useState<string>(partido.motivoCancelacion || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Definir transiciones permitidas basadas en el estado actual
  const opcionesEstado = React.useMemo(() => {
    const transicionesPermitidas: Record<string, string[]> = {
      programado: ["en_juego", "cancelado"],
      en_juego: ["finalizado", "cancelado"],
      finalizado: [],
      cancelado: [],
    };
    return transicionesPermitidas[partido.estado] || [];
  }, [partido.estado]);

  // Establecer el primer estado permitido como valor inicial
  useEffect(() => {
    if (opcionesEstado.length > 0 && !nuevoEstado) {
      setNuevoEstado(opcionesEstado[0]);
    }
  }, [opcionesEstado, nuevoEstado]);

  const formatearEstado = (estado: string) => {
    return estado.split("_").join(" ");
  };

  const handleSubmit = async () => {
    if (!nuevoEstado || nuevoEstado === partido.estado) {
      toast.error("Debes seleccionar un estado diferente al actual");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(
        nuevoEstado, // Asegúrate que este valor no es undefined
        nuevoEstado === "cancelado" ? motivo : undefined
      );
      toast.success(`Partido cambiado a ${formatearEstado(nuevoEstado)}`);
      onClose();
    } catch (err) {
      toast.error("Error al cambiar el estado. Por favor intente nuevamente.");
      console.error("Error al cambiar estado:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cambiar Estado del Partido</h1>

      <div className="space-y-6">
        <div>
          <h2 className="font-bold mb-1">
            {partido.clubLocal?.nombre} vs {partido.clubVisitante?.nombre}
          </h2>
          <p className="text-gray-600 mb-1">
            Estado actual: {formatearEstado(partido.estado)}
          </p>
          <p className="text-gray-600 mb-4">
            Fecha:{" "}
            {new Date(partido.fechaHora).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {opcionesEstado.length > 0 ? (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nuevo Estado
              </label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isSubmitting}
              >
                {opcionesEstado.map((estado) => (
                  <option key={estado} value={estado}>
                    {formatearEstado(estado)}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <p className="text-red-500">
              No hay transiciones de estado disponibles para este partido
            </p>
          )}
        </div>

        {nuevoEstado === "cancelado" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de Cancelación (Requerido)
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Ingrese el motivo de cancelación..."
              required
              disabled={isSubmitting}
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          {opcionesEstado.length > 0 && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting || !nuevoEstado}
            >
              {isSubmitting ? "Procesando..." : "Confirmar Cambio"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CambiarEstadoPartido;
