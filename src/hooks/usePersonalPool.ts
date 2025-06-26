
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PersonalPool {
  usuario_id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado_buzo: string;
  perfil_buzo?: any;
}

export interface PersonalFormData {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado_buzo?: string;
  empresa_id?: string;
  tipo_empresa?: 'salmonera' | 'contratista';
  matricula?: string;
  especialidades?: string[];
  certificaciones?: string[];
}

export const usePersonalPool = () => {
  const queryClient = useQueryClient();

  const { data: personalPool = [], isLoading } = useQuery<PersonalPool[]>({
    queryKey: ['personalPool'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select(`
          usuario_id,
          nombre,
          apellido,
          email,
          rol,
          estado_buzo,
          perfil_buzo
        `)
        .in('rol', ['buzo', 'supervisor', 'admin_servicio'])
        .eq('estado_buzo', 'activo');

      if (error) throw error;
      return data || [];
    },
  });

  const createPersonalMutation = useMutation({
    mutationFn: async (formData: PersonalFormData) => {
      // Create the user data for insertion
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        rol: formData.rol,
        estado_buzo: formData.estado_buzo || 'activo',
        usuario_id: crypto.randomUUID(), // Generate a UUID for the user
        perfil_buzo: {
          matricula: formData.matricula || '',
          especialidades: formData.especialidades || [],
          certificaciones: formData.certificaciones || []
        }
      };

      const { data, error } = await supabase
        .from('usuario')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalPool'] });
      toast({ title: "Personal creado", description: "El personal ha sido creado exitosamente." });
    },
    onError: (error) => {
      console.error('Error creating personal:', error);
      toast({ title: "Error", description: "No se pudo crear el personal.", variant: "destructive" });
    },
  });

  const updatePersonalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PersonalFormData> }) => {
      const { data: result, error } = await supabase
        .from('usuario')
        .update(data)
        .eq('usuario_id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalPool'] });
      toast({ title: "Personal actualizado", description: "El personal ha sido actualizado exitosamente." });
    },
    onError: (error) => {
      console.error('Error updating personal:', error);
      toast({ title: "Error", description: "No se pudo actualizar el personal.", variant: "destructive" });
    },
  });

  const deletePersonalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('usuario')
        .update({ estado_buzo: 'inactivo' })
        .eq('usuario_id', id);

      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalPool'] });
      toast({ title: "Personal desactivado", description: "El personal ha sido desactivado exitosamente." });
    },
    onError: (error) => {
      console.error('Error deactivating personal:', error);
      toast({ title: "Error", description: "No se pudo desactivar el personal.", variant: "destructive" });
    },
  });

  return {
    personalPool,
    isLoading,
    createPersonal: createPersonalMutation.mutateAsync,
    isCreating: createPersonalMutation.isPending,
    updatePersonal: updatePersonalMutation.mutateAsync,
    isUpdating: updatePersonalMutation.isPending,
    deletePersonal: deletePersonalMutation.mutateAsync,
    isDeleting: deletePersonalMutation.isPending,
  };
};
