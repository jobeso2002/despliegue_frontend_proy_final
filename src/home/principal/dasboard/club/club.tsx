import { useForm } from "@/components/hooks/useform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Api } from "@/config/axios_base.config";

import { useUserStore } from "@/store/usuario/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Club() {
  const { persona, consultarUsuario } = useUserStore();

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  const { form, handleChange, resetForm, setForm } = useForm({
    nombre: "",
    fundacion: "",
    direccion: "",
    telefono: "",
    rama: "",
    categoria: "",
    email: "",
    logoFile: null as File | null,
    id_usuario_responsable: 0,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    consultarUsuario();
  }, [consultarUsuario]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error("Formato no permitido. Usa JPG, PNG, GIF o WEBP.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("La imagen no debe superar 2MB.");
        return;
      }

      setForm((prev) => ({ ...prev, logoFile: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.logoFile) {
      toast.error("Debes seleccionar una imagen.");
      return;
    }

    const requiredFields = [
      "nombre",
      "fundacion",
      "direccion",
      "telefono",
      "rama",
      "categoria",
      "email",
      "id_usuario_responsable",
    ];

    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        toast.error(`El campo ${field} es obligatorio.`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("fundacion", form.fundacion);
    formData.append("direccion", form.direccion);
    formData.append("telefono", form.telefono);
    formData.append("rama", form.rama);
    formData.append("categoria", form.categoria);
    formData.append("email", form.email);
    formData.append(
      "id_usuario_responsable",
      form.id_usuario_responsable.toString()
    );
    formData.append("logoFile", form.logoFile);

    try {
      await Api.post("/club", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Club registrado correctamente");
      resetForm();
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error al registrar club:", error);
      toast.error("Error al registrar club");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Registrar CLUBES</h1>
      {/* Formulario para agregar club */}
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-6">
        {/* Cambiamos el campo de logo */}
        <div className="col-span-2">
          <label className="block mb-2 font-semibold" htmlFor="logo">
            Logo del Club
          </label>
          <input
            id="logo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formatos aceptados: JPEG, PNG, GIF, WEBP. Tamaño máximo: 2MB
          </p>
          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Vista previa:</p>
              <img
                src={previewUrl}
                alt="Vista previa del logo"
                className="h-24 w-24 object-contain border rounded"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold" htmlFor="nombre">
            Nombre del club
          </label>
          <Input
            id="nombre"
            value={form.nombre}
            required
            onChange={handleChange}
            name="nombre"
            type="text"
            placeholder="Nombre del club"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold" htmlFor="fundacion">
            Fecha Creacion
          </label>
          <Input
            id="fundacion"
            value={form.fundacion}
            required
            onChange={handleChange}
            name="fundacion"
            type="date"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold" htmlFor="direccion">
            Dirección
          </label>
          <Input
            id="direccion"
            value={form.direccion}
            required
            onChange={handleChange}
            name="direccion"
            type="text"
            placeholder="Dirección"
          />
        </div>

        <div>
          <label htmlFor="categoria" className="block mb-2 font-semibold">
            Categoria:
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            className="border p-2 rounded"
            onChange={handleChange}
            value={form.categoria}
          >
            <option value="">Seleccione Categoria</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>

        <div>
          <label htmlFor="rama" className="block mb-2 font-semibold">
            Rama:
          </label>
          <select
            id="rama"
            name="rama"
            required
            className="border p-2 rounded"
            onChange={handleChange}
            value={form.rama}
          >
            <option value="">Seleccione Rama</option>
            <option value="sub-15">Sub-15</option>
            <option value="sub-17">Sub-17</option>
            <option value="sub-19">Sub-19</option>
            <option value="infantil">Infantil</option>
            <option value="juvenil">Juvenil</option>
            <option value="mayores">Mayores</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold" htmlFor="telefono">
            Teléfono
          </label>
          <Input
            id="telefono"
            value={form.telefono}
            required
            onChange={handleChange}
            name="telefono"
            type="text"
            placeholder="Teléfono"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            value={form.email}
            required
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Email"
          />
        </div>

        <div className="col-span-4">
          <label
            htmlFor="id_usuario_responsable"
            className="block mb-2 font-semibold"
          >
            Seleccionar Tecnico:
          </label>
          <select
            id="id_usuario_responsable"
            name="id_usuario_responsable"
            onChange={handleChange}
            value={form.id_usuario_responsable}
            className="border border-gray-300 p-2 rounded w-full"
            required
          >
            <option value="">Seleccione usuario responsable</option>
            {persona
              .filter(
                (usuario) =>
                  usuario.role.name === "DIRECTOR_TECNICO" ||
                  usuario.role.name === "PRESIDENTE_CLUB"
              )
              .map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.username} - {usuario.role.name}
                </option>
              ))}
          </select>
        </div>

        <div className="col-span-4 flex justify-center">
          <Button
            type="submit"
            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 "
          >
            guardar club
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Club;
