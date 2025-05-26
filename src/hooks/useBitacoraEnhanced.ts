
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useUsersByCompany } from '@/hooks/useUsersByCompany';

export interface BitacoraUser {
  id: string;
  nombre: string;
  apellido: string;
  rol: 'supervisor' | 'buzo';
  empresa_nombre?: string;
}

export interface BitacoraSupervisorFormData {
  inmersion_id: string;
  fecha: string;
  supervisor_id: string;
  desarrollo_inmersion: string;
  incidentes?: string;
  evaluacion_general: string;
}

export interface BitacoraBuzoFormData {
  inmersion_id: string;
  fecha: string;
  buzo_id: string;
  profundidad_maxima: number;
  trabajos_realizados: string;
  estado_fisico_post: string;
  observaciones_tecnicas?: string;
}

export const useBitacoraEnhanced = () => {
  const queryClient = useQueryClient();
  const { usuarios } = useUsersByCompany();

  // Filter users for bitácoras
  const supervisores = usuarios.filter(u => u.rol === 'supervisor');
  const buzos = usuarios.filter(u => u.rol === 'buzo');

  const bitacoraUsers: BitacoraUser[] = usuarios.map(user => ({
    id: user.usuario_id,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol as 'supervisor' | 'buzo',
    empresa_nombre: user.empresa_nombre
  }));

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      // Get supervisor name from users
      const supervisor = supervisores.find(u => u.usuario_id === data.supervisor_id);
      const supervisorName = supervisor ? `${supervisor.nombre} ${supervisor.apellido}` : '';
      
      const codigo = `SUP-${Date.now()}`;
      
      const { data: result, error } = await supabase
        .from('bitacora_supervisor')
        .insert({
          codigo,
          inmersion_id: data.inmersion_id,
          fecha: data.fecha,
          supervisor: supervisorName,
          desarrollo_inmersion: data.desarrollo_inmersion,
          incidentes: data.incidentes,
          evaluacion_general: data.evaluacion_general,
          firmado: false
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-supervisor'] });
      toast({
        title: 'Bitácora creada',
        description: 'La bitácora de supervisor ha sido creada exitosamente.',
      });
    },
  });

  const createBitacoraBuzo = useMutation({
    mutationFn: async (data: BitacoraBuzoFormData) => {
      // Get buzo name from users
      const buzo = buzos.find(u => u.usuario_id === data.buzo_id);
      const buzoName = buzo ? `${buzo.nombre} ${buzo.apellido}` : '';
      
      const codigo = `BUZ-${Date.now()}`;
      
      const { data: result, error } = await supabase
        .from('bitacora_buzo')
        .insert({
          codigo,
          inmersion_id: data.inmersion_id,
          fecha: data.fecha,
          buzo: buzoName,
          profundidad_maxima: data.profundidad_maxima,
          trabajos_realizados: data.trabajos_realizados,
          estado_fisico_post: data.estado_fisico_post,
          observaciones_tecnicas: data.observaciones_tecnicas,
          firmado: false
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bitacoras-buzo'] });
      toast({
        title: 'Bitácora creada',
        description: 'La bitácora de buzo ha sido creada exitosamente.',
      });
    },
  });

  const signBitacora = useMutation({
    mutationFn: async ({ id, type, signatureData }: {
      id: string;
      type: 'supervisor' | 'buzo';
      signatureData: string;
    }) => {
      const table = type === 'supervisor' ? 'bitacora_supervisor' : 'bitacora_buzo';
      const firmaField = type === 'supervisor' ? 'supervisor_firma' : 'buzo_firma';
      
      const { error } = await supabase
        .from(table)
        .update({
          [firmaField]: signatureData,
          firmado: true,
          updated_at: new Date().toISOString()
        })
        .eq('bitacora_id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: variables.type === 'supervisor' ? ['bitacoras-supervisor'] : ['bitacoras-buzo'] 
      });
      toast({
        title: 'Bitácora firmada',
        description: 'La bitácora ha sido firmada exitosamente.',
      });
    },
  });

  return {
    usuarios: bitacoraUsers,
    supervisores,
    buzos,
    loadingUsuarios: false,
    createBitacoraSupervisor: createBitacoraSupervisor.mutate,
    createBitacoraBuzo: createBitacoraBuzo.mutate,
    signBitacora: signBitacora.mutate,
    isCreating: createBitacoraSupervisor.isPending || createBitacoraBuzo.isPending,
    isSigning: signBitacora.isPending,
  };
};
