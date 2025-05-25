
// Temporary types until Supabase regenerates the database types
export interface UsuarioRow {
  usuario_id: string;
  email: string | null;
  nombre: string;
  apellido: string;
  rol: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id: string | null;
  servicio_id: string | null;
  perfil_buzo: Record<string, any> | null;
  perfil_completado: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
  expires_at: string | null;
}

export interface NotificationSubscriptionRow {
  id: string;
  user_id: string;
  event_type: string;
  channel: 'app' | 'webhook' | 'email';
  enabled: boolean;
  created_at: string;
}
