import { Partido } from "@/interface/partido/partido.interface";
import { PartidoCard } from "./partidocard";

interface PartidoListProps {
  activeTab: "programados" | "en_juego" | "finalizados" | "cancelados";
  setActiveTab: (
    tab: "programados" | "en_juego" | "finalizados" | "cancelados"
  ) => void;
  partidos: Partido[];
  loading: boolean;
  error: string | null;
  onEditarPartido: (id: number) => void;
  onRegistrarResultado: (id: number) => void;
  onCancelarPartido: (id: number, motivo: string) => void;
  onCambiarEstado: (id: number) => void;
  eventoFiltro?: number; // Nuevo prop para filtrar por evento
  ubicacionFiltro?: string; // Nuevo prop para filtrar por ubicación
}

export const PartidoList = ({
  activeTab,
  setActiveTab,
  partidos,
  loading,
  error,
  onEditarPartido,
  onRegistrarResultado,
  onCancelarPartido,
  onCambiarEstado,
  eventoFiltro,
  ubicacionFiltro,
}: PartidoListProps) => {
  const filtrarPartidos = (partidos: Partido[]) => {
    return partidos.filter((partido) => {
      const cumpleEvento = eventoFiltro
        ? partido.evento?.id === eventoFiltro ||
          partido.id_evento === eventoFiltro
        : true;

      const cumpleUbicacion = ubicacionFiltro
        ? partido.ubicacion
            .toLowerCase()
            .includes(ubicacionFiltro.toLowerCase())
        : true;

      return cumpleEvento && cumpleUbicacion;
    });
  };

  // Aplicar filtros a cada categoría
  const partidosProgramados = filtrarPartidos(
    partidos.filter((p) => p.estado === "programado")
  );

  const partidosEnJuego = filtrarPartidos(
    partidos.filter((p) => p.estado === "en_juego")
  );

  const partidosFinalizados = filtrarPartidos(
    partidos.filter((p) => p.estado === "finalizado")
  );

  const partidosCancelados = filtrarPartidos(
    partidos.filter((p) => p.estado === "cancelado")
  );

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Gestión de Partidos</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "programados"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("programados")}
        >
          Programados ({partidosProgramados.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "en_juego"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("en_juego")}
        >
          En Juego ({partidosEnJuego.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "finalizados"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("finalizados")}
        >
          Finalizados ({partidosFinalizados.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "cancelados"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("cancelados")}
        >
          Cancelados ({partidosCancelados.length})
        </button>
      </div>

      {loading && <div className="text-center py-4">Cargando partidos...</div>}

      {activeTab === "programados" && (
        <div className="space-y-4">
          {partidosProgramados.length === 0 ? (
            <p className="text-gray-500">No hay partidos programados.</p>
          ) : (
            partidosProgramados.map((partido) => (
              <PartidoCard
                key={partido.id}
                partido={partido}
                tipo="programado"
                onEditarPartido={onEditarPartido}
                onCancelarPartido={onCancelarPartido}
                onCambiarEstado={onCambiarEstado}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "en_juego" && (
        <div className="space-y-4">
          {partidosEnJuego.length === 0 ? (
            <p className="text-gray-500">No hay partidos en juego.</p>
          ) : (
            partidosEnJuego.map((partido) => (
              <PartidoCard
                key={partido.id}
                partido={partido}
                tipo="en_juego"
                onRegistrarResultado={onRegistrarResultado}
                onCancelarPartido={onCancelarPartido}
                onCambiarEstado={onCambiarEstado}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "finalizados" && (
        <div className="space-y-4">
          {partidosFinalizados.length === 0 ? (
            <p className="text-gray-500">No hay partidos finalizados.</p>
          ) : (
            partidosFinalizados.map((partido) => (
              <PartidoCard
                key={partido.id}
                partido={partido}
                tipo="finalizado"
              />
            ))
          )}
        </div>
      )}

      {activeTab === "cancelados" && (
        <div className="space-y-4">
          {partidosCancelados.length === 0 ? (
            <p className="text-gray-500">No hay partidos cancelados.</p>
          ) : (
            partidosCancelados.map((partido) => (
              <PartidoCard
                key={partido.id}
                partido={partido}
                tipo="cancelado"
              />
            ))
          )}
        </div>
      )}
    </>
  );
};
