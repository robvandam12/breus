
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Centro {
  id: string;
  nombre: string;
  codigo: string;
  ubicacion: string;
  region: string;
  salmonera_id: string;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  profundidad_maxima?: number;
  capacidad_jaulas?: number;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  salmoneras?: {
    nombre: string;
  } | null;
}

export interface CentroFormData {
  nombre: string;
  codigo: string;
  salmonera_id: string;
  ubicacion: string;
  region: string;
  profundidad_maxima?: number;
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  capacidad_jaulas?: number;
  observaciones?: string;
}

// Función para determinar la región basada en la ubicación
const determinarRegion = (ubicacion: string): string => {
  const ubicacionLower = ubicacion.toLowerCase();
  
  if (ubicacionLower.includes('valparaíso') || ubicacionLower.includes('valparaiso')) return 'Valparaíso';
  if (ubicacionLower.includes('los lagos') || ubicacionLower.includes('puerto montt') || ubicacionLower.includes('osorno')) return 'Los Lagos';
  if (ubicacionLower.includes('aysén') || ubicacionLower.includes('aysen') || ubicacionLower.includes('coyhaique')) return 'Aysén';
  if (ubicacionLower.includes('magallanes') || ubicacionLower.includes('punta arenas')) return 'Magallanes';
  if (ubicacionLower.includes('antofagasta')) return 'Antofagasta';
  if (ubicacionLower.includes('atacama')) return 'Atacama';
  if (ubicacionLower.includes('coquimbo')) return 'Coquimbo';
  if (ubicacionLower.includes('metropolitana') || ubicacionLower.includes('santiago')) return 'Metropolitana';
  if (ubicacionLower.includes('ohiggins') || ubicacionLower.includes('rancagua')) return 'O´Higgins';
  if (ubicacionLower.includes('maule') || ubicacionLower.includes('talca')) return 'Maule';
  if (ubicacionLower.includes('ñuble') || ubicacionLower.includes('chillán')) return 'Ñuble';
  if (ubicacionLower.includes('biobío') || ubicacionLower.includes('biobio') || ubicacionLower.includes('concepción')) return 'Biobío';
  if (ubicacionLower.includes('araucanía') || ubicacionLower.includes('araucania') || ubicacionLower.includes('temuco')) return 'Araucanía';
  if (ubicacionLower.includes('los ríos') || ubicacionLower.includes('los rios') || ubicacionLower.includes('valdivia')) return 'Los Ríos';
  
  return 'Los Lagos'; // Por defecto para centros de acuicultura
};

export const useCentros = () => {
  const queryClient = useQueryClient();

  const { data: centros = [], isLoading, refetch } = useQuery({
    queryKey: ['centros'],
    queryFn: async () => {
      console.log('Fetching centros with native Supabase join...');
      
      // Usar join nativo de Supabase en lugar de join manual
      const { data, error } = await supabase
        .from('centros')
        .select(`
          *,
          salmoneras:salmonera_id (
            nombre
          )
        `)
        .order('nombre');

      if (error) {
        console.error('Error fetching centros:', error);
        throw new Error(`Error al obtener centros: ${error.message}`);
      }

      console.log('Centros fetched successfully:', data?.length || 0);
      return (data || []) as Centro[];
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: async (formData: CentroFormData) => {
      console.log('Creating centro with data:', formData);
      
      // Auto-determinar región si no se proporciona
      const dataWithRegion = {
        ...formData,
        region: formData.region || determinarRegion(formData.ubicacion)
      };

      const { data, error } = await supabase
        .from('centros')
        .insert([dataWithRegion])
        .select(`
          *,
          salmoneras:salmonera_id (
            nombre
          )
        `)
        .single();

      if (error) {
        console.error('Error creating centro:', error);
        throw new Error(`Error al crear centro: ${error.message}`);
      }

      console.log('Centro created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      // Optimistic update - actualizar cache inmediatamente
      queryClient.setQueryData(['centros'], (oldData: Centro[] | undefined) => {
        if (!oldData) return [data];
        return [...oldData, data];
      });
      
      // También invalidar para refetch desde servidor
      queryClient.invalidateQueries({ queryKey: ['centros'] });
      
      toast({
        title: "Centro creado",
        description: "El centro ha sido creado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating centro:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el centro.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CentroFormData }) => {
      console.log('Updating centro:', id, 'with data:', data);
      
      // Auto-determinar región si no se proporciona
      const dataWithRegion = {
        ...data,
        region: data.region || determinarRegion(data.ubicacion)
      };

      const { data: updatedData, error } = await supabase
        .from('centros')
        .update(dataWithRegion)
        .eq('id', id)
        .select(`
          *,
          salmoneras:salmonera_id (
            nombre
          )
        `)
        .single();

      if (error) {
        console.error('Error updating centro:', error);
        throw new Error(`Error al actualizar centro: ${error.message}`);
      }

      return updatedData;
    },
    onSuccess: (updatedData) => {
      // Optimistic update - actualizar cache inmediatamente
      queryClient.setQueryData(['centros'], (oldData: Centro[] | undefined) => {
        if (!oldData) return [updatedData];
        return oldData.map(centro => 
          centro.id === updatedData.id ? updatedData : centro
        );
      });
      
      // También invalidar para refetch desde servidor
      queryClient.invalidateQueries({ queryKey: ['centros'] });
      
      toast({
        title: "Centro actualizado",
        description: "El centro ha sido actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating centro:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el centro.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting centro:', id);
      
      const { error } = await supabase
        .from('centros')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting centro:', error);
        throw new Error(`Error al eliminar centro: ${error.message}`);
      }

      return id;
    },
    onSuccess: (deletedId) => {
      // Optimistic update - eliminar del cache inmediatamente
      queryClient.setQueryData(['centros'], (oldData: Centro[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(centro => centro.id !== deletedId);
      });
      
      // También invalidar para refetch desde servidor
      queryClient.invalidateQueries({ queryKey: ['centros'] });
      
      toast({
        title: "Centro eliminado",
        description: "El centro ha sido eliminado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting centro:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el centro.",
        variant: "destructive",
      });
    },
  });

  return {
    centros,
    isLoading,
    createCentro: createMutation.mutateAsync,
    updateCentro: updateMutation.mutateAsync,
    deleteCentro: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch,
  };
};
