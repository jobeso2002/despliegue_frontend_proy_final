import { Input } from "@/components/ui/input";
import { useClubStore } from "@/store/club/club";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

function ListaClub() {
  const { club, ConsultarClub, eliminar_Club } = useClubStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await Promise.all([ConsultarClub()]);
      } catch (err) {
        setError(
          "No se pudieron cargar los clubes. Verifica tu conexión o permisos."
        );
        console.error("Error al cargar clubes:", err);
      }
    };
    loadUsers();
  }, [ConsultarClub]);

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = club.filter(
    (club) =>
      club.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular los clubes para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClubs = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleExportToExcel = () => {
    const dataToExport = filteredUsers.map((club) => ({
      ID: club.id,
      Nombre: club.nombre,
      Fundación: club.fundacion,
      Dirección: club.direccion,
      Teléfono: club.telefono,
      Email: club.email,
      Responsable:
        club.responsable?.username || `ID: ${club.id_usuario_responsable}`,
      Logo: club.logo,
      Categoría: club.categoria,
      Rama: club.rama,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clubes");

    const fileName = `Clubes_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast.success(`Archivo "${fileName}" generado correctamente`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleEliminarClub = async (id: number, nombre: string) => {
    try {
      await eliminar_Club(id);
      toast.success(`Club ${nombre} eliminado correctamente`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error al eliminar club:", error);
      toast.error("Error al eliminar club. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-5xl mx-auto">
      <div className="bg-white shadow-md rounded-md max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}
        <h1 className="text-2xl font-bold mb-6 text-center">Lista de club</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <Input
            type="text"
            placeholder="Buscar por apellido o email"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Resetear a la primera página al buscar
            }}
            className="w-full sm:w-64"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            onClick={handleExportToExcel}
          >
            Exportar a Excel
          </Button>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron clubes
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "id",
                      "logo",
                      "nombre",
                      "fundacion",
                      "direccion",
                      "telefono",
                      "categoria",
                      "rama",
                      "email",
                      "usuario_responsable",
                      "acciones",
                    ].map((header) => (
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
                  {currentClubs.map((club) => (
                    <tr
                      key={club.id}
                      className="text-center odd:bg-white even:bg-gray-100"
                    >
                      <td className="border  px-3 py-2">{club.id}</td>
                      {/* Celda del Logo - Mostrar imagen */}
                      <td className="border px-3 py-2">
                        <div className="flex justify-center">
                          <Avatar className="h-14 w-14 sm:h-20 sm:w-20 border rounded">
                            <AvatarImage
                              src={club.logo || "/default-club-logo.png"}
                              alt={`Logo de ${club.nombre}`}
                            />
                            <AvatarFallback>
                              {club.nombre.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </td>

                      <td className="border  px-3 py-2">{club.nombre}</td>
                      <td className="border  px-3 py-2">{club.fundacion}</td>
                      <td className="border  px-3 py-2">{club.direccion}</td>

                      <td className="border  px-3 py-2">{club.telefono}</td>

                      <td className="border  px-3 py-2">{club.categoria}</td>

                      <td className="border  px-8 py-2">{club.rama}</td>

                      <td className="border  px-3 py-2">{club.email}</td>

                      <td className="border  px-3 py-2">
                        {club.responsable?.username ||
                          `ID: ${club.id_usuario_responsable}`}
                      </td>
                      <td className="border  px-3 py-2 text-right text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link
                            to={`/dashboard/editar-club/${club.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar✏️
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm transition-colors">
                                <span>🗑️</span> Eliminar
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Seguro que quieres eliminar a {club.nombre}?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer y eliminará
                                  permanentemente al club.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleEliminarClub(club.id, club.nombre)
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

            {/* Controles de paginación */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-600">
                Mostrando {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredUsers.length)} de{" "}
                {filteredUsers.length} clubes
              </div>
              <div className="flex flex-wrap gap-1">
                <Button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded disabled:opacity-50 bg-green-700 text-white hover:bg-green-800"
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
                    >
                      {number}
                    </Button>
                  )
                )}

                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded disabled:opacity-50 bg-green-700 text-white hover:bg-green-800"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ListaClub;
