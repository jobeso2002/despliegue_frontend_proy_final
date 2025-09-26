import { Partido } from "@/interface/partido/partido.interface";
import { ExcelService } from "@/services/excel/excel.service";
import React from "react";
import { toast } from "sonner";

interface ExportarPartidosButtonProps {
  partidos: Partido[];
  tipoExportacion?:
    | "todos"
    | "programados"
    | "finalizados"
    | "en_juego"
    | "cancelados";
  disabled?: boolean;
}

export const ExportarPartidosButton: React.FC<ExportarPartidosButtonProps> = ({
  partidos,
  tipoExportacion = "todos",
  disabled = false,
}) => {
  const handleExport = async () => {
    if (partidos.length === 0) {
      alert("No hay partidos para exportar");
      return;
    }

    let partidosFiltrados = partidos;
    let nombreArchivo = "partidos";

    // Filtrar partidos según el tipo de exportación
    switch (tipoExportacion) {
      case "programados":
        partidosFiltrados = partidos.filter((p) => p.estado === "programado");
        nombreArchivo = "partidos_programados";
        break;
      case "finalizados":
        partidosFiltrados = partidos.filter((p) => p.estado === "finalizado");
        nombreArchivo = "partidos_finalizados";
        break;
      case "en_juego":
        partidosFiltrados = partidos.filter((p) => p.estado === "en_juego");
        nombreArchivo = "partidos_en_juego";
        break;
      case "cancelados":
        partidosFiltrados = partidos.filter((p) => p.estado === "cancelado");
        nombreArchivo = "partidos_cancelados";
        break;
      default:
        nombreArchivo = "todos_los_partidos";
    }
    try {
      await ExcelService.exportPartidosToExcel(
        partidosFiltrados,
        nombreArchivo
      );
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("no hay partidos para exportar");
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || partidos.length === 0}
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
    </button>
  );
};
