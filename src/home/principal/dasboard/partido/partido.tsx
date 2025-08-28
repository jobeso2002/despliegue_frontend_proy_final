import { useState, useEffect } from "react";
import { usePartidoStore } from "@/store/partido/partido";
import { PartidoList } from "./componentes/listarpartido";
import { ProgramarPartidoModal } from "./componentes/programarpartido";
import { EditarPartidoModal } from "./componentes/editarpartido";
import { RegistrarResultadosModal } from "./componentes/registraresulado";
import CambiarEstadoPartido from "./componentes/cambiarestado";

import { toast } from "sonner";
import { useEventoStore } from "@/store/evento/evento";

export const GestionPartidos = () => {
  const [activeTab, setActiveTab] = useState<
    "programados" | "en_juego" | "finalizados" | "cancelados"
  >("programados");
  const [showProgramarPartido, setShowProgramarPartido] = useState(false);
  const [showEditarPartido, setShowEditarPartido] = useState(false);
  const [showRegistrarResultados, setShowRegistrarResultados] = useState(false);
  const [showCambiarEstado, setShowCambiarEstado] = useState(false);
  const [selectedPartido, setSelectedPartido] = useState<number | null>(null);
  const [eventoFiltro, setEventoFiltro] = useState<number | undefined>();
  const [ubicacionFiltro, setUbicacionFiltro] = useState<string>("");
  const { eventos, consultarEventos } = useEventoStore();

  const {
    partidos,
    partidoActual,
    loading,
    error,
    obtenerPartidos,
    obtenerPartidoPorId,
    crearPartido,
    cambiarEstadoPartido,
    actualizarPartido,
  } = usePartidoStore();

  useEffect(() => {
    // Cargar eventos al montar el componente
    const cargarEventos = async () => {
      try {
        await consultarEventos();
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };

    cargarEventos();
    obtenerPartidos();
  }, [consultarEventos, obtenerPartidos]);

  const handleEditarPartido = async (id: number) => {
    await obtenerPartidoPorId(id);
    setSelectedPartido(id);
    setShowEditarPartido(true);
  };

  const handleRegistrarResultado = async (id: number) => {
    await obtenerPartidoPorId(id);
    setSelectedPartido(id);
    setShowRegistrarResultados(true);
    toast.success("Partido registrado exitosamente");
  };

  const handleCancelarPartido = async (id: number, motivo: string) => {
    await cambiarEstadoPartido(id, "cancelado", motivo);
    await obtenerPartidos();
  };

  const handleCambiarEstado = async (id: number) => {
    await obtenerPartidoPorId(id);
    setSelectedPartido(id);
    setShowCambiarEstado(true);
  };

  const handleSubmitCambioEstado = async (
    nuevoEstado: string,
    motivo?: string
  ) => {
    if (!selectedPartido) return;

    try {
      await cambiarEstadoPartido(selectedPartido, nuevoEstado, motivo);
      await obtenerPartidos();
      setShowCambiarEstado(false);

      // Actualizar la pestaña activa según el nuevo estado
      switch (nuevoEstado) {
        case "en_juego":
          setActiveTab("en_juego");
          break;
        case "finalizado":
          setActiveTab("finalizados");
          break;
        case "cancelado":
          setActiveTab("cancelados");
          break;
        default:
          setActiveTab("programados");
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
      {!showProgramarPartido &&
      !showEditarPartido &&
      !showRegistrarResultados &&
      !showCambiarEstado ? (
        <>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar por ubicación..."
                className="w-full p-2 border rounded pl-10"
                value={ubicacionFiltro}
                onChange={(e) => setUbicacionFiltro(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              className="p-2 border rounded"
              value={eventoFiltro || ""}
              onChange={(e) =>
                setEventoFiltro(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            >
              <option value="">Todos los eventos</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.nombre}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowProgramarPartido(true)}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Programar Partido"}
            </button>
          </div>

          <PartidoList
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            partidos={partidos}
            loading={loading}
            error={error}
            onEditarPartido={handleEditarPartido}
            onRegistrarResultado={handleRegistrarResultado}
            onCancelarPartido={handleCancelarPartido}
            onCambiarEstado={handleCambiarEstado}
            eventoFiltro={eventoFiltro}
            ubicacionFiltro={ubicacionFiltro}
          />
        </>
      ) : showProgramarPartido ? (
        <ProgramarPartidoModal
          onClose={() => setShowProgramarPartido(false)}
          onCreate={async (data) => {
            await crearPartido(data);
            await obtenerPartidos();
          }}
        />
      ) : showEditarPartido && partidoActual ? (
        <EditarPartidoModal
          partido={partidoActual}
          onClose={() => setShowEditarPartido(false)}
          onUpdate={async (id, data) => {
            await actualizarPartido(id, data);
            await obtenerPartidos();
          }}
        />
      ) : showCambiarEstado && partidoActual ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <CambiarEstadoPartido
            partido={partidoActual}
            onClose={() => setShowCambiarEstado(false)}
            onSubmit={handleSubmitCambioEstado}
          />
        </div>
      ) : showRegistrarResultados && partidoActual ? (
        <RegistrarResultadosModal
          partido={partidoActual}
          onClose={() => {
            setShowRegistrarResultados(false);
            obtenerPartidos();
          }}
          onSave={async () => {
            await obtenerPartidos();
            setActiveTab("finalizados");
          }}
        />
      ) : null}
    </div>
  );
};
