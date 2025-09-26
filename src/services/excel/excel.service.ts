import { Evento } from "@/interface/evento/evento.interface";
import { Partido } from "@/interface/partido/partido.interface";
import * as XLSX from "xlsx";
import { ObtenerResultadoPorPartido } from "@/services/resultado/resultado.service";
import { consultarInscripcionesPorEvento } from "@/services/inscripcion/inscripcion.service";

export class ExcelService {
  // Exportar partidos a Excel - ahora es asíncrono
  static async exportPartidosToExcel(partidos: Partido[], filename: string = 'partidos') {
    // Obtener resultados para todos los partidos finalizados
    const partidosConResultados = await Promise.all(
      partidos.map(async (partido) => {
        if (partido.estado === 'finalizado') {
          try {
            const resultado = await ObtenerResultadoPorPartido(partido.id);
            return {
              ...partido,
              resultado: resultado // Agregar el resultado al partido
            };
          } catch (error) {
            console.warn(`No se pudo obtener resultado para partido ${partido.id}:`, error);
            return partido; // Mantener el partido sin cambios si hay error
          }
        }
        return partido;
      })
    );

    // DEBUG: Verificar estructura de datos después de obtener resultados
    console.log('=== DEBUG PARTIDOS CON RESULTADOS ===');
    partidosConResultados.forEach((partido, index) => {
      console.log(`Partido ${index + 1}:`, {
        id: partido.id,
        estado: partido.estado,
        clubLocal: partido.clubLocal?.nombre,
        clubVisitante: partido.clubVisitante?.nombre,
        tieneResultado: !!partido.resultado,
        resultado: partido.resultado
      });
    });
    console.log('=== FIN DEBUG ===');

    // Preparar datos para Excel
    const data = partidosConResultados.map(partido => {
      // Inicializar valores por defecto
      let setsLocal = 'N/A';
      let setsVisitante = 'N/A';
      let ganador = 'N/A';

      // Si existe resultado, usar los datos reales
      if (partido.resultado) {
        setsLocal = partido.resultado.setsLocal?.toString() || '0';
        setsVisitante = partido.resultado.setsVisitante?.toString() || '0';

        // Calcular ganador
        const localSets = parseInt(setsLocal);
        const visitanteSets = parseInt(setsVisitante);

        if (localSets > visitanteSets) {
          ganador = partido.clubLocal?.nombre || 'Equipo Local';
        } else if (visitanteSets > localSets) {
          ganador = partido.clubVisitante?.nombre || 'Equipo Visitante';
        } else if (localSets === visitanteSets && localSets > 0) {
          ganador = 'Empate';
        }
      }

      return {
        'ID': partido.id,
        'Evento': partido.evento?.nombre || 'Sin evento',
        'Fecha y Hora': partido.fechaHora
          ? new Date(partido.fechaHora).toLocaleString('es-ES')
          : 'N/A',
        'Ubicación': partido.ubicacion || 'N/A',
        'Estado': this.formatEstado(partido.estado),
        'Club Local': partido.clubLocal?.nombre || 'N/A',
        'Club Visitante': partido.clubVisitante?.nombre || 'N/A',
        'Motivo Cancelación': partido.motivoCancelacion || 'N/A',
        'Sets Local': setsLocal,
        'Sets Visitante': setsVisitante,
        'Ganador': ganador
      };
    });

    this.exportToExcel(data, filename);
  }


  // Exportar eventos a Excel - ahora es asíncrono
  static async exportEventosToExcel(eventos: Evento[], filename: string = 'eventos') {
    // Obtener inscripciones para todos los eventos
    const eventosConInscripciones = await Promise.all(
      eventos.map(async (evento) => {
        try {
          // Obtener inscripciones aprobadas para este evento
          const response = await consultarInscripcionesPorEvento(evento.id, 'aprobada');
          const inscripciones = response.data || [];

          // Extraer nombres de clubes
          const nombresClubes = inscripciones.map((inscripcion: any) =>
            inscripcion.club?.nombre || 'Club no disponible'
          );

          // Contar total de clubes inscritos
          const totalClubes = inscripciones.length;

          return {
            ...evento,
            nombresClubes, // Array con nombres de clubes
            totalClubes   // Total de clubes inscritos
          };
        } catch (error) {
          console.warn(`No se pudieron obtener inscripciones para evento ${evento.id}:`, error);
          return {
            ...evento,
            nombresClubes: [], // Array vacío en caso de error
            totalClubes: 0
          };
        }
      })
    );

    // DEBUG: Verificar estructura de datos
    console.log('=== DEBUG EVENTOS CON INSCRIPCIONES ===');
    eventosConInscripciones.forEach((evento, index) => {
      console.log(`Evento ${index + 1}:`, {
        id: evento.id,
        nombre: evento.nombre,
        totalClubes: evento.totalClubes,
        nombresClubes: evento.nombresClubes
      });
    });
    console.log('=== FIN DEBUG ===');

    // Preparar datos para Excel
    const data = eventosConInscripciones.map(evento => ({
      'ID': evento.id,
      'Nombre': evento.nombre,
      'Descripción': evento.descripcion || 'N/A',
      'Fecha Inicio': new Date(evento.fechaInicio).toLocaleDateString('es-ES'),
      'Fecha Fin': new Date(evento.fechaFin).toLocaleDateString('es-ES'),
      'Tipo': this.formatTipoEvento(evento.tipo),
      'Ubicación': evento.ubicacion || 'N/A',
      'Estado': this.formatEstadoEvento(evento.estado),
      'Organizador': evento.organizador?.username || 'N/A',
      'Total Clubes Inscritos': evento.totalClubes || 0,
      'Clubes Inscritos': evento.nombresClubes?.join(', ') || 'Ninguno',
    }));

    this.exportToExcel(data, filename);
  }

  // Función genérica para exportar a Excel
  private static exportToExcel(data: any[], filename: string) {
    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Ajustar anchos de columna para mejor visualización
    if (!Array.isArray(ws['!cols'])) {
      ws['!cols'] = [];
    }

    const columnWidths = [
      { width: 8 },  // ID
      { width: 25 }, // Nombre
      { width: 30 }, // Descripción
      { width: 12 }, // Fecha Inicio
      { width: 12 }, // Fecha Fin
      { width: 15 }, // Tipo
      { width: 20 }, // Ubicación
      { width: 12 }, // Estado
      { width: 15 }, // Organizador
      { width: 10 }, // Total Clubes
      { width: 40 }, // Clubes Inscritos (más ancho para lista)
    ];

    ws['!cols'] = columnWidths;

    // Añadir worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Eventos');

    // Descargar archivo
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  // Formatear estados de partidos
  private static formatEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'programado': 'Programado',
      'en_juego': 'En Juego',
      'finalizado': 'Finalizado',
      'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
  }

  // Formatear estados de eventos
  private static formatEstadoEvento(estado: string): string {
    const estados: { [key: string]: string } = {
      'planificado': 'Planificado',
      'en_curso': 'En Curso',
      'finalizado': 'Finalizado',
      'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
  }

  private static formatTipoEvento(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'torneo': 'Torneo',
      'amistoso': 'Amistoso',
      'clasificatorio': 'Clasificatorio',
      'championship': 'Championship'
    };
    return tipos[tipo] || tipo;
  }
}