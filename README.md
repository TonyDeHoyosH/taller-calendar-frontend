# Mechanic Pro System

Sistema integral de gestion de servicios para talleres mecanicos diseñado para optimizar el flujo de trabajo entre clientes y especialistas. Construido sobre una arquitectura moderna y escalable que garantiza robustez en cada interaccion.

## Filosofia de Desarrollo

Este proyecto implementa un modelo de desarrollo hibrido. Se ha utilizado Inteligencia Artificial avanzada como catalizador para la generacion de codigo y optimizacion de procesos, manteniendo siempre la supervision humana como eje central. Cada decision arquitectonica, seleccion de librerias y validacion de logica ha sido ejecutada y refinada por el equipo de ingenieria, asegurando que la IA actue como un potente motor de productividad bajo un criterio tecnico riguroso.

## Arquitectura Tecnica

El ecosistema se basa en tecnologias lideres en la industria para ofrecer una experiencia de usuario fluida y un mantenimiento simplificado.

- **Nucleo:** Next.js 14 con App Router para una navegacion optimizada y renderizado eficiente.
- **Gestion de Datos:** TanStack Query (React Query) para la sincronizacion de estado con el servidor, manejo de cache y revalidaciones en tiempo real.
- **Estado Global:** Zustand con persistencia para una gestion de sesion ligera y reactiva.
- **Capa de Estilos:** Tailwind CSS implementado bajo principios de diseño atomico y responsividad total.
- **Seguridad:** Interceptores de Axios para la inyeccion de JWT y manejo centralizado de excepciones de autorizacion.
- **Integridad de Datos:** Validaciones estrictas en tiempo de ejecucion mediante Zod y React Hook Form.

## Funcionalidades Core

### Administracion de Servicios (Mecanico)
- Gestion inteligente de solicitudes de citas (Aceptacion/Rechazo).
- Calendario maestro interactivo para el control de la carga de trabajo.
- Sistema de bloqueos temporales para gestion de disponibilidad y feriados.

### Experiencia del Cliente
- Portal de seguimiento de estado de reparaciones.
- Sistema de solicitudes intuitivo con detalle de fallas.
- Historial de servicios vinculados a la cuenta.

## Requisitos y Despliegue

### Requisitos Locales
- Node.js 18.x o superior.
- Instancia del backend activa.

### Instalacion Rapida
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar entorno:
   ```bash
   cp .env.example .env.local
   ```
3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

## Especificaciones de Proyecto

Desarrollado como proyecto de integracion para la asignatura de Servicios Web. El enfoque se centra en la excelencia tecnica y la implementacion de patrones de diseño modernos.
