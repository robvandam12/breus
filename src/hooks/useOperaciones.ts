
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
      console.log('Fetching operaciones...');
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
        console.error('Error fetching operaciones:', error);
        throw error;
      }

      console.log('Operaciones fetched:', data);
      return data as Operacion[];
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
