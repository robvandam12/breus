
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface BitacoraSupervisorItem {
  id: string;
  codigo: string;
  inmersion_id: string;
  inmersion_codigo: string;
  supervisor: string;
  fecha: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
  firmado: boolean;
  supervisor_firma?: string;
  created_at: string;
  updated_at: string;
}

export interface BitacoraBuzoItem {
  id: string;
  codigo: string;
  inmersion_id: string;
  inmersion_codigo: string;
  buzo: string;
  fecha: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  observaciones_tecnicas: string;
  estado_fisico_post: string;
  firmado: boolean;
  buzo_firma?: string;
  created_at: string;
  updated_at: string;
}

export interface BitacoraSupervisorFormData {
  inmersion_id: string;
  supervisor: string;
  desarrollo_inmersion: string;
  incidentes: string;
  evaluacion_general: string;
}

export interface BitacoraBuzoFormData {
  inmersion_id: string;
  buzo: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  observaciones_tecnicas: string;
  estado_fisico_post: string;
}

export const useBitacoras = () => {
  const [bitacorasSupervisor, setBitacorasSupervisor] = useState<BitacoraSupervisorItem[]>([]);
  const [bitacorasBuzo, setBitacorasBuzo] = useState<BitacoraBuzoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBitacoras();
  }, []);

  const loadBitacoras = async () => {
    setLoading(true);
    try {
      // Cargar bitácoras de supervisor usando query directo
      const { data: supervisorData, error: supervisorError } = await supabase
        .from('bitacora_supervisor' as any)
        .select(`
          bitacora_id,
          codigo,
          inmersion_id,
          supervisor,
          fecha,
          desarrollo_inmersion,
          incidentes,
          evaluacion_general,
          firmado,
          supervisor_firma,
          created_at,
          updated_at,
          inmersion:inmersion_id!inner (
            codigo
          )
        `)
        .order('created_at', { ascending: false });

      if (supervisorError) throw supervisorError;

      // Cargar bitácoras de buzo usando query directo
      const { data: buzoData, error: buzoError } = await supabase
        .from('bitacora_buzo' as any)
        .select(`
          bitacora_id,
          codigo,
          inmersion_id,
          buzo,
          fecha,
          profundidad_maxima,
          trabajos_realizados,
          observaciones_tecnicas,
          estado_fisico_post,
          firmado,
          buzo_firma,
          created_at,
          updated_at,
          inmersion:inmersion_id!inner (
            codigo
          )
        `)
        .order('created_at', { ascending: false });

      if (buzoError) throw buzoError;

      const formattedSupervisorData: BitacoraSupervisorItem[] = (supervisorData || []).map((item: any) => ({
        id: item.bitacora_id,
        codigo: item.codigo,
        inmersion_id: item.inmersion_id,
        inmersion_codigo: item.inmersion?.codigo || 'Inmersión no encontrada',
        supervisor: item.supervisor,
        fecha: item.fecha,
        desarrollo_inmersion: item.desarrollo_inmersion || '',
        incidentes: item.incidentes || '',
        evaluacion_general: item.evaluacion_general || '',
        firmado: item.firmado || false,
        supervisor_firma: item.supervisor_firma,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      const formattedBuzoData: BitacoraBuzoItem[] = (buzoData || []).map((item: any) => ({
        id: item.bitacora_id,
        codigo: item.codigo,
        inmersion_id: item.inmersion_id,
        inmersion_codigo: item.inmersion?.codigo || 'Inmersión no encontrada',
        buzo: item.buzo,
        fecha: item.fecha,
        profundidad_maxima: item.profundidad_maxima || 0,
        trabajos_realizados: item.trabajos_realizados || '',
        observaciones_tecnicas: item.observaciones_tecnicas || '',
        estado_fisico_post: item.estado_fisico_post || '',
        firmado: item.firmado || false,
        buzo_firma: item.buzo_firma,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setBitacorasSupervisor(formattedSupervisorData);
      setBitacorasBuzo(formattedBuzoData);
      setError(null);
    } catch (err) {
      console.error('Error loading Bitácoras:', err);
      setError('Error al cargar las Bitácoras');
      toast({
        title: "Error",
        description: "No se pudieron cargar las Bitácoras",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBitacoraSupervisor = async (data: BitacoraSupervisorFormData) => {
    setLoading(true);
    try {
      const { count } = await supabase
        .from('bitacora_supervisor' as any)
        .select('*', { count: 'exact', head: true });
      
      const codigo = `BS-2024-${String((count || 0) + 1).padStart(3, '0')}`;

      const bitacoraData = {
        codigo,
        inmersion_id: data.inmersion_id,
        supervisor: data.supervisor,
        fecha: new Date().toISOString().split('T')[0],
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes,
        evaluacion_general: data.evaluacion_general
      };

      const { error } = await supabase
        .from('bitacora_supervisor' as any)
        .insert([bitacoraData]);

      if (error) throw error;

      await loadBitacoras();

      toast({
        title: "Bitácora de Supervisor Creada",
        description: `${codigo} ha sido creada exitosamente`,
      });
    } catch (err) {
      console.error('Error creating Bitácora Supervisor:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la Bitácora de Supervisor';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBitacoraBuzo = async (data: BitacoraBuzoFormData) => {
    setLoading(true);
    try {
      const { count } = await supabase
        .from('bitacora_buzo' as any)
        .select('*', { count: 'exact', head: true });
      
      const codigo = `BB-2024-${String((count || 0) + 1).padStart(3, '0')}`;

      const bitacoraData = {
        codigo,
        inmersion_id: data.inmersion_id,
        buzo: data.buzo,
        fecha: new Date().toISOString().split('T')[0],
        profundidad_maxima: data.profundidad_maxima,
        trabajos_realizados: data.trabajos_realizados,
        observaciones_tecnicas: data.observaciones_tecnicas,
        estado_fisico_post: data.estado_fisico_post
      };

      const { error } = await supabase
        .from('bitacora_buzo' as any)
        .insert([bitacoraData]);

      if (error) throw error;

      await loadBitacoras();

      toast({
        title: "Bitácora de Buzo Creada",
        description: `${codigo} ha sido creada exitosamente`,
      });
    } catch (err) {
      console.error('Error creating Bitácora Buzo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la Bitácora de Buzo';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bitacorasSupervisor,
    bitacorasBuzo,
    loading,
    error,
    createBitacoraSupervisor,
    createBitacoraBuzo,
    refreshBitacoras: loadBitacoras
  };
};
