'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { citasApi } from '@/lib/api/citas';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Check, X, Calendar, User, Car } from 'lucide-react';

export default function SolicitudesList() {
  const queryClient = useQueryClient();

  const { data: rawData, isLoading } = useQuery({
    queryKey: ['citas-todas'],
    queryFn: citasApi.getCitasTodas,
  });

  const citas = Array.isArray(rawData) 
    ? rawData 
    : (rawData as any)?.citas || (rawData as any)?.data || [];

  console.log('Estados de las citas recibidas:', citas.map(c => ({ id: c.id, estado: c.estado })));

  const updateMutation = useMutation({
    mutationFn: ({ id, action }: { id: number; action: 'aceptar' | 'cancelar' }) => 
      citasApi.updateEstadoCita(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas-todas'] });
    },
  });

  const solicitudesPendientes = citas.filter(c => c.estado === 'pendiente');

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Cargando solicitudes...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900">Solicitudes Pendientes</h2>
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
          {solicitudesPendientes.length} Nuevas
        </span>
      </div>

      <div className="divide-y divide-gray-50">
        {solicitudesPendientes.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No hay solicitudes pendientes de revisión.</p>
          </div>
        ) : (
          solicitudesPendientes.map((cita) => (
            <div key={cita.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-400" />
                    <h3 className="font-bold text-lg text-gray-900">
                      {cita.vehiculo_modelo || cita.modelo_auto || 'Vehículo'}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{cita.usuario?.nombre || 'Cliente no especificado'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {(() => {
                          const d = new Date(cita.fecha_preferida || cita.fecha_inicio);
                          return isNaN(d.getTime()) 
                            ? 'Fecha no definida' 
                            : format(d, "PPP", { locale: es });
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600 italic">
                      "{cita.descripcion || cita.descripcion_problema || 'Sin descripción del problema.'}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (updateMutation.isPending) return;
                      updateMutation.mutate({ id: cita.id, action: 'cancelar' });
                    }}
                    disabled={updateMutation.isPending}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Rechazar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (updateMutation.isPending) return;
                      console.log('Intentando aceptar cita completa:', cita);
                      updateMutation.mutate({ id: cita.id, action: 'aceptar' });
                    }}
                    disabled={updateMutation.isPending}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Aceptar"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
