'use client';

import { useAuth } from '@/hooks/useAuth';
import { Wrench, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

import SolicitudesList from '@/components/mecanico/SolicitudesList';
import { useQuery } from '@tanstack/react-query';
import { citasApi } from '@/lib/api/citas';

export default function MecanicoDashboard() {
  const { user } = useAuth();
  const { data: citas = [] } = useQuery({
    queryKey: ['citas-todas'],
    queryFn: citasApi.getCitas,
  });

  const stats = {
    pendientes: citas.filter(c => c.estado === 'pendiente').length,
    aceptadas: citas.filter(c => c.estado === 'aceptada').length,
    rechazadas: citas.filter(c => c.estado === 'rechazada' || c.estado === 'cancelada').length,
    total: citas.length
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Panel del Taller</h1>
          <p className="text-gray-500">Bienvenido {user?.nombre}, aquí puedes gestionar las solicitudes entrantes.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/mecanico/calendario"
            className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
          >
            Ver Calendario
          </Link>
          <Link 
            href="/mecanico/configuracion"
            className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
          >
            Configuración
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Solicitudes Pendientes" value={stats.pendientes.toString()} icon={<Clock className="w-6 h-6 text-yellow-600" />} color="bg-yellow-50" />
        <StatCard title="Citas Aceptadas" value={stats.aceptadas.toString()} icon={<CheckCircle className="w-6 h-6 text-green-600" />} color="bg-green-50" />
        <StatCard title="Citas Rechazadas" value={stats.rechazadas.toString()} icon={<XCircle className="w-6 h-6 text-red-600" />} color="bg-red-50" />
        <StatCard title="Total Servicios" value={stats.total.toString()} icon={<Wrench className="w-6 h-6 text-blue-600" />} color="bg-blue-50" />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Solicitudes Recientes</h2>
        <SolicitudesList />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
