
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Contratista {
  id: string;
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  especialidades?: string[];
  certificaciones?: string[];
  estado: 'activo' | 'inactivo' | 'suspendido';
  created_at: string;
  updated_at: string;
}

export interface ContratistaFormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  especialidades?: string[];
  certificaciones?: string[];
  estado: 'activo' | 'inactivo' | 'suspendido';
}

export const useContratistas = () => {
  const queryClient = useQueryClient();

  const { data: contratistas = [], isLoading, error } = useQuery({
    queryKey: ['contratistas'],
    queryFn: async () => {
      console.log('Fetching contratistas...');
      const { data, error } = await supabase
        .from('contratistas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contratistas:', error);
        throw error;
      }

      console.log('Contratistas fetched:', data);
      return data as Contratista[];
    },
  });

  const createContratistaMutation = useMutation({
    mutationFn: async (contratistaData: ContratistaFormData) => {
      console.log('Creating contratista:', contratistaData);
      const { data, error } = await supabase
        .from('contratistas')
        .insert([contratistaData])
        .select()
        .single();

      if (error) {
        console.error('Error creating contratista:', error);
        throw error;
      }

      console.log('Contratista created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
      toast({
        title: "Contratista creado",
        description: "El contratista ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el contratista. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateContratistaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContratistaFormData> }) => {
      console.log('Updating contratista:', id, data);
      const { data: updatedData, error } = await supabase
        .from('contratistas')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contratista:', error);
        throw error;
      }

      console.log('Contratista updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
      toast({
        title: "Contratista actualizado",
        description: "El contratista ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el contratista. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteContratistaMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contratista:', id);
      const { error } = await supabase
        .from('contratistas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contratista:', error);
        throw error;
      }

      console.log('Contratista deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
      toast({
        title: "Contratista eliminado",
        description: "El contratista ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el contratista. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    contratistas,
    isLoading,
    error,
    createContratista: createContratistaMutation.mutateAsync,
    updateContratista: updateContratistaMutation.mutateAsync,
    deleteContratista: deleteContratistaMutation.mutateAsync,
    isCreating: createContratistaMutation.isPending,
    isUpdating: updateContratistaMutation.isPending,
    isDeleting: deleteContratistaMutation.isPending,
  };
};
