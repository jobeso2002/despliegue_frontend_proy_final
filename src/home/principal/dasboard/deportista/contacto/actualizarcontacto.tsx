import { useForm } from "@/components/hooks/useform";
import { Button } from "@/components/ui/button";
import { useContactoStore } from "@/store/contacto/contacto";
import { useEffect } from "react";
import { toast } from "sonner";

interface ContactoFormProps {
  initialValues: any;
  onCancel: () => void;
  onSuccess: () => void;
  deportistaId: number;
}

function ContactoForm({
  initialValues,
  onCancel,
  onSuccess,
  deportistaId,
}: ContactoFormProps) {
  const { crear_contacto, actualizarContacto } = useContactoStore();
  const { form, handleChange, resetForm } = useForm(initialValues);

  useEffect(() => {
    resetForm();
  }, [initialValues, resetForm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (form.id) {
        await actualizarContacto(form.id, form);
      } else {
        await crear_contacto({ ...form, id_deportista: deportistaId });
      }
      toast.success("Contacto actualizado exitosamente");
      onSuccess();
      resetForm();
    } catch (error) {
      console.error("Error al guardar contacto:", error);
      toast.error("Error al guardar contacto");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="nombres" className="block mb-2 font-semibold">
          Nombres:
        </label>
        <input
          id="nombres"
          name="nombres"
          type="text"
          required
          value={form.nombres}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      <div>
        <label htmlFor="apellidos" className="block mb-2 font-semibold">
          Apellidos:
        </label>
        <input
          name="apellidos"
          id="apellidos"
          type="text"
          required
          className="border border-gray-300 p-2 rounded w-full"
          onChange={handleChange}
          value={form.apellidos}
        />
      </div>

      <div>
        <label htmlFor="parentesco" className="block mb-2 font-semibold">
          Parentesco:
        </label>
        <select
          id="parentesco"
          name="parentesco"
          onChange={handleChange}
          value={form.parentesco}
          className="border border-gray-300 p-2 rounded w-full"
          required
        >
          <option value="">Seleccione Parentesco</option>
          <option value="padre">Padre</option>
          <option value="madre">Madre</option>
          <option value="abuela">Abuela</option>
          <option value="abuelo">Abuelo</option>
          <option value="tio">Tío</option>
          <option value="primo">Primo</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div>
        <label htmlFor="telefono" className="block mb-2 font-semibold">
          Teléfono:
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          required
          onChange={handleChange}
          value={form.telefono}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-semibold">
          Email:
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          onChange={handleChange}
          value={form.email}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      <div>
        <label htmlFor="direccion" className="block mb-2 font-semibold">
          Dirección:
        </label>
        <input
          id="direccion"
          name="direccion"
          type="text"
          required
          onChange={handleChange}
          value={form.direccion}
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      <div>
        <label
          htmlFor="esContactoEmergencia"
          className="block mb-2 font-semibold"
        >
          Contacto de Emergencia
        </label>
        <select
          id="esContactoEmergencia"
          name="esContactoEmergencia"
          onChange={handleChange}
          value={form.esContactoEmergencia ? "true" : "false"}
          className="border border-gray-300 p-2 rounded w-full"
          required
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="col-span-2 flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {form.id ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

export default ContactoForm;
