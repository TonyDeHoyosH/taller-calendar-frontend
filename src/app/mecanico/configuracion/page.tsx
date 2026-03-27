import BloquearFechaForm from '@/components/mecanico/BloquearFechaForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuración - Taller Calendar',
};

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Configuración del Taller</h1>
        <p className="text-gray-500">Administra la disponibilidad de tu taller.</p>
      </div>

      <div className="max-w-3xl">
        <BloquearFechaForm />
      </div>
    </div>
  );
}
