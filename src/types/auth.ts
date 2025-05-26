
// Database row types for manual typing
export interface UsuarioRow {
  usuario_id: string;
  email: string | null;
  nombre: string;
  apellido: string;
  rol: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id: string | null;
  servicio_id: string | null;
  perfil_buzo: any;
  perfil_completado: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface SalmoneraContratista {
  id: string;
  salmonera_id: string;
  contratista_id: string;
  fecha_asociacion: string;
  estado: 'activo' | 'inactivo';
  created_at: string;
  updated_at: string;
}

export interface EquipoBuceoMiembro {
  id: string;
  equipo_id: string;
  usuario_id: string;
  rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  disponible: boolean;
  created_at: string;
  updated_at: string;
}
