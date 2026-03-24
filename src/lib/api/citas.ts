import api from './axios';
import { Cita, CreateCitaDTO } from '@/types/cita';

export const citasApi = {
  getCitas: async (): Promise<Cita[]> => {
    const { data } = await api.get('/citas');
    return data;
  },

  createCita: async (citaData: CreateCitaDTO): Promise<Cita> => {
    const { data } = await api.post('/citas', citaData);
    return data;
  },

  updateEstadoCita: async (id: number, accion: 'aceptar' | 'rechazar'): Promise<Cita> => {
    const { data } = await api.patch(`/citas/${id}/${accion}`);
    return data;
  },
};
