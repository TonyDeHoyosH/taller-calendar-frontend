'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { citasApi } from '@/lib/api/citas';
import esLocale from '@fullcalendar/core/locales/es';
import CitaDetalleModal from './CitaDetalleModal';

export default function CalendarView() {
  const [selectedCitaId, setSelectedCitaId] = useState<string | null>(null);
  
  const { data: citas = [], isLoading } = useQuery({
    queryKey: ['citas-todas'],
    queryFn: citasApi.getCitas,
  });

  const getEventColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return '#f59e0b'; // yellow-500
      case 'aceptada': return '#3b82f6';  // blue-500
      case 'en_curso': return '#a855f7';  // purple-500
      case 'completada': return '#10b981'; // green-500
      case 'cancelada': return '#ef4444';  // red-500
      default: return '#9ca3af';          // gray-400
    }
  };

  const events = citas.map(cita => ({
    id: cita.id.toString(),
    title: `${cita.vehiculo_modelo} - ${cita.usuario?.nombre || 'S/N'}`,
    date: cita.fecha_preferida,
    backgroundColor: getEventColor(cita.estado),
    borderColor: 'transparent',
    extendedProps: {
      descripcion: cita.descripcion,
      estado: cita.estado
    }
  }));

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-3xl h-[600px] w-full"></div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative">
      <style>{`
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6; }
        .fc-theme-standard .fc-scrollgrid { border-color: #f3f4f6; border-radius: 12px; overflow: hidden; }
        .fc-day-today { background-color: #f8fafc !important; }
        .fc-event { border-radius: 8px; padding: 4px 8px; border: none; font-weight: 600; cursor: pointer; margin: 2px 0; font-size: 0.75rem; }
        .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 700 !important; color: #111827; text-transform: capitalize; }
        .fc-button-primary { background-color: #111827 !important; border-color: #111827 !important; text-transform: capitalize; border-radius: 10px !important; font-weight: 500; }
        .fc-button-primary:hover { background-color: #374151 !important; border-color: #374151 !important; }
        .fc-event:hover { filter: brightness(0.9); transition: all 0.2s; }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        events={events}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        eventClick={(info) => setSelectedCitaId(info.event.id)}
        eventContent={(eventInfo) => (
          <div className="truncate flex items-center gap-1.5 overflow-hidden">
             <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
             <span className="truncate">{eventInfo.event.title}</span>
          </div>
        )}
      />

      {selectedCitaId && (
        <CitaDetalleModal 
          citaId={selectedCitaId} 
          onClose={() => setSelectedCitaId(null)} 
        />
      )}
    </div>
  );
}
