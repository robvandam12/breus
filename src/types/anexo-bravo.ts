// ============= Types for Anexo Bravo =============

export interface AnexoBravoBase {
  id: string;
  codigo: string;
  operacion_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  fecha_creacion: string;
  fecha_verificacion: string;
  firmado: boolean;
  estado: 'borrador' | 'firmado' | 'cancelado' | 'en_progreso';
  progreso: number;
  checklist_completo: boolean;
}

export interface AnexoBravo extends AnexoBravoBase {
  // Datos básicos
  fecha?: string;
  supervisor: string;
  jefe_centro: string;
  lugar_faena?: string;
  empresa_nombre?: string;
  
  // Personal
  buzo_o_empresa_nombre?: string;
  buzo_matricula?: string;
  asistente_buzo_nombre?: string;
  asistente_buzo_matricula?: string;
  jefe_centro_nombre?: string;
  
  // Supervisores
  supervisor_servicio_id?: string;
  supervisor_servicio_nombre?: string;
  supervisor_servicio_timestamp?: string;
  supervisor_mandante_id?: string;
  supervisor_mandante_nombre?: string;
  supervisor_mandante_timestamp?: string;
  
  // Bitácora
  bitacora_fecha?: string;
  bitacora_hora_inicio?: string;
  bitacora_hora_termino?: string;
  bitacora_relator?: string;
  
  // Autorizaciones
  autorizacion_armada?: boolean;
  
  // Observaciones
  observaciones_generales?: string;
  
  // Firmas
  supervisor_firma?: string;
  jefe_centro_firma?: string;
  
  // Datos estructurados (JSON)
  anexo_bravo_checklist?: AnexoBravoChecklist;
  anexo_bravo_trabajadores?: AnexoBravoTrabajador[];
  anexo_bravo_firmas?: AnexoBravoFirmas;
  
  // Contexto empresarial
  company_id?: string;
  company_type?: 'salmonera' | 'contratista';
  form_version?: number;
}

// Sub-interfaces para los datos estructurados
export interface AnexoBravoChecklist {
  [key: string]: {
    verificado: boolean;
    observaciones?: string;
    responsable?: string;
  };
}

export interface AnexoBravoTrabajador {
  orden: number;
  nombre: string;
  apellido?: string;
  rut: string;
  empresa: string;
  rol: 'buzo_principal' | 'buzo_asistente' | 'supervisor' | 'apoyo';
  matricula?: string;
  certificaciones?: string[];
}

export interface AnexoBravoEquipo {
  orden: number;
  equipo_nombre: string;
  tipo: string;
  modelo?: string;
  numero_serie?: string;
  estado: 'operativo' | 'mantenimiento' | 'fuera_servicio';
  verificado: boolean;
  observaciones?: string;
}

export interface AnexoBravoFirmas {
  supervisor?: AnexoBravoFirma;
  jefe_centro?: AnexoBravoFirma;
  supervisor_servicio?: AnexoBravoFirma;
  supervisor_mandante?: AnexoBravoFirma;
  participantes?: AnexoBravoFirma[];
}

export interface AnexoBravoFirma {
  nombre: string;
  firma: string;
  fecha: string;
  hora: string;
  cargo?: string;
}

// Form data interface para crear/editar Anexo Bravo
export interface AnexoBravoFormData {
  codigo: string;
  operacion_id: string;
  fecha: string;
  supervisor: string;
  jefe_centro: string;
  lugar_faena?: string;
  empresa_nombre?: string;
  buzo_o_empresa_nombre?: string;
  buzo_matricula?: string;
  asistente_buzo_nombre?: string;
  asistente_buzo_matricula?: string;
  jefe_centro_nombre?: string;
  supervisor_servicio_nombre?: string;
  supervisor_mandante_nombre?: string;
  bitacora_fecha?: string;
  bitacora_hora_inicio?: string;
  bitacora_hora_termino?: string;
  bitacora_relator?: string;
  autorizacion_armada?: boolean;
  observaciones_generales?: string;
  
  // Arrays estructurados
  anexo_bravo_checklist?: AnexoBravoChecklist;
  anexo_bravo_trabajadores?: AnexoBravoTrabajador[];
  anexo_bravo_firmas?: AnexoBravoFirmas;
  
  // Estado y configuración
  estado?: 'borrador' | 'firmado' | 'cancelado' | 'en_progreso';
  firmado?: boolean;
}

// Interface para datos básicos de Anexo Bravo (usado en listas y referencias)
export interface AnexoBravoData {
  id: string;
  codigo: string;
  supervisor: string;
  firmado: boolean;
  estado: 'borrador' | 'firmado' | 'cancelado' | 'en_progreso';
  fecha_creacion: string;
  operacion_id: string;
}

// Response interface para queries con relaciones
export interface AnexoBravoWithOperacion extends AnexoBravo {
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

// Interfaces para las tablas relacionadas
export interface AnexoBravoChecklistItem {
  id: string;
  anexo_bravo_id: string;
  orden: number;
  item: string;
  verificado: boolean;
  observaciones?: string;
  created_at: string;
}

export interface AnexoBravoParticipante {
  id: string;
  anexo_bravo_id: string;
  orden: number;
  nombre: string;
  rut: string;
  created_at: string;
}

export interface AnexoBravoEquipoItem {
  id: string;
  anexo_bravo_id: string;
  orden: number;
  equipo_nombre: string;
  verificado: boolean;
  observaciones?: string;
  created_at: string;
}