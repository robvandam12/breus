
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
  telefono?: string;
  email?: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  especialidades?: string[];
  certificaciones?: string[];
}

export const useContratistas = () => {
  const queryClient = useQueryClient();

  const { data: contratistas = [], isLoading, error } = useQuery({
    queryKey: ['contratistas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratistas')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      return data as Contratista[];
    },
  });

  const createContratista = useMutation({
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

  const updateContratista = useMutation({
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

  const deleteContratista = useMutation({
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
    error,
    createContratista: createContratista.mutateAsync,
    updateContratista: updateContratista.mutateAsync,
    deleteContratista: deleteContratista.mutateAsync,
  };
};
