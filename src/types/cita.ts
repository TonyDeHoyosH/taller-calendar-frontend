export type EstadoCita = 'pendiente' | 'aceptada' | 'rechazada' | 'cancelada' | 'en_curso' | 'completada';

export interface Cita {
  id: string | number;
  cliente_id?: number;
  tipo_servicio_id?: number;
  servicio?: number;
  modelo_auto?: string;
  vehiculo_modelo?: string;
  descripcion_problema?: string;
  descripcion?: string;
  fecha_inicio?: string;
  fecha_preferida?: string;
  fecha_fin?: string;
  estado: EstadoCita;
  usuario?: {
    nombre: string;
    email: string;
  };
}

export interface CreateCitaDTO {
  servicio: number;
  vehiculo_modelo: string;
  descripcion: string;
  fecha_preferida: string;
}
