
export interface NetworkMaintenanceData {
  // Datos generales
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  lugar_trabajo: string;
  temperatura: number;
  profundidad_max: number;
  estado_puerto: string;
  nave_maniobras: string;
  matricula_nave: string;
  
  // Teams
  team_s: string;
  team_be: string;
  team_bi: string;
  
  // Dotación y equipos
  dotacion: DotacionBuceo[];
  equipos_superficie: EquipoSuperficie[];
  
  // Faenas específicas
  faenas_mantencion: FaenaMantencion[];
  faenas_redes: FaenaRedes[];
  
  // Sistemas y equipos
  sistemas_equipos?: SistemaEquipo[];
  
  // Apoyo a faenas
  apoyo_faenas?: ApoyoFaena[];
  
  // Resumen de inmersiones
  resumen_inmersiones?: ResumenInmersiones;
  
  // Contingencias
  contingencias?: Contingencias;
  
  // Resumen y firmas
  observaciones_finales?: string;
  supervisor_responsable?: string;
  firma_digital?: string;
  
  // Control de formulario
  progreso: number;
  firmado: boolean;
  estado: 'borrador' | 'completado' | 'aprobado';
  tipo_formulario?: 'mantencion' | 'faena_redes';
}

export interface DotacionBuceo {
  id: string;
  nombre: string;
  apellido?: string;
  rol: 'supervisor' | 'buzo_emergencia_1' | 'buzo_emergencia_2' | 'buzo_1' | 'buzo_2' | 'buzo_3' | 'buzo_4' | 'buzo_5' | 'buzo_6' | 'buzo_7' | 'buzo_8';
  matricula?: string;
  equipo?: 'liviano' | 'mediano';
  hora_inicio_buzo?: string;
  hora_fin_buzo?: string;
  profundidad?: number;
  contratista?: boolean;
}

export interface EquipoSuperficie {
  id: string;
  equipo_sup: 'compresor_1' | 'compresor_2';
  matricula_eq: string;
  horometro_ini: number;
  horometro_fin: number;
}

export interface FaenaMantencion {
  id: string;
  jaulas: string;
  cantidad: number;
  ubicacion: string;
  tipo_rotura: '2x1' | '2x2' | '>2x2';
  retensado: boolean;
  descostura: boolean;
  objetos: boolean;
  otros: string;
  obs_faena: string;
}

export interface FaenaRedes {
  id: string;
  tipo_trabajo: 'instalacion' | 'cambio' | 'reparacion' | 'inspeccion' | 'limpieza';
  ubicacion: string;
  jaula_numero?: string;
  red_tipo: string;
  dimensiones: string;
  hora_inicio: string;
  hora_fin: string;
  personal_asignado: string[];
  materiales_usados: string;
  estado_completado: boolean;
  observaciones: string;
}

export interface SistemaEquipo {
  id: string;
  jaulas_sist: string;
  tipo_trabajo_sist: string[];
  focos: number;
  extractor: number;
  aireacion: number;
  oxigenacion: number;
  otros_sist: string;
  obs_sist: string;
}

export interface ApoyoFaena {
  id: string;
  tipo_apoyo: 'baños' | 'cosecha';
  seccion_apoyo: string[];
  jaulas_apoyo: string;
  actividades_apoyo: string[];
  cantidad_apoyo: number;
  obs_apoyo: string;
}

export interface ResumenInmersiones {
  total_inmersiones: number;
  horas_navegacion: number;
  cabotaje_perdida: number;
  rev_documental: number;
  relevo: number;
}

export interface Contingencias {
  mortalidad?: number;
  bloom_algas?: number;
  observaciones_generales?: string;
}

// Para Boleta de Faena de Redes
export interface IconografiaData {
  icono_c1500: boolean;
  icono_c250_lob: boolean;
  icono_c250_pec: boolean;
  tensores_30: boolean;
  tensores_15: boolean;
  sembrado: boolean;
  cono: boolean;
  pajarera: boolean;
  lobera_inst: boolean;
  pecera_inst: boolean;
  talonera: boolean;
  pertigas: boolean;
  tensores_pec: boolean;
  surgencia: boolean;
}

export interface MatrizRedData {
  jaula_origen: string;
  jaula_destino: string;
  contrapesos_250: number;
  contrapesos_1500: number;
  actividad: string;
}

export interface BuzoTareas {
  buzo_num: number;
  jaulas_buzo: string;
  actividades_buzo: { actividad: string; cantidad: number }[];
}

// Interfaz para el formulario de Mantención de Redes
export interface NetworkMaintenanceFormData {
  operacion_id: string;
  codigo: string;
  tipo_formulario: 'mantencion' | 'faena_redes';
  network_maintenance_data: NetworkMaintenanceData;
  
  // Específico para Faena de Redes
  supervisor_faena?: string;
  obs_generales?: string;
  iconografia?: IconografiaData;
  matriz_red?: MatrizRedData[];
  buzo_tareas?: BuzoTareas[];
}

// Firmas digitales
export interface FirmasDigitales {
  supervisor_nombre: string;
  supervisor_firma: string;
  jefe_centro_nombre: string;
  jefe_centro_firma: string;
  fecha_firma?: string;
  firmado: boolean;
}
