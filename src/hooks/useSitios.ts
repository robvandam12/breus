
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

  const { data: sitios = [], isLoading } = useQuery({
    queryKey: ['sitios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sitios')
        .select(`
          *,
          salmoneras (
            nombre
          )
        `)
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      return data as Sitio[];
    },
  });

  const createSitio = useMutation({
    mutationFn: async (data: SitioFormData) => {
      const { data: result, error } = await supabase
        .from('sitios')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitios'] });
      toast({
        title: "Sitio creado",
        description: "El sitio ha sido creado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating sitio:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el sitio.",
        variant: "destructive",
      });
    },
  });

  const updateSitio = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SitioFormData> }) => {
      const { data: result, error } = await supabase
        .from('sitios')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitios'] });
      toast({
        title: "Sitio actualizado",
        description: "El sitio ha sido actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating sitio:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el sitio.",
        variant: "destructive",
      });
    },
  });

  const deleteSitio = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sitios')
        .update({ estado: 'inactivo' })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sitios'] });
      toast({
        title: "Sitio eliminado",
        description: "El sitio ha sido eliminado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting sitio:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el sitio.",
        variant: "destructive",
      });
    },
  });

  return {
    sitios,
    isLoading,
    createSitio: createSitio.mutate,
    updateSitio: updateSitio.mutate,
    deleteSitio: deleteSitio.mutate,
    isCreating: createSitio.isPending,
    isUpdating: updateSitio.isPending,
    isDeleting: deleteSitio.isPending,
  };
};
