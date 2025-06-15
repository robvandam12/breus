
import type { SecurityAlert } from './security';

export interface Inmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin: string | null;
  operacion_id: string;
  buzo_principal: string;
  buzo_principal_id: string | null;
  buzo_asistente: string | null;
  buzo_asistente_id: string | null;
  supervisor: string;
  supervisor_id: string | null;
  objetivo: string;
  estado: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones: string | null;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  created_at: string;
  updated_at: string;
  operacion_nombre?: string;
  operacion?: OperationData;
  current_depth: number | null;
  planned_bottom_time: number | null;
  depth_history: Array<{ depth: number; timestamp: string }> | null;
  security_alerts?: SecurityAlert[];
}

export interface BuzoInmersion extends Inmersion {
  operacionNombre: string;
  salmoneraNombre: string;
  sitioNombre: string;
  rol: 'Principal' | 'Asistente';
}

export interface ValidationStatus {
  hasValidHPT: boolean;
  hasValidAnexoBravo: boolean;
  hasTeam: boolean;
  canExecute: boolean;
  hptCode?: string;
  anexoBravoCode?: string;
}

export interface OperationData {
  id: string;
  codigo: string;
  nombre: string;
  equipo_buceo_id?: string;
  salmoneras?: { nombre: string } | null;
  sitios?: { nombre: string } | null;
  contratistas?: { nombre: string } | null;
}

export interface HPTData {
  id: string;
  codigo: string;
  supervisor: string;
  firmado: boolean;
}

export interface AnexoBravoData {
  id: string;
  codigo: string;
  supervisor: string;
  firmado: boolean;
}

export interface EquipoBuceoData {
  id: string;
  nombre: string;
  miembros: Array<{
    usuario_id: string;
    rol_equipo: string;
    nombre?: string;
  }>;
}
