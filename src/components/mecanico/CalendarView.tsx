'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { citasApi } from '@/lib/api/citas';
import esLocale from '@fullcalendar/core/locales/es';
import CitaDetalleModal from './CitaDetalleModal';

export default function CalendarView() {
  const queryClient = useQueryClient();
  const [selectedCitaId, setSelectedCitaId] = useState<string | null>(null);
  
  const { data: rawData, isLoading } = useQuery({
    queryKey: ['citas-todas'],
    queryFn: citasApi.getCitasTodas,
  });

  const updateDateMutation = useMutation({
    mutationFn: ({ id, date }: { id: string, date: string }) => 
      citasApi.updateCita(id, { fecha_inicio: date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-todas'] });
    },
  });

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
    start: cita.fecha_preferida || cita.fecha_inicio,
    end: cita.fecha_fin || undefined,
    backgroundColor: getEventColor(cita.estado),
    borderColor: getEventColor(cita.estado),
    extendedProps: {
      cliente: cita.usuario?.nombre || 'S/N',
      estado: cita.estado
    }
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const initialDate = events.length > 0 ? events[0].start : undefined;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <style>{`
        .fc-event { cursor: pointer !important; }
        .fc-event:hover { opacity: 0.9; }
      `}</style>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Agenda del Taller</h2>
        <p className="text-gray-500">Visualiza y gestiona todas las citas programadas.</p>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={initialDate}
        locale={esLocale}
        events={events}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        eventClick={(info) => {
          setSelectedCitaId(info.event.id);
        }}
        editable={true}
        eventDrop={async (info) => {
          if (updateDateMutation.isPending) {
            info.revert();
            return;
          }

          const newDate = info.event.start?.toISOString();
          if (newDate) {
            try {
              await updateDateMutation.mutateAsync({ 
                id: info.event.id, 
                date: newDate 
              });
            } catch (error) {
              info.revert();
            }
          }
        }}
        eventContent={(eventInfo) => (
          <div className="p-1 overflow-hidden">
            <div className="text-xs font-bold truncate">{eventInfo.event.title}</div>
            <div className="text-[10px] opacity-80 truncate">{eventInfo.event.extendedProps.cliente}</div>
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
