import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/usuario/user";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ListaUsuarios() {
  const { persona, consultarUsuario, eliminarUsuario } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        await consultarUsuario();
      } catch (err) {
        setError(
          "No se pudieron cargar los usuarios. Verifica tu conexión o permisos."
        );
        console.error("Error al cargar usuarios:", err);
      }
    };
    loadUsers();
  }, [consultarUsuario]);

  const handleEliminar = async (id: number, username: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${username}?`)) {
      try {
        await eliminarUsuario(id);
      } catch (err) {
        setError("No se pudo eliminar el usuario. Intente nuevamente.");
        console.error("Error al eliminar usuario:", err);
      }
    }
  };

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = persona.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular los usuarios para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-4">
      <div className="w-full max-w-3xl md:max-w-5xl bg-white shadow-md rounded-md p-4 md:p-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
          Listado de Usuarios
        </h1>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
            <Link to="/dashboard/crear-usuario">Crear Nuevo Usuario</Link>
          </Button>

          {/* Input para filtrar */}
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Resetear a la primera página al buscar
            }}
            className="p-2 border border-gray-300 rounded w-full md:w-64"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron usuarios
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    {["ID", "UserName", "Correo", "Rol", "Acciones"].map(
                      (header) => (
                        <th
                          key={header}
                          className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="text-center odd:bg-white even:bg-gray-100"
                    >
                      <td className="border  px-3 py-2">{user.id}</td>
                      <td className="border  px-3 py-2">{user.username}</td>
                      <td className="border  px-3 py-2">{user.email}</td>
                      <td className="border  px-3 py-2">
                        {user.role?.name || "Sin rol"}
                      </td>
                      <td className="border  px-3 py-2  text-right text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          <Link
                            to={`/dashboard/editar-usuario/${user.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar✏️
                          </Link>
                          <button
                            onClick={() =>
                              handleEliminar(user.id, user.username)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de paginación */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-3">
              <div className="text-sm text-gray-600 text-center md:text-left">
                Mostrando {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, filteredUsers.length)} de{" "}
                {filteredUsers.length} usuarios
              </div>
              <div className="flex justify-center md:justify-end space-x-1">
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

export default ListaUsuarios;
