
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface HPTItem {
  id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  fecha_creacion: string;
  supervisor: string;
  plan_trabajo: string;
  firmado: boolean;
  supervisor_firma?: string;
  jefe_operaciones_firma?: string;
  created_at: string;
  updated_at: string;
}

export interface HPTFormData {
  operacion_id: string;
  supervisor: string;
  plan_trabajo: string;
  equipos_seguridad: string[];
  procedimientos_emergencia: string;
}

export const useHPT = () => {
  const [hpts, setHpts] = useState<HPTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHPTs();
  }, []);

  const loadHPTs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hpt')
        .select(`
          hpt_id,
          codigo,
          operacion_id,
          fecha_creacion,
          supervisor,
          plan_trabajo,
          firmado,
          supervisor_firma,
          jefe_operaciones_firma,
          created_at,
          updated_at,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: HPTItem[] = (data || []).map(item => ({
        id: item.hpt_id,
        codigo: item.codigo,
        operacion_id: item.operacion_id,
        operacion_nombre: item.operacion?.nombre || 'Operación no encontrada',
        fecha_creacion: item.fecha_creacion,
        supervisor: item.supervisor || '',
        plan_trabajo: item.plan_trabajo || '',
        firmado: item.firmado || false,
        supervisor_firma: item.supervisor_firma,
        jefe_operaciones_firma: item.jefe_operaciones_firma,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setHpts(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error loading HPTs:', err);
      setError('Error al cargar los HPTs');
      toast({
        title: "Error",
        description: "No se pudieron cargar los HPTs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createHPT = async (data: HPTFormData) => {
    setLoading(true);
    try {
      const { count } = await supabase
        .from('hpt')
        .select('*', { count: 'exact', head: true });
      
      const codigo = `HPT-2024-${String((count || 0) + 1).padStart(3, '0')}`;

      const hptData = {
        codigo,
        operacion_id: data.operacion_id,
        supervisor: data.supervisor,
        plan_trabajo: data.plan_trabajo,
        equipos_seguridad: data.equipos_seguridad,
        procedimientos_emergencia: data.procedimientos_emergencia
      };

      const { data: newHPT, error } = await supabase
        .from('hpt')
        .insert([hptData])
        .select(`
          hpt_id,
          codigo,
          operacion_id,
          fecha_creacion,
          supervisor,
          plan_trabajo,
          firmado,
          supervisor_firma,
          jefe_operaciones_firma,
          created_at,
          updated_at,
          operacion:operacion_id (
            nombre
          )
        `)
        .single();

      if (error) throw error;

      const formattedNewHPT: HPTItem = {
        id: newHPT.hpt_id,
        codigo: newHPT.codigo,
        operacion_id: newHPT.operacion_id,
        operacion_nombre: newHPT.operacion?.nombre || 'Nueva Operación',
        fecha_creacion: newHPT.fecha_creacion,
        supervisor: newHPT.supervisor || '',
        plan_trabajo: newHPT.plan_trabajo || '',
        firmado: newHPT.firmado || false,
        supervisor_firma: newHPT.supervisor_firma,
        jefe_operaciones_firma: newHPT.jefe_operaciones_firma,
        created_at: newHPT.created_at,
        updated_at: newHPT.updated_at
      };

      setHpts(prev => [formattedNewHPT, ...prev]);

      toast({
        title: "HPT Creado",
        description: `${formattedNewHPT.codigo} ha sido creado exitosamente`,
      });

      return formattedNewHPT;
    } catch (err) {
      console.error('Error creating HPT:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el HPT';
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
    hpts,
    loading,
    error,
    createHPT,
    refreshHPTs: loadHPTs
  };
};
