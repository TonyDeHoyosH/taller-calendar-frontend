'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { bloqueosApi } from '@/lib/api/citas';
import { Calendar, Save, AlertCircle } from 'lucide-react';

export default function BloquearFechaForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    motivo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await bloqueosApi.createBloqueo(formData);
      setMessage({ type: 'success', text: 'Fecha bloqueada correctamente.' });
      setFormData({ fecha_inicio: '', fecha_fin: '', motivo: '' });
      queryClient.invalidateQueries({ queryKey: ['bloqueos'] });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al bloquear la fecha.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Bloquear Disponibilidad</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.fecha_inicio}
              onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={formData.fecha_fin}
              onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo / Descripción</label>
          <textarea
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            rows={3}
            placeholder="Ej: Mantenimiento del taller, Vacaciones..."
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
          />
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <AlertCircle className="w-4 h-4" />
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Guardando...' : 'Guardar Bloqueo'}
        </button>
      </form>
    </div>
  );
}
