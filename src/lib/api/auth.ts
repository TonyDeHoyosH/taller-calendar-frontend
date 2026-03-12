import api from './axios';
import { LoginResponse } from '@/types/auth';

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (userData: { nombre: string; email: string; password: string; rol: string }): Promise<LoginResponse> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
};
