import { Partido } from "@/interface/partido/partido.interface";
import { useResultadoStore } from "@/store/resultado/resultado";
import { useEffect, Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PartidoCardProps {
  partido: Partido;
  tipo: "programado" | "en_juego" | "finalizado" | "cancelado";
  onEditarPartido?: (id: number) => void;
  onRegistrarResultado?: (id: number) => void;
  onCancelarPartido?: (id: number, motivo: string) => void;
  onCambiarEstado?: (id: number) => void;
}

export const PartidoCard = ({
  partido,
  tipo,
  onEditarPartido,
  onRegistrarResultado,
  onCancelarPartido,
  onCambiarEstado,
}: PartidoCardProps) => {
  const getEstadoColor = () => {
    switch (tipo) {
      case "programado":
        return "bg-green-100 text-green-800";
      case "en_juego":
        return "bg-yellow-100 text-yellow-800";
      case "finalizado":
        return "bg-blue-100 text-blue-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const { resultados, obtenerResultadoPorPartido } = useResultadoStore();

  // Obtener el resultado específico para este partido
  const resultadoPartido = resultados[partido.id];

  const getEstadoTexto = () => {
    switch (tipo) {
      case "programado":
        return "Programado";
      case "en_juego":
        return "En Juego";
      case "finalizado":
        return "Finalizado";
      case "cancelado":
        return "Cancelado";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (tipo === "finalizado") {
      obtenerResultadoPorPartido(partido.id);
    }
  }, [partido.id, tipo, obtenerResultadoPorPartido]);

  const handleCancelar = () => {
    const motivo = prompt("Ingrese el motivo de cancelación:");
    if (motivo && onCancelarPartido) {
      onCancelarPartido(partido.id, motivo);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          {/* Mostrar nombre del evento  */}
          <h3 className="text-lg font-bold mb-3 ">
            evento: {partido.evento?.nombre || "Sin evento"}
          </h3>
          {/* Mostrar logos y nombres de los clubes */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={partido.clubLocal?.logo || "/public/yo.jpg"}
                  alt={partido.clubLocal?.nombre}
                />
                <AvatarFallback>
                  {partido.clubLocal?.nombre?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium mt-1">
                {partido.clubLocal?.nombre}
              </span>
            </div>

            <span className="text-xl font-bold mx-2">vs</span>

            <div className="flex flex-col items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={partido.clubVisitante?.logo || "/public/yo.jpg"}
                  alt={partido.clubVisitante?.nombre}
                />
                <AvatarFallback>
                  {partido.clubVisitante?.nombre?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium mt-1">
                {partido.clubVisitante?.nombre}
              </span>
            </div>
          </div>

          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            <li className="flex items-center">
              <span className="mr-1">•</span>
              {new Date(partido.fechaHora).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </li>
            <li className="flex items-center">
              <span className="mr-1">•</span> {partido.ubicacion}
            </li>

            {partido.motivoCancelacion && (
              <li className="flex items-center">
                <span className="mr-1">•</span> Motivo:{" "}
                {partido.motivoCancelacion}
              </li>
            )}
          </ul>
        </div>
        <span
          className={`${getEstadoColor()} text-xs px-2 py-1 rounded-full font-medium`}
        >
          {getEstadoTexto()}
        </span>
      </div>

      {tipo === "programado" && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm"></div>
          <div className="flex space-x-2">
            <button
              onClick={() => onCambiarEstado?.(partido.id)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Cambiar Estado
            </button>
            <button
              onClick={() => onEditarPartido?.(partido.id)}
              className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              Editar
            </button>
          </div>
        </div>
      )}

      {tipo === "en_juego" && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm"> </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onCambiarEstado?.(partido.id)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Cambiar Estado
            </button>
            <button
              onClick={handleCancelar}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Cancelar
            </button>
            <button
              onClick={() => onRegistrarResultado?.(partido.id)}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Registrar Resultado
            </button>
          </div>
        </div>
      )}

      {tipo === "finalizado" && resultadoPartido && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">
              Resultado Final: {resultadoPartido.setsLocal} -{" "}
              {resultadoPartido.setsVisitante}
            </p>
          </div>

          {/* Verificar primero si existe sets y es un array */}
          {resultadoPartido.sets && Array.isArray(resultadoPartido.sets) && (
            <div className="grid grid-cols-3 gap-2 text-sm mb-3">
              <div className="font-medium">Set</div>
              <div className="font-medium">{partido.clubLocal?.nombre}</div>
              <div className="font-medium">{partido.clubVisitante?.nombre}</div>

              {resultadoPartido.sets.map((set) => (
                <Fragment key={`result-set-${set.numeroSet}`}>
                  <div>Set {set.numeroSet}</div>
                  <div>{set.puntosLocal}</div>
                  <div>{set.puntosVisitante}</div>
                </Fragment>
              ))}
            </div>
          )}

          {resultadoPartido.duracion && (
            <p className="text-sm mt-1">
              Duración: {resultadoPartido.duracion} minutos
            </p>
          )}
          {resultadoPartido.observaciones && (
            <p className="text-sm mt-1">
              Observaciones: {resultadoPartido.observaciones}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
