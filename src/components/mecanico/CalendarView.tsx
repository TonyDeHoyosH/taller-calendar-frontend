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
  
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['citas-todas'],
    queryFn: citasApi.getCitas,
  });

  // Log para depuración rápida en consola F12
  if (rawData) console.log('Datos recibidos del backend:', rawData);

  const citas = Array.isArray(rawData) 
    ? rawData 
    : (rawData as any)?.citas || (rawData as any)?.data || [];

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
    title: `${cita.vehiculo_modelo || cita.modelo_auto || 'Vehículo'}`,
    date: cita.fecha_preferida || cita.fecha_inicio,
    backgroundColor: getEventColor(cita.estado),
    borderColor: getEventColor(cita.estado),
    extendedProps: {
      cliente: cita.usuario?.nombre || 'S/N',
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
        .fc-event { 
          border-radius: 8px !important; 
          padding: 4px 8px !important; 
          border: none !important; 
          font-weight: 700 !important; 
          cursor: pointer !important; 
          margin: 2px 0 !important; 
          font-size: 0.7rem !important;
          color: white !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 700 !important; color: #111827; text-transform: capitalize; }
        .fc-button-primary { background-color: #111827 !important; border-color: #111827 !important; text-transform: capitalize; border-radius: 10px !important; font-weight: 500; }
        .fc-event:hover { transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.2s; }
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
          <div className="flex flex-col gap-0.5 leading-tight">
             <span className="opacity-80 text-[9px] uppercase tracking-tighter font-black">
               {eventInfo.event.extendedProps.estado}
             </span>
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
