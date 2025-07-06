import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OperacionFormData {
  codigo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada';
  salmonera_id?: string;
  centro_id?: string;
  contratista_id?: string;
  servicio_id?: string;
  company_id?: string;
  company_type?: string;
  tareas?: string;
}

export const useOperacionesMutations = () => {
  const queryClient = useQueryClient();

  const createOperacion = useMutation({
    mutationFn: async (data: OperacionFormData) => {
      console.log('Sending operacion data:', data);
      
      // Preparar los datos asegurando que tengan la estructura correcta
      const operacionData = {
        codigo: data.codigo,
        nombre: data.nombre,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin || null,
        estado: data.estado,
        tareas: data.tareas || null,
        salmonera_id: data.salmonera_id || null,
        contratista_id: data.contratista_id || null,
        centro_id: data.centro_id || null,
        servicio_id: data.servicio_id || null,
        company_id: data.company_id || null,
        company_type: data.company_type || null
      };

      const { data: result, error } = await supabase
        .from('operacion')
        .insert([operacionData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación creada",
        description: "La operación se ha creado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      
      let errorMessage = 'No se pudo crear la operación';
      
      // Mensajes de error específicos
      if (error.code === '23505') {
        errorMessage = 'Ya existe una operación con este código. Por favor, use un código diferente.';
      } else if (error.code === '23503') {
        errorMessage = 'Uno de los recursos seleccionados (centro o contratista) no es válido.';
      } else if (error.code === '22P02') {
        errorMessage = 'Formato de datos inválido. Verifique que todos los campos estén correctamente completados.';
      } else if (error.message?.includes('invalid input syntax for type uuid')) {
        errorMessage = 'Error en la selección de empresa. Por favor, seleccione un centro y contratista válidos.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Error al crear operación",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const updateOperacion = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OperacionFormData }) => {
      const { data: result, error } = await supabase
        .from('operacion')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación actualizada",
        description: "La operación se ha actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo actualizar la operación: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteOperacion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación eliminada",
        description: "La operación se ha eliminado exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar la operación: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const checkCanDelete = async (id: string) => {
    try {
      // Verificar si hay inmersiones asociadas
      const { data: inmersiones, error } = await supabase
        .from('inmersion')
        .select('inmersion_id')
        .eq('operacion_id', id)
        .limit(1);

      if (error) throw error;

      if (inmersiones && inmersiones.length > 0) {
        return {
          canDelete: false,
          reason: 'tiene inmersiones asociadas'
        };
      }

      return {
        canDelete: true,
        reason: null
      };
    } catch (error) {
      console.error('Error checking if can delete:', error);
      return {
        canDelete: false,
        reason: 'error al verificar dependencias'
      };
    }
  };

  return {
    createOperacion: createOperacion.mutateAsync,
    updateOperacion: updateOperacion.mutateAsync,
    deleteOperacion: deleteOperacion.mutateAsync,
    checkCanDelete,
    isCreating: createOperacion.isPending,
    isUpdating: updateOperacion.isPending,
    isDeleting: deleteOperacion.isPending,
  };
};
