
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { MultiXData, MultiXFormData } from '@/types/multix';

export const useMultiX = () => {
  const [loading, setLoading] = useState(false);
  const [multiXData, setMultiXData] = useState<MultiXData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createMultiX = async (formData: MultiXFormData) => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('multix')
        .insert([{
          operacion_id: formData.operacion_id,
          codigo: formData.codigo,
          tipo_formulario: formData.tipo_formulario,
          multix_data: formData.multix_data,
          user_id: user.id,
          fecha: formData.multix_data.fecha,
          estado: 'borrador',
          progreso: 0
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "MultiX creado",
        description: `Formulario ${formData.tipo_formulario} creado exitosamente`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating MultiX:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudo crear el formulario MultiX",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMultiX = async (id: string, updates: Partial<MultiXData>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('multix')
        .update({
          multix_data: updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMultiXData(data.multix_data);
      
      toast({
        title: "Guardado",
        description: "Cambios guardados exitosamente",
      });

      return data;
    } catch (error: any) {
      console.error('Error updating MultiX:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMultiXByOperacion = async (operacionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('multix')
        .select('*')
        .eq('operacion_id', operacionId);

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Error fetching MultiX:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const signMultiX = async (id: string, firmas: any) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('multix')
        .update({
          firmado: true,
          estado: 'firmado',
          multix_data: {
            ...multiXData,
            firmas
          }
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Formulario firmado",
        description: "El formulario MultiX ha sido firmado exitosamente",
      });

      return data;
    } catch (error: any) {
      console.error('Error signing MultiX:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudo firmar el formulario",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    multiXData,
    setMultiXData,
    createMultiX,
    updateMultiX,
    getMultiXByOperacion,
    signMultiX
  };
};
