import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface CambiarEstadoFormProps {
  evento: any;
  onClose: () => void;
  onSubmit: (estado: string) => void;
}

const CambiarEstadoForm: React.FC<CambiarEstadoFormProps> = ({
  evento,
  onClose,
  onSubmit,
}) => {
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [comentario, setComentario] = useState("");

  const opcionesEstado = React.useMemo(() => {
    const estadosPermitidos: Record<string, string[]> = {
      planificado: ["en_curso", "cancelado"],
      en_curso: ["finalizado", "cancelado"],
      finalizado: [],
      cancelado: [],
    };
    return estadosPermitidos[evento.estado] || [];
  }, [evento.estado]);

  useEffect(() => {
    if (opcionesEstado.length > 0) {
      setNuevoEstado(opcionesEstado[0]);
    }
  }, [evento.estado, opcionesEstado]);

  const handleSubmit = () => {
    if (!nuevoEstado || nuevoEstado === evento.estado) {
      toast.error("Debes seleccionar un estado diferente al actual");
      return;
    }

    if (opcionesEstado.length > 0) {
      onSubmit(nuevoEstado);
    }
    toast.success("Estado cambiado correctamente");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cambiar Estado del Evento</h1>

      <div className="space-y-6">
        <div>
          <h2 className="font-bold mb-1">{evento.nombre}</h2>
          <p className="text-gray-600 mb-4">Estado actual: {evento.estado}</p>

          {opcionesEstado.length > 0 ? (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nuevo Estado
              </label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {opcionesEstado.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.replace("_", " ")}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <p className="text-red-500">
              No hay transiciones de estado disponibles
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comentario (Opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Razón del cambio de estado..."
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          {opcionesEstado.length > 0 && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirmar Cambio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CambiarEstadoForm;
