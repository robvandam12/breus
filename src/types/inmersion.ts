
import type { SecurityAlert } from './security';
import { Tables } from '@/integrations/supabase/types';

export interface Inmersion extends Tables<'inmersion'> {
  operacion?: OperationData;
  operacion_nombre?: string;
  security_alerts?: SecurityAlert[];
  centro?: { nombre: string };
}

export interface BuzoInmersion extends Inmersion {
  operacionNombre: string;
  salmoneraNombre: string;
  centroNombre: string;
  rol: 'Principal' | 'Asistente';
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
  salmoneras?: { nombre: string } | null;
  centros?: { nombre: string } | null;
  contratistas?: { nombre: string } | null;
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
