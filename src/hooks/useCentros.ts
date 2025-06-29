
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
  };
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

  const { data: centros = [], isLoading } = useQuery({
    queryKey: ['centros'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('centros')
        .select(`
          *,
          salmoneras!centros_salmonera_id_fkey(nombre)
        `)
        .order('nombre');

      if (error) throw error;
      return data as Centro[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: CentroFormData) => {
      // Auto-determinar región si no se proporciona
      const dataWithRegion = {
        ...formData,
        region: formData.region || determinarRegion(formData.ubicacion)
      };

      const { data, error } = await supabase
        .from('centros')
        .insert([dataWithRegion])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centros'] });
      toast({
        title: "Centro creado",
        description: "El centro ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating centro:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el centro.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CentroFormData }) => {
      // Auto-determinar región si no se proporciona
      const dataWithRegion = {
        ...data,
        region: data.region || determinarRegion(data.ubicacion)
      };

      const { error } = await supabase
        .from('centros')
        .update(dataWithRegion)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centros'] });
      toast({
        title: "Centro actualizado",
        description: "El centro ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating centro:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el centro.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('centros')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centros'] });
      toast({
        title: "Centro eliminado",
        description: "El centro ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting centro:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el centro.",
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
  };
};
