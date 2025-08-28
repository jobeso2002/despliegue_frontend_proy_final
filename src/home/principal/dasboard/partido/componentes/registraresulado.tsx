import { useState, Fragment } from "react";
import { Partido } from "@/interface/partido/partido.interface";
import { toast } from "sonner";
import { useResultadoStore } from "@/store/resultado/resultado";
import { useAuthStore } from "@/store/authstore";

interface RegistrarResultadosModalProps {
  partido: Partido;
  onClose: () => void;
  onSave: () => void;
}

export const RegistrarResultadosModal = ({
  partido,
  onClose,
  onSave,
}: RegistrarResultadosModalProps) => {
  const [sets, setSets] = useState([
    { numeroSet: 1, puntosLocal: 0, puntosVisitante: 0 },
    { numeroSet: 2, puntosLocal: 0, puntosVisitante: 0 },
    { numeroSet: 3, puntosLocal: 0, puntosVisitante: 0 },
    { numeroSet: 4, puntosLocal: 0, puntosVisitante: 0 },
    { numeroSet: 5, puntosLocal: 0, puntosVisitante: 0 },
  ]);
  const [duracion, setDuracion] = useState<number>();
  const [observaciones, setObservaciones] = useState("");
  const { crearResultado, loading } = useResultadoStore();
  const { user } = useAuthStore();

  const handleSetChange = (
    index: number,
    field: "puntosLocal" | "puntosVisitante",
    value: number
  ) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const calculateSetsGanados = () => {
    let local = 0;
    let visitante = 0;

    sets.forEach((set) => {
      if (set.puntosLocal > set.puntosVisitante) local++;
      if (set.puntosVisitante > set.puntosLocal) visitante++;
    });

    return { local, visitante };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes iniciar sesión para registrar resultados");
      return; // Detener la ejecución si no hay usuario
    }

    const { local: setsLocal, visitante: setsVisitante } =
      calculateSetsGanados();

    // Filtrar solo los sets que se jugaron (al menos un punto)
    const setsJugados = sets.filter(
      (set) => set.puntosLocal > 0 || set.puntosVisitante > 0
    );

    try {
      await crearResultado({
        setsLocal,
        setsVisitante,
        duracion,
        observaciones,
        partidoId: partido.id,
        usuarioRegistraId: user.id, // Reemplazar con ID de usuario real
        sets: setsJugados,
      });

      toast.success("Resultado registrado exitosamente");
      onSave();
      onClose();
    } catch (error) {
      toast.error("Error al registrar el resultado");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrar Resultado</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="font-medium">Set</div>
          <div className="font-medium">{partido.clubLocal?.nombre}</div>
          <div className="font-medium">{partido.clubVisitante?.nombre}</div>

          {sets.map((set, index) => (
            <Fragment key={`set-row-${index}`}>
              <div className="flex items-center" key={`set-number-${index}`}>
                Set {set.numeroSet}
              </div>
              <input
                type="number"
                value={set.puntosLocal}
                onChange={(e) =>
                  handleSetChange(
                    index,
                    "puntosLocal",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full p-2 border rounded"
                min="0"
                key={`local-input-${index}`}
              />
              <input
                type="number"
                value={set.puntosVisitante}
                onChange={(e) =>
                  handleSetChange(
                    index,
                    "puntosVisitante",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full p-2 border rounded"
                min="0"
                key={`visitante-input-${index}`}
              />
            </Fragment>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-2">Resumen</h3>
          <p>
            Sets ganados:
            <span className="font-bold"> {calculateSetsGanados().local}</span> -
            <span className="font-bold">
              {" "}
              {calculateSetsGanados().visitante}
            </span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Duración (minutos)
          </label>
          <input
            type="number"
            value={duracion}
            onChange={(e) =>
              setDuracion(e.target.value === "" ? 1 : Number(e.target.value))
            }
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Resultado"}
          </button>
        </div>
      </form>
    </div>
  );
};
