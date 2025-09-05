import { useState, useEffect } from "react";
import { useForm } from "@/components/hooks/useform";
import { toast } from "sonner";
import { useEventoStore } from "@/store/evento/evento";
import { Partido } from "@/interface/partido/partido.interface";

interface EditarPartidoModalProps {
  partido: Partido;
  onClose: () => void;
  onUpdate: (id: number, data: any) => Promise<void>;
}

export const EditarPartidoModal = ({
  partido,
  onClose,
  onUpdate,
}: EditarPartidoModalProps) => {
  // Verificar la estructura del partido recibido
  console.log("Partido recibido:", partido);

  const { form, handleChange, setForm } = useForm({
    fechaHora: partido.fechaHora
      ? new Date(partido.fechaHora).toISOString().slice(0, 16)
      : "",
    ubicacion: partido.ubicacion || "",
    id_club_local:
      partido.clubLocal?.id?.toString() ??
      partido.id_club_local?.toString() ??
      "",
    id_club_visitante:
      partido.clubVisitante?.id?.toString() ??
      partido.id_club_visitante?.toString() ??
      "",
    id_evento:
      partido.evento?.id?.toString() ?? partido.id_evento?.toString() ?? "",
    id_arbitro_principal:
      partido.arbitroPrincipal?.id?.toString() ??
      partido.id_arbitro_principal?.toString() ??
      "",
    id_arbitro_secundario:
      partido.arbitroSecundario?.id?.toString() ??
      partido.id_arbitro_secundario?.toString() ??
      "",
  });

  const [clubesInscritos, setClubesInscritos] = useState<any[]>([]);
  const [loadingClubes, setLoadingClubes] = useState(true);
  const { obtenerClubesInscritos } = useEventoStore();

  // Cargar clubes inscritos cuando se carga el componente
  useEffect(() => {
    const fetchClubesInscritos = async () => {
      try {
        // Usamos tanto el id_evento directo como el posible id del objeto evento
        const eventoId = partido.evento?.id || partido.id_evento;

        if (!eventoId) {
          console.error("ID de evento no encontrado en:", partido);
          toast.error("No se pudo identificar el evento del partido");
          setLoadingClubes(false);
          return;
        }

        console.log("Obteniendo clubes para evento ID:", eventoId);
        const clubes = await obtenerClubesInscritos(Number(eventoId));
        console.log("Clubes obtenidos:", clubes);

        if (!clubes || clubes.length === 0) {
          toast.warning("No hay clubes inscritos en este evento");
          setClubesInscritos([]);
        } else {
          setClubesInscritos(clubes);

          // Verificar si los clubes actuales están en los inscritos
          const clubLocalId = partido.clubLocal?.id || partido.id_club_local;
          const clubVisitanteId =
            partido.clubVisitante?.id || partido.id_club_visitante;

          setForm((prev) => ({
            ...prev,
            id_club_local: clubes.some((c) => c.id === clubLocalId)
              ? prev.id_club_local
              : "",
            id_club_visitante: clubes.some((c) => c.id === clubVisitanteId)
              ? prev.id_club_visitante
              : "",
          }));
        }
      } catch (error) {
        console.error("Error al obtener clubes inscritos:", error);
        toast.error("Error al cargar clubes del evento");
      } finally {
        setLoadingClubes(false);
      }
    };

    fetchClubesInscritos();
  }, [partido, obtenerClubesInscritos, setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.id_club_local === form.id_club_visitante) {
      toast.error("El club local y visitante no pueden ser el mismo");
      return;
    }

    try {
      await onUpdate(partido.id, {
        ...form,
        fechaHora: new Date(form.fechaHora).toISOString(),
        id_club_local: Number(form.id_club_local),
        id_club_visitante: Number(form.id_club_visitante),
        id_evento: Number(form.id_evento),
        id_arbitro_principal: form.id_arbitro_principal
          ? Number(form.id_arbitro_principal)
          : undefined,
        id_arbitro_secundario: form.id_arbitro_secundario
          ? Number(form.id_arbitro_secundario)
          : undefined,
      });
      toast.success("Partido actualizado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al actualizar partido:", error);
      toast.error("Error al actualizar partido");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Partido</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos de fecha, hora y ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y Hora
          </label>
          <input
            type="datetime-local"
            name="fechaHora"
            value={form.fechaHora}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Selector de Evento (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evento
          </label>
          <input
            type="text"
            value={partido.evento?.nombre || "Evento no disponible"}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
          />
        </div>

        {/* Selector de Club Local */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Club Local
          </label>
          <select
            name="id_club_local"
            value={form.id_club_local}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled={loadingClubes}
          >
            <option value="">
              {loadingClubes ? "Cargando clubes..." : "Seleccione club local"}
            </option>
            {clubesInscritos.map((club) => (
              <option key={club.id} value={club.id}>
                {club.nombre}
                {club.id === (partido.clubLocal?.id || partido.id_club_local) &&
                  " (Actual)"}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Club Visitante */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Club Visitante
          </label>
          <select
            name="id_club_visitante"
            value={form.id_club_visitante}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            disabled={loadingClubes}
          >
            <option value="">
              {loadingClubes
                ? "Cargando clubes..."
                : "Seleccione club visitante"}
            </option>
            {clubesInscritos.map((club) => (
              <option key={club.id} value={club.id}>
                {club.nombre}
                {club.id ===
                  (partido.clubVisitante?.id || partido.id_club_visitante) &&
                  " (Actual)"}
              </option>
            ))}
          </select>
        </div>

        {/* Árbitros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Árbitro Principal (Opcional)
          </label>
          <input
            type="number"
            name="id_arbitro_principal"
            value={form.id_arbitro_principal}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder={
              partido.arbitroPrincipal?.id?.toString() ||
              partido.id_arbitro_principal?.toString() ||
              "No asignado"
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Árbitro Secundario (Opcional)
          </label>
          <input
            type="number"
            name="id_arbitro_secundario"
            value={form.id_arbitro_secundario}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder={
              partido.arbitroSecundario?.id?.toString() ||
              partido.id_arbitro_secundario?.toString() ||
              "No asignado"
            }
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={
              loadingClubes ||
              !form.id_evento ||
              !form.id_club_local ||
              !form.id_club_visitante
            }
          >
            {loadingClubes ? "Cargando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};
