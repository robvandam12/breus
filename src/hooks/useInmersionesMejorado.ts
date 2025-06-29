
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface InmersionFormData {
  codigo: string;
  fecha_inmersion: string;
  hora_inicio?: string;
  hora_fin?: string;
  objetivo: string;
  profundidad_max: number;
  supervisor?: string;
  buzo_principal?: string;
  buzo_asistente?: string;
  operacion_id?: string;
  observaciones?: string;
  cuadrilla_id?: string;
  centro_id?: string;
}

export const useInmersionesMejorado = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const createInmersion = useMutation({
    mutationFn: async (data: InmersionFormData) => {
      console.log('Creating inmersion with data:', data);
      
      // Preparar datos para la inmersión
      const inmersionData = {
        codigo: data.codigo,
        fecha_inmersion: data.fecha_inmersion,
        hora_inicio: data.hora_inicio || null,
        hora_fin: data.hora_fin || null,
        objetivo: data.objetivo,
        profundidad_max: data.profundidad_max,
        supervisor: data.supervisor || null,
        buzo_principal: data.buzo_principal || null,
        buzo_asistente: data.buzo_asistente || null,
        operacion_id: data.operacion_id || null,
        observaciones: data.observaciones || '',
        centro_id: data.centro_id || null,
        estado: 'planificada',
        // Incluir metadata con cuadrilla si existe
        metadata: data.cuadrilla_id ? { cuadrilla_id: data.cuadrilla_id } : {}
      };

      // Crear la inmersión
      const { data: inmersionCreada, error: inmersionError } = await supabase
        .from('inmersion')
        .insert([inmersionData])
        .select()
        .single();

      if (inmersionError) {
        console.error('Error creating inmersion:', inmersionError);
        throw inmersionError;
      }

      // Si hay cuadrilla asignada, crear la asignación
      if (data.cuadrilla_id && inmersionCreada) {
        const { error: asignacionError } = await supabase
          .from('cuadrilla_asignaciones')
          .insert([{
            cuadrilla_id: data.cuadrilla_id,
            inmersion_id: inmersionCreada.inmersion_id,
            fecha_asignacion: data.fecha_inmersion,
            estado: 'activa'
          }]);

        if (asignacionError) {
          console.error('Error creating cuadrilla assignment:', asignacionError);
          // Si falla la asignación, eliminar la inmersión creada
          await supabase
            .from('inmersion')
            .delete()
            .eq('inmersion_id', inmersionCreada.inmersion_id);
          
          throw new Error('Error al asignar cuadrilla a la inmersión');
        }
      }

      return inmersionCreada;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    },
  });

  const deleteInmersion = useMutation({
    mutationFn: async (inmersionId: string) => {
      console.log('Starting deletion process for inmersion:', inmersionId);
      
      // Primero eliminar asignaciones de cuadrilla si existen
      const { error: asignacionError } = await supabase
        .from('cuadrilla_asignaciones')
        .delete()
        .eq('inmersion_id', inmersionId);

      if (asignacionError) {
        console.warn('Warning deleting cuadrilla assignments:', asignacionError);
      }

      // Luego eliminar la inmersión
      const { error: inmersionError } = await supabase
        .from('inmersion')
        .delete()
        .eq('inmersion_id', inmersionId);

      if (inmersionError) {
        console.error('Error deleting inmersion:', inmersionError);
        throw new Error('No se pudo eliminar la inmersión - ' + inmersionError.message);
      }

      return inmersionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      queryClient.invalidateQueries({ queryKey: ['cuadrillas'] });
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Delete mutation failed:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la inmersión.",
        variant: "destructive",
      });
    },
  });

  return {
    createInmersion: createInmersion.mutateAsync,
    deleteInmersion: deleteInmersion.mutateAsync,
    isCreating: createInmersion.isPending,
    isDeleting: deleteInmersion.isPending,
  };
};
