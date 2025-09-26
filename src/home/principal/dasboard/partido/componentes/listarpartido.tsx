import { Partido } from "@/interface/partido/partido.interface";
import { PartidoCard } from "./partidocard";
import { useState, useMemo, useCallback } from "react";

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
  eventoFiltro?: number;
  ubicacionFiltro?: string;
}

const ITEMS_PER_PAGE = 3;

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
  const [currentPages, setCurrentPages] = useState({
    programados: 1,
    en_juego: 1,
    finalizados: 1,
    cancelados: 1,
  });

    const filtrarPartidos = useCallback(
  (partidos: Partido[]) => {
    return partidos.filter((partido) => {
      const cumpleEvento = eventoFiltro
        ? partido.evento?.id === eventoFiltro || partido.id_evento === eventoFiltro
        : true;

      const cumpleUbicacion = ubicacionFiltro
        ? partido.ubicacion.toLowerCase().includes(ubicacionFiltro.toLowerCase())
        : true;

      return cumpleEvento && cumpleUbicacion;
    });
  },
  [eventoFiltro, ubicacionFiltro] // dependencias reales
);

  // Aplicar filtros a cada categoría
  const partidosProgramados = useMemo(
    () => filtrarPartidos(partidos.filter((p) => p.estado === "programado")),
    [partidos, filtrarPartidos]
  );

  const partidosEnJuego = useMemo(
    () => filtrarPartidos(partidos.filter((p) => p.estado === "en_juego")),
    [partidos, filtrarPartidos]
  );

  const partidosFinalizados = useMemo(
    () => filtrarPartidos(partidos.filter((p) => p.estado === "finalizado")),
    [partidos, filtrarPartidos]
  );

  const partidosCancelados = useMemo(
    () => filtrarPartidos(partidos.filter((p) => p.estado === "cancelado")),
    [partidos, filtrarPartidos]
  );

  // Obtener partidos paginados según la pestaña activa
  const getPartidosPaginados = () => {
    let partidosFiltrados: Partido[] = [];

    switch (activeTab) {
      case "programados":
        partidosFiltrados = partidosProgramados;
        break;
      case "en_juego":
        partidosFiltrados = partidosEnJuego;
        break;
      case "finalizados":
        partidosFiltrados = partidosFinalizados;
        break;
      case "cancelados":
        partidosFiltrados = partidosCancelados;
        break;
    }

    const startIndex = (currentPages[activeTab] - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return partidosFiltrados.slice(startIndex, endIndex);
  };

  // Obtener total de páginas según la pestaña activa
  const getTotalPaginas = () => {
    let totalPartidos = 0;

    switch (activeTab) {
      case "programados":
        totalPartidos = partidosProgramados.length;
        break;
      case "en_juego":
        totalPartidos = partidosEnJuego.length;
        break;
      case "finalizados":
        totalPartidos = partidosFinalizados.length;
        break;
      case "cancelados":
        totalPartidos = partidosCancelados.length;
        break;
    }

    return Math.ceil(totalPartidos / ITEMS_PER_PAGE);
  };

  // Cambiar página
  const cambiarPagina = (nuevaPagina: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [activeTab]: nuevaPagina,
    }));
  };

  // Resetear paginación cuando cambia la pestaña
  const handleTabChange = (
    tab: "programados" | "en_juego" | "finalizados" | "cancelados"
  ) => {
    setActiveTab(tab);
    // No es necesario resetear la página aquí porque cada tab mantiene su propia página
  };

  const partidosPaginados = getPartidosPaginados();
  const totalPaginas = getTotalPaginas();
  const paginaActual = currentPages[activeTab];

  // Componente de paginación
  const Paginacion = () => {
    if (totalPaginas <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className={`px-3 py-1 rounded ${
            paginaActual === 1
              ? "bg-green-600 text-white hover:bg-green-800"
              : "bg-green-500 text-white hover:bg-green-800"
          }`}
        >
          Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className={`px-3 py-1 rounded ${
            paginaActual === totalPaginas
              ? "bg-green-600 text-white hover:bg-green-800"
              : "bg-green-500 text-white hover:bg-green-800"
          }`}
        >
          Siguiente
        </button>
      </div>
    );
  };

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
          onClick={() => handleTabChange("programados")}
        >
          Programados ({partidosProgramados.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "en_juego"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("en_juego")}
        >
          En Juego ({partidosEnJuego.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "finalizados"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("finalizados")}
        >
          Finalizados ({partidosFinalizados.length})
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "cancelados"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => handleTabChange("cancelados")}
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
            <>
              {partidosPaginados.map((partido) => (
                <PartidoCard
                  key={partido.id}
                  partido={partido}
                  tipo="programado"
                  onEditarPartido={onEditarPartido}
                  onCancelarPartido={onCancelarPartido}
                  onCambiarEstado={onCambiarEstado}
                />
              ))}
              <Paginacion />
            </>
          )}
        </div>
      )}

      {activeTab === "en_juego" && (
        <div className="space-y-4">
          {partidosEnJuego.length === 0 ? (
            <p className="text-gray-500">No hay partidos en juego.</p>
          ) : (
            <>
              {partidosPaginados.map((partido) => (
                <PartidoCard
                  key={partido.id}
                  partido={partido}
                  tipo="en_juego"
                  onRegistrarResultado={onRegistrarResultado}
                  onCancelarPartido={onCancelarPartido}
                  onCambiarEstado={onCambiarEstado}
                />
              ))}
              <Paginacion />
            </>
          )}
        </div>
      )}

      {activeTab === "finalizados" && (
        <div className="space-y-4">
          {partidosFinalizados.length === 0 ? (
            <p className="text-gray-500">No hay partidos finalizados.</p>
          ) : (
            <>
              {partidosPaginados.map((partido) => (
                <PartidoCard
                  key={partido.id}
                  partido={partido}
                  tipo="finalizado"
                />
              ))}
              <Paginacion />
            </>
          )}
        </div>
      )}

      {activeTab === "cancelados" && (
        <div className="space-y-4">
          {partidosCancelados.length === 0 ? (
            <p className="text-gray-500">No hay partidos cancelados.</p>
          ) : (
            <>
              {partidosPaginados.map((partido) => (
                <PartidoCard
                  key={partido.id}
                  partido={partido}
                  tipo="cancelado"
                />
              ))}
              <Paginacion />
            </>
          )}
        </div>
      )}
    </>
  );
};
