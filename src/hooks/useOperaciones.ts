
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin?: string;
  created_at: string;
  updated_at: string;
}

export const useOperaciones = () => {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOperaciones();
  }, []);

  const loadOperaciones = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('operacion')
        .select('*')
        .eq('estado', 'activa')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: Operacion[] = (data || []).map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        estado: item.estado,
        fecha_inicio: item.fecha_inicio,
        fecha_fin: item.fecha_fin,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setOperaciones(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error loading operaciones:', err);
      setError('Error al cargar las operaciones');
      toast({
        title: "Error",
        description: "No se pudieron cargar las operaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    operaciones,
    loading,
    error,
    refreshOperaciones: loadOperaciones
  };
};
