'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { citasApi } from '@/lib/api/citas';

const agendarSchema = z.object({
  tipo_servicio_id: z.string().min(1, 'Selecciona un servicio'),
  modelo_auto: z.string().min(2, 'Modelo muy corto'),
  descripcion_problema: z.string().min(10, 'Describe con más detalle (mín. 10 caracteres)'),
  fecha_inicio: z.string().min(1, 'Selecciona una fecha'),
});

type AgendarFormValues = z.infer<typeof agendarSchema>;

const serviciosMock = [
  { id: 1, nombre: 'Mantenimiento General' },
  { id: 2, nombre: 'Cambio de Aceite' },
  { id: 3, nombre: 'Revisión de Frenos' },
  { id: 4, nombre: 'Diagnóstico por Computadora' }
];

export default function AgendarForm() {
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AgendarFormValues>({
    resolver: zodResolver(agendarSchema),
  });

  const onSubmit = async (data: AgendarFormValues) => {
    setError('');
    try {
      if (!user) return;
      
      const payload = {
        ...data,
        cliente_id: user.id,
        tipo_servicio_id: parseInt(data.tipo_servicio_id, 10)
      };
      
      await citasApi.createCita(payload);
      router.push('/cliente');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agendar la cita. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Agendar Nueva Cita</h2>
        <p className="text-gray-500 mt-1">Completa los datos de tu vehículo y el servicio requerido.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Servicio</label>
            <select
              {...register('tipo_servicio_id')}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
            >
              <option value="">Seleccione un servicio</option>
              {serviciosMock.map(srv => (
                <option key={srv.id} value={srv.id.toString()}>{srv.nombre}</option>
              ))}
            </select>
            {errors.tipo_servicio_id && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.tipo_servicio_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha Preferida</label>
            <input
              {...register('fecha_inicio')}
              type="date"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.fecha_inicio && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fecha_inicio.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Modelo y Año del Auto</label>
          <input
            {...register('modelo_auto')}
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            placeholder="Ej. Toyota Corolla 2018"
          />
          {errors.modelo_auto && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.modelo_auto.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción del Problema</label>
          <textarea
            {...register('descripcion_problema')}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
            placeholder="Describe qué le sucede a tu vehículo o detalles adicionales sobre el servicio..."
          ></textarea>
          {errors.descripcion_problema && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.descripcion_problema.message}</p>}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Cita'}
          </button>
        </div>
      </form>
    </div>
  );
}
