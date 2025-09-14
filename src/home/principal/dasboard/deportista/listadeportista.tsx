import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Api } from "@/config/axios_base.config";
import { Deportista } from "@/interface/deportista/deportista.interface";
import { useClubStore } from "@/store/club/club";
import { useDeportistaStore } from "@/store/deportista/deportista";
import { useTransferenciaStore } from "@/store/transferencia/transferencia";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function ListaDeportista() {
  const { deportistas, ConsultarDeportista, eliminar_deportista } =
    useDeportistaStore();
  const { crear_transferencia } = useTransferenciaStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const { club, ConsultarClub } = useClubStore();
  const [showClubModal, setShowClubModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedDeportista, setSelectedDeportista] =
    useState<Deportista | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<number>(0);
  const [clubOrigenId, setClubOrigenId] = useState<number>(0);
  const [fechaIngreso, setFechaIngreso] = useState<string>("");
  const [fechaTransferencia, setFechaTransferencia] = useState<string>("");
  const [motivo, setMotivo] = useState<string>("");

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 10 items por página

  const handleOpenClubModal = async (deportista: Deportista) => {
    await ConsultarClub();
    setSelectedDeportista(deportista);
    setShowClubModal(true);
  };

  const handleOpenTransferModal = async (deportista: Deportista) => {
    await ConsultarClub();
    setSelectedDeportista(deportista);
    setShowTransferModal(true);
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await ConsultarDeportista();
        setCurrentPage(1); // Resetear a la primera página cuando se cargan nuevos datos
      } catch (err) {
        setError(
          "No se pudieron cargar los usuarios. Verifica tu conexión o permisos."
        );
        console.error("Error al cargar usuarios:", err);
      }
    };
    loadUsers();
  }, [ConsultarDeportista]);

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = deportistas.filter(
    (deportista) =>
      deportista.primer_apellido
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      deportista.documentoIdentidad
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  //eliminar deportista
  const handleEliminarDeportista = async (id: number, nombre: string) => {
    try {
      await eliminar_deportista(id);
      toast.success(`Deportista ${nombre} eliminado correctamente`);
    } catch (error) {
      console.error("Error al eliminar deportista:", error);
      toast.error(
        "Error al eliminar deportista. Por favor, inténtalo de nuevo."
      );
    }
  };

  const handleAddToClub = async () => {
    if (!selectedDeportista || !selectedClubId) return;
    try {
      const response = await Api.post(`/club/${selectedClubId}/deportistas`, {
        id_deportista: selectedDeportista.id,
        fecha_ingreso: fechaIngreso || new Date().toISOString().split("T")[0],
      });

      console.log("Deportista agregado al club:", response.data);
      setShowClubModal(false);
      setSelectedClubId(0);
      setFechaIngreso("");
      toast.success("deportista agregado al club ", response.data);
    } catch (error) {
      console.error("Error al agregar deportista al club:", error);
      toast.error(
        "Error al agregar deportista al club. Verifica la consola para más detalles."
      );
    }
  };

  const handleCreateTransfer = async () => {
    if (!selectedDeportista || !clubOrigenId || !selectedClubId) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    if (clubOrigenId === selectedClubId) {
      toast.error("El club de origen y destino no pueden ser el mismo");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (fechaTransferencia && fechaTransferencia > today) {
      toast.error("La fecha de transferencia no puede ser futura");
      return;
    }
    try {
      await crear_transferencia({
        deportista: {
          id: selectedDeportista.id,
          primer_nombre: selectedDeportista.primer_nombre,
          primer_apellido: selectedDeportista.primer_apellido,
        },
        clubOrigen: {
          id: clubOrigenId,
          nombre: club.find((c) => c.id === clubOrigenId)?.nombre || "",
        },
        clubDestino: {
          id: selectedClubId,
          nombre: club.find((c) => c.id === selectedClubId)?.nombre || "",
        },
        fechaTransferencia:
          fechaTransferencia || new Date().toISOString().split("T")[0],
        motivo: motivo,
        estado: "pendiente", // Estado inicial de la transferencia
        usuarioRegistra: {
          id: 1, // Aquí deberías obtener el ID del usuario logueado
          username: "admin", // Aquí deberías obtener el username del usuario logueado
        },
      });

      toast.success("Transferencia creada exitosamente!");
      setShowTransferModal(false);
      resetTransferForm();
    } catch (error) {
      console.error("Error al crear transferencia:", error);
      toast.error(
        "Error al crear transferencia. Verifica la consola para más detalles."
      );
    }
  };

  const resetTransferForm = () => {
    setClubOrigenId(0);
    setSelectedClubId(0);
    setFechaTransferencia("");
    setMotivo("");
  };

  const handleExportExcel = () => {
    // Preparar los datos para exportar con nombres de propiedades consistentes
    const dataToExport = filteredUsers.map((deportista) => ({
      ID: deportista.id,
      Tipo_Documento: deportista.tipoDocumento,
      N_Identificacion: deportista.documentoIdentidad,
      Primer_Nombre: deportista.primer_nombre,
      Segundo_Nombre: deportista.segundo_nombre || "", // Manejar valores undefined
      Primer_Apellido: deportista.primer_apellido,
      Segundo_Apellido: deportista.segundo_apellido || "", // Manejar valores undefined
      Fecha_Nacimiento: deportista.fechaNacimiento,
      Genero: deportista.genero,
      Telefono: deportista.telefono,
      Direccion: deportista.direccion, // Sin tilde para consistencia
      Email: deportista.email,
    }));

    // Crear hoja de trabajo con encabezados explícitos
    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: [
        "ID",
        "Tipo_Documento",
        "N_Identificacion",
        "Primer_Nombre",
        "Segundo_Nombre",
        "Primer_Apellido",
        "Segundo_Apellido",
        "Fecha_Nacimiento",
        "Genero",
        "Telefono",
        "Direccion",
        "Email",
      ],
      skipHeader: false, // Esto asegura que los encabezados se escriban correctamente
    });

    // Ajustar anchos de columna
    ws["!cols"] = [
      { width: 8 }, // ID
      { width: 20 }, // Tipo Documento
      { width: 16 }, // N Identificación
      { width: 12 }, // Primer Nombre
      { width: 12 }, // Segundo Nombre
      { width: 12 }, // Primer Apellido
      { width: 12 }, // Segundo Apellido
      { width: 12 }, // Fecha Nacimiento
      { width: 10 }, // Género
      { width: 12 }, // Teléfono
      { width: 20 }, // Dirección
      { width: 25 }, // Email
    ];

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deportistas");

    // Exportar archivo
    XLSX.writeFile(
      wb,
      `Deportistas_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const headers = [
    "ID",
    "Foto",
    "Tipo_Documento",
    "N_Identificacion",
    "Primer_Nombre",
    "Segundo_Nombre",
    "Primer_Apellido",
    "Segundo_Apellido",
    "Fecha_Nacimiento",
    "Genero",
    "Telefono",
    "Direccion",
    "Email",
    "Acciones",
  ];

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-md max-w-full md:max-w-5xl mx-auto overflow-x-hidden">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
        Listado de Deportistas
      </h1>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-stretch sm:items-center mb-4">
        <Input
          type="text"
          placeholder="Buscar por identificacion o apellido"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Resetear a la primera página al buscar
          }}
          className="p-2 border border-gray-300 rounded w-full sm:w-64"
        />
        <Button
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          onClick={handleExportExcel}
        >
          Exportar a Excel
        </Button>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron usuarios
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-4 -mx-2 sm:mx-0">
            <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
              <thead className="bg-gray-200">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((deportista) => (
                  <tr
                    key={deportista.id}
                    className="text-center odd:bg-white even:bg-gray-100"
                  >
                    <td className="border  px-3 py-2">{deportista.id}</td>
                    <td className="border px-3 py-2">
                      <div className="flex justify-center">
                        <Avatar className="h-20 w-20 object-cover border rounded">
                          <AvatarImage
                            src={deportista.foto || "/public/yo.jpg"}
                            alt={`${deportista.primer_nombre} ${deportista.primer_apellido}`}
                          />
                          <AvatarFallback>
                            {deportista.primer_nombre.charAt(0)}
                            {deportista.primer_apellido.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </td>

                    <td className="border  px-3 py-2">
                      {deportista.tipoDocumento}
                    </td>
                    <td className="border  px-3 py-2">
                      {deportista.documentoIdentidad}
                    </td>
                    <td className="border  px-3 py-2">
                      {deportista.primer_nombre}
                    </td>
                    <td className="border  px-3 py-2">
                      {deportista.segundo_nombre}
                    </td>
                    <td className="border  px-3 py-2">
                      {deportista.primer_apellido}
                    </td>
                    <td className="border  px-3 py-2">
                      {deportista.segundo_apellido}
                    </td>
                    <td className="border  px-3 py-2">
                      {deportista.fechaNacimiento}
                    </td>
                    <td className="border  px-3 py-2">{deportista.genero}</td>
                    <td className="border  px-3 py-2">{deportista.telefono}</td>
                    <td className="border  px-3 py-2">
                      {deportista.direccion}
                    </td>
                    <td className="border  px-3 py-2">{deportista.email}</td>
                    <td className="border px-3 py-2">
                      <div className="flex flex-col sm:flex-wrap gap-2 justify-center items-stretch sm:items-center">
                        <Link
                          to={`/dashboard/editar-deportista/${deportista.id}`}
                          className="inline-flex items-center px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md text-sm transition-colors"
                        >
                          <span className="mr-1">✏️</span> Editar
                        </Link>
                        <button
                          onClick={() => handleOpenClubModal(deportista)}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-sm transition-colors"
                        >
                          <span className="mr-1">🏅</span> Club
                        </button>
                        <button
                          onClick={() => handleOpenTransferModal(deportista)}
                          className="inline-flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-md text-sm transition-colors"
                        >
                          <span className="mr-1">🔄</span> Transferir
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm transition-colors">
                              <span className="mr-1">🗑️</span> Eliminar
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Seguro que quieres eliminar a{" "}
                                {deportista.primer_nombre}{" "}
                                {deportista.primer_apellido}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer y eliminará
                                permanentemente al deportista.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleEliminarDeportista(
                                    deportista.id,
                                    `${deportista.primer_nombre} ${deportista.primer_apellido}`
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Sí, eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Componente de paginación */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Mostrando {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredUsers.length)} de{" "}
              {filteredUsers.length} deportistas
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-1">
              <Button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded disabled:opacity-50 bg-green-700 text-white hover:bg-green-800"
                size="sm"
              >
                Anterior
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <Button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded ${
                      currentPage === number
                        ? "bg-green-600 text-white hover:bg-green-800"
                        : "bg-green-300 text-white hover:bg-green-800"
                    }`}
                    size="sm"
                  >
                    {number}
                  </Button>
                )
              )}

              <Button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded disabled:opacity-50 bg-green-700 text-white hover:bg-green-800"
                size="sm"
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      {showClubModal && selectedDeportista && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Asignar {selectedDeportista.primer_nombre}{" "}
              {selectedDeportista.primer_apellido} a un Club
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar Club
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(Number(e.target.value))}
              >
                <option value={0}>Seleccione un club</option>
                {club.map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.nombre} ({cl.categoria} - {cl.rama})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Ingreso (opcional)
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={fechaIngreso}
                onChange={(e) => setFechaIngreso(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowClubModal(false);
                  setSelectedClubId(0);
                  setFechaIngreso("");
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddToClub}
                disabled={!selectedClubId}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Asignar
              </Button>
            </div>
          </div>
        </div>
      )}

      {showTransferModal && selectedDeportista && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Transferir {selectedDeportista.primer_nombre}{" "}
              {selectedDeportista.primer_apellido}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Club de Origen
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={clubOrigenId}
                onChange={(e) => setClubOrigenId(Number(e.target.value))}
              >
                <option value={0}>Seleccione club de origen</option>
                {club.map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.nombre} ({cl.categoria} - {cl.rama})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Club de Destino
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(Number(e.target.value))}
              >
                <option value={0}>Seleccione club de destino</option>
                {club.map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.nombre} ({cl.categoria} - {cl.rama})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Transferencia
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={fechaTransferencia}
                onChange={(e) => setFechaTransferencia(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTransferModal(false);
                  setClubOrigenId(0);
                  setSelectedClubId(0);
                  setFechaTransferencia("");
                  setMotivo("");
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateTransfer}
                disabled={!clubOrigenId || !selectedClubId}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Solicitar Transferencia
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaDeportista;
