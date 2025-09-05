import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@/components/hooks/useform";
import { DeportistaForm } from "@/interface/deportista/deportista.interface";
import { useDeportistaStore } from "@/store/deportista/deportista";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_PDF_TYPES = ["application/pdf"];

function EditarDeportista() {
  const { id } = useParams<{ id: string }>();
  const { deportistas, actualizarDeportista } = useDeportistaStore();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewDocs, setPreviewDocs] = useState<Record<string, string | null>>(
    {
      documentoIdentidad: null,
      registroCivil: null,
      afiliacion: null,
      certificadoEps: null,
      permisoResponsable: null,
    }
  );

  // Buscar el deportista actual en el store
  const deportistaActual = deportistas.find((d) => d.id === Number(id));

  // Inicializar el formulario con valores por defecto
  const { form, handleChange, setForm } = useForm<DeportistaForm>({
    documentoIdentidad: "",
    tipoDocumento: "cedula",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    fechaNacimiento: "",
    genero: "masculino",
    foto: "",
    tipo_sangre: "A+",
    telefono: "",
    posicion: "central",
    numero_camiseta: 0,
    email: "",
    direccion: "",
    documentoIdentidadPdf: "",
    registroCivilPdf: "",
    afiliacionPdf: "",
    certificadoEpsPdf: "",
    permisoResponsablePdf: "",
    estado: "activo",
    fotoFile: null,
    documentoIdentidadFile: null,
    registroCivilFile: null,
    afiliacionFile: null,
    certificadoEpsFile: null,
    permisoResponsableFile: null,
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof typeof form
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (fieldName !== "fotoFile" && !ALLOWED_PDF_TYPES.includes(file.type)) {
        toast.error("Solo se permiten archivos PDF.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("El archivo no debe superar 2MB.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      // Mostrar nombre del archivo o vista previa
      if (fieldName === "fotoFile") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewDocs((prev) => ({
          ...prev,
          [fieldName.replace("File", "")]: file.name,
        }));
      }
    }
  };

  // Cargar datos del deportista cuando el componente se monta
  useEffect(() => {
    if (deportistaActual) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...deportistaData } = deportistaActual;
      setForm({
        ...deportistaData,
        fotoFile: null,
        documentoIdentidadFile: null,
        registroCivilFile: null,
        afiliacionFile: null,
        certificadoEpsFile: null,
        permisoResponsableFile: null,
      });
      if (deportistaActual.foto) {
        setPreviewUrl(deportistaActual.foto);
      }
    }
  }, [deportistaActual, setForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // Agregar campos de texto
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number") {
        formData.append(key, value.toString());
      }
    });

    // Agregar archivos si existen
    const fileFields = [
      "fotoFile",
      "documentoIdentidadFile",
      "registroCivilFile",
      "afiliacionFile",
      "certificadoEpsFile",
      "permisoResponsableFile",
    ];

    fileFields.forEach((field) => {
      if (form[field as keyof typeof form]) {
        formData.append(field, form[field as keyof typeof form] as File);
      }
    });

    try {
      await actualizarDeportista(Number(id), formData);
      toast.success("Deportista actualizado exitosamente");
      navigate("/dashboard/listadeportista");
    } catch (error) {
      console.error("Error al actualizar deportista:", error);
      toast.error("Error al actualizar deportista");
    }
  };

  const FileInput = ({
    name,
    label,
    currentFileUrl,
    isImage = false,
  }: {
    name: keyof typeof form;
    label: string;
    currentFileUrl?: string;
    isImage?: boolean;
  }) => (
    <div className="col-span-2">
      <label htmlFor={name} className="block mb-2 font-semibold">
        {label}
      </label>
      <input
        id={name}
        type="file"
        name={name}
        accept={isImage ? "image/*" : "application/pdf"}
        onChange={(e) => handleFileChange(e, name)}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      <p className="text-xs text-gray-500 mt-1">
        {isImage
          ? "Formatos aceptados: JPEG, PNG, GIF, WEBP. Tamaño máximo: 2MB"
          : "Formato aceptado: PDF. Tamaño máximo: 2MB"}
      </p>
      {isImage && previewUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Vista previa:</p>
          <img
            src={previewUrl}
            alt="Vista previa de la foto"
            className="h-24 w-24 object-contain border rounded"
          />
        </div>
      )}
      {!isImage && previewDocs[name.replace("File", "")] && (
        <div className="mt-2 text-sm text-gray-600">
          Nuevo archivo seleccionado: {previewDocs[name.replace("File", "")]}
        </div>
      )}
      {currentFileUrl && !previewDocs[name.replace("File", "")] && (
        <div className="mt-2 text-sm text-gray-600">
          Archivo actual:{" "}
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Ver documento
          </a>
        </div>
      )}
    </div>
  );

  if (!deportistaActual) {
    return <div>Deportista no encontrado</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Deportista</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-6">
        {/* Foto */}
        <FileInput
          name="fotoFile"
          label="Foto:"
          currentFileUrl={form.foto}
          isImage
        />

        {/* Documentos PDF */}
        <FileInput
          name="documentoIdentidadFile"
          label="Documento de Identidad (PDF):"
          currentFileUrl={form.documentoIdentidadPdf}
        />

        <FileInput
          name="registroCivilFile"
          label="Registro Civil (PDF):"
          currentFileUrl={form.registroCivilPdf}
        />

        <FileInput
          name="afiliacionFile"
          label="Afiliación (PDF):"
          currentFileUrl={form.afiliacionPdf}
        />

        <FileInput
          name="certificadoEpsFile"
          label="Certificado EPS (PDF):"
          currentFileUrl={form.certificadoEpsPdf}
        />

        <FileInput
          name="permisoResponsableFile"
          label="Permiso del Responsable (PDF):"
          currentFileUrl={form.permisoResponsablePdf}
        />

        {/* Resto de campos del formulario */}
        <div>
          <Label htmlFor="tipoDocumento" className="block mb-2 font-semibold">
            Tipo de Documento:
          </Label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            required
            className="border p-2 rounded w-full"
            value={form.tipoDocumento}
            onChange={handleChange}
          >
            <option value="tarjeta_identidad">Tarjeta Identidad</option>
            <option value="cedula">Cedula Ciudadania</option>
            <option value="pasaporte">Cedula Extranjera</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="documentoIdentidad"
            className="block mb-2 font-semibold"
          >
            Número Documento:
          </label>
          <Input
            id="documentoIdentidad"
            type="text"
            name="documentoIdentidad"
            placeholder="Número de Documento"
            required
            className="w-full"
            value={form.documentoIdentidad}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="fechaNacimiento" className="text-black text-sm">
            Fecha Nacimiento:
          </Label>
          <Input
            id="fechaNacimiento"
            type="date"
            name="fechaNacimiento"
            placeholder="Fecha Nacimiento"
            required
            className="w-full"
            value={form.fechaNacimiento}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="primer_nombre" className="block mb-2 font-semibold">
            Primer Nombre:
          </label>
          <Input
            id="primer_nombre"
            type="text"
            name="primer_nombre"
            placeholder="Primer Nombre"
            required
            className="w-full"
            value={form.primer_nombre}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="segundo_nombre" className="block mb-2 font-semibold">
            Segundo Nombre:
          </label>
          <Input
            id="segundo_nombre"
            type="text"
            name="segundo_nombre"
            placeholder="Segundo Nombre"
            className="w-full"
            value={form.segundo_nombre}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="primer_apellido" className="block mb-2 font-semibold">
            Primer Apellido:
          </label>
          <Input
            id="primer_apellido"
            type="text"
            name="primer_apellido"
            placeholder="Primer Apellido"
            required
            className="w-full"
            value={form.primer_apellido}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="segundo_apellido"
            className="block mb-2 font-semibold"
          >
            Segundo Apellido:
          </label>
          <Input
            id="segundo_apellido"
            type="text"
            name="segundo_apellido"
            placeholder="Segundo Apellido"
            className="w-full"
            value={form.segundo_apellido}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block mb-2 font-semibold">
            Teléfono:
          </label>
          <Input
            id="telefono"
            type="text"
            name="telefono"
            placeholder="Teléfono"
            required
            value={form.telefono}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="posicion" className="block mb-2 font-semibold">
            Posición:
          </label>
          <select
            id="posicion"
            name="posicion"
            required
            className="border p-2 rounded w-full"
            value={form.posicion}
            onChange={handleChange}
          >
            <option value="armador">Armador</option>
            <option value="central">Central</option>
            <option value="punta">Punta</option>
            <option value="libero">Libero</option>
            <option value="opuesto">Opuesto</option>
          </select>
        </div>

        <div>
          <label htmlFor="numero_camiseta" className="block mb-2 font-semibold">
            Número de Camiseta:
          </label>
          <Input
            id="numero_camiseta"
            type="number"
            name="numero_camiseta"
            placeholder="Número de Camiseta"
            required
            value={form.numero_camiseta || ""}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="direccion" className="block mb-2 font-semibold">
            Dirección:
          </label>
          <Input
            id="direccion"
            type="text"
            name="direccion"
            placeholder="Dirección"
            required
            value={form.direccion}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="genero" className="block mb-2 font-semibold">
            Género:
          </Label>
          <select
            id="genero"
            name="genero"
            required
            className="border p-2 rounded w-full"
            value={form.genero}
            onChange={handleChange}
          >
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>

        <div>
          <Label htmlFor="tipo_sangre" className="block mb-2 font-semibold">
            Tipo Sangre:
          </Label>
          <select
            id="tipo_sangre"
            name="tipo_sangre"
            required
            className="border p-2 rounded w-full"
            value={form.tipo_sangre}
            onChange={handleChange}
          >
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">
            Correo Electrónico:
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Correo Electrónico"
            required
            className="w-full"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="col-span-4 flex justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/listadeportista")}
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

export default EditarDeportista;
