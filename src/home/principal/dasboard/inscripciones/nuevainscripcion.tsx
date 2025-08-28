// src/components/NuevaInscripcion.tsx
import { useClubStore } from "@/store/club/club";
import { useEventoStore } from "@/store/evento/evento";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface NuevaInscripcionProps {
  eventoId?: number;
  onClose: () => void;
  onSubmit: (data: { id_evento: number; id_club: number }) => Promise<void>;
}

export const NuevaInscripcion = ({
  eventoId,
  onClose,
  onSubmit,
}: NuevaInscripcionProps) => {
  const [formData, setFormData] = useState({
    id_evento: eventoId || "",
    id_club: "",
  });
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroRama, setFiltroRama] = useState("");
  // Obtener stores
  const { eventos, consultarEventos } = useEventoStore();
  const { club, ConsultarClub } = useClubStore();
  // Cargar datos iniciales
  useEffect(() => {
    consultarEventos({ estado: "planificado" });
    ConsultarClub();
  }, [consultarEventos, ConsultarClub]);
  // Obtener categorías y ramas únicas para los filtros
  const categoriasUnicas = [...new Set(club.map((c) => c.categoria))];
  const ramasUnicas = [...new Set(club.map((c) => c.rama))];
  // Filtrar clubes
  const clubesFiltrados = club.filter((clubItem) => {
    const coincideNombre = clubItem.nombre.toLowerCase();
    const coincideCategoria = filtroCategoria
      ? clubItem.categoria === filtroCategoria
      : true;
    const coincideRama = filtroRama ? clubItem.rama === filtroRama : true;
    return coincideNombre && coincideCategoria && coincideRama;
  });
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        id_evento: Number(formData.id_evento),
        id_club: Number(formData.id_club),
      });
    } catch (error) {
      console.error("Error al crear inscripción:", error);
      toast.error("Ocurrió un error al crear la inscripción");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Nueva Inscripción</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!eventoId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evento
            </label>
            <select
              name="id_evento"
              value={formData.id_evento}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccione un evento</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>
                  {evento.nombre} -{" "}
                  {new Date(evento.fechaInicio).toLocaleDateString()} (
                  {evento.tipo})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club
            </label>

            {/* Filtros */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Todas las categorías</option>
                  {categoriasUnicas.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={filtroRama}
                  onChange={(e) => setFiltroRama(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Todas las ramas</option>
                  {ramasUnicas.map((rama) => (
                    <option key={rama} value={rama}>
                      {rama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selector de clubes */}
            <select
              name="id_club"
              value={formData.id_club}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccione un club</option>
              {clubesFiltrados.length > 0 ? (
                clubesFiltrados.map((clubItem) => (
                  <option key={clubItem.id} value={clubItem.id}>
                    {clubItem.nombre} ({clubItem.categoria} - {clubItem.rama})
                  </option>
                ))
              ) : (
                <option disabled>No se encontraron clubes</option>
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!formData.id_evento || !formData.id_club}
          >
            Registrar Inscripción
          </button>
        </div>
      </form>
    </div>
  );
};
