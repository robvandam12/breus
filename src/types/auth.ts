
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

export interface BitacoraBuzoData {
  // Datos generales
  folio?: string;
  codigo?: string;
  fecha?: string;
  inmersion_id?: string;
  
  // Datos del buzo
  buzo?: string;
  buzo_rut?: string;
  buzo_nombre?: string; // Added missing property
  
  // Datos del supervisor
  supervisor_nombre?: string;
  supervisor_rut?: string;
  supervisor_correo?: string;
  
  // Datos técnicos
  profundidad_maxima?: number;
  datostec_equipo_usado?: string;
  datostec_traje?: string;
  datostec_hora_dejo_superficie?: string;
  datostec_hora_llegada_fondo?: string;
  datostec_hora_salida_fondo?: string;
  datostec_hora_llegada_superficie?: string;
  
  // Condiciones ambientales
  condamb_temp_aire_c?: number;
  condamb_temp_agua_c?: number;
  condamb_visibilidad_fondo_mts?: number;
  condamb_corriente_fondo_nudos?: number;
  condamb_estado_mar?: string;
  condamb_estado_puerto?: string;
  
  // Tiempos
  tiempos_total_fondo?: string;
  tiempos_total_descompresion?: string;
  tiempos_total_buceo?: string;
  tiempos_grupo_repetitivo_anterior?: string;
  tiempos_nuevo_grupo_repetitivo?: string;
  tiempos_nitrogeno_residual?: string;
  tiempos_intervalo_superficie?: string;
  tiempos_tabulacion_usada?: string;
  
  // Objetivo del trabajo
  objetivo_proposito?: string;
  objetivo_tipo_area?: string;
  objetivo_caracteristicas_dimensiones?: string;
  
  // Condiciones y certificaciones
  condcert_buceo_areas_confinadas?: boolean;
  condcert_buceo_altitud?: boolean;
  condcert_certificados_equipos_usados?: boolean;
  condcert_observaciones?: string;
  
  // Estado físico
  estado_fisico_post?: string;
  
  // Trabajo realizado
  trabajos_realizados?: string;
  
  // Observaciones técnicas
  observaciones_tecnicas?: string;
  
  // Datos de la empresa
  empresa_nombre?: string;
  centro_nombre?: string;
  contratista_nombre?: string;
  contratista_rut?: string;
  
  // Contactos
  jefe_centro_correo?: string;
  
  // Firmas y validación
  buzo_firma?: string;
  firmado?: boolean;
  estado_aprobacion?: string;
  codigo_verificacion?: string;
  validador_nombre?: string;
  comentarios_aprobacion?: string;
  fecha_aprobacion?: string;
  aprobada_por?: string;
}

export interface SalmoneraFormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  estado?: string;
}

export interface ContratistaFormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  contacto_principal?: string;
  certificaciones?: string[];
  especialidades?: string[];
  estado?: string; // Added missing property
}
