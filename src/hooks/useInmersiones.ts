
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface InmersionItem {
  id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  supervisor: string;
  buzo_principal: string;
  buzo_asistente?: string;
  objetivo: string;
  estado: 'planificada' | 'en_progreso' | 'completada' | 'cancelada';
  observaciones: string;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  created_at: string;
  updated_at: string;
}

export interface InmersionFormData {
  operacion_id: string;
  fecha_inmersion: string;
  hora_inicio: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  supervisor: string;
  buzo_principal: string;
  buzo_asistente?: string;
  objetivo: string;
  observaciones: string;
}

export const useInmersiones = () => {
  const [inmersiones, setInmersiones] = useState<InmersionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInmersiones();
  }, []);

  const loadInmersiones = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inmersion' as any)
        .select(`
          inmersion_id,
          codigo,
          operacion_id,
          fecha_inmersion,
          hora_inicio,
          hora_fin,
          profundidad_max,
          temperatura_agua,
          visibilidad,
          corriente,
          supervisor,
          buzo_principal,
          buzo_asistente,
          objetivo,
          estado,
          observaciones,
          hpt_validado,
          anexo_bravo_validado,
          created_at,
          updated_at,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: InmersionItem[] = (data || []).map((item: any) => ({
        id: item.inmersion_id,
        codigo: item.codigo,
        operacion_id: item.operacion_id,
        operacion_nombre: item.operacion?.nombre || 'Operación no encontrada',
        fecha_inmersion: item.fecha_inmersion,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
        profundidad_max: item.profundidad_max,
        temperatura_agua: item.temperatura_agua,
        visibilidad: item.visibilidad,
        corriente: item.corriente,
        supervisor: item.supervisor,
        buzo_principal: item.buzo_principal,
        buzo_asistente: item.buzo_asistente,
        objetivo: item.objetivo,
        estado: item.estado as InmersionItem['estado'],
        observaciones: item.observaciones || '',
        hpt_validado: item.hpt_validado,
        anexo_bravo_validado: item.anexo_bravo_validado,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setInmersiones(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error loading Inmersiones:', err);
      setError('Error al cargar las Inmersiones');
      toast({
        title: "Error",
        description: "No se pudieron cargar las Inmersiones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePreInmersion = async (operacionId: string) => {
    try {
      // Verificar HPT firmado
      const { data: hptData, error: hptError } = await supabase
        .from('hpt' as any)
        .select('firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      if (hptError || !hptData) {
        throw new Error('No existe un HPT firmado para esta operación');
      }

      // Verificar Anexo Bravo firmado
      const { data: anexoData, error: anexoError } = await supabase
        .from('anexo_bravo')
        .select('firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      if (anexoError || !anexoData) {
        throw new Error('No existe un Anexo Bravo firmado para esta operación');
      }

      return { hpt_validado: true, anexo_bravo_validado: true };
    } catch (err) {
      console.error('Error en validación pre-inmersión:', err);
      throw err;
    }
  };

  const createInmersion = async (data: InmersionFormData) => {
    setLoading(true);
    try {
      // Ejecutar validación pre-inmersión
      const validacion = await validatePreInmersion(data.operacion_id);

      // Generar código único
      const { count } = await supabase
        .from('inmersion' as any)
        .select('*', { count: 'exact', head: true });
      
      const codigo = `IMM-2024-${String((count || 0) + 1).padStart(3, '0')}`;

      const inmersionData = {
        codigo,
        operacion_id: data.operacion_id,
        fecha_inmersion: data.fecha_inmersion,
        hora_inicio: data.hora_inicio,
        profundidad_max: data.profundidad_max,
        temperatura_agua: data.temperatura_agua,
        visibilidad: data.visibilidad,
        corriente: data.corriente,
        supervisor: data.supervisor,
        buzo_principal: data.buzo_principal,
        buzo_asistente: data.buzo_asistente,
        objetivo: data.objetivo,
        observaciones: data.observaciones,
        estado: 'planificada',
        hpt_validado: validacion.hpt_validado,
        anexo_bravo_validado: validacion.anexo_bravo_validado
      };

      const { data: newInmersion, error } = await supabase
        .from('inmersion' as any)
        .insert([inmersionData])
        .select(`
          inmersion_id,
          codigo,
          operacion_id,
          fecha_inmersion,
          hora_inicio,
          hora_fin,
          profundidad_max,
          temperatura_agua,
          visibilidad,
          corriente,
          supervisor,
          buzo_principal,
          buzo_asistente,
          objetivo,
          estado,
          observaciones,
          hpt_validado,
          anexo_bravo_validado,
          created_at,
          updated_at,
          operacion:operacion_id (
            nombre
          )
        `)
        .single();

      if (error) throw error;

      const formattedNewInmersion: InmersionItem = {
        id: newInmersion.inmersion_id,
        codigo: newInmersion.codigo,
        operacion_id: newInmersion.operacion_id,
        operacion_nombre: newInmersion.operacion?.nombre || 'Nueva Operación',
        fecha_inmersion: newInmersion.fecha_inmersion,
        hora_inicio: newInmersion.hora_inicio,
        hora_fin: newInmersion.hora_fin,
        profundidad_max: newInmersion.profundidad_max,
        temperatura_agua: newInmersion.temperatura_agua,
        visibilidad: newInmersion.visibilidad,
        corriente: newInmersion.corriente,
        supervisor: newInmersion.supervisor,
        buzo_principal: newInmersion.buzo_principal,
        buzo_asistente: newInmersion.buzo_asistente,
        objetivo: newInmersion.objetivo,
        estado: newInmersion.estado as InmersionItem['estado'],
        observaciones: newInmersion.observaciones || '',
        hpt_validado: newInmersion.hpt_validado,
        anexo_bravo_validado: newInmersion.anexo_bravo_validado,
        created_at: newInmersion.created_at,
        updated_at: newInmersion.updated_at
      };

      setInmersiones(prev => [formattedNewInmersion, ...prev]);

      toast({
        title: "Inmersión Creada",
        description: `${formattedNewInmersion.codigo} ha sido creada exitosamente`,
      });

      return formattedNewInmersion;
    } catch (err) {
      console.error('Error creating Inmersion:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la Inmersión';
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

  const updateEstadoInmersion = async (id: string, estado: InmersionItem['estado']) => {
    try {
      const updateData: any = { estado };
      
      if (estado === 'completada') {
        updateData.hora_fin = new Date().toTimeString().slice(0, 5);
      }

      const { error } = await supabase
        .from('inmersion' as any)
        .update(updateData)
        .eq('inmersion_id', id);

      if (error) throw error;

      setInmersiones(prev => prev.map(inmersion => 
        inmersion.id === id 
          ? { ...inmersion, estado, hora_fin: updateData.hora_fin || inmersion.hora_fin }
          : inmersion
      ));

      toast({
        title: "Inmersión Actualizada",
        description: `Estado cambiado a ${estado}`,
      });
    } catch (err) {
      console.error('Error updating Inmersion:', err);
      toast({
        title: "Error",
        description: "No se pudo actualizar la Inmersión",
        variant: "destructive",
      });
    }
  };

  return {
    inmersiones,
    loading,
    error,
    createInmersion,
    updateEstadoInmersion,
    refreshInmersiones: loadInmersiones
  };
};
