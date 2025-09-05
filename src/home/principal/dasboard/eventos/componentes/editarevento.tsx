import React from "react";
import { useForm } from "@/components/hooks/useform";
import { toast } from "sonner";

interface EditarEventoFormProps {
  evento: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const EditarEventoForm: React.FC<EditarEventoFormProps> = ({
  evento,
  onClose,
  onSubmit,
}) => {
  const { form, handleChange } = useForm({
    nombre: evento.nombre,
    descripcion: evento.descripcion,
    fechaInicio: evento.fechaInicio.split("T")[0],
    fechaFin: evento.fechaFin.split("T")[0],
    tipo: evento.tipo,
    ubicacion: evento.ubicacion,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      fechaInicio: new Date(form.fechaInicio).toISOString(),
      fechaFin: new Date(form.fechaFin).toISOString(),
    });
    toast.success("Evento actualizado correctamente");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Evento</h1>

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
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarEventoForm;
