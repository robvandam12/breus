export interface InmersionFormData {
  operacion_id: string;
  external_operation_code: string;
  objetivo: string;
  fecha_inmersion: string;
  profundidad_max: string;
  observaciones: string;
  centro_id: string;
  codigo: string;
}

export interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  fecha_inicio: string;
  centro_id?: string;
  centros?: { nombre: string };
}

export interface Centro {
  id: string;
  nombre: string;
  salmonera_id: string;
}

export interface InmersionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export interface FormValidationState {
  hasPlanning: boolean;
  canShowPlanningToggle: boolean;
  isPlanned: boolean;
  enterpriseModules: any;
}

export interface EnterpriseContext {
  salmonera_id?: string;
  contratista_id?: string;
  context_metadata: {
    selection_mode: string;
    empresa_origen_tipo: string;
  };
}
