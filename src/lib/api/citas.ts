import api from './axios';
import { Cita, CreateCitaDTO } from '@/types/cita';

export const citasApi = {
  getCitas: async (): Promise<Cita[]> => {
    const { data } = await api.get('/citas');
    return data;
  },

  createCita: async (citaData: any): Promise<Cita> => {
    const { data } = await api.post('/citas', citaData);
    return data;
  },

  getCitaById: async (id: string | number): Promise<Cita> => {
    const { data } = await api.get(`/citas/${id}`);
    return data;
  },

  updateCita: async (id: string | number, updateData: any): Promise<Cita> => {
    const { data } = await api.patch(`/citas/${id}`, updateData);
    return data;
  },

  updateEstadoCita: async (id: number, accion: 'aceptar' | 'rechazar'): Promise<Cita> => {
    const { data } = await api.patch(`/citas/${id}/${accion}`);
    return data;
  },
};

export const bloqueosApi = {
  getBloqueos: async () => {
    const { data } = await api.get('/configuracion/bloqueos');
    return data;
  },
  
  deleteBloqueo: async (id: string | number) => {
    const { data } = await api.delete(`/configuracion/bloqueos/${id}`);
    return data;
  }
};
