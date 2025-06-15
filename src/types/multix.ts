
export interface MultiXData {
  // Encabezado general
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
  
  // Dotación
  dotacion: DotacionMiembro[];
  
  // Equipos superficie
  equipos_superficie: EquipoSuperficie[];
  
  // Datos específicos según tipo
  tipo_formulario: 'mantencion' | 'faena';
  
  // Mantención específica
  faenas_mantencion?: FaenaMantencion[];
  sistemas_equipos?: SistemasEquipos;
  apoyo_faenas?: ApoyoFaenas;
  
  // Faena específica
  supervisor_faena?: string;
  obs_generales?: string;
  iconografia?: Iconografia;
  matriz_actividades?: MatrizActividad[];
  cambio_pecera?: CambioPecera[];
  
  // Resumen común
  resumen?: ResumenInmersiones;
  contingencias?: Contingencias;
  firmas?: FirmasMultiX;
  
  // Control
  progreso: number;
  firmado: boolean;
  estado: 'borrador' | 'completado' | 'firmado';
}

export interface DotacionMiembro {
  id: string;
  rol: 'Supervisor' | 'Buzo Emergencia 1' | 'Buzo Emergencia 2' | 'Buzo N°1' | 'Buzo N°2' | 'Buzo N°3' | 'Buzo N°4' | 'Buzo N°5' | 'Buzo N°6' | 'Buzo N°7' | 'Buzo N°8';
  nombre: string;
  apellido: string;
  matricula: string;
  contratista: boolean;
  equipo: 'Liviano' | 'Mediano';
  hora_inicio_buzo?: string;
  hora_fin_buzo?: string;
  profundidad?: number;
}

export interface EquipoSuperficie {
  id: string;
  equipo_sup: 'Compresor 1' | 'Compresor 2';
  matricula_eq: string;
  horometro_ini: number;
  horometro_fin: number;
}

export interface FaenaMantencion {
  id: string;
  tipo: 'Red' | 'Lobera' | 'Peceras';
  jaulas: string;
  cantidad: number;
  ubicacion: string;
  tipo_rotura: '2×1' | '2×2' | '>2×2';
  retensado: boolean;
  descostura: boolean;
  objetos: boolean;
  otros: string;
  obs_faena: string;
}

export interface SistemasEquipos {
  jaulas_sist: string;
  tipo_trabajo_sist: ('Instalación' | 'Mantención' | 'Recuperación' | 'Limpieza' | 'Ajuste')[];
  focos: number;
  extractor: number;
  aireacion: number;
  oxigenacion: number;
  otros_sist: string;
  obs_sist: string;
}

export interface ApoyoFaenas {
  tipo_apoyo: 'Baños' | 'Cosecha';
  seccion_apoyo: ('Red' | 'Lobera' | 'Peceras')[];
  jaulas_apoyo: string;
  actividades_apoyo: ('Soltar-reinstalar tensores' | 'Reparación red')[];
  cantidad_apoyo: number;
  obs_apoyo: string;
}

export interface Iconografia {
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

export interface MatrizActividad {
  id: string;
  actividad: string;
  jaula_origen: string;
  jaula_destino: string;
  contrapesos_250: number;
  contrapesos_1500: number;
}

export interface CambioPecera {
  buzo_num: number;
  jaulas_buzo: string;
  actividades_buzo: { actividad: string; cantidad: number }[];
}

export interface ResumenInmersiones {
  total_inmersiones: number;
  horas_navegacion: number;
  cabotaje_perdida: number;
  rev_documental: number;
  relevo: number;
}

export interface Contingencias {
  mortalidad: string;
  bloom_algas: string;
  observaciones_generales: string;
}

export interface FirmasMultiX {
  supervisor_nombre: string;
  supervisor_firma: string;
  jefe_centro_nombre: string;
  jefe_centro_firma: string;
}

export interface MultiXFormData {
  operacion_id: string;
  codigo: string;
  tipo_formulario: 'mantencion' | 'faena';
  multix_data: MultiXData;
}
