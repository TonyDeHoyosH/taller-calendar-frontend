'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { citasApi } from '@/lib/api/citas';
import { Cita } from '@/types/cita';
import CitaCard from '@/components/citas/CitaCard';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function ClienteDashboard() {
  const { user } = useAuth();

  const { data: citas = [], isLoading, isError } = useQuery<Cita[]>({
    queryKey: ['citas'],
    queryFn: citasApi.getCitas,
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Bienvenido, {user?.nombre}</h1>
          <p className="text-gray-500">Gestiona tus citas y servicios mecánicos.</p>
        </div>
        <Link 
          href="/cliente/agendar"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Agendar Nueva Cita
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Mis Citas</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            {citas.length} Total
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
            Error al cargar las citas. Por favor, intenta nuevamente más tarde.
          </div>
        ) : citas.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes citas programadas</h3>
            <p className="text-gray-500 mb-6">Aún no has solicitado ningún servicio para tu vehículo.</p>
            <Link 
              href="/cliente/agendar"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Agendar mi primera cita
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citas.map((cita: Cita) => (
              <CitaCard key={cita.id} cita={cita} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Necesario para el ícono en empty state
import { Calendar } from 'lucide-react';
