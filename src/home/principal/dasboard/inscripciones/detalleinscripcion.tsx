// src/components/DetalleInscripcion.tsx

import { Inscripcion } from "@/interface/inscripcion/inscripcion.interfaces";

interface DetalleInscripcionProps {
  inscripcion: Inscripcion;
  onClose: () => void;
  onEditClick?: () => void;
}

export const DetalleInscripcion = ({
  inscripcion,
  onClose,
}: DetalleInscripcionProps) => {
  const getEstadoColor = () => {
    switch (inscripcion.estado) {
      case "aprobada":
        return "bg-green-100 text-green-800";
      case "rechazada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Detalle de Inscripción</h1>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">{inscripcion.club.nombre}</h2>
            <span className={`text-xs px-2 py-1 rounded ${getEstadoColor()}`}>
              {inscripcion.estado.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">
                Información del Evento
              </h3>
              <p className="text-sm">{inscripcion.evento.nombre}</p>
              <p className="text-sm text-gray-600">
                Fecha:{" "}
                {new Date(inscripcion.evento.fechaInicio).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Estado: {inscripcion.evento.estado}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">
                Información del Club
              </h3>
              <p className="text-sm">{inscripcion.club.nombre}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Registro</h3>
              <p className="text-sm">
                Fecha:{" "}
                {new Date(inscripcion.fechaInscripcion).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Registrado por: {inscripcion.usuarioRegistra.username}
              </p>
            </div>

            {(inscripcion.fechaAprobacion || inscripcion.fechaRechazo) && (
              <div>
                <h3 className="font-medium text-gray-700">
                  {inscripcion.fechaAprobacion ? "Aprobación" : "Rechazo"}
                </h3>
                <p className="text-sm">
                  Fecha:{" "}
                  {new Date(
                    inscripcion.fechaAprobacion ||
                      inscripcion.fechaRechazo ||
                      ""
                  ).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Por:{" "}
                  {
                    (inscripcion.usuarioAprueba || inscripcion.usuarioRechaza)
                      ?.username
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};
