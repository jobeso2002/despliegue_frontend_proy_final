import { useForm } from "@/components/hooks/useform";
import { Button } from "@/components/ui/button";
import { useContactoStore } from "@/store/contacto/contacto";
import { useDeportistaStore } from "@/store/deportista/deportista";
import { useEffect } from "react";
import { toast } from "sonner";

function ContactoFamiliarDep() {
  const { crear_contacto } = useContactoStore();
  const { deportistas, ConsultarDeportista } = useDeportistaStore();
  const { form, handleChange, resetForm } = useForm({
    nombres: "",
    apellidos: "",
    parentesco: "",
    telefono: "",
    email: "",
    direccion: "",
    esContactoEmergencia: true,
    id_deportista: 0,
  });

  // Carga los deportistas cuando el componente se monta
  useEffect(() => {
    ConsultarDeportista();
  }, [ConsultarDeportista]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await crear_contacto(form);
      console.log("Contacto creado exitosamente");
      toast.success("Contacto creado exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al crear contacto:", error);
      toast.error("Error al crear contacto");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Datos De Contactos
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-6">
        {/* Selección de deportista */}
        <div className="col-span-4">
          <label htmlFor="id_deportista" className="block mb-2 font-semibold">
            Seleccionar Deportista:
          </label>
          <select
            id="id_deportista"
            name="id_deportista"
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full"
            required
            value={form.id_deportista}
          >
            <option value="">Seleccione un deportista</option>
            {deportistas.map((deportista) => (
              <option key={deportista.id} value={deportista.id}>
                {deportista.primer_apellido} {deportista.primer_nombre}
              </option>
            ))}
          </select>
        </div>

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
            placeholder="Nombres"
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
            placeholder="Apellidos"
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
            className="border border-teal-600 p-2 rounded w-full"
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
            Telefono:
          </label>
          <input
            id="telefono"
            name="telefono"
            placeholder="Telefono"
            type="number"
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
            placeholder="Email"
            required
            onChange={handleChange}
            value={form.email}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="direccion" className="block mb-2 font-semibold">
            Direccion:
          </label>
          <input
            id="direccion"
            name="direccion"
            placeholder="Direccion"
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
            Contacto De Emergencia
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

        <div className="col-span-4 flex justify-center">
          <Button
            type="submit"
            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Guardar Contacto
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ContactoFamiliarDep;
