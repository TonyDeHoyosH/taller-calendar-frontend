'use client';

import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL;

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

interface FormData {
  summary: string;
  description: string;
  start: string;
  end: string;
}

const emptyForm: FormData = { summary: '', description: '', start: '', end: '' };

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/calendar/events`);
    const data = await res.json();
    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async () => {
    const url = editingId
      ? `${API}/api/calendar/events/update?eventId=${editingId}`
      : `${API}/api/calendar/events/create`;
    const method = editingId ? 'PATCH' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API}/api/calendar/events/delete?eventId=${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  const handleEdit = (event: CalendarEvent) => {
    setForm({
      summary: event.summary,
      description: event.description || '',
      start: event.start.dateTime.slice(0, 16),
      end: event.end.dateTime.slice(0, 16),
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-mono">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="border-l-4 border-blue-500 pl-4 mb-10">
          <p className="text-blue-400 text-xs tracking-widest uppercase mb-1">Taller Mecánico</p>
          <h1 className="text-3xl font-bold text-white">Google Calendar API</h1>
          <p className="text-zinc-500 text-sm mt-1">Gestión de eventos · SOA Practice</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-zinc-400 text-sm">{events.length} eventos próximos</p>
          <button
            onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditingId(null); }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Nuevo Evento'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
            <h2 className="text-sm text-zinc-400 uppercase tracking-widest mb-4">
              {editingId ? 'Editar Evento' : 'Crear Evento'}
            </h2>
            <div className="grid gap-3">
              <input
                className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                placeholder="Título del evento"
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
              />
              <input
                className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                placeholder="Descripción"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Inicio</p>
                  <input
                    type="datetime-local"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    value={form.start}
                    onChange={e => setForm({ ...form, start: e.target.value })}
                  />
                </div>
                <div>
                  <p className="text-zinc-500 text-xs mb-1">Fin</p>
                  <input
                    type="datetime-local"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    value={form.end}
                    onChange={e => setForm({ ...form, end: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded transition-colors mt-1"
              >
                {editingId ? 'Guardar cambios' : 'Crear evento'}
              </button>
            </div>
          </div>
        )}

        {/* Events List */}
        {loading ? (
          <p className="text-zinc-500 text-sm">Cargando eventos...</p>
        ) : events.length === 0 ? (
          <p className="text-zinc-500 text-sm">No hay eventos próximos.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map(event => (
              <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex justify-between items-start hover:border-zinc-600 transition-colors">
                <div>
                  <p className="text-white font-bold text-sm">{event.summary}</p>
                  {event.description && <p className="text-zinc-400 text-xs mt-1">{event.description}</p>}
                  <p className="text-blue-400 text-xs mt-2">
                    {new Date(event.start.dateTime).toLocaleString('es-MX')} →{' '}
                    {new Date(event.end.dateTime).toLocaleString('es-MX')}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(event)} className="text-zinc-400 hover:text-white text-xs border border-zinc-700 hover:border-zinc-400 px-3 py-1 rounded transition-colors">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-300 text-xs border border-red-900 hover:border-red-600 px-3 py-1 rounded transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}