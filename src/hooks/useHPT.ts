
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
      // Para HPT, necesitaremos crear la tabla también. Por ahora, devolvemos una lista vacía
      console.log('HPT table not created yet - returning empty list');
      setHpts([]);
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
      console.log('Creating HPT:', data);
      // TODO: Implement when HPT table is created
      toast({
        title: "Información",
        description: "La tabla HPT aún no está implementada",
        variant: "destructive",
      });
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
