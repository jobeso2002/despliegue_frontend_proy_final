import { useState, useEffect } from "react";
import { useForm } from "@/components/hooks/useform";
import { toast } from "sonner";
import { useEventoStore } from "@/store/evento/evento";

interface ProgramarPartidoModalProps {
  onClose: () => void;
  onCreate: (data: any) => Promise<any>;
}

export const ProgramarPartidoModal = ({
  onClose,
  onCreate,
}: ProgramarPartidoModalProps) => {
  const { form, handleChange, resetForm, setForm } = useForm({
    fechaHora: new Date().toISOString().slice(0, 16),
    ubicacion: "",
    id_club_local: "",
    id_club_visitante: "",
    id_evento: "",
    id_arbitro_principal: "",
    id_arbitro_secundario: "",
  });

  const [clubesInscritos, setClubesInscritos] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [loadingClubes, setLoadingClubes] = useState(false);
  const {
    eventos: eventosDisponibles,
    obtenerClubesInscritos,
    consultarEventos,
  } = useEventoStore();

  // Cargar eventos planificados al montar el componente
  useEffect(() => {
    const fetchEventosPlanificados = async () => {
      try {
        await consultarEventos({ estado: "planificado" });
        if (eventosDisponibles && eventosDisponibles.length > 0) {
          setEventos(eventosDisponibles);
        } else {
          toast.info("No hay eventos planificados disponibles");
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        toast.error("Error al cargar eventos");
      }
    };

    fetchEventosPlanificados();
  }, [consultarEventos, eventosDisponibles]);

  // Cargar clubes inscritos cuando se selecciona un evento
  useEffect(() => {
    const fetchClubesInscritos = async () => {
      if (form.id_evento) {
        setLoadingClubes(true);
        try {
          const clubes = await obtenerClubesInscritos(Number(form.id_evento));
          setClubesInscritos(clubes);
          // Resetear selección de clubes sin disparar un nuevo render
          setForm((prev) => ({
            ...prev,
            id_club_local: "",
            id_club_visitante: "",
          }));
        } catch (error) {
          console.error("Error al obtener clubes inscritos:", error);
          toast.error("Error al cargar clubes del evento");
        } finally {
          setLoadingClubes(false);
        }
      }
    };

    fetchClubesInscritos();
  }, [form.id_evento, obtenerClubesInscritos, setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.id_club_local === form.id_club_visitante) {
      toast.error("El club local y visitante no pueden ser el mismo");
      return;
    }

    try {
      await onCreate({
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
      toast.success("Partido programado exitosamente");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error al crear partido:", error);
      toast.error("Error al registrar partido");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Programar Nuevo Partido</h1>

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

        {/* Selector de Evento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Evento (solo planificados)
          </label>
          <select
            name="id_evento"
            value={form.id_evento}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccione un evento planificado</option>
            {eventos.map((evento) => (
              <option key={evento.id} value={evento.id}>
                {evento.nombre} -{" "}
                {new Date(evento.fechaInicio).toLocaleDateString()}
              </option>
            ))}
          </select>
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
            disabled={!form.id_evento || loadingClubes}
          >
            <option value="">
              {loadingClubes
                ? "Cargando clubes..."
                : !form.id_evento
                ? "Primero seleccione un evento"
                : "Seleccione club local"}
            </option>
            {clubesInscritos.map((club) => (
              <option key={club.id} value={club.id}>
                {club.nombre}
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
            disabled={!form.id_evento || loadingClubes}
          >
            <option value="">
              {loadingClubes
                ? "Cargando clubes..."
                : !form.id_evento
                ? "Primero seleccione un evento"
                : "Seleccione club visitante"}
            </option>
            {clubesInscritos.map((club) => (
              <option key={club.id} value={club.id}>
                {club.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Resto del formulario (igual que antes) */}
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
              !form.id_evento ||
              !form.id_club_local ||
              !form.id_club_visitante ||
              loadingClubes
            }
          >
            Programar Partido
          </button>
        </div>
      </form>
    </div>
  );
};
