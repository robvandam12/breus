
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Sitio {
  id: string;
  nombre: string;
  codigo: string;
  salmonera_id: string;
  ubicacion: string;
  profundidad_maxima?: number;
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  capacidad_jaulas?: number;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  salmoneras?: {
    nombre: string;
  };
}

export interface SitioFormData {
  nombre: string;
  codigo: string;
  salmonera_id: string;
  ubicacion: string;
  profundidad_maxima?: number;
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  capacidad_jaulas?: number;
  observaciones?: string;
}

export const useSitios = () => {
  const queryClient = useQueryClient();

  const { data: sitios = [], isLoading, error } = useQuery({
    queryKey: ['sitios'],
    queryFn: async () => {
      console.log('Fetching sitios...');
      const { data, error } = await supabase
        .from('sitios')
        .select(`
          *,
          salmoneras:salmonera_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sitios:', error);
        throw error;
      }

      console.log('Sitios fetched:', data);
      return data as Sitio[];
    },
  });

  const createSitioMutation = useMutation({
    mutationFn: async (sitioData: SitioFormData) => {
      console.log('Creating sitio:', sitioData);
      const { data, error } = await supabase
        .from('sitios')
        .insert([sitioData])
        .select()
        .single();

      if (error) {
        console.error('Error creating sitio:', error);
        throw error;
      }

      console.log('Sitio created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitios'] });
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Sitio creado",
        description: "El sitio ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el sitio. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateSitioMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SitioFormData> }) => {
      console.log('Updating sitio:', id, data);
      const { data: updatedData, error } = await supabase
        .from('sitios')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating sitio:', error);
        throw error;
      }

      console.log('Sitio updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitios'] });
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Sitio actualizado",
        description: "El sitio ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el sitio. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteSitioMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting sitio:', id);
      const { error } = await supabase
        .from('sitios')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting sitio:', error);
        throw error;
      }

      console.log('Sitio deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitios'] });
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Sitio eliminado",
        description: "El sitio ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el sitio. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    sitios,
    isLoading,
    error,
    createSitio: createSitioMutation.mutateAsync,
    updateSitio: updateSitioMutation.mutateAsync,
    deleteSitio: deleteSitioMutation.mutateAsync,
    isCreating: createSitioMutation.isPending,
    isUpdating: updateSitioMutation.isPending,
    isDeleting: deleteSitioMutation.isPending,
  };
};
