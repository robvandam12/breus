
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InmersionData {
  codigo: string;
  operacion_id: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  supervisor: string;
  supervisor_id?: string;
  buzo_principal: string;
  buzo_principal_id?: string;
  buzo_asistente?: string;
  buzo_asistente_id?: string;
  objetivo: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones?: string;
  estado: string;
}

export const useInmersion = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const createInmersion = async (data: InmersionData) => {
    setIsCreating(true);
    try {
      const { data: result, error } = await supabase
        .from('inmersion')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });

      return result;
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateInmersion = async ({ id, data }: { id: string; data: Partial<InmersionData> }) => {
    setIsUpdating(true);
    try {
      const { data: result, error } = await supabase
        .from('inmersion')
        .update(data)
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });

      return result;
    } catch (error) {
      console.error('Error updating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    createInmersion,
    updateInmersion,
    isCreating,
    isUpdating,
  };
};
