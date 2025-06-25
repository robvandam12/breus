
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BitacoraSupervisorFormData {
  inmersion_id?: string;
  codigo?: string;
  fecha?: string;
  firmado?: boolean;
  supervisor?: string;
  estado_aprobacion?: string;
  comentarios_validacion?: string;
  desarrollo_inmersion?: string;
  descripcion_trabajo?: string;
  trabajo_a_realizar?: string;
  incidentes?: string;
  evaluacion_general?: string;
  lugar_trabajo?: string;
  centro_nombre?: string;
  empresa_nombre?: string;
  estado_mar?: string;
  embarcacion_apoyo?: string;
  fecha_inicio_faena?: string;
  hora_inicio_faena?: string;
  hora_termino_faena?: string;
  visibilidad_fondo?: number;
  // Agregar campos de contexto empresarial
  company_id?: string;
  company_type?: 'salmonera' | 'contratista';
}

export const useBitacorasSupervisorMutations = () => {
  const queryClient = useQueryClient();

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (data: Partial<BitacoraSupervisorFormData>) => {
      // Validar que tenga contexto empresarial
      if (!data.company_id || !data.company_type) {
        throw new Error('Contexto empresarial requerido para crear bitácora de supervisor');
      }

      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert([{
          inmersion_id: data.inmersion_id,
          codigo: data.codigo,
          fecha: data.fecha,
          supervisor: data.supervisor,
          desarrollo_inmersion: data.desarrollo_inmersion,
          incidentes: data.incidentes || '',
          evaluacion_general: data.evaluacion_general,
          lugar_trabajo: data.lugar_trabajo,
          estado_aprobacion: data.estado_aprobacion || 'pendiente',
          firmado: data.firmado || false,
          company_id: data.company_id,
          company_type: data.company_type,
        }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la bitácora de supervisor.",
        variant: "destructive",
      });
    },
  });

  const updateBitacoraSupervisor = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BitacoraSupervisorFormData> }) => {
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .update(data)
        .eq('bitacora_id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      toast({
        title: "Bitácora actualizada",
        description: "La bitácora de supervisor ha sido actualizada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la bitácora de supervisor.",
        variant: "destructive",
      });
    },
  });

  const deleteBitacoraSupervisor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bitacora_supervisor')
        .delete()
        .eq('bitacora_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      toast({
        title: "Bitácora eliminada",
        description: "La bitácora de supervisor ha sido eliminada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la bitácora de supervisor.",
        variant: "destructive",
      });
    },
  });

  return {
    createBitacoraSupervisor: createBitacoraSupervisor.mutateAsync,
    updateBitacoraSupervisor: updateBitacoraSupervisor.mutateAsync,
    deleteBitacoraSupervisor: deleteBitacoraSupervisor.mutateAsync,
    isCreating: createBitacoraSupervisor.isPending,
    isUpdating: updateBitacoraSupervisor.isPending,
    isDeleting: deleteBitacoraSupervisor.isPending,
  };
};
