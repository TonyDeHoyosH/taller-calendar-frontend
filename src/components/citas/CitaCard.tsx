import { Cita } from '@/types/cita';
import { Calendar, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CitaCardProps {
  cita: Cita;
}

const estadoColors: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  aceptada: 'bg-green-100 text-green-800 border-green-200',
  rechazada: 'bg-red-100 text-red-800 border-red-200',
  cancelada: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function CitaCard({ cita }: CitaCardProps) {
  // Ajuste para el timezone en las fechas (asumiendo formato ISO)
  const fechaString = cita.fecha_preferida || cita.fecha_inicio || new Date().toISOString();
  const fecha = new Date(fechaString);
  const formattedDate = format(fecha, "EEEE d 'de' MMMM, yyyy", { locale: es });
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            {cita.vehiculo_modelo || cita.modelo_auto || 'Vehículo'}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">ID: #{cita.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${estadoColors[cita.estado] || estadoColors.pendiente}`}>
          {cita.estado}
        </span>
      </div>
      
      <div className="space-y-3 mt-5">
        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="capitalize font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-gray-600 p-2">
          <Wrench className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2 leading-relaxed">
            {cita.descripcion || cita.descripcion_problema || 'Sin descripción'}
          </span>
        </div>
      </div>
    </div>
  );
}
