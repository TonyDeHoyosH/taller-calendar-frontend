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

  if (isLoading) return <div className="animate-pulse bg-gray-50 h-32 rounded-xl"></div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <h3 className="text-xl font-bold text-gray-900">Fechas Bloqueadas</h3>
        <p className="text-sm text-gray-500">Periodos donde el taller no recibirá citas.</p>
      </div>

      <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
        {bloqueos.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No hay fechas bloqueadas actualmente.</p>
          </div>
        ) : (
          bloqueos.map((bloqueo: any) => (
            <div key={bloqueo.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{bloqueo.motivo}</span>
                <span className="text-sm text-gray-600">
                  {format(new Date(bloqueo.fecha_inicio), 'dd/MM/yyyy')} - {format(new Date(bloqueo.fecha_fin), 'dd/MM/yyyy')}
                </span>
              </div>
              <button 
                onClick={() => handleDelete(bloqueo.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar bloqueo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
