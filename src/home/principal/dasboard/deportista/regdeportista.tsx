import { useForm } from "@/components/hooks/useform";
import { usePermissions } from "@/components/hooks/usePermissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Api } from "@/config/axios_base.config";
import { PermisoType } from "@/enums/permisotype/permiso";
import { useState } from "react";
import { toast } from "sonner";

function RegDeportista() {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const ALLOWED_PDF_TYPES = ["application/pdf"];

  const { form, handleChange, resetForm, setForm } = useForm({
    documentoIdentidad: "",
    tipoDocumento: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    fechaNacimiento: "",
    genero: "",
    tipo_sangre: "",
    telefono: "",
    email: "",
    direccion: "",
    posicion: "",
    numero_camiseta: 0,
    fotoFile: null,
    documentoIdentidadFile: null,
    registroCivilFile: null,
    afiliacionFile: null,
    certificadoEpsFile: null,
    permisoResponsableFile: null,
  });

  const { hasPermission } = usePermissions();
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof typeof form,
    isImage: boolean = false
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_PDF_TYPES;
      const errorMessage = isImage
        ? "Formato no permitido. Usa JPG, PNG, GIF o WEBP."
        : "Solo se permiten archivos PDF.";

      if (!allowedTypes.includes(file.type)) {
        toast.error(errorMessage);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("El archivo no debe superar 2MB.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        [fieldName]: file, // Asigna directamente el archivo
      }));
      // Mostrar vista previa solo para imágenes
      if (isImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // Para PDFs, mostramos solo el nombre del archivo
        setPreviewDocs((prev) => ({
          ...prev,
          [fieldName]: file.name,
        }));
      }
    }
  };

  if (!hasPermission(PermisoType.WRITE)) {
    return <div>No tienes permisos para realizar esta acción</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Estado actual del formulario:", form);

    const requiredFields = [
      "documentoIdentidad",
      "tipoDocumento",
      "primer_nombre",
      "primer_apellido",
      "fechaNacimiento",
      "genero",
      "tipo_sangre",
      "telefono",
      "email",
      "direccion",
      "posicion",
      "numero_camiseta",
    ];
    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        toast.error(`El campo ${field} es obligatorio.`);
        return;
      }
    }

    // Validación de archivos requeridos
    if (!form.fotoFile || form.fotoFile === null) {
      toast.error("Debes subir una foto del deportista.");
      return;
    }
    if (!form.documentoIdentidadFile || form.documentoIdentidadFile === null) {
      toast.error("Debes subir el documento de identidad.");
      return;
    }
    if (!form.registroCivilFile || form.registroCivilFile === null) {
      toast.error("Debes subir el registro civil.");
      return;
    }
    if (!form.afiliacionFile || form.afiliacionFile === null) {
      toast.error("Debes subir el documento de afiliación.");
      return;
    }
    if (!form.certificadoEpsFile || form.certificadoEpsFile === null) {
      toast.error("Debes subir el certificado EPS.");
      return;
    }
    if (!form.permisoResponsableFile || form.permisoResponsableFile === null) {
      toast.error("Debes subir el permiso del responsable.");
      return;
    }

    const formData = new FormData();

    formData.append("documentoIdentidad", form.documentoIdentidad);
    formData.append("tipoDocumento", form.tipoDocumento);
    formData.append("primer_nombre", form.primer_nombre);
    formData.append("segundo_nombre", form.segundo_nombre);
    formData.append("primer_apellido", form.primer_apellido);
    formData.append("segundo_apellido", form.segundo_apellido);
    formData.append("fechaNacimiento", form.fechaNacimiento);
    formData.append("genero", form.genero);
    formData.append("tipo_sangre", form.tipo_sangre);
    formData.append("telefono", form.telefono);
    formData.append("email", form.email);
    formData.append("direccion", form.direccion);
    formData.append("posicion", form.posicion);
    formData.append("numero_camiseta", form.numero_camiseta.toString());

    // Agregar archivos si existen
    if (form.fotoFile) formData.append("fotoFile", form.fotoFile);
    if (form.documentoIdentidadFile)
      formData.append("documentoIdentidadFile", form.documentoIdentidadFile);
    if (form.registroCivilFile)
      formData.append("registroCivilFile", form.registroCivilFile);
    if (form.afiliacionFile)
      formData.append("afiliacionFile", form.afiliacionFile);
    if (form.certificadoEpsFile)
      formData.append("certificadoEpsFile", form.certificadoEpsFile);
    if (form.permisoResponsableFile)
      formData.append("permisoResponsableFile", form.permisoResponsableFile);

    try {
      await Api.post("/deportista", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Deportista registrado correctamente");
      resetForm();
      setPreviewUrl(null);
      setPreviewDocs({
        documentoIdentidad: null,
        registroCivil: null,
        afiliacion: null,
        certificadoEps: null,
        permisoResponsable: null,
      });
    } catch (error) {
      console.error("Error al registrar deportista:", error);
      toast.error("Error al registrar deportista");
    }
  };

  const FileInput = ({
    name,
    label,
    required = false,
    isImage = false,
  }: {
    name: keyof typeof form;
    label: string;
    required?: boolean;
    isImage?: boolean;
  }) => (
    <div className="col-span-2">
      <label htmlFor={name} className="block mb-2 font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type="file"
        name={name}
        accept={isImage ? "image/*" : "application/pdf"}
        onChange={(e) => handleFileChange(e, name, isImage)}
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
      {!isImage && previewDocs[name] && (
        <div className="mt-2 text-sm text-gray-600">
          Archivo seleccionado: {previewDocs[name]}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="bg-white shadow-md rounded-md max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Registrar Deportista
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Foto */}
          <FileInput name="fotoFile" label="Foto:" required isImage />

          {/* Documentos */}
          <FileInput
            name="documentoIdentidadFile"
            label="Documento de Identidad (PDF):"
            required
          />

          <FileInput name="registroCivilFile" label="Registro Civil (PDF):" />

          <FileInput name="afiliacionFile" label="Afiliación (PDF):" />

          <FileInput name="certificadoEpsFile" label="Certificado EPS (PDF):" />

          <FileInput
            name="permisoResponsableFile"
            label="Permiso del Responsable (PDF):"
          />

          <div>
            <Label htmlFor="tipoDocumento" className="block mb-2 font-semibold">
              Tipo de Documento:
            </Label>
            <select
              id="tipoDocumento"
              name="tipoDocumento"
              required
              className="border p-2 rounded"
              value={form.tipoDocumento}
              onChange={handleChange}
            >
              <option value="">Tipo de Documento</option>
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
            <input
              id="documentoIdentidad"
              type="text"
              name="documentoIdentidad"
              placeholder="Número de Documento"
              required
              className="border border-gray-300 p-2 rounded w-full"
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
              className="border p-2 rounded"
              value={form.fechaNacimiento}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="primer_nombre" className="block mb-2 font-semibold">
              Primer Nombre:
            </label>
            <input
              id="primer_nombre"
              type="text"
              name="primer_nombre"
              placeholder="Primer Nombre"
              required
              className="border border-gray-300 p-2 rounded w-full"
              value={form.primer_nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="segundo_nombre"
              className="block mb-2 font-semibold"
            >
              Segundo Nombre:
            </label>
            <input
              id="segundo_nombre"
              type="text"
              name="segundo_nombre"
              placeholder="Segundo Nombre"
              required
              className="border border-gray-300 p-2 rounded w-full"
              value={form.segundo_nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="primer_apellido"
              className="block mb-2 font-semibold"
            >
              Primer Apellido:
            </label>
            <input
              id="primer_apellido"
              type="text"
              name="primer_apellido"
              placeholder="Primer Apellido"
              required
              className="border border-gray-300 p-2 rounded w-full"
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
            <input
              id="segundo_apellido"
              type="text"
              name="segundo_apellido"
              placeholder="Segundo Apellido"
              required
              className="border border-gray-300 p-2 rounded w-full"
              value={form.segundo_apellido}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block mb-2 font-semibold">
              Telefono:
            </label>
            <input
              id="telefono"
              type="text"
              name="telefono"
              placeholder="Telefono"
              required
              value={form.telefono}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
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
              className="border p-2 rounded"
              value={form.posicion}
              onChange={handleChange}
            >
              <option value="">Seleccione posición</option>
              <option value="armador">armador</option>
              <option value="central">central</option>
              <option value="punta">punta</option>
              <option value="libero">libero</option>
              <option value="opuesto">opuesto</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="numero_camiseta"
              className="block mb-2 font-semibold"
            >
              Número de Camiseta:
            </label>
            <input
              id="numero_camiseta"
              type="number"
              name="numero_camiseta"
              placeholder="Número de Camiseta"
              required
              value={form.numero_camiseta || ""}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="direccion" className="block mb-2 font-semibold">
              Direccion:
            </label>
            <input
              id="direccion"
              type="text"
              name="direccion"
              placeholder="Direccion"
              required
              value={form.direccion}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>

          <div>
            <Label htmlFor="genero" className="block mb-2 font-semibold">
              Genero:
            </Label>
            <select
              id="genero"
              name="genero"
              required
              className="border p-2 rounded"
              value={form.genero}
              onChange={handleChange}
            >
              <option value="">Seleccione genero</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
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
              className="border p-2 rounded"
              value={form.tipo_sangre}
              onChange={handleChange}
            >
              <option value="">Seleccione tipo de sangre</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-semibold">
              Correo Electrónico:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              required
              className="border border-gray-300 p-2 rounded w-full"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center mt-6">
            <Button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegDeportista;
