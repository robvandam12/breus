
export interface Inmersion {
  inmersion_id: string;
  operacion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  buzo_principal: string;
  buzo_asistente?: string;
  supervisor: string;
  estado: 'planificada' | 'en_progreso' | 'completada' | 'cancelada';
  profundidad_max: number;
  current_depth?: number;
  temperatura_agua?: number;
  visibilidad?: number;
  corriente?: string;
  objetivo?: string;
  observaciones?: string;
  depth_history?: { depth: number; timestamp: string }[];
  security_alerts?: any[];
  operacion_nombre?: string;
}

export interface ValidationStatus {
  hasValidHPT: boolean;
  hasValidAnexo: boolean;
  hasTeam: boolean;
  canExecute: boolean;
}

export interface HPTData {
  id: string;
  firmado: boolean;
  supervisor?: string;
}

export interface AnexoBravoData {
  id: string;
  firmado: boolean;
  supervisor?: string;
}

export interface EquipoBuceoMiembro {
  usuario_id: string;
  nombre: string;
  rol_equipo: string;
}

export interface EquipoBuceoData {
  id: string;
  miembros: EquipoBuceoMiembro[];
}

export interface OperationData {
  operacion: {
    id: string;
    codigo: string;
    equipo_buceo_id?: string;
  };
  hpt: HPTData | null;
  anexoBravo: AnexoBravoData | null;
  equipoBuceo: EquipoBuceoData | null;
}
