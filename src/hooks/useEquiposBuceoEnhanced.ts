
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EquipoBuceoMember {
  id: string;
  equipo_id: string;
  usuario_id?: string;
  rol_equipo: string;
  disponible: boolean;
  created_at: string;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
  // Computed properties for compatibility
  nombre_completo: string;
  email?: string;
  rol: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  matricula?: string;
  telefono?: string;
  invitado: boolean;
  estado_invitacion: 'pendiente' | 'aceptada' | 'rechazada';
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
  miembros?: EquipoBuceoMember[];
  salmonera?: {
    nombre: string;
  };
}

export const useEquiposBuceoEnhanced = () => {
  const queryClient = useQueryClient();

  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ['equipos-buceo-enhanced'],
    queryFn: async () => {
      console.log('Fetching equipos de buceo...');
      
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select(`
          *,
          salmonera:salmoneras!equipos_buceo_empresa_id_fkey(nombre),
          miembros:equipo_buceo_miembros(
            *,
            usuario:usuario(nombre, apellido, email, rol)
          )
        `)
        .eq('tipo_empresa', 'salmonera')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching equipos:', error);
        throw error;
      }
      
      console.log('Raw equipos data:', data);
      
      // Transform the data to match our interface
      const transformedData = (data || []).map((equipo: any) => ({
        ...equipo,
        miembros: (equipo.miembros || []).map((miembro: any) => ({
          ...miembro,
          nombre_completo: miembro.usuario ? 
            `${miembro.usuario.nombre} ${miembro.usuario.apellido}` : 
            'Usuario sin nombre',
          email: miembro.usuario?.email,
          rol: miembro.rol_equipo as 'supervisor' | 'buzo_principal' | 'buzo_asistente',
          matricula: '',
          telefono: '',
          invitado: false,
          estado_invitacion: 'aceptada' as const
        }))
      })) as EquipoBuceo[];

      console.log('Transformed equipos data:', transformedData);
      return transformedData;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  const createEquipo = useMutation({
    mutationFn: async (equipoData: {
      nombre: string;
      descripcion?: string;
      empresa_id: string;
    }) => {
      console.log('Creating equipo with data:', equipoData);
      
      const { data, error } = await supabase
        .from('equipos_buceo')
        .insert({
          nombre: equipoData.nombre,
          descripcion: equipoData.descripcion,
          empresa_id: equipoData.empresa_id,
          tipo_empresa: 'salmonera'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating equipo:', error);
        throw error;
      }
      
      console.log('Created equipo:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
      toast({
        title: 'Equipo creado',
        description: 'El equipo de buceo ha sido creado exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error in createEquipo mutation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el equipo de buceo.',
        variant: 'destructive',
      });
    },
  });

  const addMiembro = useMutation({
    mutationFn: async ({ 
      equipo_id, 
      usuario_id, 
      rol_equipo,
      nombre_completo,
      email,
      matricula,
      telefono,
      invitado = false
    }: {
      equipo_id: string;
      usuario_id?: string;
      rol_equipo: string;
      nombre_completo: string;
      email?: string;
      matricula?: string;
      telefono?: string;
      invitado?: boolean;
    }) => {
      console.log('Adding member to equipo:', { equipo_id, usuario_id, rol_equipo });
      
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert({ 
          equipo_id, 
          usuario_id, 
          rol_equipo,
          disponible: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding member:', error);
        throw error;
      }
      
      console.log('Added member:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
      toast({
        title: 'Miembro agregado',
        description: 'El miembro ha sido agregado al equipo exitosamente.',
      });
    },
    onError: (error) => {
      console.error('Error in addMiembro mutation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar el miembro al equipo.',
        variant: 'destructive',
      });
    },
  });

  const inviteMember = useMutation({
    mutationFn: async ({
      equipo_id,
      email,
      nombre_completo,
      rol_equipo
    }: {
      equipo_id: string;
      email: string;
      nombre_completo: string;
      rol_equipo: string;
    }) => {
      console.log('Inviting member:', { equipo_id, email, nombre_completo, rol_equipo });
      
      // For now, just add as a regular member
      // In the future, this could create user invitations
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert({
          equipo_id,
          rol_equipo,
          disponible: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error inviting member:', error);
        throw error;
      }
      
      console.log('Invited member:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
      toast({
        title: 'Invitación enviada',
        description: 'Se ha enviado una invitación al miembro.',
      });
    },
    onError: (error) => {
      console.error('Error in inviteMember mutation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la invitación.',
        variant: 'destructive',
      });
    },
  });

  return {
    equipos,
    isLoading,
    createEquipo: createEquipo.mutate,
    addMiembro: addMiembro.mutate,
    inviteMember: inviteMember.mutate,
    isCreating: createEquipo.isPending,
  };
};
