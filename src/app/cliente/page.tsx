'use client';

import { useAuth } from '@/hooks/useAuth';

export default function ClienteDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido, {user?.nombre}</h1>
        <p className="text-gray-600">Desde aquí puedes gestionar tus citas y agendar nuevos servicios para tu vehículo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mis Citas Activas</h3>
          <div className="text-sm text-gray-500 flex-1 flex items-center justify-center py-6">
            <p>Cargando información...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
