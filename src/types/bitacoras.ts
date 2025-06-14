
import { Tables } from '@/integrations/supabase/types';

// Extendiendo Tables<'inmersion'> para asegurar compatibilidad
export interface InmersionCompleta extends Tables<'inmersion'> {
  operacion: {
    id: string;
    nombre: string;
    equipo_buceo_id?: string | null;
    salmoneras?: { nombre: string } | null;
    contratistas?: { nombre: string } | null;
    sitios?: { nombre: string } | null;
  } | null;
}

export interface BitacoraSupervisorCompleta extends Omit<Tables<'bitacora_supervisor'>, 'aprobada_por' | 'inmersiones_buzos' | 'equipos_utilizados' | 'diving_records'> {
  inmersion: InmersionCompleta | null;
  supervisor_data?: { id: string; nombre: string; } | null;
  aprobador_data?: { id: string; nombre: string; } | null;
  inmersiones_buzos: any[] | null;
  equipos_utilizados: any[] | null;
  diving_records: any[] | null;
}

export interface BitacoraBuzoCompleta extends Omit<Tables<'bitacora_buzo'>, 'aprobada_por'> {
  inmersion: InmersionCompleta | null;
}
