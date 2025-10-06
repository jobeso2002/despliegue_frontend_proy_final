import React from "react";
import { useForm } from "@/components/hooks/useform";
import { toast } from "sonner";

interface CrearEventoFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CrearEventoForm: React.FC<CrearEventoFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const { form, handleChange } = useForm({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    tipo: "torneo",
    ubicacion: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
    });
    toast.success("Evento creado exitosamente");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Evento</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Evento
          </label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ej: Torneo de Verano 2025"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Descripción detallada del evento..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Fin
            </label>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Evento
          </label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="torneo">Torneo</option>
            <option value="amistoso">Amistoso</option>
            <option value="clasificatorio">Clasificatorio</option>
            <option value="championship">Championship</option>
          </select>
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
            placeholder="Ej: Coliseo Municipal"
            required
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
          >
            Crear Evento
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearEventoForm;
