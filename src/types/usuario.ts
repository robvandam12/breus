
export interface Usuario {
  usuario_id: string;
  nombre: string;
  apellido: string;
  email?: string;
  rol: 'buzo' | 'supervisor' | 'admin' | 'jefe_faena';
  estado_buzo: 'activo' | 'inactivo' | 'suspendido';
  perfil_completado: boolean;
  created_at: string;
  updated_at: string;
  salmonera_id?: string;
  servicio_id?: string;
  perfil_buzo?: any;
  salmonera?: {
    nombre: string;
    rut: string;
  };
  contratista?: {
    nombre: string;
    rut: string;
  };
}
