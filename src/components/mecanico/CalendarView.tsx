'use client';

import { useQuery } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { citasApi } from '@/lib/api/citas';
import esLocale from '@fullcalendar/core/locales/es';

export default function CalendarView() {
  const { data: citas = [], isLoading } = useQuery({
    queryKey: ['citas-todas'],
    queryFn: citasApi.getCitas,
  });

  // Solo mostrar en calendario las citas que están aceptadas
  const events = citas
    .filter(cita => cita.estado === 'aceptada')
    .map(cita => ({
      id: cita.id.toString(),
      title: `${cita.modelo_auto}`,
      date: cita.fecha_inicio,
      color: '#3b82f6', // blue-500
      extendedProps: {
        descripcion: cita.descripcion_problema,
        estado: cita.estado
      }
    }));

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 rounded-3xl h-[600px] w-full"></div>;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <style>{`
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f3f4f6; }
        .fc-theme-standard .fc-scrollgrid { border-color: #f3f4f6; border-radius: 12px; overflow: hidden; }
        .fc-day-today { background-color: #f8fafc !important; }
        .fc-event { border-radius: 6px; padding: 2px 4px; border: none; font-weight: 500; cursor: pointer; }
        .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 700 !important; color: #111827; text-transform: capitalize; }
        .fc-button-primary { background-color: #111827 !important; border-color: #111827 !important; text-transform: capitalize; border-radius: 8px !important; }
        .fc-button-primary:hover { background-color: #374151 !important; border-color: #374151 !important; }
        .fc-button-primary:disabled { background-color: #9ca3af !important; border-color: #9ca3af !important; }
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
        eventContent={(eventInfo) => (
          <div className="truncate text-xs px-1">
            <span className="ml-1 font-medium">{eventInfo.event.title}</span>
          </div>
        )}
      />
    </div>
  );
}
