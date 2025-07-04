export interface BuzoInmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string | null;
  buzo_principal: string;
  buzo_asistente?: string | null;
  supervisor: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  estado: string;
  observaciones?: string | null;
  operacion_id: string;
  operacionNombre: string;
  salmoneraNombre: string;
  centroNombre: string;
  rol: 'Principal' | 'Asistente';
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
  buzo_principal_id?: string | null;
  buzo_asistente_id?: string | null;
  supervisor_id?: string | null;
  created_at: string;
  updated_at: string;
  anexo_bravo_validado: boolean;
  hpt_validado: boolean;
  estimated_end_time?: string | null;
  actual_end_time?: string | null;
  notification_status?: any;
  centro_id?: string | null;
  validation_status?: string | null;
  context_type?: string | null;
  empresa_creadora_tipo?: string | null;
  contexto_operativo?: string | null;
  external_operation_code?: string | null;
  priority?: string | null;
  work_type?: string | null;
  company_type?: string | null;
  metadata?: any;
  requires_validation?: boolean | null;
  validacion_contextual?: any;
  empresa_creadora_id?: string | null;
  requiere_validacion_previa?: boolean | null;
  is_independent?: boolean | null;
  company_id?: string | null;
  depth_history?: any;
  planned_bottom_time?: number | null;
  current_depth?: number | null;
}

// Re-export the main Inmersion type for compatibility
export interface Inmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string | null;
  buzo_principal: string;
  buzo_asistente?: string | null;
  supervisor: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  estado: string;
  observaciones?: string | null;
  operacion_id: string;
  buzo_principal_id?: string | null;
  buzo_asistente_id?: string | null;
  supervisor_id?: string | null;
  created_at: string;
  updated_at: string;
  anexo_bravo_validado: boolean;
  hpt_validado: boolean;
  estimated_end_time?: string | null;
  actual_end_time?: string | null;
  notification_status?: any;
  centro_id?: string | null;
  validation_status?: string | null;
  context_type?: string | null;
  empresa_creadora_tipo?: string | null;
  contexto_operativo?: string | null;
  external_operation_code?: string | null;
  priority?: string | null;
  work_type?: string | null;
  company_type?: string | null;
  metadata?: any;
  requires_validation?: boolean | null;
  validacion_contextual?: any;
  empresa_creadora_id?: string | null;
  requiere_validacion_previa?: boolean | null;
  is_independent?: boolean | null;
  company_id?: string | null;
  depth_history?: any;
  planned_bottom_time?: number | null;
  current_depth?: number | null;
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

// Import types from their dedicated files
export type { HPTData } from '@/types/hpt';
export type { AnexoBravoData } from '@/types/anexo-bravo';

// Additional types for compatibility
export interface OperationData {
  id: string;
  codigo: string;
  nombre: string;
  salmonera_id?: string;
  contratista_id?: string;
  salmoneras?: { nombre: string } | null;
  centros?: { nombre: string } | null;
  contratistas?: { nombre: string } | null;
}

export interface EquipoBuceoData {
  id: string;
  nombre: string;
}

export interface ValidationStatus {
  hasValidHPT: boolean;
  hasValidAnexoBravo: boolean;
  hasTeam: boolean;
  canExecute: boolean;
  hptCode?: string;
  anexoBravoCode?: string;
}
