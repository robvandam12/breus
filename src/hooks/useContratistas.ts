
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

  const { data: contratistas = [], isLoading } = useQuery({
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
    mutationFn: async (data: ContratistaFormData) => {
      const { data: result, error } = await supabase
        .from('contratistas')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
      toast({
        title: "Contratista creado",
        description: "El contratista ha sido creado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating contratista:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el contratista.",
        variant: "destructive",
      });
    },
  });

  const updateContratista = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContratistaFormData> }) => {
      const { data: result, error } = await supabase
        .from('contratistas')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contratistas'] });
      toast({
        title: "Contratista actualizado",
        description: "El contratista ha sido actualizado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating contratista:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el contratista.",
        variant: "destructive",
      });
    },
  });

  const deleteContratista = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contratistas')
        .update({ estado: 'inactivo' })
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
    onError: (error: any) => {
      console.error('Error deleting contratista:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el contratista.",
        variant: "destructive",
      });
    },
  });

  return {
    contratistas,
    isLoading,
    createContratista: createContratista.mutate,
    updateContratista: updateContratista.mutate,
    deleteContratista: deleteContratista.mutate,
    isCreating: createContratista.isPending,
    isUpdating: updateContratista.isPending,
    isDeleting: deleteContratista.isPending,
  };
};
