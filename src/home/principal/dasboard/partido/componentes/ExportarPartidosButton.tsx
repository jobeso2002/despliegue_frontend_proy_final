import { Partido } from "@/interface/partido/partido.interface";
import { ExcelService } from "@/services/excel/excel.service";
import React, { useState } from "react";
import { toast } from "sonner";

interface ExportarPartidosButtonProps {
  partidos: Partido[];
  tipoExportacion?:
    | "todos"
    | "programados"
    | "finalizados"
    | "en_juego"
    | "cancelados"
    | "completo"; // Nuevo tipo
  disabled?: boolean;
  // Nueva prop para obtener todos los partidos (sin filtrar por pestaña)
  todosLosPartidos?: Partido[];
}

export const ExportarPartidosButton: React.FC<ExportarPartidosButtonProps> = ({
  partidos,
  tipoExportacion = "todos",
  disabled = false,
  todosLosPartidos = [], // Prop opcional con todos los partidos
}) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const handleExport = async (tipo: "actual" | "completo") => {
    let partidosAExportar: Partido[] = [];
    let nombreArchivo = "partidos";

    if (tipo === "actual") {
      // Exportar solo los partidos de la pestaña actual (lógica existente)
      partidosAExportar = partidos;
      
      switch (tipoExportacion) {
        case "programados":
          partidosAExportar = partidos.filter((p) => p.estado === "programado");
          nombreArchivo = "partidos_programados";
          break;
        case "finalizados":
          partidosAExportar = partidos.filter((p) => p.estado === "finalizado");
          nombreArchivo = "partidos_finalizados";
          break;
        case "en_juego":
          partidosAExportar = partidos.filter((p) => p.estado === "en_juego");
          nombreArchivo = "partidos_en_juego";
          break;
        case "cancelados":
          partidosAExportar = partidos.filter((p) => p.estado === "cancelado");
          nombreArchivo = "partidos_cancelados";
          break;
        default:
          nombreArchivo = "todos_los_partidos";
      }
    } else {
      // Exportar todos los partidos (nueva funcionalidad)
      partidosAExportar = todosLosPartidos.length > 0 ? todosLosPartidos : partidos;
      nombreArchivo = "partidos_completos";
    }

    if (partidosAExportar.length === 0) {
      toast.error("No hay partidos para exportar");
      return;
    }

    try {
      await ExcelService.exportPartidosToExcel(partidosAExportar, nombreArchivo);
      setMostrarOpciones(false);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al exportar partidos");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarOpciones(!mostrarOpciones)}
        disabled={disabled || (partidos.length === 0 && todosLosPartidos.length === 0)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Exportar a Excel"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Exportar Excel
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {mostrarOpciones && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button
            onClick={() => handleExport("actual")}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 border-b"
          >
            Exportar {tipoExportacion.replace('_', ' ')}
          </button>
          <button
            onClick={() => handleExport("completo")}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Exportar Todo (Completo)
          </button>
        </div>
      )}
    </div>
  );
};