
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useMaintenanceNetworks = () => {
  const queryClient = useQueryClient();

  // Obtener formularios multix (mantención de redes)
  const { data: maintenanceForms = [], isLoading, error } = useQuery({
    queryKey: ['multix-forms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('multix')
        .select(`
          *,
          dotacion:multix_dotacion(*),
          equipos_superficie:multix_equipos_superficie(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Crear nuevo formulario de mantención
  const createMaintenanceForm = useMutation({
    mutationFn: async (formData: any) => {
      const { data, error } = await supabase
        .from('multix')
        .insert([{
          codigo: formData.codigo,
          tipo_formulario: formData.tipo_formulario,
          fecha: formData.fecha,
          lugar_trabajo: formData.lugar_trabajo,
          nave_maniobras: formData.nave_maniobras,
          matricula_nave: formData.matricula_nave,
          estado_puerto: formData.estado_puerto,
          team_s: formData.team_s,
          team_be: formData.team_be,
          team_bi: formData.team_bi,
          hora_inicio: formData.hora_inicio,
          hora_termino: formData.hora_termino,
          profundidad_max: formData.profundidad_max,
          temperatura: formData.temperatura,
          multix_data: formData.multix_data || {},
          user_id: (await supabase.auth.getUser()).data.user?.id,
          estado: 'borrador',
          progreso: 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multix-forms'] });
      toast({
        title: "Formulario creado",
        description: "El formulario de mantención ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating maintenance form:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el formulario de mantención.",
        variant: "destructive",
      });
    },
  });

  // Obtener formularios por tipo
  const getFormsByType = (type: 'mantencion' | 'faena_redes') => {
    return maintenanceForms.filter(form => form.tipo_formulario === type);
  };

  // Actualizar formulario
  const updateMaintenanceForm = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: updatedData, error } = await supabase
        .from('multix')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multix-forms'] });
      toast({
        title: "Formulario actualizado",
        description: "El formulario ha sido actualizado exitosamente.",
      });
    },
  });

  // Eliminar formulario
  const deleteMaintenanceForm = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('multix')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multix-forms'] });
      toast({
        title: "Formulario eliminado",
        description: "El formulario ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting maintenance form:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el formulario.",
        variant: "destructive",
      });
    },
  });

  // Propiedades adicionales para compatibilidad
  const canAccessModule = true; // Por ahora siempre permitir acceso
  const isUpdating = updateMaintenanceForm.isPending;

  return {
    maintenanceForms,
    isLoading,
    error,
    createMaintenanceForm: createMaintenanceForm.mutateAsync,
    isCreating: createMaintenanceForm.isPending,
    updateMaintenanceForm: updateMaintenanceForm.mutateAsync,
    deleteMaintenanceForm: deleteMaintenanceForm.mutateAsync,
    isUpdating,
    canAccessModule,
    getFormsByType,
  };
};
