
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface OperacionFormData {
  codigo: string;
  nombre: string;
  sitio_id?: string;
  servicio_id?: string;
  salmonera_id?: string;
  contratista_id?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada';
}

export interface OperacionConRelaciones {
  id: string;
  codigo: string;
  nombre: string;
  tareas?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: string;
  estado_aprobacion?: string;
  salmonera_id?: string;
  contratista_id?: string;
  sitio_id?: string;
  servicio_id?: string;
  equipo_buceo_id?: string;
  supervisor_asignado_id?: string;
  created_at: string;
  updated_at: string;
  salmoneras?: { id: string; nombre: string };
  contratistas?: { id: string; nombre: string };
  sitios?: { id: string; nombre: string; codigo: string };
  equipos_buceo?: { id: string; nombre: string };
  usuario_supervisor?: { usuario_id: string; nombre: string; apellido: string };
}

export type Operacion = OperacionConRelaciones;

export const useOperaciones = () => {
  const queryClient = useQueryClient();

  const { data: operaciones = [], isLoading, error, refetch } = useQuery({
    queryKey: ['operaciones'],
    queryFn: async () => {
      console.log('Fetching operaciones...');
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          salmoneras:salmonera_id(id, nombre),
          contratistas:contratista_id(id, nombre),
          sitios:sitio_id(id, nombre, codigo),
          equipos_buceo:equipo_buceo_id(id, nombre),
          usuario_supervisor:supervisor_asignado_id(usuario_id, nombre, apellido)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching operaciones:', error);
        throw error;
      }

      console.log('Operaciones fetched:', data);
      return data as OperacionConRelaciones[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (operacionData: OperacionFormData) => {
      console.log('Creating operacion with data:', operacionData);
      
      const { data, error } = await supabase
        .from('operacion')
        .insert([operacionData])
        .select()
        .single();

      if (error) {
        console.error('Error creating operacion:', error);
        throw error;
      }

      console.log('Operacion created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Create mutation error:', error);
      toast({
        title: "Error",
        description: `No se pudo crear la operación: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OperacionFormData> }) => {
      console.log('Updating operacion with data:', { id, data });
      
      const { data: updated, error } = await supabase
        .from('operacion')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating operacion:', error);
        throw error;
      }

      console.log('Operacion updated:', updated);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar la operación: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting operacion:', id);
      
      // Verificar primero si se puede eliminar
      const canDeleteResult = await checkCanDelete(id);
      if (!canDeleteResult.canDelete) {
        throw new Error(`No se puede eliminar la operación: ${canDeleteResult.reason}`);
      }
      
      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting operacion:', error);
        throw error;
      }

      console.log('Operacion deleted successfully');
    },
    onSuccess: () => {
      // Forzar actualización de cache
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      queryClient.refetchQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Error",
        description: `No se pudo eliminar la operación: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const checkCanDelete = async (operacionId: string) => {
    try {
      console.log('Checking if operation can be deleted:', operacionId);
      
      // Verificar si hay documentos firmados - Usando maybeSingle para evitar errores 400
      const [hptResult, anexoResult, inmersionResult] = await Promise.all([
        supabase
          .from('hpt')
          .select('id')
          .eq('operacion_id', operacionId)
          .eq('firmado', true)
          .maybeSingle(),
        supabase
          .from('anexo_bravo')
          .select('id')
          .eq('operacion_id', operacionId)
          .eq('firmado', true)
          .maybeSingle(),
        supabase
          .from('inmersion')
          .select('inmersion_id')
          .eq('operacion_id', operacionId)
          .maybeSingle()
      ]);

      console.log('Delete check results:', { hptResult, anexoResult, inmersionResult });

      if (hptResult.data) {
        return { canDelete: false, reason: 'tiene documentos HPT firmados' };
      }

      if (anexoResult.data) {
        return { canDelete: false, reason: 'tiene documentos Anexo Bravo firmados' };
      }

      if (inmersionResult.data) {
        return { canDelete: false, reason: 'tiene inmersiones asociadas' };
      }

      return { canDelete: true, reason: '' };
    } catch (error) {
      console.error('Error checking if operation can be deleted:', error);
      return { canDelete: false, reason: 'error al verificar dependencias' };
    }
  };

  const validateOperacionCompleteness = async (operacionId: string) => {
    try {
      console.log('Validating operacion completeness:', operacionId);
      
      // Obtener datos de la operación
      const { data: operacion, error: opError } = await supabase
        .from('operacion')
        .select('*')
        .eq('id', operacionId)
        .single();

      if (opError) {
        console.error('Error fetching operation for validation:', opError);
        throw opError;
      }

      // Verificar documentos - Usando maybeSingle para evitar errores 400
      const [hptResult, anexoResult] = await Promise.all([
        supabase
          .from('hpt')
          .select('id, firmado')
          .eq('operacion_id', operacionId)
          .eq('firmado', true)
          .maybeSingle(),
        supabase
          .from('anexo_bravo')
          .select('id, firmado')
          .eq('operacion_id', operacionId)
          .eq('firmado', true)
          .maybeSingle()
      ]);

      console.log('Validation check results:', { hptResult, anexoResult, operacion });

      const hptReady = !!hptResult.data;
      const anexoBravoReady = !!anexoResult.data;
      const supervisorAsignado = !!operacion.supervisor_asignado_id;
      const equipoAsignado = !!operacion.equipo_buceo_id;
      const sitioAsignado = !!operacion.sitio_id;

      const canExecute = hptReady && anexoBravoReady && supervisorAsignado && equipoAsignado && sitioAsignado;

      console.log('Validation result:', {
        hptReady,
        anexoBravoReady,
        supervisorAsignado,
        equipoAsignado,
        sitioAsignado,
        canExecute
      });

      return {
        hptReady,
        anexoBravoReady,
        supervisorAsignado,
        equipoAsignado,
        sitioAsignado,
        canExecute
      };
    } catch (error) {
      console.error('Error validating operacion completeness:', error);
      return {
        hptReady: false,
        anexoBravoReady: false,
        supervisorAsignado: false,
        equipoAsignado: false,
        sitioAsignado: false,
        canExecute: false
      };
    }
  };

  const createOperacion = async (data: OperacionFormData) => {
    return createMutation.mutateAsync(data);
  };

  const updateOperacion = async ({ id, data }: { id: string; data: Partial<OperacionFormData> }) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteOperacion = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    operaciones,
    isLoading,
    error,
    refetch,
    createOperacion,
    updateOperacion,
    deleteOperacion,
    checkCanDelete,
    validateOperacionCompleteness,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
