import React, { useState, useMemo, useEffect } from "react";
import EventoCard from "./eventocard";

interface EventosListProps {
  eventos: any[];
  onEdit?: (id: number) => void;
  onInscribir?: (id: number) => void;
  onCancelar?: (id: number) => void;
  onCambiarEstado?: (id: number) => void;
}

const ITEMS_PER_PAGE = 3;

const EventosList: React.FC<EventosListProps> = ({
  eventos,
  onEdit,
  onInscribir,
  onCancelar,
  onCambiarEstado,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Resetear a página 1 cuando cambian los eventos
  useEffect(() => {
    setCurrentPage(1);
  }, [eventos]);

  // Calcular eventos paginados
  const eventosPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return eventos.slice(startIndex, endIndex);
  }, [eventos, currentPage]);

  // Calcular total de páginas
  const totalPaginas = Math.ceil(eventos.length / ITEMS_PER_PAGE);

  // Cambiar página
  const cambiarPagina = (nuevaPagina: number) => {
    setCurrentPage(nuevaPagina);
  };

  // Componente de paginación
  const Paginacion = () => {
    if (totalPaginas <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => cambiarPagina(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded text-sm font-medium ${
            currentPage === 1
              ? "bg-green-600 text-white hover:bg-green-800"
              : "bg-green-500 text-white hover:bg-green-800"
          }`}
        >
          Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPaginas}
        </span>

        <button
          onClick={() => cambiarPagina(currentPage + 1)}
          disabled={currentPage === totalPaginas}
          className={`px-4 py-2 rounded text-sm font-medium ${
            currentPage === totalPaginas
              ? "bg-green-600 text-white hover:bg-green-800"
              : "bg-green-500 text-white hover:bg-green-800"
          }`}
        >
          Siguiente
        </button>
      </div>
    );
  };

  if (eventos.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No hay eventos en esta categoría.
      </p>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {eventosPaginados.map((evento) => (
          <EventoCard
            key={evento.id}
            evento={evento}
            onEdit={onEdit ? () => onEdit(evento.id) : undefined}
            onInscribir={onInscribir ? () => onInscribir(evento.id) : undefined}
            onCancelar={onCancelar ? () => onCancelar(evento.id) : undefined}
            onCambiarEstado={
              onCambiarEstado ? () => onCambiarEstado(evento.id) : undefined
            }
          />
        ))}
      </div>

      <Paginacion />
    </div>
  );
};

export default EventosList;
