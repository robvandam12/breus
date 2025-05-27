
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface HPT {
  id: string;
  codigo: string;
  supervisor: string;
  plan_trabajo: string;
  operacion_id: string;
  fecha_programada?: string;
  hora_inicio?: string;
  hora_fin?: string;
  descripcion_trabajo?: string;
  profundidad_maxima?: number;
  temperatura?: number;
  observaciones?: string;
  firmado: boolean;
  estado: string;
  progreso: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Nuevos campos según especificación
  folio?: string;
  fecha?: string;
  hora_termino?: string;
  empresa_servicio_nombre?: string;
  supervisor_nombre?: string;
  centro_trabajo_nombre?: string;
  jefe_mandante_nombre?: string;
  descripcion_tarea?: string;
  es_rutinaria?: boolean;
  lugar_especifico?: string;
  estado_puerto?: string;
  hpt_epp?: any;
  hpt_erc?: any;
  hpt_medidas?: any;
  hpt_riesgos_comp?: any;
  hpt_conocimiento?: any;
  hpt_conocimiento_asistentes?: any[];
  hpt_firmas?: any;
  supervisor_servicio_id?: string;
  supervisor_mandante_id?: string;
  form_version?: number;
}

export interface HPTFormData {
  codigo: string;
  supervisor: string;
  operacion_id: string;
  plan_trabajo: string;
  fecha_programada?: string;
  hora_inicio?: string;
  hora_fin?: string;
  descripcion_trabajo?: string;
  profundidad_maxima?: number;
  temperatura?: number;
  observaciones?: string;
  // Nuevos campos para el formulario completo
  folio?: string;
  fecha?: string;
  hora_termino?: string;
  empresa_servicio_nombre?: string;
  supervisor_nombre?: string;
  centro_trabajo_nombre?: string;
  jefe_mandante_nombre?: string;
  descripcion_tarea?: string;
  es_rutinaria?: boolean;
  lugar_especifico?: string;
  estado_puerto?: string;
  hpt_epp?: any;
  hpt_erc?: any;
  hpt_medidas?: any;
  hpt_riesgos_comp?: any;
  hpt_conocimiento?: any;
  hpt_conocimiento_asistentes?: any[];
}

export const useHPT = () => {
  const queryClient = useQueryClient();

  const { data: hpts = [], isLoading, error } = useQuery({
    queryKey: ['hpts'],
    queryFn: async () => {
      console.log('useHPT - Fetching HPTs...');
      const { data, error } = await supabase
        .from('hpt')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useHPT - Error fetching HPTs:', error);
        throw error;
      }

      console.log('useHPT - HPTs data:', data);
      return data as HPT[];
    },
  });

  const createHPTMutation = useMutation({
    mutationFn: async (hptData: HPTFormData) => {
      console.log('Creating HPT:', hptData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('hpt')
        .insert([{
          ...hptData,
          user_id: user.id,
          fecha_creacion: new Date().toISOString().split('T')[0],
          estado: 'borrador',
          progreso: 0,
          firmado: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating HPT:', error);
        throw error;
      }

      console.log('HPT created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
      toast({
        title: "HPT creada",
        description: "La Hoja de Planificación de Tarea ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateHPTMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HPTFormData> }) => {
      console.log('Updating HPT:', id, data);
      const { data: updatedData, error } = await supabase
        .from('hpt')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating HPT:', error);
        throw error;
      }

      console.log('HPT updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
      toast({
        title: "HPT actualizada",
        description: "La HPT ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const signHPTMutation = useMutation({
    mutationFn: async ({ id, signatures }: { id: string; signatures: any }) => {
      console.log('Signing HPT:', id, signatures);
      const { data, error } = await supabase
        .from('hpt')
        .update({
          firmado: true,
          estado: 'firmado',
          progreso: 100,
          hpt_firmas: signatures
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error signing HPT:', error);
        throw error;
      }

      console.log('HPT signed:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
      toast({
        title: "HPT firmada",
        description: "La HPT ha sido firmada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error signing HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteHPTMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting HPT:', id);
      const { error } = await supabase
        .from('hpt')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting HPT:', error);
        throw error;
      }

      console.log('HPT deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-status'] });
      toast({
        title: "HPT eliminada",
        description: "La HPT ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    hpts,
    isLoading,
    error,
    createHPT: createHPTMutation.mutateAsync,
    updateHPT: updateHPTMutation.mutateAsync,
    signHPT: signHPTMutation.mutateAsync,
    deleteHPT: deleteHPTMutation.mutateAsync,
    isCreating: createHPTMutation.isPending,
    isUpdating: updateHPTMutation.isPending,
    isSigning: signHPTMutation.isPending,
    isDeleting: deleteHPTMutation.isPending,
  };
};
