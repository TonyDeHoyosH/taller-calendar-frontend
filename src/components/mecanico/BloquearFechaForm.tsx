'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api/axios';
import { Calendar as CalendarIcon, ShieldAlert } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const bloquearSchema = z.object({
  fecha_inicio: z.string().min(1, 'Selecciona la fecha inicial'),
  fecha_fin: z.string().min(1, 'Selecciona la fecha final'),
  motivo: z.string().min(5, 'Especifica el motivo del bloqueo'),
});

type BloquearFormValues = z.infer<typeof bloquearSchema>;

export default function BloquearFechaForm() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BloquearFormValues>({
    resolver: zodResolver(bloquearSchema),
  });

  const onSubmit = async (data: BloquearFormValues) => {
    setError('');
    setSuccess('');
    try {
      await api.post('/configuracion/bloquear', data);
      setSuccess('Fechas bloqueadas exitosamente. No se podrán agendar citas en este periodo.');
      reset();
      queryClient.invalidateQueries({ queryKey: ['citas-todas'] });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al bloquear las fechas.');
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-50 rounded-xl">
          <ShieldAlert className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bloquear Fechas</h2>
          <p className="text-sm text-gray-500 mt-1">Deshabilita días para evitar nuevas solicitudes.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Inicio</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('fecha_inicio')}
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fecha_inicio.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Fin</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('fecha_fin')}
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.fecha_fin && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fecha_fin.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Motivo (Ej. Vacaciones, Mantenimiento local)</label>
          <input
            {...register('motivo')}
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
            placeholder="Especifica por qué el taller estará cerrado"
          />
          {errors.motivo && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.motivo.message}</p>}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? 'Guardando...' : 'Confirmar Bloqueo'}
          </button>
        </div>
      </form>
    </div>
  );
}
