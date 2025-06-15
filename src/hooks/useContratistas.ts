
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export interface Contratista {
  id: string;
  nombre: string;
  rut: string;
  direccion: string;
  email?: string;
  telefono?: string;
  estado: string;
  especialidades?: string[];
  certificaciones?: string[];
  created_at: string;
  updated_at: string;
}

export interface ContratistaFormData {
  nombre: string;
  rut: string;
  direccion: string;
  email?: string;
  telefono?: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  especialidades?: string[];
  certificaciones?: string[];
}

export const useContratistas = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const { data: contratistas = [], isLoading } = useQuery({
    queryKey: ['contratistas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratistas')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data as Contratista[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: ContratistaFormData) => {
      const { data, error } = await supabase
        .from('contratistas')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // Si el usuario es admin_salmonera, crear automáticamente la asociación
      if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
        const { error: associationError } = await supabase
          .from('salmonera_contratista')
          .insert({
            salmonera_id: profile.salmonera_id,
            contratista_id: data.id
          });

        if (associationError) {
          console.error('Error creating salmonera-contratista association:', associationError);
          // No lanzar error aquí, solo log para que no bloquee la creación del contratista
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
      queryClient.invalidateQueries({ queryKey: ['salmonera-contratista'] });
      toast({
        title: "Contratista creado",
        description: profile?.role === 'admin_salmonera' 
          ? "El contratista ha sido creado y asociado a su salmonera exitosamente."
          : "El contratista ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el contratista.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ContratistaFormData }) => {
      const { error } = await supabase
        .from('contratistas')
        .update(data)
        .eq('id', id);

      if (error) throw error;
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
        description: "No se pudo actualizar el contratista.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contratistas')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
        description: "No se pudo eliminar el contratista.",
        variant: "destructive",
      });
    },
  });

  return {
    contratistas,
    isLoading,
    createContratista: createMutation.mutateAsync,
    updateContratista: updateMutation.mutateAsync,
    deleteContratista: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
