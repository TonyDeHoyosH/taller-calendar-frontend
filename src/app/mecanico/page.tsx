'use client';

import { useAuth } from '@/hooks/useAuth';
import { Wrench, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function MecanicoDashboard() {
  const { user } = useAuth();

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
        <StatCard title="Solicitudes Pendientes" value="--" icon={<Clock className="w-6 h-6 text-yellow-600" />} color="bg-yellow-50" />
        <StatCard title="Citas Aceptadas" value="--" icon={<CheckCircle className="w-6 h-6 text-green-600" />} color="bg-green-50" />
        <StatCard title="Citas Rechazadas" value="--" icon={<XCircle className="w-6 h-6 text-red-600" />} color="bg-red-50" />
        <StatCard title="Total Servicios" value="--" icon={<Wrench className="w-6 h-6 text-blue-600" />} color="bg-blue-50" />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Solicitudes Recientes</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
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
