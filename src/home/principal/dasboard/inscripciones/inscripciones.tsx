import { useInscripcionStore } from "@/store/inscripcion/inscripcion";
import { useState, useEffect } from "react";
import { NuevaInscripcion } from "./nuevainscripcion";
import { DetalleInscripcion } from "./detalleinscripcion";
import { useAuthStore } from "@/store/authstore";
import { toast } from "sonner";

interface GestionInscripcionesProps {
  eventoId?: number; // Prop opcional para filtrar por evento
  onClose: () => void;
}

export const GestionInscripciones = ({
  eventoId,
  onClose,
}: GestionInscripcionesProps) => {
  const { user } = useAuthStore(); // Obtener el usuario autenticado
  const [activeTab, setActiveTab] = useState<
    "pendientes" | "aprobadas" | "rechazadas"
  >("pendientes");
  const [showNuevaInscripcion, setShowNuevaInscripcion] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState<number | null>(
    null
  );

  // Usar el store
  const {
    inscripciones,
    inscripcionSeleccionada,
    obtenerInscripciones,
    obtenerInscripcionPorId,
    obtenerInscripcionesPorEvento,
    aprobarInscripcion,
    rechazarInscripcion,

    crearInscripcion,
  } = useInscripcionStore();

  // Filtrar inscripciones según el tab activo
  const inscripcionesFiltradas = inscripciones.filter((insc) => {
    if (activeTab === "pendientes") return insc.estado === "pendiente";
    if (activeTab === "aprobadas") return insc.estado === "aprobada";
    if (activeTab === "rechazadas") return insc.estado === "rechazada";
    return false;
  });

  // Obtener inscripciones al cargar el componente
  useEffect(() => {
    if (eventoId) {
      obtenerInscripcionesPorEvento(eventoId);
    } else {
      obtenerInscripciones();
    }
  }, [eventoId, obtenerInscripciones, obtenerInscripcionesPorEvento]);

  // Cargar detalles cuando se selecciona una inscripción
  useEffect(() => {
    if (selectedInscripcion) {
      obtenerInscripcionPorId(selectedInscripcion);
    }
  }, [selectedInscripcion, obtenerInscripcionPorId]);

  // En tu componente GestionInscripciones

  const handleAprobar = async (id: number) => {
    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      await aprobarInscripcion(id, user.id);
      toast.success("Inscripción aprobada exitosamente.");
      // Recargar las inscripciones después de aprobar
      if (eventoId) {
        await obtenerInscripcionesPorEvento(eventoId);
      } else {
        await obtenerInscripciones();
      }
    } catch (error: any) {
      console.error("Error al aprobar inscripción:", error);
      toast.error(`Error al aprobar inscripción: ${error.message}`);
    }
  };

  const handleRechazar = async (id: number) => {
    try {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      await rechazarInscripcion(id, user.id);
      toast.success("Inscripción rechazada exitosamente.");
      // Recargar las inscripciones después de rechazar
      if (eventoId) {
        await obtenerInscripcionesPorEvento(eventoId);
      } else {
        await obtenerInscripciones();
      }
    } catch (error: any) {
      console.error("Error al rechazar inscripción:", error);
      toast.error(`Error al rechazar inscripción: ${error.message}`);
    }
  };

  const handleCrearInscripcion = async (data: {
    id_evento: number;
    id_club: number;
  }) => {
    try {
      if (!user) {
        throw new Error("Debe iniciar sesión para crear inscripciones");
      }

      await crearInscripcion({
        ...data,
        id_usuario_registra: user.id, // Usamos el ID del usuario logueado
      });

      setShowNuevaInscripcion(false);
      toast.success("Inscripción creada exitosamente");

      // Actualizar la lista
      if (eventoId) {
        await obtenerInscripcionesPorEvento(eventoId);
      } else {
        await obtenerInscripciones();
      }
    } catch (error: any) {
      console.error("Error al crear inscripción:", error);
      toast.error(error.message || "Error al crear la inscripción");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {eventoId ? "Inscripciones del Evento" : "Gestión de Inscripciones"}
        </h1>
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Volver
        </button>
      </div>

      {!showNuevaInscripcion && !selectedInscripcion ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Gestión de Inscripciones</h1>

          <div className="mb-6 flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar inscripciones (club, evento)..."
                className="w-full p-2 border rounded pl-10"
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
            {eventoId && (
              <button
                onClick={() => setShowNuevaInscripcion(true)}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Nueva Inscripción
              </button>
            )}
          </div>

          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "pendientes"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("pendientes")}
            >
              Pendientes (
              {inscripciones.filter((i) => i.estado === "pendiente").length})
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "aprobadas"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("aprobadas")}
            >
              Aprobadas (
              {inscripciones.filter((i) => i.estado === "aprobada").length})
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "rechazadas"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("rechazadas")}
            >
              Rechazadas (
              {inscripciones.filter((i) => i.estado === "rechazada").length})
            </button>
          </div>

          <div className="space-y-4">
            {inscripcionesFiltradas.length === 0 ? (
              <p className="text-gray-500">No hay inscripciones {activeTab}.</p>
            ) : (
              inscripcionesFiltradas.map((inscripcion) => (
                <div key={inscripcion.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{inscripcion.club?.nombre || "Club no disponible"}</h3>
                      <p className="text-sm text-gray-600">
                        Evento: {inscripcion.evento?.nombre || "Evento no disponible"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Fecha inscripción:{" "}
                        {new Date(
                          inscripcion.fechaInscripcion
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Registrada por: {inscripcion.usuarioRegistra.username || "Usuario no disponible"}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        inscripcion.estado === "aprobada"
                          ? "bg-green-100 text-green-800"
                          : inscripcion.estado === "rechazada"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {inscripcion.estado.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setSelectedInscripcion(inscripcion.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Ver Detalle
                    </button>
                    {inscripcion.estado === "pendiente" && (
                      <>
                        <button
                          onClick={() => handleAprobar(inscripcion.id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleRechazar(inscripcion.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : showNuevaInscripcion ? (
        <NuevaInscripcion
          onClose={() => setShowNuevaInscripcion(false)}
          onSubmit={handleCrearInscripcion}
        />
      ) : inscripcionSeleccionada ? (
        <DetalleInscripcion
          onClose={() => setSelectedInscripcion(null)}
          inscripcion={inscripcionSeleccionada}
        />
      ) : null}
    </div>
  );
};
