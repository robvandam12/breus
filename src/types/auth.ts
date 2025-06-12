
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
  estado_buzo: 'activo' | 'inactivo' | 'suspendido' | null;
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

export interface BitacoraBuzoData {
  folio: string;
  codigo_verificacion: string;
  empresa_nombre: string;
  centro_nombre: string;
  fecha: string;
  buzo_nombre: string;
  buzo_rut: string;
  supervisor_nombre: string;
  supervisor_rut: string;
  supervisor_correo: string;
  jefe_centro_correo: string;
  contratista_nombre: string;
  contratista_rut: string;
  condamb_estado_puerto: string;
  condamb_estado_mar: string;
  condamb_temp_aire_c: number;
  condamb_temp_agua_c: number;
  condamb_visibilidad_fondo_mts: number;
  condamb_corriente_fondo_nudos: number;
  datostec_equipo_usado: string;
  datostec_traje: string;
  profundidad_maxima: number;
  datostec_hora_dejo_superficie: string;
  datostec_hora_llegada_fondo: string;
  datostec_hora_salida_fondo: string;
  datostec_hora_llegada_superficie: string;
  tiempos_total_fondo: string;
  tiempos_total_descompresion: string;
  tiempos_total_buceo: string;
  tiempos_tabulacion_usada: string;
  tiempos_intervalo_superficie: string;
  tiempos_nitrogeno_residual: string;
  tiempos_grupo_repetitivo_anterior: string;
  tiempos_nuevo_grupo_repetitivo: string;
  objetivo_proposito: string;
  objetivo_tipo_area: string;
  objetivo_caracteristicas_dimensiones: string;
  condcert_buceo_altitud: boolean;
  condcert_certificados_equipos_usados: boolean;
  condcert_buceo_areas_confinadas: boolean;
  condcert_observaciones: string;
  validador_nombre: string;
  buzo_firma?: any;
  validador_firma?: any;
  inmersion_id: string;
}
