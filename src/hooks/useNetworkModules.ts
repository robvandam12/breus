import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useModularSystem } from "./useModularSystem";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface NetworkForm {
  id: string;
  inmersion_id: string;
  module_name: string;
  form_type: 'faena_redes' | 'mantencion';
  form_data: {
    // Datos generales
    fecha?: string;
    hora_inicio?: string;
    hora_termino?: string;
    lugar_trabajo?: string;
    temperatura?: number;
    profundidad_max?: number;
    estado_puerto?: string;
    
    // Equipos y dotación
    dotacion?: Array<{
      nombre: string;
      apellido?: string;
      rol: string;
      matricula?: string;
      equipo?: string;
    }>;
    
    equipos_superficie?: Array<{
      equipo_sup: string;
      matricula_eq?: string;
      horometro_ini?: number;
      horometro_fin?: number;
    }>;
    
    // Datos específicos según tipo
    [key: string]: any;
  };
  status: 'draft' | 'completed' | 'approved';
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  approved_at?: string;
}

export const useNetworkModules = () => {
  const { hasModuleAccess, modules } = useModularSystem();
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Verificar acceso a módulos de red
  const canAccessMaintenanceModule = hasModuleAccess(modules.MAINTENANCE_NETWORKS);
  const canAccessOperationsModule = hasModuleAccess(modules.MAINTENANCE_NETWORKS); // Usando el mismo módulo por ahora

  // Obtener formularios de redes
  const { data: networkForms = [], isLoading, refetch } = useQuery({
    queryKey: ['network-forms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operational_forms')
        .select(`
          *,
          inmersion:inmersion_id (
            codigo,
            fecha_inmersion,
            supervisor,
            buzo_principal
          )
        `)
        .eq('module_name', 'maintenance_networks')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NetworkForm[];
    },
    enabled: canAccessMaintenanceModule || canAccessOperationsModule,
  });

  // Crear nuevo formulario de redes
  const createNetworkForm = useMutation({
    mutationFn: async (formData: Omit<NetworkForm, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('operational_forms')
        .insert({
          inmersion_id: formData.inmersion_id,
          module_name: formData.module_name,
          form_type: formData.form_type,
          form_data: formData.form_data,
          status: formData.status || 'draft',
          created_by: profile?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-forms'] });
      toast({
        title: "Formulario Creado",
        description: "El formulario de redes ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo crear el formulario de redes.",
        variant: "destructive",
      });
    },
  });

  // Actualizar formulario de redes
  const updateNetworkForm = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NetworkForm> }) => {
      const updateData: any = {
        form_data: data.form_data,
        status: data.status,
        updated_at: new Date().toISOString(),
      };

      if (data.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      if (data.status === 'approved') {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = profile?.id;
      }

      const { data: updatedData, error } = await supabase
        .from('operational_forms')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-forms'] });
      toast({
        title: "Formulario Actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    },
  });

  // Eliminar formulario de redes
  const deleteNetworkForm = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('operational_forms')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-forms'] });
      toast({
        title: "Formulario Eliminado",
        description: "El formulario ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el formulario.",
        variant: "destructive",
      });
    },
  });

  // Obtener formulario por ID
  const getNetworkFormById = (id: string) => {
    return networkForms.find(form => form.id === id);
  };

  // Filtrar formularios por tipo
  const getFormsByType = (type: 'faena_redes' | 'mantencion') => {
    return networkForms.filter(form => form.form_type === type);
  };

  return {
    // Data
    networkForms,
    isLoading,
    canAccessMaintenanceModule,
    canAccessOperationsModule,
    
    // Actions
    createNetworkForm: createNetworkForm.mutateAsync,
    updateNetworkForm: updateNetworkForm.mutateAsync,
    deleteNetworkForm: deleteNetworkForm.mutateAsync,
    refetch,
    
    // Helpers
    getNetworkFormById,
    getFormsByType,
    
    // Loading states
    isCreating: createNetworkForm.isPending,
    isUpdating: updateNetworkForm.isPending,
    isDeleting: deleteNetworkForm.isPending,
  };
};
