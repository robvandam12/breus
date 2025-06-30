
import { Tables } from '@/integrations/supabase/types';
import type { Inmersion } from '@/types/inmersion';

// Datos detallados de cada miembro de la cuadrilla
export interface CuadrillaMemberData {
  usuario_id: string;
  nombre: string;
  apellido?: string;
  rol: 'buzo_principal' | 'buzo_asistente' | 'supervisor';
  matricula?: string;
  hora_entrada?: string;
  hora_salida?: string;
  profundidad_maxima?: number;
  tiempo_total_minutos?: number;
  observaciones?: string;
  equipo_utilizado?: string;
  estado_fisico_pre?: string;
  estado_fisico_post?: string;
}

// Tiempos detallados por buzo
export interface TiemposDetallados {
  [usuarioId: string]: {
    hora_entrada: string;
    hora_salida: string;
    profundidad_maxima: number;
    tiempo_fondo_minutos: number;
    tiempo_descompresion_minutos?: number;
    observaciones_tiempos?: string;
  };
}

export interface BitacoraSupervisorCompleta extends Omit<Tables<'bitacora_supervisor'>, 'aprobada_por' | 'inmersiones_buzos' | 'equipos_utilizados' | 'diving_records'> {
  inmersion: Inmersion | null;
  supervisor_data?: { id: string; nombre: string; } | null;
  aprobador_data?: { id: string; nombre: string; } | null;
  inmersiones_buzos: any[] | null;
  equipos_utilizados: any[] | null;
  diving_records: any[] | null;
  datos_cuadrilla?: CuadrillaMemberData[];
  tiempos_detallados?: TiemposDetallados;
}

export interface BitacoraBuzoCompleta extends Omit<Tables<'bitacora_buzo'>, 'aprobada_por'> {
  inmersion: Inmersion | null;
  bitacora_supervisor_id?: string | null;
  bitacora_supervisor?: BitacoraSupervisorCompleta | null;
}
