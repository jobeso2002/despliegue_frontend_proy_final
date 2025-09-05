// src/components/club/EditarClub.tsx
import { useForm } from "@/components/hooks/useform";
import { useClubStore } from "@/store/club/club";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Definir la interfaz para el formulario
interface ClubForm {
  nombre: string;
  fundacion: string;
  direccion: string;
  telefono: string;
  rama: string;
  categoria: string;
  email: string;
  logo: string;
  id_usuario_responsable: number;
  logoFile: File | null;
}

function EditarClub() {
  const { id } = useParams<{ id: string }>();
  const { club, actualizar_Club } = useClubStore();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Encontrar el club a editar
  const clubActual = club.find((c) => c.id === Number(id));

  // Especificar explícitamente el tipo genérico ClubForm
  const { form, handleChange, setForm } = useForm<ClubForm>({
    nombre: clubActual?.nombre || "",
    fundacion: clubActual?.fundacion || "",
    direccion: clubActual?.direccion || "",
    telefono: clubActual?.telefono || "",
    rama: clubActual?.rama || "sub-15",
    categoria: clubActual?.categoria || "masculino",
    email: clubActual?.email || "",
    logo: clubActual?.logo || "",
    id_usuario_responsable: clubActual?.id_usuario_responsable || 0,
    logoFile: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(
          "Solo se permiten archivos de imagen (JPEG, PNG, GIF, WEBP)."
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("El archivo no debe superar 2MB.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        logoFile: file, // Esto ahora funciona porque TypeScript sabe que logoFile es File | null
      }));

      // Mostrar vista previa de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (clubActual) {
      setForm({
        nombre: clubActual.nombre,
        fundacion: clubActual.fundacion,
        direccion: clubActual.direccion,
        telefono: clubActual.telefono,
        rama: clubActual.rama,
        categoria: clubActual.categoria,
        email: clubActual.email,
        logo: clubActual.logo,
        id_usuario_responsable: clubActual.id_usuario_responsable,
        logoFile: null,
      });

      if (clubActual.logo) {
        setPreviewUrl(clubActual.logo);
      }
    }
  }, [clubActual, setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // Agregar campos de texto
    Object.entries(form).forEach(([key, value]) => {
      if (
        key !== "logoFile" &&
        (typeof value === "string" || typeof value === "number")
      ) {
        formData.append(key, value.toString());
      }
    });

    // Agregar archivo de logo si existe
    if (form.logoFile) {
      formData.append("logoFile", form.logoFile);
    }

    try {
      await actualizar_Club(Number(id), formData);
      toast.success("Club actualizado correctamente");
      navigate("/dashboard/listaclub");
    } catch (error) {
      console.error("Error al actualizar el club:", error);
      toast.error("Error al actualizar el club");
    }
  };

  if (!clubActual) {
    return <div>Club no encontrado</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Editar Club: {clubActual.nombre}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Logo Upload */}
        <div className="col-span-2">
          <Label htmlFor="logoFile" className="block mb-2 font-semibold">
            Logo del Club:
          </Label>
          <input
            id="logoFile"
            type="file"
            name="logoFile"
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

          {form.logo && !previewUrl && (
            <div className="mt-2 text-sm text-gray-600">
              Logo actual:{" "}
              <a
                href={form.logo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Ver logo
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Nombre
            </Label>
            <Input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Fecha Fundación
            </Label>
            <Input
              type="date"
              name="fundacion"
              value={form.fundacion}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Dirección
            </Label>
            <Input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Teléfono
            </Label>
            <Input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Rama
            </Label>
            <select
              name="rama"
              value={form.rama}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="sub-15">Sub-15</option>
              <option value="sub-17">Sub-17</option>
              <option value="sub-19">Sub-19</option>
              <option value="mayores">Mayores</option>
              <option value="juvenil">Juvenil</option>
              <option value="infantil">Infantil</option>
            </select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Categoría
            </Label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="mixto">Mixto</option>
            </select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/listaclub")}
          >
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditarClub;
