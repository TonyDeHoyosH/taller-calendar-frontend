import CalendarView from '@/components/mecanico/CalendarView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendario - Taller Calendar',
};

export default function CalendarioPage() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Agenda del Taller</h1>
        <p className="text-gray-500">Visualiza y gestiona todas las citas programadas.</p>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <CalendarView />
      </div>
    </div>
  );
}
