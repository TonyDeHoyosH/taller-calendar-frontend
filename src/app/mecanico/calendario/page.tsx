import CalendarView from '@/components/mecanico/CalendarView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendario de Servicios - Taller Calendar',
};

export default function CalendarioPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Calendario de Servicios</h1>
        <p className="text-gray-500">Visualiza todas las citas aceptadas y los días bloqueados en el taller.</p>
      </div>

      <CalendarView />
    </div>
  );
}
