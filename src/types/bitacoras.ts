
import { Tables } from '@/integrations/supabase/types';
import type { Inmersion } from '@/types/inmersion';

// La interfaz 'InmersionCompleta' ha sido consolidada en el tipo 'Inmersion'
// en `src/types/inmersion.ts`. Todas las referencias aquí usan ahora 'Inmersion'.

export interface BitacoraSupervisorCompleta extends Omit<Tables<'bitacora_supervisor'>, 'aprobada_por' | 'inmersiones_buzos' | 'equipos_utilizados' | 'diving_records'> {
  inmersion: Inmersion | null;
  supervisor_data?: { id: string; nombre: string; } | null;
  aprobador_data?: { id: string; nombre: string; } | null;
  inmersiones_buzos: any[] | null;
  equipos_utilizados: any[] | null;
  diving_records: any[] | null;
}

export interface BitacoraBuzoCompleta extends Omit<Tables<'bitacora_buzo'>, 'aprobada_por'> {
  inmersion: Inmersion | null;
}
