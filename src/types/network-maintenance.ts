export interface NetworkMaintenanceData {
  // Datos generales
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  lugar_trabajo: string;
  temperatura: number;
  profundidad_max: number;
  estado_puerto: string;
  nave_maniobras: string;
  matricula_nave: string;
  
  // Teams
  team_s: string;
  team_be: string;
  team_bi: string;
  
  // Dotación y equipos
  dotacion: DotacionBuceo[];
  equipos_superficie: EquipoSuperficie[];
  
  // Faenas específicas
  faenas_mantencion: FaenaMantencion[];
  faenas_redes: FaenaRedes[];
  
  // Sistemas y equipos (Nuevo para Paso 5)
  sistemas_equipos?: SistemaEquipo[];
  
  // Resumen y firmas (Nuevo para Paso 6)
  observaciones_finales?: string;
  contingencias?: string;
  supervisor_responsable?: string;
  firma_digital?: string;
  
  // Control de formulario
  progreso: number;
  firmado: boolean;
  estado: 'borrador' | 'completado' | 'aprobado';
  tipo_formulario?: 'mantencion' | 'faena_redes';
}

export interface DotacionBuceo {
  id: string;
  nombre: string;
  apellido?: string;
  rol: 'buzo' | 'asistente' | 'supervisor' | 'operador_superficie';
  matricula?: string;
  equipo?: string;
  hora_inicio_buzo?: string;
  hora_fin_buzo?: string;
  profundidad?: number;
  contratista?: boolean;
}

// Alias para compatibilidad con DotacionBuceo.tsx
export type DotacionMiembro = DotacionBuceo;

export interface EquipoSuperficie {
  id: string;
  equipo_sup: 'Compresor 1' | 'Compresor 2';
  matricula_eq: string;
  horometro_ini: number;
  horometro_fin: number;
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

// Nueva interfaz para Sistemas y Equipos (Paso 5)
export interface SistemaEquipo {
  id: string;
  tipo_sistema: 'alimentacion' | 'oxigenacion' | 'limpieza' | 'monitoreo' | 'seguridad';
  nombre_equipo: string;
  estado_operativo: 'operativo' | 'mantenimiento' | 'fuera_servicio';
  observaciones: string;
  trabajo_realizado: string;
  responsable: string;
  verificado: boolean;
}

// Interfaz para el formulario de Mantención de Redes
export interface NetworkMaintenanceFormData {
  operacion_id: string;
  codigo: string;
  tipo_formulario: 'mantencion' | 'faena_redes';
  network_maintenance_data: NetworkMaintenanceData;
}
