'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { citasApi } from '@/lib/api/citas';
import { Cita } from '@/types/cita';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, Calendar, Clock, User, Car, FileText, AlertCircle, CheckCircle2, PlayCircle, Ban } from 'lucide-react';
import { useState } from 'react';

interface CitaDetalleModalProps {
  citaId: string | number;
  onClose: () => void;
}

export default function CitaDetalleModal({ citaId, onClose }: CitaDetalleModalProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  // Intentar obtener de la caché general primero para mayor velocidad
  const { data: allCitas } = useQuery<Cita[]>({
    queryKey: ['citas-todas'],
    enabled: false, // No disparar fetch, solo leer caché
  });

  const { data: citaFetched, isLoading } = useQuery({
    queryKey: ['cita', citaId],
    queryFn: () => citasApi.getCitaById(citaId),
    retry: 1,
  });

  // Normalizar la cita (por si viene envuelta en { data: ... } o { cita: ... })
  const normalizedCita = citaFetched 
    ? ((citaFetched as any).data || (citaFetched as any).cita || citaFetched) as Cita
    : null;

  // Usar la cita del fetch individual, o buscarla en la lista general si el fetch falla
  const cita = normalizedCita || allCitas?.find((c: Cita) => c.id.toString() === citaId.toString());

  const updateMutation = useMutation({
    mutationFn: ({ accion }: { accion: 'aceptar' | 'en-curso' | 'completar' | 'cancelar' }) => 
      citasApi.updateEstadoCita(citaId, accion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cita', citaId] });
      queryClient.invalidateQueries({ queryKey: ['citas-todas'] });
    },
  });

  if (isLoading) return null; // O un spinner pequeño

  if (!cita) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center">
        <p>No se encontró la cita.</p>
        <button onClick={onClose} className="mt-4 text-blue-600">Cerrar</button>
      </div>
    </div>
  );

  const handleUpdateStatus = async (nuevoEstado: 'aceptar' | 'en-curso' | 'completar' | 'cancelar') => {
    if (updateMutation.isPending) return;
    try {
      setError('');
      await updateMutation.mutateAsync({ accion: nuevoEstado });
    } catch (err: any) {
      console.error('Error al actualizar:', err);
      // Extraer mensaje detallado si existe
      const backendError = err.response?.data?.message || 'Error al actualizar el estado.';
      setError(backendError);
    }
  };

  const safeFormat = (date: any) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Fecha no válida';
      return format(d, "PPPP 'a las' HH:mm", { locale: es });
    } catch (e) {
      return 'Fecha no válida';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative">
        {/* Cabecera con Imagen/Color según estado */}
        <div className={`h-32 p-8 flex justify-between items-start ${
          cita.estado === 'completada' ? 'bg-green-600' : 
          cita.estado === 'cancelada' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          <div>
            <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
              Detalle de Servicio
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">#{cita.id}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <DetailItem icon={<Car />} label="Vehículo" value={cita.vehiculo_modelo || cita.modelo_auto} />
              <DetailItem icon={<User />} label="Cliente" value={cita.usuario?.nombre || 'S/N'} />
              <DetailItem icon={<Clock />} label="Estado" value={
                <span className={`capitalize font-bold ${
                  cita.estado === 'pendiente' ? 'text-yellow-600' : 
                  cita.estado === 'aceptada' ? 'text-blue-600' :
                  cita.estado === 'en_curso' ? 'text-purple-600' :
                  cita.estado === 'completada' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {cita.estado}
                </span>
              } />
            </div>
            <div className="space-y-6">
              <DetailItem icon={<Calendar />} label="Fecha Programada" value={safeFormat(cita.fecha_preferida || cita.fecha_inicio)} />
              <DetailItem icon={<FileText />} label="Descripción" value={cita.descripcion || cita.descripcion_problema || 'Sin descripción'} />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Acciones de Estado */}
          <div className="border-t pt-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Acciones de Gestión</p>
            <div className="flex flex-wrap gap-3">
              {cita.estado === 'aceptada' && (
                <StatusButton 
                  onClick={() => handleUpdateStatus('en-curso')} 
                  icon={<PlayCircle />} 
                  label="Iniciar Servicio" 
                  color="bg-purple-600 hover:bg-purple-700" 
                  disabled={updateMutation.isPending}
                />
              )}
              {(cita.estado === 'en_curso' || cita.estado === 'aceptada') && (
                <StatusButton 
                  onClick={() => handleUpdateStatus('completar')} 
                  icon={<CheckCircle2 />} 
                  label="Terminar Servicio" 
                  color="bg-green-600 hover:bg-green-700" 
                  disabled={updateMutation.isPending}
                />
              )}
              {(cita.estado !== 'completada' && cita.estado !== 'cancelada') && (
                <StatusButton 
                  onClick={() => handleUpdateStatus('cancelar')} 
                  icon={<Ban />} 
                  label="Cancelar Cita" 
                  color="bg-red-600 hover:bg-red-700" 
                  disabled={updateMutation.isPending}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: any }) {
  return (
    <div className="flex gap-4">
      <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="text-gray-900 font-medium leading-tight">{value}</div>
      </div>
    </div>
  );
}

function StatusButton({ onClick, icon, label, color, disabled }: { onClick: () => void, icon: React.ReactNode, label: string, color: string, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${color}`}
    >
      {icon}
      {label}
    </button>
  );
}
