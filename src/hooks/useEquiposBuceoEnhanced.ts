import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EquipoBuceoMiembro {
  id: string;
  nombre_completo: string;
  rol: string;
  disponible: boolean;
  matricula?: string;
  email?: string;
  telefono?: string;
  invitado?: boolean;
  estado_invitacion?: 'pendiente' | 'aceptada' | 'rechazada';
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
  empresa_id: string;
}

export interface AddMiembroData {
  equipo_id: string;
  usuario_id: string;
  rol_equipo: string;
  nombre_completo: string;
  email?: string;
  invitado: boolean;
}

export interface InviteMemberData {
  equipo_id: string;
  email: string;
  nombre_completo: string;
  rol_equipo: string;
}

export const useEquiposBuceoEnhanced = () => {
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
          rol: miembro.rol_equipo,
          disponible: miembro.disponible,
          email: miembro.usuario?.email,
          matricula: '',
          telefono: '',
          invitado: false,
          estado_invitacion: 'aceptada' as const
        })) || []
      })) as EquipoBuceo[];
    },
  });

  const createEquipoMutation = useMutation({
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
        empresa_id: userProfile.salmonera_id || userProfile.servicio_id || data.empresa_id,
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

  const addMiembroMutation = useMutation({
    mutationFn: async (data: AddMiembroData) => {
      console.log('Adding miembro to equipo:', data);
      
      const { data: result, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert([{
          equipo_id: data.equipo_id,
          usuario_id: data.usuario_id,
          rol_equipo: data.rol_equipo,
          disponible: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding miembro:', error);
        throw error;
      }

      // Registrar evento de dominio para trazabilidad
      await supabase.rpc('emit_domain_event', {
        p_event_type: 'MEMBER_ADDED',
        p_aggregate_id: data.equipo_id,
        p_aggregate_type: 'equipo_buceo',
        p_event_data: {
          usuario_id: data.usuario_id,
          rol_equipo: data.rol_equipo,
          nombre_completo: data.nombre_completo,
          timestamp: new Date().toISOString()
        }
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado al equipo exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error adding miembro:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro al equipo.",
        variant: "destructive",
      });
    },
  });

  const removeMiembroMutation = useMutation({
    mutationFn: async ({ miembro_id, equipo_id }: { miembro_id: string; equipo_id: string }) => {
      console.log('Removing miembro from equipo:', miembro_id);
      
      // Obtener información del miembro antes de eliminarlo
      const { data: miembro } = await supabase
        .from('equipo_buceo_miembros')
        .select(`
          *,
          usuario:usuario_id (nombre, apellido, email)
        `)
        .eq('id', miembro_id)
        .single();

      const { error } = await supabase
        .from('equipo_buceo_miembros')
        .delete()
        .eq('id', miembro_id);

      if (error) {
        console.error('Error removing miembro:', error);
        throw error;
      }

      // Registrar evento de dominio para trazabilidad
      if (miembro) {
        await supabase.rpc('emit_domain_event', {
          p_event_type: 'MEMBER_REMOVED',
          p_aggregate_id: equipo_id,
          p_aggregate_type: 'equipo_buceo',
          p_event_data: {
            usuario_id: miembro.usuario_id,
            rol_equipo: miembro.rol_equipo,
            nombre_completo: `${miembro.usuario?.nombre || ''} ${miembro.usuario?.apellido || ''}`.trim(),
            timestamp: new Date().toISOString()
          }
        });
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido del equipo exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error removing miembro:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro del equipo.",
        variant: "destructive",
      });
    },
  });

  const updateMiembroRoleMutation = useMutation({
    mutationFn: async ({ miembro_id, nuevo_rol, equipo_id }: { miembro_id: string; nuevo_rol: string; equipo_id: string }) => {
      console.log('Updating miembro role:', miembro_id, nuevo_rol);
      
      // Obtener información actual del miembro
      const { data: miembroActual } = await supabase
        .from('equipo_buceo_miembros')
        .select(`
          *,
          usuario:usuario_id (nombre, apellido, email)
        `)
        .eq('id', miembro_id)
        .single();

      const { data: result, error } = await supabase
        .from('equipo_buceo_miembros')
        .update({ rol_equipo: nuevo_rol })
        .eq('id', miembro_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating miembro role:', error);
        throw error;
      }

      // Registrar evento de dominio para trazabilidad
      if (miembroActual) {
        await supabase.rpc('emit_domain_event', {
          p_event_type: 'MEMBER_ROLE_CHANGED',
          p_aggregate_id: equipo_id,
          p_aggregate_type: 'equipo_buceo',
          p_event_data: {
            usuario_id: miembroActual.usuario_id,
            rol_anterior: miembroActual.rol_equipo,
            rol_nuevo: nuevo_rol,
            nombre_completo: `${miembroActual.usuario?.nombre || ''} ${miembroActual.usuario?.apellido || ''}`.trim(),
            timestamp: new Date().toISOString()
          }
        });
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Rol actualizado",
        description: "El rol del miembro ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating miembro role:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del miembro.",
        variant: "destructive",
      });
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (data: InviteMemberData) => {
      console.log('Inviting member to equipo:', data);
      
      // Create invitation logic here
      // For now, we'll just simulate success
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Invitación enviada",
        description: "La invitación ha sido enviada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error inviting member:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación.",
        variant: "destructive",
      });
    },
  });

  const updateEquipoMutation = useMutation({
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

  const deleteEquipoMutation = useMutation({
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

  const addMemberToEquipo = async (equipoId: string, memberData: any) => {
    console.log('Adding member to equipo:', equipoId, memberData);
    
    const { data: result, error } = await supabase
      .from('equipo_buceo_miembros')
      .insert([{
        equipo_id: equipoId,
        usuario_id: memberData.usuario_id,
        rol_equipo: memberData.rol,
        disponible: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding member:', error);
      throw error;
    }

    // Registrar evento de dominio para trazabilidad
    await supabase.rpc('emit_domain_event', {
      p_event_type: 'MEMBER_ADDED',
      p_aggregate_id: equipoId,
      p_aggregate_type: 'equipo_buceo',
      p_event_data: {
        usuario_id: memberData.usuario_id,
        rol_equipo: memberData.rol,
        nombre_completo: memberData.nombre_completo,
        timestamp: new Date().toISOString()
      }
    });

    queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
    
    toast({
      title: "Miembro agregado",
      description: "El miembro ha sido agregado al equipo exitosamente.",
    });

    return result;
  };

  const removeMemberFromEquipo = async (equipoId: string, memberId: string) => {
    console.log('Removing member from equipo:', equipoId, memberId);
    
    // Obtener información del miembro antes de eliminarlo
    const { data: miembro } = await supabase
      .from('equipo_buceo_miembros')
      .select(`
        *,
        usuario:usuario_id (nombre, apellido, email)
      `)
      .eq('id', memberId)
      .single();

    const { error } = await supabase
      .from('equipo_buceo_miembros')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('Error removing member:', error);
      throw error;
    }

    // Registrar evento de dominio para trazabilidad
    if (miembro) {
      await supabase.rpc('emit_domain_event', {
        p_event_type: 'MEMBER_REMOVED',
        p_aggregate_id: equipoId,
        p_aggregate_type: 'equipo_buceo',
        p_event_data: {
          usuario_id: miembro.usuario_id,
          rol_equipo: miembro.rol_equipo,
          nombre_completo: `${miembro.usuario?.nombre || ''} ${miembro.usuario?.apellido || ''}`.trim(),
          timestamp: new Date().toISOString()
        }
      });
    }

    queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
    
    toast({
      title: "Miembro removido",
      description: "El miembro ha sido removido del equipo exitosamente.",
    });

    return true;
  };

  return {
    equipos,
    isLoading,
    createEquipo: createEquipoMutation.mutateAsync,
    addMiembro: addMiembroMutation.mutateAsync,
    removeMiembro: removeMiembroMutation.mutateAsync,
    updateMiembroRole: updateMiembroRoleMutation.mutateAsync,
    inviteMember: inviteMemberMutation.mutateAsync,
    updateEquipo: updateEquipoMutation.mutateAsync,
    deleteEquipo: deleteEquipoMutation.mutateAsync,
    addMemberToEquipo,
    removeMemberFromEquipo,
    isCreating: createEquipoMutation.isPending,
    isUpdating: updateEquipoMutation.isPending,
    isDeleting: deleteEquipoMutation.isPending,
  };
};
