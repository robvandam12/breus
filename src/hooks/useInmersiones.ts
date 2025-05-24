
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Inmersion {
  id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  buzo_principal: string;
  buzo_asistente?: string;
  supervisor: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  estado: string;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export interface InmersionFormData {
  operacion_id: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  buzo_principal: string;
  buzo_asistente?: string;
  supervisor: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones?: string;
}

export const useInmersiones = () => {
  const [inmersiones, setInmersiones] = useState<Inmersion[]>([]);
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
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: Inmersion[] = (data || []).map((item: any) => ({
        id: item.inmersion_id,
        codigo: item.codigo,
        operacion_id: item.operacion_id,
        operacion_nombre: item.operacion?.nombre || 'Operación no encontrada',
        fecha_inmersion: item.fecha_inmersion,
        hora_inicio: item.hora_inicio,
        hora_fin: item.hora_fin,
        buzo_principal: item.buzo_principal,
        buzo_asistente: item.buzo_asistente,
        supervisor: item.supervisor,
        objetivo: item.objetivo,
        profundidad_max: Number(item.profundidad_max),
        temperatura_agua: Number(item.temperatura_agua),
        visibilidad: Number(item.visibilidad),
        corriente: item.corriente,
        estado: item.estado,
        hpt_validado: item.hpt_validado,
        anexo_bravo_validado: item.anexo_bravo_validado,
        observaciones: item.observaciones,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setInmersiones(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error loading inmersiones:', err);
      setError('Error al cargar las inmersiones');
      toast({
        title: "Error",
        description: "No se pudieron cargar las inmersiones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInmersion = async (data: InmersionFormData) => {
    setLoading(true);
    try {
      // Generar código único
      const { count } = await supabase
        .from('inmersion')
        .select('*', { count: 'exact', head: true });
      
      const codigo = `INM-2024-${String((count || 0) + 1).padStart(3, '0')}`;

      const inmersionData = {
        codigo,
        operacion_id: data.operacion_id,
        fecha_inmersion: data.fecha_inmersion,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin || null,
        buzo_principal: data.buzo_principal,
        buzo_asistente: data.buzo_asistente || null,
        supervisor: data.supervisor,
        objetivo: data.objetivo,
        profundidad_max: data.profundidad_max,
        temperatura_agua: data.temperatura_agua,
        visibilidad: data.visibilidad,
        corriente: data.corriente,
        observaciones: data.observaciones || null,
        estado: 'planificada'
      };

      const { data: newInmersion, error } = await supabase
        .from('inmersion')
        .insert([inmersionData])
        .select(`
          *,
          operacion:operacion_id (
            nombre
          )
        `)
        .single();

      if (error) throw error;

      const formattedNewInmersion: Inmersion = {
        id: newInmersion.inmersion_id,
        codigo: newInmersion.codigo,
        operacion_id: newInmersion.operacion_id,
        operacion_nombre: newInmersion.operacion?.nombre || 'Nueva Operación',
        fecha_inmersion: newInmersion.fecha_inmersion,
        hora_inicio: newInmersion.hora_inicio,
        hora_fin: newInmersion.hora_fin,
        buzo_principal: newInmersion.buzo_principal,
        buzo_asistente: newInmersion.buzo_asistente,
        supervisor: newInmersion.supervisor,
        objetivo: newInmersion.objetivo,
        profundidad_max: Number(newInmersion.profundidad_max),
        temperatura_agua: Number(newInmersion.temperatura_agua),
        visibilidad: Number(newInmersion.visibilidad),
        corriente: newInmersion.corriente,
        estado: newInmersion.estado,
        hpt_validado: newInmersion.hpt_validado,
        anexo_bravo_validado: newInmersion.anexo_bravo_validado,
        observaciones: newInmersion.observaciones,
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
      console.error('Error creating inmersion:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la inmersión';
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
    inmersiones,
    loading,
    error,
    createInmersion,
    refreshInmersiones: loadInmersiones
  };
};
