
// Base interfaces for network maintenance forms

export interface PersonalBuceo {
  id: string;
  nombre: string;
  rol: 'supervisor' | 'buzo_especialista' | 'buzo_industrial' | 'buzo_aprendiz';
  certificaciones: string[];
  tiempo_inmersion?: number; // en minutos
  profundidad_max?: number; // en metros
  observaciones?: string;
}

export interface EquipoSuperficie {
  id: string;
  tipo: 'compresor' | 'winche' | 'grua' | 'embarcacion' | 'otro';
  marca: string;
  modelo: string;
  numero_serie?: string;
  estado: 'operativo' | 'mantenimiento' | 'fuera_servicio';
  observaciones?: string;
}

export interface SistemaEquipo {
  id: string;
  sistema: 'comunicaciones' | 'aire_comprimido' | 'emergencia' | 'navegacion' | 'otro';
  descripcion: string;
  estado: 'operativo' | 'falla' | 'mantenimiento';
  responsable: string;
  observaciones?: string;
}

export interface FaenaMantencion {
  id: string;
  tipo_faena: 'mantencion_preventiva' | 'mantencion_correctiva' | 'instalacion_red' | 'cambio_red' | 'reparacion_urgente';
  descripcion: string;
  hora_inicio: string;
  hora_fin: string;
  profundidad_trabajo: number;
  responsable: string;
  estado: 'planificada' | 'en_progreso' | 'completada' | 'suspendida';
  observaciones: string;
}

export interface FaenaRedes {
  id: string;
  tipo_trabajo: 'instalacion' | 'cambio' | 'reparacion' | 'inspeccion' | 'limpieza';
  ubicacion: string;
  jaula_numero?: string;
  red_tipo: string;
  dimensiones: string;
  hora_inicio: string;
  hora_fin: string;
  personal_asignado: string[];
  materiales_usados: string;
  estado_completado: boolean;
  observaciones: string;
}

export interface NetworkMaintenanceData {
  // Información general
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
  
  // Personal y equipos
  dotacion: PersonalBuceo[];
  equipos_superficie: EquipoSuperficie[];
  sistemas_equipos: SistemaEquipo[];
  
  // Faenas
  faenas_mantencion: FaenaMantencion[];
  faenas_redes: FaenaRedes[];
  
  // Control
  tipo_formulario: 'mantencion' | 'faena';
  progreso: number;
  firmado: boolean;
  estado: 'borrador' | 'completado' | 'archivado';
  
  // Firmas y responsables
  supervisor_responsable?: string;
  firma_supervisor?: string;
  fecha_firma?: string;
  
  // Observaciones generales
  observaciones_generales?: string;
  condiciones_climaticas?: string;
  incidentes?: string;
}

export interface NetworkMaintenanceFormProps {
  formData: NetworkMaintenanceData;
  updateFormData: (data: Partial<NetworkMaintenanceData>) => void;
  errors?: Record<string, string>;
}
