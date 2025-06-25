
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface NetworkMaintenanceFormData {
  codigo: string;
  lugar_trabajo: string;
  fecha: string;
  temperatura: number;
  hora_inicio: string;
  hora_termino: string;
  profundidad_max: number;
  nave_maniobras: string;
  team_s?: string;
  team_be?: string;
  team_bi?: string;
  matricula_nave: string;
  estado_puerto: string;
  tipo_formulario: 'mantencion_redes' | 'faena_redes';
  multix_data: any;
  estado: string;
  progreso: number;
  firmado: boolean;
  user_id: string;
  operacion_id?: string;
  created_at: string;
  updated_at: string;
}

export const useNetworkMaintenance = () => {
  const [networkMaintenanceForms, setNetworkMaintenanceForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const createNetworkMaintenance = useCallback(async (formData: NetworkMaintenanceFormData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('multix')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setNetworkMaintenanceForms(prev => [...prev, data]);
      
      toast({
        title: "Formulario creado",
        description: "El formulario ha sido creado exitosamente.",
      });

      return data;
    } catch (error) {
      console.error('Error creating network maintenance form:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el formulario",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNetworkMaintenance = useCallback(async (id: string, formData: Partial<NetworkMaintenanceFormData>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('multix')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setNetworkMaintenanceForms(prev => 
        prev.map(form => form.id === id ? data : form)
      );

      toast({
        title: "Formulario actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });

      return data;
    } catch (error) {
      console.error('Error updating network maintenance form:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el formulario",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSignatures = useCallback(async (id: string, signatures: any) => {
    try {
      setLoading(true);
      
      // Obtener el formulario actual
      const { data: currentForm, error: fetchError } = await supabase
        .from('multix')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Asegurar que multix_data sea un objeto válido antes del spread
      const existingMultixData = currentForm.multix_data && typeof currentForm.multix_data === 'object' 
        ? currentForm.multix_data 
        : {};

      // Actualizar solo las firmas manteniendo el resto de datos
      const updatedMultixData = {
        ...existingMultixData,
        firmas: signatures
      };

      const isFullySigned = !!(signatures.supervisor_firma && signatures.jefe_centro_firma);

      const { data, error } = await supabase
        .from('multix')
        .update({
          multix_data: updatedMultixData,
          firmado: isFullySigned,
          estado: isFullySigned ? 'firmado' : currentForm.estado,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setNetworkMaintenanceForms(prev => 
        prev.map(form => form.id === id ? data : form)
      );

      toast({
        title: "Firmas actualizadas",
        description: isFullySigned 
          ? "El formulario ha sido firmado completamente." 
          : "Las firmas han sido guardadas.",
      });

      return data;
    } catch (error) {
      console.error('Error updating signatures:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las firmas",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNetworkMaintenance = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('multix')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNetworkMaintenanceForms(prev => prev.filter(form => form.id !== id));

      toast({
        title: "Formulario eliminado",
        description: "El formulario ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting network maintenance form:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el formulario",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNetworkMaintenanceForms = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('multix')
        .select('*')
        .in('tipo_formulario', ['mantencion_redes', 'faena_redes', 'instalacion_cambio_redes'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNetworkMaintenanceForms(data || []);
    } catch (error) {
      console.error('Error fetching network maintenance forms:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los formularios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchNetworkMaintenanceForms();
  }, [fetchNetworkMaintenanceForms]);

  const refetch = useCallback(async () => {
    await fetchNetworkMaintenanceForms();
  }, [fetchNetworkMaintenanceForms]);

  return {
    networkMaintenanceForms,
    loading,
    createNetworkMaintenance,
    updateNetworkMaintenance,
    updateSignatures,
    deleteNetworkMaintenance,
    fetchNetworkMaintenanceForms,
    refetch,
  };
};
