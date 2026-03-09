import axios from 'axios';

// Instancia base de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT en las peticiones protegidas
api.interceptors.request.use(
  (config) => {
    // Aquí después inyectaremos el token desde Zustand o localStorage
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const parsedData = JSON.parse(authData);
          const token = parsedData?.state?.token;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error al leer el token", error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
