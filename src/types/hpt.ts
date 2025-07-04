// ============= Types for HPT (Hoja de Planificación de Trabajo) =============

export interface HPTBase {
  id: string;
  codigo: string;
  supervisor: string;
  plan_trabajo: string;
  operacion_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  fecha_creacion: string;
  firmado: boolean;
  estado: 'borrador' | 'firmado' | 'cancelado' | 'en_progreso';
  progreso: number;
}

export interface HPT extends HPTBase {
  // Datos básicos
  folio?: string;
  fecha?: string;
  fecha_programada?: string;
  hora_inicio?: string;
  hora_fin?: string;
  hora_termino?: string;
  
  // Información del trabajo
  descripcion_trabajo?: string;
  descripcion_tarea?: string;
  profundidad_maxima?: number;
  temperatura?: number;
  observaciones?: string;
  es_rutinaria?: boolean;
  
  // Ubicación y contexto
  lugar_especifico?: string;
  estado_puerto?: string;
  empresa_servicio_nombre?: string;
  centro_trabajo_nombre?: string;
  
  // Personal
  supervisor_nombre?: string;
  jefe_mandante_nombre?: string;
  supervisor_servicio_id?: string;
  supervisor_mandante_id?: string;
  
  // Equipos y recursos
  buzos?: HPTBuzo[];
  asistentes?: HPTAsistente[];
  herramientas?: HPTHerramienta[];
  equipo_buceo?: HPTEquipoBuceo[];
  equipo_seguridad?: HPTEquipoSeguridad[];
  equipo_comunicacion?: HPTEquipoComunicacion[];
  contactos_emergencia?: HPTContactoEmergencia[];
  
  // Riesgos y medidas
  riesgos_identificados?: HPTRiesgo[];
  medidas_control?: HPTMedidaControl[];
  
  // Plan de emergencia
  plan_emergencia?: string;
  camara_hiperbarica?: string;
  hospital_cercano?: string;
  
  // Condiciones ambientales
  visibilidad?: string;
  corrientes?: string;
  
  // Firmas y validaciones
  jefe_obra?: string;
  jefe_obra_firma?: string;
  jefe_operaciones_firma?: string;
  supervisor_firma?: string;
  
  // Datos estructurados (JSON)
  hpt_epp?: HPTJsonData;
  hpt_erc?: HPTJsonData;
  hpt_medidas?: HPTJsonData;
  hpt_riesgos_comp?: HPTJsonData;
  hpt_conocimiento?: HPTJsonData;
  hpt_conocimiento_asistentes?: HPTAsistente[];
  hpt_firmas?: HPTFirmas;
  
  // Versioning y empresa
  form_version?: number;
  company_id?: string;
  company_type?: 'salmonera' | 'contratista';
  
  // Tipo de trabajo
  tipo_trabajo?: string;
}

// Sub-interfaces para los datos estructurados
export interface HPTBuzo {
  nombre: string;
  apellido?: string;
  matricula?: string;
  rol: 'principal' | 'asistente';
  certificaciones?: string[];
}

export interface HPTAsistente {
  nombre: string;
  apellido?: string;
  empresa: string;
  rut?: string;
  firma_url?: string;
}

export interface HPTHerramienta {
  nombre: string;
  tipo: string;
  cantidad: number;
  estado: 'bueno' | 'regular' | 'malo';
}

export interface HPTEquipoBuceo {
  tipo: string;
  modelo?: string;
  numero_serie?: string;
  estado: 'operativo' | 'mantenimiento' | 'fuera_servicio';
  ultima_revision?: string;
}

export interface HPTEquipoSeguridad {
  tipo: string;
  descripcion?: string;
  cantidad: number;
  verificado: boolean;
}

export interface HPTEquipoComunicacion {
  tipo: string;
  frecuencia?: string;
  alcance?: string;
  estado: 'operativo' | 'standby' | 'fuera_servicio';
}

export interface HPTContactoEmergencia {
  nombre: string;
  telefono: string;
  tipo: 'camara_hiperbarica' | 'hospital' | 'rescate' | 'coordinacion';
  disponibilidad: '24h' | 'horario_comercial';
}

export interface HPTRiesgo {
  descripcion: string;
  probabilidad: 'alta' | 'media' | 'baja';
  severidad: 'alta' | 'media' | 'baja';
  categoria: 'tecnico' | 'ambiental' | 'humano' | 'equipos';
  medidas_preventivas: string[];
}

export interface HPTMedidaControl {
  descripcion: string;
  tipo: 'preventiva' | 'correctiva' | 'emergencia';
  responsable: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface HPTJsonData {
  [key: string]: any;
}

export interface HPTFirmas {
  supervisor?: HPTFirma;
  jefe_obra?: HPTFirma;
  jefe_operaciones?: HPTFirma;
  asistentes?: HPTFirma[];
}

export interface HPTFirma {
  nombre: string;
  firma: string;
  fecha: string;
  hora: string;
}

// Form data interface para crear/editar HPT
export interface HPTFormData {
  codigo: string;
  supervisor: string;
  operacion_id: string;
  plan_trabajo: string;
  fecha_programada?: string;
  hora_inicio?: string;
  hora_fin?: string;
  hora_termino?: string;
  descripcion_trabajo?: string;
  descripcion_tarea?: string;
  profundidad_maxima?: number;
  temperatura?: number;
  observaciones?: string;
  es_rutinaria?: boolean;
  lugar_especifico?: string;
  estado_puerto?: string;
  empresa_servicio_nombre?: string;
  centro_trabajo_nombre?: string;
  supervisor_nombre?: string;
  jefe_mandante_nombre?: string;
  tipo_trabajo?: string;
  folio?: string;
  fecha?: string;
  plan_emergencia?: string;
  camara_hiperbarica?: string;
  hospital_cercano?: string;
  visibilidad?: string;
  corrientes?: string;
  jefe_obra?: string;
  
  // Arrays estructurados
  buzos?: HPTBuzo[];
  asistentes?: HPTAsistente[];
  herramientas?: HPTHerramienta[];
  equipo_buceo?: HPTEquipoBuceo[];
  equipo_seguridad?: HPTEquipoSeguridad[];
  equipo_comunicacion?: HPTEquipoComunicacion[];
  contactos_emergencia?: HPTContactoEmergencia[];
  riesgos_identificados?: HPTRiesgo[];
  medidas_control?: HPTMedidaControl[];
  
  // JSON data
  hpt_epp?: HPTJsonData;
  hpt_erc?: HPTJsonData;
  hpt_medidas?: HPTJsonData;
  hpt_riesgos_comp?: HPTJsonData;
  hpt_conocimiento?: HPTJsonData;
  hpt_conocimiento_asistentes?: HPTAsistente[];
}

// Interface para datos básicos de HPT (usado en listas y referencias)
export interface HPTData {
  id: string;
  codigo: string;
  supervisor: string;
  firmado: boolean;
  estado: 'borrador' | 'firmado' | 'cancelado' | 'en_progreso';
  fecha_creacion: string;
  operacion_id: string;
}

// Response interface para queries con relaciones
export interface HPTWithOperacion extends HPT {
  operacion?: {
    id: string;
    codigo: string;
    nombre: string;
    salmonera_id?: string;
    contratista_id?: string;
    salmoneras?: { nombre: string } | null;
    centros?: { nombre: string } | null;
    contratistas?: { nombre: string } | null;
  };
}