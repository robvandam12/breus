
import { Json } from "@/integrations/supabase/types";

export interface Dotacion {
  id: string;
  nombre: string;
  apellido: string;
  rut: string;
  rol: 'buzo' | 'supervisor' | 'jefe_faena' | 'paramedico' | 'buzo_1' | 'buzo_2' | 'buzo_3' | 'buzo_4' | 'buzo_5' | 'buzo_6' | 'buzo_7' | 'buzo_8' | 'buzo_emergencia_1' | 'buzo_emergencia_2';
  horas_trabajadas: number;
  matricula: string;
  contratista: boolean;
  equipo: 'liviano' | 'mediano';
  hora_inicio_buzo: string;
  hora_fin_buzo: string;
  profundidad: number;
}

export type DotacionBuceo = Dotacion;

export interface EquipoSuperficie {
  id: string;
  equipo_sup: 'compresor_1' | 'compresor_2';
  matricula_eq: string;
  horometro_ini: number;
  horometro_fin: number;
}

export interface FaenaMantencion {
  id: string;
  tipo_mantencion: string;
  cantidad: number;
  unidad: string;
  descripcion_trabajo: string;
  tipo_seccion: 'red' | 'lobera' | 'peceras';
  jaulas: string;
  ubicacion: string;
  tipo_rotura: '2x1' | '2x2' | 'mayor_2x2';
  retensado: boolean;
  descostura: boolean;
  objetos: boolean;
  otros: string;
  obs_faena: string;
}

export interface FaenaRed {
  id: string;
  jaula_red: string;
  tipo_red: string;
  tipo_actividad: string[];
  descripcion_actividad: string;
  materiales_utilizados: string;
  cantidad_materiales: number;
  unidad_materiales: string;
  tiempo_inicio: string;
  tiempo_termino: string;
  observaciones_red: string;
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
  tipo_apoyo: string;
  cantidad_apoyo: number;
  unidad_apoyo: string;
  descripcion_apoyo: string;
  seccion_apoyo: string[];
  jaulas_apoyo: string;
  actividades_apoyo: string[];
  obs_apoyo: string;
}

export interface ResumenInmersiones {
  id: string;
  nombre_piloto: string;
  horas_piloto: number;
  tipo_nave: string;
  obs_inmersiones: string;
  total_inmersiones: number;
  horas_navegacion: number;
  cabotaje_perdida: number;
  rev_documental: number;
  relevo: number;
}

export interface Contingencias {
  mortalidad?: string;
  bloom_algas?: string;
  escape_peces?: string;
  dana_red?: string;
  falla_equipos?: string;
  condiciones_mar?: string;
  accidentes?: string;
  otros_eventos?: string;
  observaciones_contingencias?: string;
  observaciones_generales?: string;
}

export interface Firmas {
  supervisor_nombre: string;
  supervisor_firma: string;
  jefe_centro_nombre: string;
  jefe_centro_firma: string;
  fecha_firma: string;
  codigo_verificacion: string;
}

export interface NetworkMaintenanceData {
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

  // Dotación y equipos
  dotacion: Dotacion[];
  equipos_superficie: EquipoSuperficie[];

  // Faenas
  faenas_mantencion: FaenaMantencion[];
  faenas_redes?: FaenaRed[];

  // Sistemas y equipos
  sistemas_equipos?: SistemaEquipo[];

  // Apoyo a faenas
  apoyo_faenas?: ApoyoFaena[];

  // Resumen
  resumen_inmersiones?: ResumenInmersiones;

  // Contingencias
  contingencias?: Contingencias;

  // Firmas
  firmas?: Firmas;

  // Campos adicionales para el resumen y firmas
  observaciones_finales?: string;
  supervisor_responsable?: string;
  firma_digital?: string;

  // Control del formulario
  progreso: number;
  firmado: boolean;
  estado: 'borrador' | 'en_revision' | 'completado' | 'firmado';
  tipo_formulario: 'mantencion' | 'faena_redes';
}
