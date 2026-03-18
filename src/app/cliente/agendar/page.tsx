import AgendarForm from '@/components/citas/AgendarForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agendar Cita - Taller Calendar',
};

export default function AgendarPage() {
  return (
    <div className="space-y-6">
      <AgendarForm />
    </div>
  );
}
