import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT en las peticiones protegidas
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar sesión
      useAuthStore.getState().logout();
      // Redirigir al login si estamos en el cliente
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
