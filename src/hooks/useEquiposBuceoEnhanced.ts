
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserCompany } from "@/hooks/useUserCompany";

export interface EquipoBuceoMiembro {
  id: string;
  equipo_id: string;
  usuario_id: string;
  rol_equipo: string;
  disponible: boolean;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  matricula?: string;
  nombre_completo?: string;
  rol?: string;
  invitado?: boolean;
  estado_invitacion?: 'pendiente' | 'aceptado' | 'rechazado';
}

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: EquipoBuceoMiembro[];
}

export const useEquiposBuceoEnhanced = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { companyInfo } = useUserCompany();

  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ['equipos-buceo-enhanced'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select(`
          *,
          miembros:equipo_buceo_miembros(
            *,
            usuario:usuario(nombre, apellido, email, rol, perfil_buzo)
          )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(equipo => ({
        ...equipo,
        miembros: equipo.miembros?.map(miembro => {
          const perfilBuzo = miembro.usuario?.perfil_buzo as any;
          return {
            ...miembro,
            nombre: miembro.usuario?.nombre || '',
            apellido: miembro.usuario?.apellido || '',
            email: miembro.usuario?.email || '',
            rol: miembro.usuario?.rol || '',
            telefono: perfilBuzo?.telefono || '',
            matricula: perfilBuzo?.matricula || '',
            nombre_completo: `${miembro.usuario?.nombre || ''} ${miembro.usuario?.apellido || ''}`.trim(),
            invitado: false,
            estado_invitacion: 'aceptado' as const
          };
        }) || []
      })) as EquipoBuceo[];
    },
  });

  const createEquipo = useMutation({
    mutationFn: async (equipoData: {
      nombre: string;
      descripcion?: string;
      empresa_id?: string;
    }) => {
      if (!profile?.salmonera_id && !profile?.servicio_id && !equipoData.empresa_id) {
        throw new Error('Usuario debe estar asignado a una empresa');
      }

      const empresa_id = equipoData.empresa_id || profile.salmonera_id || profile.servicio_id;
      const tipo_empresa = profile.salmonera_id ? 'salmonera' : 'contratista';

      const { data, error } = await supabase
        .from('equipos_buceo')
        .insert([{
          nombre: equipoData.nombre,
          descripcion: equipoData.descripcion,
          empresa_id,
          tipo_empresa,
          activo: true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
      toast({
        title: 'Equipo creado',
        description: 'El equipo de buceo ha sido creado exitosamente.',
      });
    },
    onError: (error: any) => {
      console.error('Error creating equipo:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear el equipo de buceo.',
        variant: 'destructive',
      });
    },
  });

  const addMiembro = useMutation({
    mutationFn: async ({ equipo_id, usuario_id, rol_equipo }: {
      equipo_id: string;
      usuario_id: string;
      rol_equipo: string;
    }) => {
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert({ equipo_id, usuario_id, rol_equipo, disponible: true })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
      toast({
        title: 'Miembro agregado',
        description: 'El miembro ha sido agregado al equipo exitosamente.',
      });
    },
  });

  const inviteMember = useMutation({
    mutationFn: async ({ equipo_id, email, nombre_completo, rol_equipo }: {
      equipo_id: string;
      email: string;
      nombre_completo: string;
      rol_equipo: string;
    }) => {
      // Por ahora solo simularemos la invitación
      // En el futuro aquí se podría implementar la lógica real de invitación
      toast({
        title: 'Invitación enviada',
        description: `Invitación enviada a ${email}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo-enhanced'] });
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
