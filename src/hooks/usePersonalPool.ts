
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PersonalPool {
  id: string;
  usuario_id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'supervisor' | 'buzo';
  empresa_asociada?: string;
  tipo_empresa?: 'salmonera' | 'contratista';
  matricula?: string;
  especialidades?: string[];
  certificaciones?: string[];
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalFormData {
  nombre: string;
  apellido: string;
  email: string;
  rol: 'supervisor' | 'buzo';
  empresa_id?: string;
  tipo_empresa?: 'salmonera' | 'contratista';
  matricula?: string;
  especialidades?: string[];
  certificaciones?: string[];
}

export const usePersonalPool = () => {
  const queryClient = useQueryClient();

  const { data: personal = [], isLoading } = useQuery({
    queryKey: ['personal-pool'],
    queryFn: async () => {
      console.log('Fetching personal pool...');
      const { data, error } = await supabase
        .from('usuario')
        .select(`
          *
        `)
        .in('rol', ['supervisor', 'buzo'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching personal pool:', error);
        throw error;
      }

      return (data || []).map(user => {
        const perfilBuzo = typeof user.perfil_buzo === 'object' && user.perfil_buzo !== null 
          ? user.perfil_buzo as any 
          : {};

        return {
          id: user.usuario_id,
          usuario_id: user.usuario_id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email || '',
          rol: user.rol as 'supervisor' | 'buzo',
          empresa_asociada: 'Por definir', // Will be populated when we fetch related data
          tipo_empresa: user.salmonera_id ? 'salmonera' as const : 'contratista' as const,
          matricula: perfilBuzo.matricula || '',
          especialidades: Array.isArray(perfilBuzo.especialidades) ? perfilBuzo.especialidades : [],
          certificaciones: Array.isArray(perfilBuzo.certificaciones) ? perfilBuzo.certificaciones : [],
          disponible: perfilBuzo.disponible !== false,
          created_at: user.created_at,
          updated_at: user.updated_at
        };
      }) as PersonalPool[];
    },
  });

  const createPersonalMutation = useMutation({
    mutationFn: async (data: PersonalFormData) => {
      console.log('Creating personal:', data);
      
      const userId = crypto.randomUUID();
      const { data: result, error } = await supabase
        .from('usuario')
        .insert([{
          usuario_id: userId,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol,
          salmonera_id: data.tipo_empresa === 'salmonera' ? data.empresa_id : null,
          servicio_id: data.tipo_empresa === 'contratista' ? data.empresa_id : null,
          perfil_buzo: {
            matricula: data.matricula,
            especialidades: data.especialidades || [],
            certificaciones: data.certificaciones || [],
            disponible: true
          },
          perfil_completado: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating personal:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-pool'] });
      toast({
        title: "Personal agregado",
        description: "El miembro del personal ha sido agregado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating personal:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el personal.",
        variant: "destructive",
      });
    },
  });

  const updatePersonalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PersonalFormData> }) => {
      console.log('Updating personal:', id, data);
      
      const { data: result, error } = await supabase
        .from('usuario')
        .update({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol,
          salmonera_id: data.tipo_empresa === 'salmonera' ? data.empresa_id : null,
          servicio_id: data.tipo_empresa === 'contratista' ? data.empresa_id : null,
          perfil_buzo: {
            matricula: data.matricula,
            especialidades: data.especialidades || [],
            certificaciones: data.certificaciones || [],
            disponible: true
          }
        })
        .eq('usuario_id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-pool'] });
      toast({
        title: "Personal actualizado",
        description: "Los datos del personal han sido actualizados exitosamente.",
      });
    },
  });

  const deletePersonalMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting personal:', id);
      
      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('usuario_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-pool'] });
      toast({
        title: "Personal eliminado",
        description: "El miembro del personal ha sido eliminado exitosamente.",
      });
    },
  });

  return {
    personal,
    isLoading,
    createPersonal: createPersonalMutation.mutateAsync,
    updatePersonal: updatePersonalMutation.mutateAsync,
    deletePersonal: deletePersonalMutation.mutateAsync,
    isCreating: createPersonalMutation.isPending,
    isUpdating: updatePersonalMutation.isPending,
    isDeleting: deletePersonalMutation.isPending,
  };
};
