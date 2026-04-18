# Taller Calendar Frontend

Este es el frontend para el sistema de agendamiento de citas de un taller mecánico, desarrollado con Next.js 14, Tailwind CSS y TypeScript.

## Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Backend (API) funcionando en el puerto 10000

## Configuración y Arranque

1. Clona el repositorio e instala dependencias:
   ```bash
   npm install
   ```
2. Configura las variables de entorno copiando `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Asegúrate de que `NEXT_PUBLIC_API_URL` apunte correctamente a tu backend (por defecto `http://localhost:10000`).

3. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Arquitectura Tecnológica

- **Framework Core:** Next.js 14 con App Router para rutas protegidas y renderizado híbrido.
- **Estado de Servidor:** TanStack React Query para caché de solicitudes, revalidaciones (`invalidateQueries`) y manejo de estados asíncronos.
- **Estado Global:** Zustand con persistencia en `localStorage` (Middlewares) para la sesión del usuario.
- **Autenticación:** Sistema basado en JWT inyectado globalmente mediante interceptores de Axios. Manejo de errores de autorización (401) global.
- **Formularios:** Validaciones estrictas con React Hook Form acoplado a Zod (`@hookform/resolvers/zod`).
- **UI & Estilos:** Tailwind CSS con componentes semánticos de Lucide React, siguiendo prácticas mobile-first. Calendario interactivo con FullCalendar.

## Roles del Sistema

- **Cliente (`cliente`):** 
  - Visualización del dashboard de estado de sus vehículos.
  - Creación de solicitudes de citas (Mantenimientos, reparaciones, etc).
  
- **Mecánico (`mecanico`):**
  - Recepción y gestión de solicitudes (Aceptar/Rechazar).
  - Visualización de calendario maestro de citas aceptadas.
  - Gestión de disponibilidad (Bloqueo de fechas por vacaciones o inhabilitación del taller).

Desarrollado como proyecto académico para la asignatura de Servicios Web.
