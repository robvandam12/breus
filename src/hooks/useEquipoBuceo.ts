
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EquipoBuceoMiembro {
  id: string;
  nombre_completo: string;
  rol_equipo: string;
  disponible: boolean;
  email?: string;
  matricula?: string;
  telefono?: string;
}

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: EquipoBuceoMiembro[];
}

export interface EquipoBuceoFormData {
  nombre: string;
  descripcion: string;
}

export const useEquipoBuceo = () => {
  const queryClient = useQueryClient();

  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ['equipos-buceo'],
    queryFn: async () => {
      console.log('Fetching equipos de buceo...');
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select(`
          *,
          equipo_buceo_miembros (
            id,
            usuario_id,
            disponible,
            rol_equipo,
            usuario:usuario_id (
              nombre,
              apellido,
              email
            )
          )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching equipos:', error);
        throw error;
      }

      return (data || []).map(equipo => ({
        ...equipo,
        miembros: equipo.equipo_buceo_miembros?.map(miembro => ({
          id: miembro.id,
          nombre_completo: `${miembro.usuario?.nombre || ''} ${miembro.usuario?.apellido || ''}`.trim(),
          rol_equipo: miembro.rol_equipo,
          disponible: miembro.disponible,
          email: miembro.usuario?.email,
          matricula: '',
          telefono: '',
        })) || []
      })) as EquipoBuceo[];
    },
  });

  const createEquipo = useMutation({
    mutationFn: async (data: EquipoBuceoFormData) => {
      console.log('Creating equipo de buceo:', data);
      
      // Get current user to determine empresa_id and tipo_empresa
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuario no autenticado');

      const { data: userProfile } = await supabase
        .from('usuario')
        .select('salmonera_id, servicio_id')
        .eq('usuario_id', user.user.id)
        .single();

      if (!userProfile) throw new Error('Perfil de usuario no encontrado');

      const equipoData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        empresa_id: userProfile.salmonera_id || userProfile.servicio_id,
        tipo_empresa: userProfile.salmonera_id ? 'salmonera' : 'servicio',
        activo: true
      };

      const { data: result, error } = await supabase
        .from('equipos_buceo')
        .insert([equipoData])
        .select()
        .single();

      if (error) {
        console.error('Error creating equipo:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo creado",
        description: "El equipo de buceo ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo de buceo.",
        variant: "destructive",
      });
    },
  });

  const updateEquipo = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EquipoBuceoFormData> }) => {
      console.log('Updating equipo:', id, data);
      
      const { data: result, error } = await supabase
        .from('equipos_buceo')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo actualizado",
        description: "El equipo ha sido actualizado exitosamente.",
      });
    },
  });

  const deleteEquipo = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting equipo:', id);
      
      const { error } = await supabase
        .from('equipos_buceo')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo eliminado",
        description: "El equipo ha sido eliminado exitosamente.",
      });
    },
  });

  return {
    equipos,
    isLoading,
    createEquipo: createEquipo.mutateAsync,
    updateEquipo: updateEquipo.mutateAsync,
    deleteEquipo: deleteEquipo.mutateAsync,
    isCreating: createEquipo.isPending,
    isUpdating: updateEquipo.isPending,
    isDeleting: deleteEquipo.isPending,
  };
};
