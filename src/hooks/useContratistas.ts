
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
        description: "No se pudo crear el contratista.",
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
    deleteContratista: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
