
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface HPTFormData {
  // Paso 1: Información General
  operacion_id: string;
  fecha_programada: string;
  hora_inicio: string;
  hora_fin: string;
  supervisor: string;
  jefe_obra: string;
  descripcion_trabajo: string;
  plan_trabajo: string;
  
  // Paso 2: Equipo de Buceo
  buzos: Array<{
    nombre: string;
    certificacion: string;
    vencimiento: string;
    rol: string;
  }>;
  asistentes: Array<{
    nombre: string;
    rol: string;
  }>;
  
  // Paso 3: Análisis de Riesgos
  tipo_trabajo: string;
  profundidad_maxima: number;
  corrientes: string;
  visibilidad: string;
  temperatura: number;
  riesgos_identificados: string[];
  medidas_control: string[];
  
  // Paso 4: Equipos y Herramientas
  equipo_buceo: string[];
  herramientas: string[];
  equipo_seguridad: string[];
  equipo_comunicacion: string[];
  
  // Paso 5: Procedimientos de Emergencia
  plan_emergencia: string;
  contactos_emergencia: Array<{
    nombre: string;
    cargo: string;
    telefono: string;
  }>;
  hospital_cercano: string;
  camara_hiperbarica: string;
  
  // Paso 6: Autorizaciones
  supervisor_firma: string | null;
  jefe_obra_firma: string | null;
  observaciones: string;
}

export interface HPT {
  id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  supervisor: string;
  fecha_creacion: string;
  firmado: boolean;
  supervisor_firma?: string;
  jefe_obra_firma?: string;
  created_at: string;
  updated_at: string;
}

export const useHPT = () => {
  const queryClient = useQueryClient();

  const { data: hpts = [], isLoading: loading, error } = useQuery({
    queryKey: ['hpts'],
    queryFn: async () => {
      console.log('Fetching HPTs...');
      const { data, error } = await supabase
        .from('hpt')
        .select(`
          *,
          operacion:operacion_id (
            nombre,
            codigo
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching HPTs:', error);
        throw error;
      }

      console.log('HPTs fetched:', data);
      return (data || []).map((item: any) => ({
        id: item.id,
        codigo: item.codigo || `HPT-${item.id.slice(0, 8)}`,
        operacion_id: item.operacion_id,
        operacion_nombre: item.operacion?.nombre || 'Sin operación',
        supervisor: item.supervisor || 'Sin supervisor',
        fecha_creacion: new Date(item.created_at).toLocaleDateString(),
        firmado: !!(item.supervisor_firma && item.jefe_obra_firma),
        supervisor_firma: item.supervisor_firma,
        jefe_obra_firma: item.jefe_obra_firma,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })) as HPT[];
    },
  });

  const createHPTMutation = useMutation({
    mutationFn: async (hptData: HPTFormData) => {
      console.log('Creating HPT:', hptData);
      
      const hptRecord = {
        operacion_id: hptData.operacion_id,
        supervisor: hptData.supervisor,
        codigo: `HPT-${Date.now()}`,
        fecha_programada: hptData.fecha_programada,
        hora_inicio: hptData.hora_inicio,
        hora_fin: hptData.hora_fin,
        descripcion_trabajo: hptData.descripcion_trabajo,
        plan_trabajo: hptData.plan_trabajo,
        tipo_trabajo: hptData.tipo_trabajo,
        profundidad_maxima: hptData.profundidad_maxima,
        plan_emergencia: hptData.plan_emergencia,
        supervisor_firma: hptData.supervisor_firma,
        jefe_obra_firma: hptData.jefe_obra_firma,
        observaciones: hptData.observaciones,
        buzos: hptData.buzos,
        riesgos_identificados: hptData.riesgos_identificados,
        medidas_control: hptData.medidas_control,
        equipo_buceo: hptData.equipo_buceo,
        contactos_emergencia: hptData.contactos_emergencia,
      };

      const { data, error } = await supabase
        .from('hpt')
        .insert([hptRecord])
        .select()
        .single();

      if (error) {
        console.error('Error creating HPT:', error);
        throw error;
      }

      console.log('HPT created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hpts'] });
      toast({
        title: "HPT creada",
        description: "La Hoja de Preparación de Trabajo ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la HPT. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    hpts,
    loading,
    error,
    createHPT: createHPTMutation.mutateAsync,
    isCreating: createHPTMutation.isPending,
  };
};
