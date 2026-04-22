import axios from 'axios';

const api = axios.create({
  baseURL: 'https://agenda-mecanico-backend-1.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el JWT en todas las peticiones
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (e) {
        console.error('Error parsing auth-storage', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales (ej: 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage'); // Para Zustand si se usa persistencia
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
