import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authstore";
import { useTransferenciaStore } from "@/store/transferencia/transferencia";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function GestionTransferencias() {
  const user = useAuthStore((state) => state.user);
  const {
    transferencias,
    ConsultarTransferencias,
    aprobar_transferencia,
    rechazar_transferencia,
  } = useTransferenciaStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [showRechazoModal, setShowRechazoModal] = useState(false);
  const [selectedTransferencia, setSelectedTransferencia] = useState<
    number | null
  >(null);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    ConsultarTransferencias();
  }, [ConsultarTransferencias]);

  // Función para obtener nombre seguro del deportista
  const getDeportistaNombre = (deportista: any) => {
    if (!deportista) return "Deportista no disponible";
    return (
      `${deportista.primer_nombre || ""} ${
        deportista.primer_apellido || ""
      }`.trim() || "Nombre no disponible"
    );
  };

  // Función para obtener nombre seguro del club
  const getClubNombre = (club: any) => {
    if (!club) return "Club no disponible";
    return club.nombre || "Nombre no disponible";
  };

  const filteredTransferencias = transferencias.filter(
    (t) =>
      t.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toString().includes(searchTerm) ||
      getDeportistaNombre(t.deportista)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getClubNombre(t.clubOrigen)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getClubNombre(t.clubDestino)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Calcular las transferencias para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransferencias = filteredTransferencias.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransferencias.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAprobar = async (id: number) => {
    try {
      if (!user) throw new Error("Usuario no autenticado");
      await aprobar_transferencia(id, user.id);
      toast.success("Transferencia aprobada exitosamente");
    } catch (error: any) {
      console.error("Error al aprobar:", error);
      toast.error(error.message || "Error al aprobar transferencia");
    }
  };

  const handleRechazar = async () => {
    if (!selectedTransferencia || !user) return;

    try {
      await rechazar_transferencia(
        selectedTransferencia,
        user.id,
        motivoRechazo
      );
      setShowRechazoModal(false);
      setMotivoRechazo("");
      toast.success("Transferencia rechazada exitosamente");
    } catch (error: any) {
      console.error("Error al rechazar:", error);
      toast.error(error.message || "Error al rechazar transferencia");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Gestión de Transferencias
      </h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Buscar por ID, estado, deportista o club"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Resetear a la primera página al buscar
          }}
          className="p-2 border border-gray-300 rounded w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Deportista</th>
              <th className="border px-3 py-2">Club Origen</th>
              <th className="border px-3 py-2">Club Destino</th>
              <th className="border px-3 py-2">Motivo</th>
              <th className="border px-3 py-2">Fecha</th>
              <th className="border px-3 py-2">Estado</th>
              <th className="border px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentTransferencias.length > 0 ? (
              currentTransferencias.map((t) => (
                <tr
                  key={t.id}
                  className="text-center odd:bg-white even:bg-gray-100"
                >
                  <td className="border px-3 py-2">{t.id || "N/A"}</td>
                  <td className="border px-3 py-2">
                    {getDeportistaNombre(t.deportista)}
                  </td>
                  <td className="border px-3 py-2">
                    {getClubNombre(t.clubOrigen)}
                  </td>
                  <td className="border px-3 py-2">
                    {getClubNombre(t.clubDestino)}
                  </td>
                  <td className="border px-3 py-2">
                    {t.motivo || "Sin motivo"}
                  </td>
                  <td className="border px-3 py-2">
                    {t.fechaTransferencia
                      ? new Date(t.fechaTransferencia).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        t.estado === "aprobada"
                          ? "bg-green-100 text-green-800"
                          : t.estado === "rechazada"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {t.estado || "pendiente"}
                    </span>
                  </td>
                  <td className="border px-3 py-2">
                    {t.estado === "pendiente" && (
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => handleAprobar(t.id!)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedTransferencia(t.id!);
                            setShowRechazoModal(true);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs"
                        >
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="border px-3 py-4 text-center">
                  {transferencias.length === 0
                    ? "No hay transferencias registradas"
                    : "No se encontraron resultados para la búsqueda"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      {filteredTransferencias.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Mostrando {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredTransferencias.length)} de{" "}
            {filteredTransferencias.length} transferencias
          </div>
          <div className="flex space-x-1">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded disabled:opacity-50"
              variant="outline"
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
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  variant={currentPage === number ? "default" : "outline"}
                >
                  {number}
                </Button>
              )
            )}

            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded disabled:opacity-50"
              variant="outline"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {showRechazoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Motivo de Rechazo</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingrese el motivo del rechazo
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRechazoModal(false);
                  setMotivoRechazo("");
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRechazar}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!motivoRechazo.trim()}
              >
                Confirmar Rechazo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionTransferencias;
