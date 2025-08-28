// src/app/eventos/componentes/eventolist.tsx
import React from "react";
import EventoCard from "./eventocard";

interface EventosListProps {
  eventos: any[];
  onEdit?: (id: number) => void;
  onInscribir?: (id: number) => void;
  onCancelar?: (id: number) => void;
  onCambiarEstado?: (id: number) => void;
}

const EventosList: React.FC<EventosListProps> = ({
  eventos,
  onEdit,
  onInscribir,
  onCancelar,
  onCambiarEstado,
}) => {
  if (eventos.length === 0) {
    return <p className="text-gray-500">No hay eventos en esta categoría.</p>;
  }

  return (
    <div className="space-y-4">
      {eventos.map((evento) => (
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
  );
};

export default EventosList;
