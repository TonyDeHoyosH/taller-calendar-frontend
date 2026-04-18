'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { citasApi } from '@/lib/api/citas';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, X, Calendar, Wrench } from 'lucide-react';

export default function SolicitudesList() {
  const queryClient = useQueryClient();

  const { data: citas = [], isLoading } = useQuery({
    queryKey: ['citas-todas'],
    queryFn: citasApi.getCitas,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'aceptar' | 'rechazar' }) => 
      citasApi.updateEstadoCita(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-todas'] });
    },
  });

  const solicitudesPendientes = citas.filter(c => c.estado === 'pendiente');

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Cargando solicitudes...</div>;
  }

  if (solicitudesPendientes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay solicitudes pendientes</h3>
        <p className="text-gray-500">Has revisado todas las solicitudes de citas entrantes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {solicitudesPendientes.map((cita) => (
        <div key={cita.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Nueva
              </span>
              <h3 className="font-bold text-gray-900 text-lg">{cita.vehiculo_modelo || cita.modelo_auto || 'Vehículo'}</h3>
              <span className="text-gray-400 text-sm">#{cita.id}</span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="font-medium capitalize">{format(new Date(cita.fecha_preferida || cita.fecha_inicio), "EEEE d 'de' MMMM", { locale: es })}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Wrench className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p>{cita.descripcion || cita.descripcion_problema}</p>
            </div>
          </div>
          
          <div className="flex md:flex-col gap-3 min-w-[140px]">
            <button
              onClick={() => updateMutation.mutate({ id: cita.id, action: 'aceptar' })}
              disabled={updateMutation.isPending}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> Aceptar
            </button>
            <button
              onClick={() => updateMutation.mutate({ id: cita.id, action: 'rechazar' })}
              disabled={updateMutation.isPending}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" /> Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
