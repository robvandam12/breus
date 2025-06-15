
import type { SecurityAlert } from './security';

export interface Inmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  operacion_id: string;
  buzo_principal: string;
  buzo_principal_id?: string;
  buzo_asistente?: string;
  buzo_asistente_id?: string;
  supervisor: string;
  supervisor_id?: string;
  objetivo: string;
  estado: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones?: string;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  created_at: string;
  updated_at: string;
  operacion_nombre?: string;
  operacion?: {
    codigo: string;
    nombre: string;
  };
  current_depth?: number | null;
  planned_bottom_time?: number | null;
  depth_history?: Array<{ depth: number; timestamp: string }>;
  security_alerts?: SecurityAlert[];
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
  salmoneras?: { nombre: string };
  sitios?: { nombre: string };
  contratistas?: { nombre: string };
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
