
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

// Bitácora types with complete schema
export interface BitacoraSupervisorData {
  // 1. Identificación de la Faena
  fecha_inicio_faena: string;
  hora_inicio_faena: string;
  fecha_termino_faena: string;
  hora_termino_faena: string;
  lugar_trabajo: string;
  tipo_trabajo: string;
  supervisor_nombre_matricula: string;
  
  // 2. Buzos y Asistentes (hasta 6)
  bs_personal: Array<{
    nombre: string;
    matricula: string;
    cargo: string;
    serie_profundimetro: string;
    color_profundimetro: string;
  }>;
  
  // 3. Equipos Usados (hasta 3 bloques)
  bs_equipos_usados: Array<{
    equipo: string;
    numero_registro: string;
  }>;
  
  // 4. Observaciones condiciones físicas previas
  observaciones_previas: string;
  
  // 5. Embarcación de Apoyo
  embarcacion_nombre_matricula: string;
  
  // 6. Tiempo de Buceo
  tiempo_total_buceo: string;
  incluye_descompresion: boolean;
  
  // 7. Contratista de Buceo
  contratista_nombre: string;
  
  // 8. Datos del Buzo Principal
  buzo_principal_datos: {
    apellido_paterno: string;
    apellido_materno: string;
    nombres: string;
    run: string;
  };
  
  // 9. Profundidades
  profundidad_trabajo_mts: number;
  profundidad_maxima_mts: number;
  requiere_camara_hiperbarica: boolean;
  
  // 10. Gestión Preventiva Según Decreto N°44
  gestprev_eval_riesgos_actualizada: boolean;
  gestprev_procedimientos_disponibles_conocidos: boolean;
  gestprev_capacitacion_previa_realizada: boolean;
  gestprev_identif_peligros_control_riesgos_subacuaticos_realizados: boolean;
  gestprev_registro_incidentes_reportados: boolean;
  
  // 11. Medidas Correctivas Implementadas
  medidas_correctivas_texto: string;
  
  // 12. Observaciones Generales
  observaciones_generales_texto: string;
  
  // 13. Firma
  supervisor_buceo_firma: string | null;
  inmersion_id?: string;
}

export interface BitacoraBuzoData {
  // 1. Identificación del Registro
  folio: string;
  codigo_verificacion: string;
  
  // 2. Datos Generales
  empresa_nombre: string;
  centro_nombre: string;
  fecha: string;
  
  // 3. Datos del Buzo
  buzo_nombre: string;
  buzo_rut: string;
  
  // 4. Datos del Supervisor
  supervisor_nombre: string;
  supervisor_rut: string;
  supervisor_correo: string;
  
  // 5. Otros Contactos
  jefe_centro_correo: string;
  contratista_nombre: string;
  contratista_rut: string;
  
  // 6. Condiciones Ambientales
  condamb_estado_puerto: "abierto" | "cerrado";
  condamb_estado_mar: string;
  condamb_temp_aire_c: number;
  condamb_temp_agua_c: number;
  condamb_visibilidad_fondo_mts: number;
  condamb_corriente_fondo_nudos: number;
  
  // 7. Datos Técnicos del Buceo
  datostec_equipo_usado: string;
  datostec_traje: string;
  datostec_profundidad_maxima: number;
  datostec_hora_dejo_superficie: string;
  datostec_hora_llegada_fondo: string;
  datostec_hora_salida_fondo: string;
  datostec_hora_llegada_superficie: string;
  
  // 8. Tiempos y Tabulación
  tiempos_total_fondo: string;
  tiempos_total_descompresion: string;
  tiempos_total_buceo: string;
  tiempos_tabulacion_usada: string;
  tiempos_intervalo_superficie?: string;
  tiempos_nitrogeno_residual?: string;
  tiempos_grupo_repetitivo_anterior?: string;
  tiempos_nuevo_grupo_repetitivo?: string;
  
  // 9. Objetivo del Buceo
  objetivo_proposito: string;
  objetivo_tipo_area: string;
  objetivo_caracteristicas_dimensiones: string;
  
  // 10. Condiciones y Certificaciones
  condcert_buceo_altitud: boolean;
  condcert_certificados_equipos_usados: boolean;
  condcert_buceo_areas_confinadas: boolean;
  condcert_observaciones?: string;
  
  // 11. Firma Final
  buzo_firma: string | null;
  validador_nombre?: string;
  validador_firma?: string | null;
  
  inmersion_id: string;
}
