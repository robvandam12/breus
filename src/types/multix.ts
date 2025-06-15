
export interface MultiXFormData {
  // Encabezado general
  lugar_trabajo: string;
  fecha: string;
  temperatura?: number;
  hora_inicio?: string;
  hora_termino?: string;
  profundidad_max?: number;
  nave_maniobras?: string;
  team_s?: string;
  team_be?: string;
  team_bi?: string;
  matricula_nave?: string;
  estado_puerto?: string;
  
  // Secciones dinámicas
  dotacion: DotacionMember[];
  equipos_superficie: EquipoSuperficie[];
  
  // Datos específicos por tipo
  multix_data?: Record<string, any>;
}

export interface DotacionMember {
  id?: string;
  rol: string;
  nombre?: string;
  apellido?: string;
  matricula?: string;
  contratista?: boolean;
  equipo?: string;
  hora_inicio_buzo?: string;
  hora_fin_buzo?: string;
  profundidad?: number;
  orden?: number;
}

export interface EquipoSuperficie {
  id?: string;
  equipo_sup?: string;
  matricula_eq?: string;
  horometro_ini?: number;
  horometro_fin?: number;
  orden?: number;
}

export interface MultiXRecord {
  id: string;
  codigo: string;
  tipo_formulario: 'mantencion' | 'faena';
  operacion_id?: string;
  fecha: string;
  estado: 'borrador' | 'revision' | 'firmado';
  firmado: boolean;
  progreso: number;
  user_id: string;
  
  // Encabezado
  lugar_trabajo?: string;
  temperatura?: number;
  hora_inicio?: string;
  hora_termino?: string;
  profundidad_max?: number;
  nave_maniobras?: string;
  team_s?: string;
  team_be?: string;
  team_bi?: string;
  matricula_nave?: string;
  estado_puerto?: string;
  
  multix_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  dotacion?: DotacionMember[];
  equipos_superficie?: EquipoSuperficie[];
}

export const ROLES_BUCEO = [
  'Supervisor',
  'Buzo Emergencia 1',
  'Buzo Emergencia 2',
  'Buzo N°1',
  'Buzo N°2',
  'Buzo N°3',
  'Buzo N°4',
  'Buzo N°5',
  'Buzo N°6',
  'Buzo N°7',
  'Buzo N°8'
];

export const TIPOS_EQUIPO = [
  'Liviano',
  'Mediano'
];

export const EQUIPOS_SUPERFICIE = [
  'Compresor 1',
  'Compresor 2'
];

export const ESTADOS_PUERTO = [
  'Calmo',
  'Mareada',
  'Agitado',
  'Temporal'
];
