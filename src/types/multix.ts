export interface DotacionMember {
  id: string;
  nombre: string;
  rut: string;
  rol: string;
  empresa: string;
}

export interface EquipoSuperficie {
  id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  estado: string;
}

export interface FaenaMantencion {
  id: string;
  tipo: 'red' | 'lobera' | 'peceras';
  estado: 'bueno' | 'regular' | 'malo' | 'critico' | 'reparado';
  metros_trabajados: number;
  observaciones: string;
}

export interface SistemaEquipo {
  sistema_id: string;
  nombre: string;
  categoria: string;
  estado_operacional: 'operativo' | 'mantenimiento' | 'falla' | 'no_disponible';
  observaciones: string;
}

export interface MultiXData {
  id?: string;
  codigo?: string;
  tipo_formulario: 'mantencion' | 'faena';
  operacion_id?: string;
  fecha: string;
  estado: 'borrador' | 'revision' | 'firmado';
  firmado: boolean;
  progreso: number;
  user_id?: string;

  // Encabezado general
  lugar_trabajo: string;
  temperatura?: number;
  hora_inicio: string;
  hora_termino: string;
  profundidad_max?: number;
  nave_maniobras: string;
  team_s: string;
  team_be: string;
  team_bi: string;
  matricula_nave: string;
  estado_puerto: string;

  // Secciones dinámicas
  dotacion: DotacionMember[];
  equipos_superficie: EquipoSuperficie[];
  faenas_mantencion: FaenaMantencion[];
  iconografia_simbologia: string[];
  sistemas_equipos: SistemaEquipo[];
  
  // Campos adicionales para futuras fases
  apoyo_faenas?: any[];
  resumen_inmersiones?: any[];
  contingencias?: string;
  observaciones_generales?: string;
  
  // Metadatos
  created_at?: string;
  updated_at?: string;
}
