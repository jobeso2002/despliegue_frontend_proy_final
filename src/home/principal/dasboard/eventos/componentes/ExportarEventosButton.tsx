import React, { useState } from "react";
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
    | "cancelados"
    | "completo";
  disabled?: boolean;
  todosLosEventos?: Evento[];
}

export const ExportarEventosButton: React.FC<ExportarEventosButtonProps> = ({
  eventos,
  tipoExportacion = "todos",
  disabled = false,
  todosLosEventos = [],
}) => {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const handleExport = async (tipo: "actual" | "completo") => {
    let eventosAExportar: Evento[] = [];
    let nombreArchivo = "eventos";

    if (tipo === "actual") {
      // Lógica existente
      eventosAExportar = eventos;
      
      switch (tipoExportacion) {
        case "planificados":
          eventosAExportar = eventos.filter((e) => e.estado === "planificado");
          nombreArchivo = "eventos_planificados";
          break;
        case "en_curso":
          eventosAExportar = eventos.filter((e) => e.estado === "en_curso");
          nombreArchivo = "eventos_en_curso";
          break;
        case "finalizados":
          eventosAExportar = eventos.filter((e) => e.estado === "finalizado");
          nombreArchivo = "eventos_finalizados";
          break;
        case "cancelados":
          eventosAExportar = eventos.filter((e) => e.estado === "cancelado");
          nombreArchivo = "eventos_cancelados";
          break;
        default:
          nombreArchivo = "todos_los_eventos";
      }
    } else {
      // Nueva funcionalidad - exportar todo
      eventosAExportar = todosLosEventos.length > 0 ? todosLosEventos : eventos;
      nombreArchivo = "eventos_completos";
    }

    if (eventosAExportar.length === 0) {
      toast.error("No hay eventos para exportar");
      return;
    }

    try {
      await ExcelService.exportEventosToExcel(eventosAExportar, nombreArchivo);
      setMostrarOpciones(false);
    } catch (error) {
      console.error("Error al exportar eventos:", error);
      toast.error("Error al exportar eventos");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setMostrarOpciones(!mostrarOpciones)}
        disabled={disabled || (eventos.length === 0 && todosLosEventos.length === 0)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        title="Exportar eventos a Excel"
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