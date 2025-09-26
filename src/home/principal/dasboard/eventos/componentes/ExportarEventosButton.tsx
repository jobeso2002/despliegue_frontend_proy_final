import React from "react";
import { Evento } from "@/interface/evento/evento.interface";
import { ExcelService } from "@/services/excel/excel.service";
import { toast } from "sonner";

interface ExportarEventosButtonProps {
  eventos: Evento[];
  tipoExportacion?:
    | "todos"
    | "planificados"
    | "en_curso"
    | "finalizados"
    | "cancelados";
  disabled?: boolean;
}

export const ExportarEventosButton: React.FC<ExportarEventosButtonProps> = ({
  eventos,
  tipoExportacion = "todos",
  disabled = false,
}) => {
  const handleExport = async () => {
    if (eventos.length === 0) {
      alert("No hay eventos para exportar");
      return;
    }

    let eventosFiltrados = eventos;
    let nombreArchivo = "eventos";

    // Filtrar eventos según el tipo de exportación
    switch (tipoExportacion) {
      case "planificados":
        eventosFiltrados = eventos.filter((e) => e.estado === "planificado");
        nombreArchivo = "eventos_planificados";
        break;
      case "en_curso":
        eventosFiltrados = eventos.filter((e) => e.estado === "en_curso");
        nombreArchivo = "eventos_en_curso";
        break;
      case "finalizados":
        eventosFiltrados = eventos.filter((e) => e.estado === "finalizado");
        nombreArchivo = "eventos_finalizados";
        break;
      case "cancelados":
        eventosFiltrados = eventos.filter((e) => e.estado === "cancelado");
        nombreArchivo = "eventos_cancelados";
        break;
      default:
        nombreArchivo = "todos_los_eventos";
    }

    try {
      await ExcelService.exportEventosToExcel(eventosFiltrados, nombreArchivo);
    } catch (error) {
      console.error("Error al exportar eventos:", error);
      toast.error("Error al exportar eventos. Por favor, intente nuevamente.");
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || eventos.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      title="Exportar eventos a Excel con información de clubes inscritos"
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
      Exportar Eventos Excel
    </button>
  );
};
