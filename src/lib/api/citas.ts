import api from './axios';
import { Cita } from '@/types/cita';

export const citasApi = {
  getCitas: async (): Promise<Cita[]> => {
    const { data } = await api.get('/citas');
    return data;
  },
};
