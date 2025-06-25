
export interface UsuarioRow {
  usuario_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id?: string;
  servicio_id?: string;
  created_at: string;
  updated_at: string;
  perfil_buzo?: any;
}
