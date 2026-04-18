'use client';

import { useState } from 'react';
import { X, Calendar as CalendarIcon, User, Car, ClipboardList, CheckCircle2, Clock, Ban, AlertCircle } from 'lucide-react';
import { citasApi } from '@/lib/api/citas';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CitaDetalleModalProps {
  citaId: string | number | null;
  onClose: () => void;
}

export default function CitaDetalleModal({ citaId, onClose }: CitaDetalleModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const citas = queryClient.getQueryData<any[]>(['citas-todas']);
  const cita = citas?.find(c => c.id.toString() === citaId?.toString());

  if (!cita) return null;

  const handleUpdateStatus = async (nuevoEstado: string) => {
    setIsUpdating(true);
    setError('');
    try {
      await citasApi.updateCita(cita.id, { estado: nuevoEstado });
      queryClient.invalidateQueries({ queryKey: ['citas-todas'] });
      onClose();
    } catch (err: any) {
      const msg = Array.isArray(err.response?.data?.message) 
        ? err.response.data.message.join(', ') 
        : err.response?.data?.message;
      setError(msg || 'Error al actualizar el estado.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateDate = async (nuevaFecha: string) => {
    if (!nuevaFecha) return;
    setIsUpdating(true);
    try {
      await citasApi.updateCita(cita.id, { 
        fecha_preferida: new Date(nuevaFecha).toISOString(),
        fecha_inicio: new Date(nuevaFecha).toISOString() // Mandamos ambos por si acaso
      });
      queryClient.invalidateQueries({ queryKey: ['citas-todas'] });
      onClose();
    } catch (err: any) {
      const msg = Array.isArray(err.response?.data?.message) 
        ? err.response.data.message.join(', ') 
        : err.response?.data?.message;
      setError(msg || 'Error al actualizar la fecha.');
    } finally {
      setIsUpdating(false);
    }
  };

  const safeFormat = (dateStr: any) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Fecha no válida';
      return format(d, 'yyyy-MM-dd');
    } catch {
      return 'Fecha no válida';
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-3 h-3" /> Pendiente</span>;
      case 'aceptada': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Aceptada</span>;
      case 'en_curso': return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> En Curso</span>;
      case 'completada': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Completada</span>;
      case 'cancelada': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Ban className="w-3 h-3" /> Cancelada</span>;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-900">Detalles de la Cita</h3>
            {getEstadoBadge(cita.estado)}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><User className="w-3 h-3" /> Cliente</label>
              <p className="text-gray-900 font-semibold">{cita.usuario?.nombre || 'Cliente Registrado'}</p>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><Car className="w-3 h-3" /> Vehículo</label>
              <p className="text-gray-900 font-semibold">{cita.vehiculo_modelo || cita.modelo_auto || 'No especificado'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><ClipboardList className="w-3 h-3" /> Descripción del Problema</label>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 text-sm leading-relaxed">
              {cita.descripcion || cita.descripcion_problema || 'Sin descripción'}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
             <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest"><CalendarIcon className="w-3 h-3" /> Gestionar Fecha y Estado</label>
             
             <div className="flex flex-wrap gap-3 items-center">
                <input 
                  type="date" 
                  defaultValue={safeFormat(cita.fecha_preferida || cita.fecha_inicio)}
                  onChange={(e) => handleUpdateDate(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                
                <div className="flex gap-2">
                  {cita.estado !== 'en_curso' && cita.estado !== 'completada' && (
                    <button 
                      onClick={() => handleUpdateStatus('en_curso')}
                      disabled={isUpdating}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
                    >
                      En Curso
                    </button>
                  )}
                  {cita.estado !== 'completada' && (
                    <button 
                      onClick={() => handleUpdateStatus('completada')}
                      disabled={isUpdating}
                      className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
                    >
                      Terminar
                    </button>
                  )}
                  {cita.estado !== 'cancelada' && (
                    <button 
                      onClick={() => handleUpdateStatus('cancelada')}
                      disabled={isUpdating}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-all"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
           <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Acceso de Mecánico Autorizado</p>
        </div>
      </div>
    </div>
  );
}
