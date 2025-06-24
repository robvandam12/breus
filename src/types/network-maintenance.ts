
export interface NetworkMaintenanceData {
  // Encabezado General
  lugar_trabajo: string;
  fecha: string;
  temperatura: number;
  hora_inicio: string;
  hora_termino: string;
  profundidad_max: number;
  nave_maniobras: string;
  team_s: string;
  team_be: string;
  team_bi: string;
  matricula_nave: string;
  estado_puerto: string;
  
  // Campos específicos para Faena de Redes
  supervisor_faena?: string;
  obs_generales?: string;
  
  // Dotación y equipos
  dotacion: DotacionBuceo[];
  equipos_superficie: EquipoSuperficie[];
  
  // Faenas específicas
  faenas_mantencion: FaenaMantencion[];
  
  // Sistemas y equipos (Sección 1.5)
  sistemas_equipos?: SistemaEquipo[];
  
  // Apoyo a faenas (Sección 1.6)
  apoyo_faenas?: ApoyoFaena[];
  
  // Resumen inmersiones (Sección 1.7)
  resumen_inmersiones?: ResumenInmersiones;
  
  // Contingencias (Sección 1.8)
  contingencias?: Contingencias;
  
  // Iconografía para Faena de Redes (Sección 2.2)
  iconografia?: IconografiaRedes;
  
  // Matriz Red/Lobera/Peceras (Sección 2.3)
  matriz_redes?: MatrizRedes[];
  
  // Tareas por buzo (Sección 2.4)
  tareas_buzos?: TareaBuzo[];
  
  // Firmas digitales (Sección 1.9)
  firmas?: FirmasDigitales;
  
  // Control de formulario
  progreso: number;
  firmado: boolean;
  estado: 'borrador' | 'completado' | 'pendiente_firma' | 'firmado';
  tipo_formulario: 'mantencion' | 'faena_redes';
}

export interface DotacionBuceo {
  id: string;
  rol: 'supervisor' | 'buzo_emergencia_1' | 'buzo_emergencia_2' | 'buzo_1' | 'buzo_2' | 'buzo_3' | 'buzo_4' | 'buzo_5' | 'buzo_6' | 'buzo_7' | 'buzo_8';
  nombre: string;
  apellido: string;
  matricula: string;
  contratista: boolean;
  equipo: 'liviano' | 'mediano';
  hora_inicio_buzo?: string;
  hora_fin_buzo?: string;
  profundidad?: number;
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
  tipo_seccion: 'red' | 'lobera' | 'peceras';
  jaulas: string;
  cantidad: number;
  ubicacion: string;
  tipo_rotura: '2x1' | '2x2' | 'mayor_2x2';
  retensado: boolean;
  descostura: boolean;
  objetos: boolean;
  otros: string;
  obs_faena: string;
}

export interface SistemaEquipo {
  id: string;
  jaulas_sist: string;
  tipo_trabajo_sist: string[]; // Multiple selection
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
  seccion_apoyo: string[]; // Multiple: 'red', 'lobera', 'peceras'
  jaulas_apoyo: string;
  actividades_apoyo: string[]; // Multiple activities
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
  mortalidad?: string;
  bloom_algas?: string;
  observaciones_generales?: string;
  [key: string]: string | undefined;
}

export interface IconografiaRedes {
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

export interface MatrizRedes {
  id: string;
  actividad: 'TC' | 'CED' | 'CES' | 'MA';
  jaula_origen: string;
  jaula_destino: string;
  contrapesos_250: number;
  contrapesos_1500: number;
}

export interface TareaBuzo {
  id: string;
  buzo_num: number;
  jaulas_buzo: string;
  actividades_buzo: ActividadBuzo[];
}

export interface ActividadBuzo {
  actividad: string;
  cantidad: number;
}

export interface FirmasDigitales {
  supervisor_nombre: string;
  supervisor_firma?: string;
  jefe_centro_nombre: string;
  jefe_centro_firma?: string;
  fecha_firma?: string;
  codigo_verificacion?: string;
}

// Interfaz para el formulario completo
export interface NetworkMaintenanceFormData {
  operacion_id?: string;
  codigo: string;
  tipo_formulario: 'mantencion' | 'faena_redes';
  network_maintenance_data: NetworkMaintenanceData;
}

// Alias para compatibilidad
export type DotacionMiembro = DotacionBuceo;
