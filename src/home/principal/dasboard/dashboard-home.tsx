import { useClubStore } from "@/store/club/club";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function DashboardHome() {
  const { club, ConsultarClub } = useClubStore();

  // Cargar los clubes al montar el componente
  useEffect(() => {
    ConsultarClub();
  }, [ConsultarClub]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bienvenido a SIGA-LVC Admin
        </h1>
        <p className="text-gray-600 mb-8">
          Plataforma para la gestión administrativa de la liga de voleibol del
          Cesar.
        </p>
        <p className="text-gray-600 mb-8">
          Utilice el menú de navegación para administrar clubes, programar
          partidos, registrar resultados y más.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clubes Registrados */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-700 mb-2">
              Club Registrados
            </h3>
            <p className="text-3xl font-bold text-blue-600 mb-4">
              {club.length}
            </p>
            <button className="text-blue-500 hover:text-blue-700 font-medium">
              <Link to="/dashboard/listaclub">Ver clubes</Link>
            </button>
          </div>

          {/* Gestionar Clubes */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-700 mb-2">
              Gestionar Clubes
            </h3>
            <p className="text-gray-600 mb-4">Registrar y actualizar clubes.</p>
            <button className="flex items-center text-blue-500 hover:text-blue-700 font-medium">
              <Link to="/dashboard/club">
                Ir ahora <span className="ml-1">→</span>
              </Link>
            </button>
          </div>

          {/* Programar Partidos */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-700 mb-2">
              Programar Partidos
            </h3>
            <p className="text-gray-600 mb-4">Crear y administrar.</p>
            <button className="flex items-center text-blue-500 hover:text-blue-700 font-medium">
              <Link to="/dashboard/partidos">
                Ir ahora <span className="ml-1">→</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
