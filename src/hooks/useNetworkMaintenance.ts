
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { NetworkMaintenanceData, NetworkMaintenanceFormData } from '@/types/network-maintenance';

export const useNetworkMaintenance = () => {
  const [loading, setLoading] = useState(false);
  const [networkMaintenanceData, setNetworkMaintenanceData] = useState<NetworkMaintenanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createNetworkMaintenance = async (formData: NetworkMaintenanceFormData) => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('operational_forms')
        .insert({
          inmersion_id: formData.operacion_id,
          module_name: 'network_maintenance',
          form_type: formData.tipo_formulario,
          form_data: formData.network_maintenance_data as any,
          created_by: user.id,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Mantención de Redes creada",
        description: `Formulario ${formData.tipo_formulario} creado exitosamente`,
      });

      return data;
    } catch (error: any) {
      console.error('Error creating Network Maintenance:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudo crear el formulario de mantención de redes",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateNetworkMaintenance = async (id: string, updates: Partial<NetworkMaintenanceData>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('operational_forms')
        .update({
          form_data: updates as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setNetworkMaintenanceData(data.form_data as unknown as NetworkMaintenanceData);
      
      return data;
    } catch (error: any) {
      console.error('Error updating Network Maintenance:', error);
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

  const getNetworkMaintenanceByOperacion = async (operacionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('operational_forms')
        .select('*')
        .eq('inmersion_id', operacionId)
        .eq('module_name', 'network_maintenance')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error: any) {
      console.error('Error fetching Network Maintenance:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const completeNetworkMaintenance = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('operational_forms')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Formulario completado",
        description: "El formulario de mantención de redes ha sido completado exitosamente",
      });

      return data;
    } catch (error: any) {
      console.error('Error completing Network Maintenance:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "No se pudo completar el formulario",
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
    networkMaintenanceData,
    setNetworkMaintenanceData,
    createNetworkMaintenance,
    updateNetworkMaintenance,
    getNetworkMaintenanceByOperacion,
    completeNetworkMaintenance
  };
};
