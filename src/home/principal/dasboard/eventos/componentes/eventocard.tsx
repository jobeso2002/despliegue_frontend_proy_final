import React from "react";

interface EventoCardProps {
  evento: any;
  onEdit?: () => void;
  onInscribir?: () => void;
  onCancelar?: () => void;
  onCambiarEstado?: () => void;
}

const EventoCard: React.FC<EventoCardProps> = ({
  evento,
  onEdit,
  onInscribir,
  onCancelar,
  onCambiarEstado,
}) => {
  // Determinar qué botones mostrar según el estado del evento
  const showButtons = {
    inscribir: evento.estado === "planificado" && onInscribir,
    cambiarEstado:
      (evento.estado === "planificado" || evento.estado === "en_curso") &&
      onCambiarEstado,
    editar:
      (evento.estado === "planificado" || evento.estado === "en_curso") &&
      onEdit,
    cancelar: evento.estado === "planificado" && onCancelar,
  };

  return (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{evento.nombre}</h3>
          <p className="text-gray-600 mt-1">{evento.descripcion}</p>
          <ul className="text-sm text-gray-600 mt-2">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(evento.fechaInicio).toLocaleDateString()} -{" "}
              {new Date(evento.fechaFin).toLocaleDateString()}
            </li>
            <li className="flex items-center mt-1">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {evento.ubicacion}
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`px-2 py-1 rounded text-xs ${
              evento.estado === "planificado"
                ? "bg-blue-100 text-blue-800"
                : evento.estado === "en_curso"
                ? "bg-green-100 text-green-800"
                : evento.estado === "finalizado"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {evento.estado}
          </span>
          <span className="mt-2 text-sm text-gray-600">
            {evento.inscripciones?.length || 0} clubes inscritos
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div>
          <span className="capitalize bg-gray-100 px-2 py-1 rounded text-sm">
            {evento.tipo}
          </span>
        </div>
        <div className="space-x-2">
          {showButtons.inscribir && (
            <button
              onClick={onInscribir}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Inscribir Club
            </button>
          )}
          {showButtons.cambiarEstado && (
            <button
              onClick={onCambiarEstado}
              className="text-purple-600 hover:text-purple-800 text-sm"
            >
              Cambiar Estado
            </button>
          )}
          {showButtons.editar && (
            <button
              onClick={onEdit}
              className="text-yellow-600 hover:text-yellow-800 text-sm"
            >
              Editar
            </button>
          )}
          {showButtons.cancelar && (
            <button
              onClick={onCancelar}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventoCard;
