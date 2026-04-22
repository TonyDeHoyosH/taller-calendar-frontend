import api from './axios';
import { Cita } from '@/types/cita';

export const citasApi = {
  // Para Clientes: El backend filtra por JWT
  getCitas: async (): Promise<Cita[]> => {
    const { data } = await api.get('/citas');
    return data;
  },

  // Para Mecánicos: Ver todo el taller
  getCitasTodas: async (): Promise<Cita[]> => {
    const { data } = await api.get('/citas/todos');
    return data;
  },

  getCitaById: async (id: string | number): Promise<Cita> => {
    const { data } = await api.get(`/citas/${id}`);
    return data;
  },

  // Agendar nueva cita
  createCita: async (citaData: {
    servicio: number;
    vehiculo_modelo: string;
    descripcion: string;
    fecha_preferida: string;
  }): Promise<Cita> => {
    const { data } = await api.post('/citas', citaData);
    return data;
  },

  // Edición rápida (PATCH genérico para drag & drop o cambios de texto)
  updateCita: async (id: string | number, updateData: Partial<Cita>): Promise<Cita> => {
    const { data } = await api.patch(`/citas/${id}`, updateData);
    return data;
  },

  // Flujo de estados (Kanban / Modal)
  updateEstadoCita: async (id: string | number, accion: 'aceptar' | 'en-curso' | 'completar' | 'cancelar'): Promise<Cita> => {
    // Mapeo interno para asegurar que el backend reciba el valor de 'estado' esperado si lo pide en el body
    const estadoMapping: Record<string, string> = {
      'aceptar': 'aceptada',
      'en-curso': 'en_curso',
      'completar': 'completada',
      'cancelar': 'cancelada'
    };

    try {
      // Enviamos el estado en el body por si el backend tiene ValidationPipe estricto
      const { data } = await api.patch(`/citas/${id}/${accion}`, {
        estado: estadoMapping[accion]
      });
      return data;
    } catch (error: any) {
      console.error('Error detallado del backend:', error.response?.data);
      throw error;
    }
  },
};

export const bloqueosApi = {
  getBloqueos: async () => {
    const { data } = await api.get('/configuracion/bloqueos');
    return data;
  },
  
  createBloqueo: async (bloqueoData: { fecha_inicio: string; fecha_fin: string; motivo: string }) => {
    const { data } = await api.post('/configuracion/bloquear', bloqueoData);
    return data;
  },

  deleteBloqueo: async (id: string | number) => {
    const { data } = await api.delete(`/configuracion/bloqueos/${id}`);
    return data;
  },
};
