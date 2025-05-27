
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface BitacoraUser {
  id: string;
  nombre: string;
  apellido: string;
  rol: 'supervisor' | 'buzo';
  empresa_nombre?: string;
}

export interface InmersionCompleta {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  objetivo: string;
  hora_inicio: string;
  hora_fin?: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  buzo_principal: string;
  buzo_principal_id?: string;
  supervisor: string;
  supervisor_id?: string;
  buzo_asistente?: string;
  operacion: {
    id: string;
    nombre: string;
    codigo: string;
    salmoneras?: { nombre: string };
    sitios?: { nombre: string };
    contratistas?: { nombre: string };
  };
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
  const { profile } = useAuth();

  // Fetch real inmersiones
  const { data: inmersiones = [], isLoading: loadingInmersiones } = useQuery({
    queryKey: ['inmersiones-completas'],
    queryFn: async () => {
      console.log('Fetching inmersiones completas...');
      
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion(
            *,
            salmoneras(nombre),
            sitios(nombre),
            contratistas(nombre)
          )
        `)
        .order('fecha_inmersion', { ascending: false });

      if (error) {
        console.error('Error fetching inmersiones:', error);
        throw error;
      }

      return (data || []).map(inmersion => ({
        inmersion_id: inmersion.inmersion_id,
        codigo: inmersion.codigo,
        fecha_inmersion: inmersion.fecha_inmersion,
        objetivo: inmersion.objetivo,
        hora_inicio: inmersion.hora_inicio,
        hora_fin: inmersion.hora_fin,
        profundidad_max: inmersion.profundidad_max,
        temperatura_agua: inmersion.temperatura_agua,
        visibilidad: inmersion.visibilidad,
        corriente: inmersion.corriente,
        buzo_principal: inmersion.buzo_principal,
        buzo_principal_id: inmersion.buzo_principal_id,
        supervisor: inmersion.supervisor,
        supervisor_id: inmersion.supervisor_id,
        buzo_asistente: inmersion.buzo_asistente,
        operacion: inmersion.operacion
      })) as InmersionCompleta[];
    },
  });

  // Fetch usuarios by company
  const { data: usuarios = [], isLoading: loadingUsuarios } = useQuery({
    queryKey: ['usuarios-by-company'],
    queryFn: async () => {
      console.log('Fetching usuarios by company...');
      
      if (!profile?.salmonera_id && !profile?.servicio_id) {
        return [];
      }

      const { data, error } = await supabase
        .from('usuario')
        .select(`
          *,
          salmoneras:salmonera_id(nombre),
          contratistas:servicio_id(nombre)
        `)
        .or(`salmonera_id.eq.${profile.salmonera_id},servicio_id.eq.${profile.servicio_id}`)
        .in('rol', ['supervisor', 'buzo']);

      if (error) {
        console.error('Error fetching usuarios:', error);
        throw error;
      }

      return (data || []).map(user => ({
        id: user.usuario_id,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol as 'supervisor' | 'buzo',
        empresa_nombre: user.salmoneras?.nombre || user.contratistas?.nombre || 'Sin empresa'
      })) as BitacoraUser[];
    },
    enabled: !!(profile?.salmonera_id || profile?.servicio_id),
  });

  // Filter users for bitácoras
  const supervisores = usuarios.filter(u => u.rol === 'supervisor');
  const buzos = usuarios.filter(u => u.rol === 'buzo');

  const createBitacoraSupervisor = useMutation({
    mutationFn: async (data: BitacoraSupervisorFormData) => {
      // Get supervisor name from users
      const supervisor = supervisores.find(u => u.id === data.supervisor_id);
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
      const buzo = buzos.find(u => u.id === data.buzo_id);
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
    usuarios,
    supervisores,
    buzos,
    inmersiones,
    loadingUsuarios,
    loadingInmersiones,
    createBitacoraSupervisor: createBitacoraSupervisor.mutate,
    createBitacoraBuzo: createBitacoraBuzo.mutate,
    signBitacora: signBitacora.mutate,
    isCreating: createBitacoraSupervisor.isPending || createBitacoraBuzo.isPending,
    isSigning: signBitacora.isPending,
  };
};
