
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

export interface NetworkMaintenanceRecord {
  id: string;
  inmersion_id: string;
  codigo?: string;
  tipo_formulario: 'mantencion' | 'faena_redes';
  network_maintenance_data: NetworkMaintenanceData;
  status: 'draft' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const useNetworkMaintenance = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Get all network maintenance records
  const { data: records = [], isLoading } = useQuery({
    queryKey: ['network-maintenance', profile?.usuario_id],
    queryFn: async () => {
      if (!profile?.usuario_id) throw new Error('No user profile');

      const { data, error } = await supabase
        .from('operational_forms')
        .select('*')
        .eq('module_name', 'maintenance_networks')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(record => ({
        id: record.id,
        inmersion_id: record.inmersion_id,
        codigo: `NM-${record.id.slice(0, 8)}`,
        tipo_formulario: record.form_type as 'mantencion' | 'faena_redes',
        network_maintenance_data: record.form_data as unknown as NetworkMaintenanceData,
        status: record.status as 'draft' | 'completed' | 'archived',
        created_at: record.created_at,
        updated_at: record.updated_at,
        created_by: record.created_by || ''
      })) as NetworkMaintenanceRecord[];
    },
    enabled: !!profile?.usuario_id,
  });

  // Create network maintenance record
  const createNetworkMaintenance = async (data: {
    inmersion_id: string;
    codigo: string;
    tipo_formulario: 'mantencion' | 'faena_redes';
    network_maintenance_data: NetworkMaintenanceData;
  }) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('operational_forms')
        .insert({
          inmersion_id: data.inmersion_id,
          module_name: 'maintenance_networks',
          form_type: data.tipo_formulario,
          form_data: data.network_maintenance_data as any,
          status: 'draft',
          created_by: profile?.usuario_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['network-maintenance'] });
      
      toast({
        title: "Formulario creado",
        description: "El formulario de mantención de redes ha sido creado exitosamente",
      });

      return result;
    } catch (error: any) {
      console.error('Error creating network maintenance:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el formulario",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update network maintenance record
  const updateNetworkMaintenance = async (id: string, data: NetworkMaintenanceData) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('operational_forms')
        .update({
          form_data: data as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['network-maintenance'] });
      
      return result;
    } catch (error: any) {
      console.error('Error updating network maintenance:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Complete network maintenance
  const completeNetworkMaintenance = async (id: string) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from('operational_forms')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['network-maintenance'] });
      
      return result;
    } catch (error: any) {
      console.error('Error completing network maintenance:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get by inmersion
  const getNetworkMaintenanceByInmersion = async (inmersionId: string) => {
    const { data, error } = await supabase
      .from('operational_forms')
      .select('*')
      .eq('module_name', 'maintenance_networks')
      .eq('inmersion_id', inmersionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  // Get all for current user
  const getAllNetworkMaintenance = async () => {
    const { data, error } = await supabase
      .from('operational_forms')
      .select('*')
      .eq('module_name', 'maintenance_networks')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  };

  return {
    records,
    isLoading,
    loading,
    createNetworkMaintenance,
    updateNetworkMaintenance,
    completeNetworkMaintenance,
    getNetworkMaintenanceByInmersion,
    getAllNetworkMaintenance,
  };
};
