
export interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  sitio_id?: string;
  salmonera_id?: string;
  contratista_id?: string;
  servicio_id?: string;
  equipo_buceo_id?: string;
  estado: 'activa' | 'completada' | 'suspendida';
  estado_aprobacion: 'pendiente' | 'aprobado' | 'rechazado';
  tareas?: string;
  created_at: string;
  updated_at: string;
  sitios?: {
    id: string;
    nombre: string;
    ubicacion: string;
  };
  salmoneras?: {
    id: string;
    nombre: string;
  };
  contratistas?: {
    id: string;
    nombre: string;
  };
}

export interface Sitio {
  id: string;
  nombre: string;
  codigo: string;
  ubicacion: string;
  salmonera_id: string;
  estado: string;
  observaciones?: string;
  profundidad_maxima?: number;
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  capacidad_jaulas?: number;
  created_at: string;
  updated_at: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id?: string;
  servicio_id?: string;
  perfil_completado: boolean;
  created_at: string;
  updated_at: string;
}
