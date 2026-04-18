'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bloqueosApi } from '@/lib/api/citas';
import { Trash2, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';

export default function BloqueosList() {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { data: rawData, isLoading } = useQuery({
    queryKey: ['bloqueos'],
    queryFn: bloqueosApi.getBloqueos,
  });

  const bloqueos = Array.isArray(rawData) ? rawData : (rawData as any)?.bloqueos || [];

  const handleDelete = async (id: number) => {
    try {
      await bloqueosApi.deleteBloqueo(id);
      queryClient.invalidateQueries({ queryKey: ['bloqueos'] });
    } catch (err) {
      setError('No se pudo eliminar el bloqueo.');
    }
  };

  if (isLoading) return <div className="animate-pulse bg-gray-50 h-32 rounded-2xl"></div>;

  if (bloqueos.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-3xl border border-dashed border-gray-200 text-center">
        <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No hay fechas bloqueadas actualmente.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/30">
        <h3 className="font-bold text-gray-900">Fechas Inhabilitadas</h3>
      </div>
      <div className="divide-y divide-gray-50">
        {bloqueos.map((bloqueo: any) => (
          <div key={bloqueo.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{bloqueo.motivo}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Desde {format(new Date(bloqueo.fecha_inicio), 'PP', { locale: es })} hasta {format(new Date(bloqueo.fecha_fin), 'PP', { locale: es })}
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(bloqueo.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Eliminar bloqueo"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      {error && <p className="p-4 text-xs text-red-500 text-center border-t border-gray-50">{error}</p>}
    </div>
  );
}
