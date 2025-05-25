import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada';
  salmonera_id?: string;
  sitio_id?: string;
  contratista_id?: string;
  created_at: string;
  updated_at: string;
  // Campos calculados para mostrar nombres
  sitio_nombre?: string;
  contratista_nombre?: string;
  // Relaciones
  salmoneras?: {
    nombre: string;
    rut: string;
  };
  sitios?: {
    nombre: string;
    codigo: string;
    ubicacion: string;
  };
  contratistas?: {
    nombre: string;
    rut: string;
  };
}

export interface OperacionFormData {
  codigo: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada';
  salmonera_id?: string;
  sitio_id?: string;
  contratista_id?: string;
}

export const useOperaciones = () => {
  const queryClient = useQueryClient();

  const { data: operaciones = [], isLoading, error } = useQuery({
    queryKey: ['operaciones'],
    queryFn: async () => {
      console.log('useOperaciones - Fetching operaciones...');
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          salmoneras:salmonera_id (
            nombre,
            rut
          ),
          sitios:sitio_id (
            nombre,
            codigo,
            ubicacion
          ),
          contratistas:contratista_id (
            nombre,
            rut
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useOperaciones - Error fetching operaciones:', error);
        throw error;
      }

      console.log('useOperaciones - Raw operaciones data:', data);
      
      const validOperaciones = (data || [])
        .filter(item => {
          const isValid = item && 
            typeof item === 'object' &&
            item.id && 
            typeof item.id === 'string' &&
            item.id.trim() !== "" &&
            item.nombre &&
            typeof item.nombre === 'string' &&
            item.nombre.trim() !== "";
          
          if (!isValid) {
            console.log('useOperaciones - Invalid operation filtered out:', item);
          }
          
          return isValid;
        })
        .map(item => {
          const processedItem = {
            ...item,
            codigo: item.codigo || `OP-${item.id.slice(0, 8)}`,
            // Agregar nombres calculados para la UI
            sitio_nombre: item.sitios?.nombre || 'Sin asignar',
            contratista_nombre: item.contratistas?.nombre || 'Sin asignar'
          };
          
          console.log('useOperaciones - Processed operation:', processedItem.id, processedItem.nombre, processedItem.codigo);
          
          return processedItem;
        }) as Operacion[];

      console.log('useOperaciones - Final filtered operaciones:', validOperaciones);
      return validOperaciones;
    },
  });

  const createOperacionMutation = useMutation({
    mutationFn: async (operacionData: OperacionFormData) => {
      console.log('Creating operacion:', operacionData);
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
    onError: (error) => {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateOperacionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OperacionFormData> }) => {
      console.log('Updating operacion:', id, data);
      const { data: updatedData, error } = await supabase
        .from('operacion')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating operacion:', error);
        throw error;
      }

      console.log('Operacion updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la operación. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteOperacionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting operacion:', id);
      const { error } = await supabase
        .from('operacion')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting operacion:', error);
        throw error;
      }

      console.log('Operacion deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la operación. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    operaciones,
    isLoading,
    error,
    createOperacion: createOperacionMutation.mutateAsync,
    updateOperacion: updateOperacionMutation.mutateAsync,
    deleteOperacion: deleteOperacionMutation.mutateAsync,
    isCreating: createOperacionMutation.isPending,
    isUpdating: updateOperacionMutation.isPending,
    isDeleting: deleteOperacionMutation.isPending,
  };
};
