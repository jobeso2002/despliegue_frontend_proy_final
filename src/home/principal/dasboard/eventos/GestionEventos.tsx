import { useState, useEffect, useMemo } from "react";
import { useEventoStore } from "@/store/evento/evento";
import EventoTabs from "./componentes/eventotabs";
import EventosList from "./componentes/eventolist";
import CrearEventoForm from "./componentes/creareventoform";
import EditarEventoForm from "./componentes/editarevento";
import CambiarEstadoForm from "./componentes/cambiarestado";
import { useAuthStore } from "@/store/authstore";
import { GestionInscripciones } from "../inscripciones/inscripciones";
import { ExportarEventosButton } from "./componentes/ExportarEventosButton";

export const GestionEventos = () => {
  const [activeTab, setActiveTab] = useState<
    "planificados" | "en_curso" | "finalizados" | "cancelados"
  >("planificados");
  const [showCrearEvento, setShowCrearEvento] = useState(false);
  const [showEditarEvento, setShowEditarEvento] = useState(false);
  const [showInscribirClub, setShowInscribirClub] = useState(false);
  const [showCambiarEstado, setShowCambiarEstado] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("");
  const [filterUbicacion, setFilterUbicacion] = useState("");

  const { user } = useAuthStore();
  const {
    eventos,
    eventoActual,
    loading,
    error,
    consultarEventos,
    consultarEventoPorId,
    crearEvento,
    actualizarEvento,
    cancelarEvento,
    cambiarEstadoEvento,
  } = useEventoStore();

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Función para manejar el cambio en el filtro de tipo
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterTipo(e.target.value);
  };

  // Función para manejar el cambio en el filtro de ubicación
  const handleUbicacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterUbicacion(e.target.value);
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchTerm("");
    setFilterTipo("");
    setFilterUbicacion("");
  };

  // Aplicar filtros a los eventos
  const eventosFiltrados = useMemo(() => {
    const filtered = {
      planificados: eventos.filter((e) => e.estado === "planificado"),
      en_curso: eventos.filter((e) => e.estado === "en_curso"),
      finalizados: eventos.filter((e) => e.estado === "finalizado"),
      cancelados: eventos.filter((e) => e.estado === "cancelado"),
    };

    // Aplicar filtros adicionales
    return {
      planificados: filtered.planificados.filter((evento) => {
        const matchesSearch =
          evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = filterTipo ? evento.tipo === filterTipo : true;
        const matchesUbicacion = filterUbicacion
          ? evento.ubicacion
              .toLowerCase()
              .includes(filterUbicacion.toLowerCase())
          : true;

        return matchesSearch && matchesTipo && matchesUbicacion;
      }),
      en_curso: filtered.en_curso.filter((evento) => {
        const matchesSearch =
          evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = filterTipo ? evento.tipo === filterTipo : true;
        const matchesUbicacion = filterUbicacion
          ? evento.ubicacion
              .toLowerCase()
              .includes(filterUbicacion.toLowerCase())
          : true;

        return matchesSearch && matchesTipo && matchesUbicacion;
      }),
      finalizados: filtered.finalizados.filter((evento) => {
        const matchesSearch =
          evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = filterTipo ? evento.tipo === filterTipo : true;
        const matchesUbicacion = filterUbicacion
          ? evento.ubicacion
              .toLowerCase()
              .includes(filterUbicacion.toLowerCase())
          : true;

        return matchesSearch && matchesTipo && matchesUbicacion;
      }),
      cancelados: filtered.cancelados.filter((evento) => {
        const matchesSearch =
          evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = filterTipo ? evento.tipo === filterTipo : true;
        const matchesUbicacion = filterUbicacion
          ? evento.ubicacion
              .toLowerCase()
              .includes(filterUbicacion.toLowerCase())
          : true;

        return matchesSearch && matchesTipo && matchesUbicacion;
      }),
    };
  }, [eventos, searchTerm, filterTipo, filterUbicacion]);

  useEffect(() => {
    consultarEventos({ todos: true });
  }, [consultarEventos]);

  const handleCrearEvento = async (data: any) => {
    try {
      await crearEvento({
        ...data,
        id_usuario_organizador: user?.id || 1, // Usar el ID del usuario autenticado
      });
      setShowCrearEvento(false);
    } catch (error) {
      console.error("Error al crear evento:", error);
    }
  };

  const handleActualizarEvento = async (id: number, data: any) => {
    try {
      await actualizarEvento(id, data);
      setShowEditarEvento(false);
    } catch (error) {
      console.error("Error al actualizar evento:", error);
    }
  };

  const handleCancelarEvento = async (id: number) => {
    try {
      await cancelarEvento(id);
    } catch (error) {
      console.error("Error al cancelar evento:", error);
    }
  };

  const handleCambiarEstado = async (id: number, estado: string) => {
    try {
      if (!user) throw new Error("Usuario no autenticado");
      await cambiarEstadoEvento(id, estado, user.id);
      setShowCambiarEstado(false);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-6xl mx-auto">
      {!showCrearEvento &&
      !showEditarEvento &&
      !showInscribirClub &&
      !showCambiarEstado ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Gestión de Eventos</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative col-span-2">
                <input
                  type="text"
                  placeholder="Buscar eventos (nombre, descripción)..."
                  className="w-full p-2 border rounded pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
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

              <div>
                <select
                  value={filterTipo}
                  onChange={handleTipoChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Todos los tipos</option>
                  <option value="torneo">Torneo</option>
                  <option value="amistoso">Amistoso</option>
                  <option value="clasificatorio">Clasificatorio</option>
                  <option value="championship">Championship</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Filtrar por ubicación..."
                  className="w-full p-2 border rounded pl-10"
                  value={filterUbicacion}
                  onChange={handleUbicacionChange}
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
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
              </div>
            </div>

            <div className="flex justify-between items-center">
              {(searchTerm || filterTipo || filterUbicacion) && (
                <div className="text-sm text-gray-600">
                  Filtros aplicados:
                  {searchTerm && (
                    <span className="ml-2 bg-gray-100 px-2 py-1 rounded">
                      Nombre: "{searchTerm}"
                    </span>
                  )}
                  {filterTipo && (
                    <span className="ml-2 bg-gray-100 px-2 py-1 rounded">
                      Tipo: {filterTipo}
                    </span>
                  )}
                  {filterUbicacion && (
                    <span className="ml-2 bg-gray-100 px-2 py-1 rounded">
                      Ubicación: "{filterUbicacion}"
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              <div className="flex gap-2">
                <ExportarEventosButton
                  eventos={eventosFiltrados[activeTab]}
                  tipoExportacion={
                    activeTab === "planificados"
                      ? "planificados"
                      : activeTab === "en_curso"
                      ? "en_curso"
                      : activeTab === "finalizados"
                      ? "finalizados"
                      : activeTab === "cancelados"
                      ? "cancelados"
                      : "todos"
                  }
                  todosLosEventos={eventos} // Pasar todos los eventos sin filtrar
                  disabled={loading}
                />

                <button
                  onClick={() => setShowCrearEvento(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Crear Evento
                </button>
              </div>
            </div>
            
          </div>
          <EventoTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={{
              planificados: eventosFiltrados.planificados.length,
              en_curso: eventosFiltrados.en_curso.length,
              finalizados: eventosFiltrados.finalizados.length,
              cancelados: eventosFiltrados.cancelados.length,
            }}
          />
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <EventosList
                eventos={eventosFiltrados[activeTab]}
                onEdit={(id) => {
                  consultarEventoPorId(id);
                  setShowEditarEvento(true);
                }}
                onInscribir={(id) => {
                  consultarEventoPorId(id);
                  setShowInscribirClub(true);
                }}
                onCancelar={handleCancelarEvento}
                onCambiarEstado={(id) => {
                  consultarEventoPorId(id);
                  setShowCambiarEstado(true);
                }}
              />
            </>
          )}
        </>
      ) : showCrearEvento ? (
        <CrearEventoForm
          onClose={() => setShowCrearEvento(false)}
          onSubmit={handleCrearEvento}
        />
      ) : showEditarEvento && eventoActual ? (
        <EditarEventoForm
          evento={eventoActual}
          onClose={() => setShowEditarEvento(false)}
          onSubmit={(data) => handleActualizarEvento(eventoActual.id, data)}
        />
      ) : showInscribirClub && eventoActual ? (
        <GestionInscripciones
          eventoId={eventoActual.id}
          onClose={() => setShowInscribirClub(false)}
        />
      ) : showCambiarEstado && eventoActual ? (
        <CambiarEstadoForm
          evento={eventoActual}
          onClose={() => setShowCambiarEstado(false)}
          onSubmit={(estado) => handleCambiarEstado(eventoActual.id, estado)}
        />
      ) : null}
    </div>
  );
};
