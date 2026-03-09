export type RolUsuario = 'cliente' | 'mecanico';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

export interface LoginResponse {
  access_token: string;
  user: Usuario;
}
