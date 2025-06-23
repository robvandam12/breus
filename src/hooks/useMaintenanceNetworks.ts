
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useContextualOperations } from '@/hooks/useContextualOperations';
import { toast } from '@/hooks/use-toast';

export interface MaintenanceNetworkForm {
  id: string;
  inmersion_id: string;
  module_name: string;
  form_type: 'mantencion' | 'faena_redes';
  form_data: any;
  status: 'draft' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const useMaintenanceNetworks = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { isModuleActive } = useContextualOperations();

  // Check if user can access this module
  const canAccessModule = isModuleActive('maintenance_networks');

  // Get all maintenance network forms for current user/company
  const { data: maintenanceForms = [], isLoading } = useQuery({
    queryKey: ['maintenance-networks', profile?.id],
    queryFn: async () => {
      if (!profile?.id) throw new Error('No user profile');

      const { data, error } = await supabase
        .from('operational_forms')
        .select('*')
        .eq('module_name', 'maintenance_networks')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MaintenanceNetworkForm[];
    },
    enabled: !!profile?.id && canAccessModule,
  });

  // Create new maintenance form  
  const createMaintenanceForm = useMutation({
    mutationFn: async (formData: Omit<MaintenanceNetworkForm, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data, error } = await supabase
        .from('operational_forms')
        .insert({
          ...formData,
          created_by: profile?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-networks'] });
      toast({
        title: "Formulario creado",
        description: "El formulario de mantención de redes ha sido creado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el formulario",
        variant: "destructive",
      });
    },
  });

  // Update maintenance form
  const updateMaintenanceForm = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MaintenanceNetworkForm> }) => {
      const { data: result, error } = await supabase
        .from('operational_forms')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-networks'] });
      toast({
        title: "Formulario actualizado",
        description: "Los cambios han sido guardados exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el formulario",
        variant: "destructive",
      });
    },
  });

  // Delete maintenance form
  const deleteMaintenanceForm = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('operational_forms')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-networks'] });
      toast({
        title: "Formulario eliminado",
        description: "El formulario ha sido eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el formulario",
        variant: "destructive",
      });
    },
  });

  // Get forms by inmersion
  const getFormsByInmersion = async (inmersionId: string): Promise<MaintenanceNetworkForm[]> => {
    const { data, error } = await supabase
      .from('operational_forms')
      .select('*')
      .eq('module_name', 'maintenance_networks')
      .eq('inmersion_id', inmersionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MaintenanceNetworkForm[];
  };

  // Complete form (mark as completed)
  const completeForm = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('operational_forms')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-networks'] });
      toast({
        title: "Formulario completado",
        description: "El formulario ha sido marcado como completado",
      });
    },
  });

  return {
    // Data
    maintenanceForms,
    isLoading,
    
    // Module access
    canAccessModule,
    
    // Mutations
    createMaintenanceForm: createMaintenanceForm.mutateAsync,
    updateMaintenanceForm: updateMaintenanceForm.mutateAsync,
    deleteMaintenanceForm: deleteMaintenanceForm.mutateAsync,
    completeForm: completeForm.mutateAsync,
    
    // Utils
    getFormsByInmersion,
    
    // Loading states
    isCreating: createMaintenanceForm.isPending,
    isUpdating: updateMaintenanceForm.isPending,
    isDeleting: deleteMaintenanceForm.isPending,
    isCompleting: completeForm.isPending,
  };
};
