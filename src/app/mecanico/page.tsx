'use client';

import { useAuth } from '@/hooks/useAuth';
import { Calendar, Clock, CheckCircle, XCircle, Settings } from 'lucide-react';
import Link from 'next/link';
import SolicitudesList from '@/components/mecanico/SolicitudesList';
import { useQuery } from '@tanstack/react-query';
import { citasApi } from '@/lib/api/citas';
import { Cita } from '@/types/cita';

export default function MecanicoDashboard() {
  const { user } = useAuth();
  const { data: citas = [] } = useQuery<Cita[]>({
    queryKey: ['citas-todas'],
    queryFn: citasApi.getCitasTodas,
  });

  const stats = {
    pendientes: citas.filter((c: Cita) => c.estado === 'pendiente').length,
    aceptadas: citas.filter((c: Cita) => c.estado === 'aceptada').length,
    rechazadas: citas.filter((c: Cita) => c.estado === 'rechazada' || c.estado === 'cancelada').length,
    total: citas.length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500">Bienvenido, {user?.nombre}</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/mecanico/calendario"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Ver Calendario
          </Link>
          <Link 
            href="/mecanico/configuracion"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configuración
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pendientes" value={stats.pendientes} icon={<Clock className="text-yellow-600" />} />
        <StatCard title="Aceptadas" value={stats.aceptadas} icon={<CheckCircle className="text-green-600" />} />
        <StatCard title="Rechazadas" value={stats.rechazadas} icon={<XCircle className="text-red-600" />} />
        <StatCard title="Total Servicios" value={stats.total} icon={<Calendar className="text-blue-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SolicitudesList />
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Estado del Taller</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Monitoreo de carga de trabajo en tiempo real.</p>
            {/* Aquí podrían ir gráficos simples o más métricas */}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
