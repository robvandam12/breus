
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Salmonera {
  id: string;
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  sitios_activos: number;
  estado: 'activa' | 'inactiva' | 'suspendida';
  created_at: string;
  updated_at: string;
}

export interface SalmoneraFormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  estado: 'activa' | 'inactiva' | 'suspendida';
}

export const useSalmoneras = () => {
  const queryClient = useQueryClient();

  const { data: salmoneras = [], isLoading, error } = useQuery({
    queryKey: ['salmoneras'],
    queryFn: async () => {
      console.log('Fetching salmoneras...');
      const { data, error } = await supabase
        .from('salmoneras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching salmoneras:', error);
        throw error;
      }

      console.log('Salmoneras fetched:', data);
      return data as Salmonera[];
    },
  });

  const createSalmoneraeMutation = useMutation({
    mutationFn: async (salmoneraData: SalmoneraFormData) => {
      console.log('Creating salmonera:', salmoneraData);
      const { data, error } = await supabase
        .from('salmoneras')
        .insert([salmoneraData])
        .select()
        .single();

      if (error) {
        console.error('Error creating salmonera:', error);
        throw error;
      }

      console.log('Salmonera created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Salmonera creada",
        description: "La salmonera ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating salmonera:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la salmonera. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateSalmoneraeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SalmoneraFormData> }) => {
      console.log('Updating salmonera:', id, data);
      const { data: updatedData, error } = await supabase
        .from('salmoneras')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating salmonera:', error);
        throw error;
      }

      console.log('Salmonera updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Salmonera actualizada",
        description: "La salmonera ha sido actualizada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating salmonera:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la salmonera. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteSalmoneraeMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting salmonera:', id);
      const { error } = await supabase
        .from('salmoneras')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting salmonera:', error);
        throw error;
      }

      console.log('Salmonera deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Salmonera eliminada",
        description: "La salmonera ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting salmonera:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la salmonera. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    salmoneras,
    isLoading,
    error,
    createSalmonera: createSalmoneraeMutation.mutateAsync,
    updateSalmonera: updateSalmoneraeMutation.mutateAsync,
    deleteSalmonera: deleteSalmoneraeMutation.mutateAsync,
    isCreating: createSalmoneraeMutation.isPending,
    isUpdating: updateSalmoneraeMutation.isPending,
    isDeleting: deleteSalmoneraeMutation.isPending,
  };
};
