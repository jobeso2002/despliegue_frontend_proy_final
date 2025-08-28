import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useClubStore } from "@/store/club/club";
import { Api } from "@/config/axios_base.config";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface Deportista {
  id: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  documentoIdentidad: string;
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  posicion: string;
  email?: string;
  direccion?: string;
  estado?: string;
  numero_camiseta?: number;
  tipo_sangre?: string;
}

interface ClubDeportistasResponse {
  club: {
    id: number;
    nombre: string;
  };
  deportistas: Deportista[];
}

interface Club {
  id: number;
  nombre: string;
  categoria: string;
  rama: string;
}

function ListarDeportistasPorClub() {
  const { club, ConsultarClub } = useClubStore();
  const [selectedClubId, setSelectedClubId] = useState<number>(0);
  const [selectedRama, setSelectedRama] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
  const [clubNombre, setClubNombre] = useState("");

  // Obtener ramas únicas de los clubes
  const ramas = Array.from(new Set(club.map((c: Club) => c.rama))).sort();

  // Filtrar clubes por rama seleccionada
  const clubesFiltrados = selectedRama
    ? club.filter((c: Club) => c.rama === selectedRama)
    : club;

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await ConsultarClub();
      } catch (err) {
        setError("Error al cargar los clubes. Verifica tu conexión.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [ConsultarClub]);

  // Obtener deportistas del club seleccionado
  const fetchDeportistasDelClub = async (clubId: number) => {
    try {
      setLoading(true);
      const response = await Api.get<ClubDeportistasResponse>(
        `/club/${clubId}/deportistas`
      );

      // Filtrar solo deportistas activos en el frontend si el backend no lo hace
      const deportistasActivos =
        response.data?.deportistas.filter((d: any) => d.estado === "activo") ||
        [];

      setDeportistas(deportistasActivos);
      setClubNombre(response.data?.club?.nombre || "");

      console.log("Datos recibidos:", response.data);
    } catch (error) {
      console.error("Error al obtener deportistas del club:", error);
      setError("Error al cargar deportistas del club");
      setDeportistas([]);
      setClubNombre("");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de selección de rama
  const handleRamaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rama = e.target.value;
    setSelectedRama(rama);
    setSelectedClubId(0); // Resetear selección de club al cambiar rama
    setDeportistas([]);
    setClubNombre("");
  };

  // Manejar cambio de selección de club
  const handleClubChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clubId = Number(e.target.value);
    setSelectedClubId(clubId);

    if (clubId === 0) {
      setDeportistas([]);
      setClubNombre("");
      return;
    }

    await fetchDeportistasDelClub(clubId);
  };

  // Exportar a excel
  const handleExportToExcel = () => {
    if (filteredDeportistas.length === 0) {
      toast.warning("No hay deportistas para exportar", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const dataToExport = filteredDeportistas.map((deportista) => ({
      ID: deportista.id,
      Documento: deportista.documentoIdentidad,
      "Nombre Completo": `${deportista.primer_nombre} ${
        deportista.segundo_nombre || ""
      } ${deportista.primer_apellido} ${
        deportista.segundo_apellido || ""
      }`.trim(),
      "Fecha Nacimiento": deportista.fechaNacimiento,
      Género: deportista.genero,
      Teléfono: deportista.telefono,
      Posición: deportista.posicion,
      "N° Camiseta": deportista.numero_camiseta || "N/A",
      Estado: deportista.estado,
      Email: deportista.email || "N/A",
      Dirección: deportista.direccion || "N/A",
      "Tipo de Sangre": deportista.tipo_sangre || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deportistas");

    const fileName = `Deportistas_${clubNombre.replace(
      /\s+/g,
      "_"
    )}_${new Date().toISOString().slice(0, 10)}.xlsx`;
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

  // Filtrar deportistas basado en el término de búsqueda
  const filteredDeportistas = deportistas.filter((deportista) => {
    const searchText = searchTerm.toLowerCase();
    return (
      deportista.primer_nombre?.toLowerCase().includes(searchText) ||
      deportista.primer_apellido?.toLowerCase().includes(searchText) ||
      deportista.documentoIdentidad?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="p-6 bg-white shadow-md rounded-md max-w-5xl mx-auto">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">
        Deportistas por Club {clubNombre && `- ${clubNombre}`}
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Rama
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedRama}
            onChange={handleRamaChange}
            disabled={loading || club.length === 0}
          >
            <option value="">Todas las ramas</option>
            {ramas.map((rama) => (
              <option key={rama} value={rama}>
                {rama}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar Club
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedClubId}
            onChange={handleClubChange}
            disabled={loading || clubesFiltrados.length === 0}
          >
            <option value={0}>Seleccione un club</option>
            {clubesFiltrados.map((cl: Club) => (
              <option key={cl.id} value={cl.id}>
                {cl.nombre} ({cl.categoria} - {cl.rama})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {clubesFiltrados.length} club(es) encontrado(s)
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar Deportista
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar por nombre, apellido o documento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={selectedClubId === 0 || loading}
              className="flex-1"
            />
            <Button
              onClick={handleExportToExcel}
              disabled={
                selectedClubId === 0 || filteredDeportistas.length === 0
              }
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Exportar Excel
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando...</div>
      ) : selectedClubId === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {selectedRama
            ? `Por favor seleccione un club de ${selectedRama} para ver sus deportistas`
            : "Por favor seleccione una rama y luego un club para ver sus deportistas"}
        </div>
      ) : filteredDeportistas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron deportistas en este club
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "ID",
                  "Documento",
                  "Nombre Completo",
                  "Fecha Nacimiento",
                  "Género",
                  "Teléfono",
                  "Posición",
                  "N° Camiseta",
                  "Estado",
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
              {filteredDeportistas.map((deportista) => (
                <tr
                  key={deportista.id}
                  className="text-center odd:bg-white even:bg-gray-100"
                >
                  <td className="border px-3 py-2">{deportista.id}</td>
                  <td className="border px-3 py-2">
                    {deportista.documentoIdentidad}
                  </td>
                  <td className="border px-3 py-2">
                    {deportista.primer_nombre} {deportista.segundo_nombre}{" "}
                    {deportista.primer_apellido} {deportista.segundo_apellido}
                  </td>
                  <td className="border px-3 py-2">
                    {deportista.fechaNacimiento}
                  </td>
                  <td className="border px-3 py-2">{deportista.genero}</td>
                  <td className="border px-3 py-2">{deportista.telefono}</td>
                  <td className="border px-3 py-2">{deportista.posicion}</td>
                  <td className="border px-3 py-2">
                    {deportista.numero_camiseta}
                  </td>
                  <td className="border px-3 py-2">{deportista.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListarDeportistasPorClub;