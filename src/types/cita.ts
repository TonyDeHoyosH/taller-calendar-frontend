export type EstadoCita = 'pendiente' | 'aceptada' | 'rechazada' | 'cancelada';

export interface Cita {
  id: number;
  cliente_id: number;
  tipo_servicio_id: number;
  modelo_auto: string;
  descripcion_problema: string;
  fecha_inicio: string; // Formato YYYY-MM-DD
  fecha_fin?: string;
  estado: EstadoCita;
}

export interface CreateCitaDTO {
  cliente_id: number;
  tipo_servicio_id: number;
  modelo_auto: string;
  descripcion_problema: string;
  fecha_inicio: string; // Formato YYYY-MM-DD
}
