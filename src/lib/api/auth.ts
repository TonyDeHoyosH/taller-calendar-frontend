import api from './axios';
import { LoginResponse } from '@/types/auth';

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    // Mapeamos password a contrasena para el backend
    const { data } = await api.post('/auth/login', {
      email: credentials.email,
      contrasena: credentials.password
    });
    return data;
  },

  register: async (userData: { 
    nombre: string; 
    email: string; 
    password: string; 
    telefono: string; 
    rol: string 
  }): Promise<LoginResponse> => {
    // Enviamos explícitamente los campos que el backend espera
    const { data } = await api.post('/auth/register', {
      nombre: userData.nombre,
      email: userData.email,
      contrasena: userData.password,
      telefono: userData.telefono,
      rol: userData.rol
    });
    return data;
  },
};
