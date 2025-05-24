
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface HPTItem {
  id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  fecha_creacion: string;
  supervisor: string;
  plan_trabajo: string;
  firmado: boolean;
  supervisor_firma?: string;
  jefe_operaciones_firma?: string;
  created_at: string;
  updated_at: string;
}

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
  supervisor_firma?: string;
  jefe_obra_firma?: string;
  observaciones: string;
}

export const useHPT = () => {
  const [hpts, setHpts] = useState<HPTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadHPTs();
  }, []);

  const loadHPTs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hpt')
        .select(`
          id,
          codigo,
          operacion_id,
          fecha_creacion,
          supervisor,
          plan_trabajo,
          firmado,
          supervisor_firma,
          jefe_operaciones_firma,
          created_at,
          updated_at,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: HPTItem[] = (data || []).map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        operacion_id: item.operacion_id,
        operacion_nombre: item.operacion?.nombre || 'Operación no encontrada',
        fecha_creacion: item.fecha_creacion,
        supervisor: item.supervisor,
        plan_trabajo: item.plan_trabajo,
        firmado: item.firmado,
        supervisor_firma: item.supervisor_firma,
        jefe_operaciones_firma: item.jefe_operaciones_firma,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setHpts(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error loading HPTs:', err);
      setError('Error al cargar los HPTs');
      toast({
        title: "Error",
        description: "No se pudieron cargar los HPTs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createHPT = async (data: HPTFormData) => {
    setLoading(true);
    try {
      // Generar código único
      const { count } = await supabase
        .from('hpt')
        .select('*', { count: 'exact', head: true });
      
      const codigo = `HPT-2024-${String((count || 0) + 1).padStart(3, '0')}`;

      // Preparar datos para la base de datos - ahora usando las nuevas columnas
      const hptData = {
        codigo,
        operacion_id: data.operacion_id,
        fecha_programada: data.fecha_programada,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        supervisor: data.supervisor,
        jefe_obra: data.jefe_obra,
        descripcion_trabajo: data.descripcion_trabajo,
        plan_trabajo: data.plan_trabajo,
        
        // Datos del equipo
        buzos: data.buzos,
        asistentes: data.asistentes,
        
        // Análisis de riesgos
        tipo_trabajo: data.tipo_trabajo,
        profundidad_maxima: data.profundidad_maxima,
        corrientes: data.corrientes,
        visibilidad: data.visibilidad,
        temperatura: data.temperatura,
        riesgos_identificados: data.riesgos_identificados,
        medidas_control: data.medidas_control,
        
        // Equipos y herramientas
        equipo_buceo: data.equipo_buceo,
        herramientas: data.herramientas,
        equipo_seguridad: data.equipo_seguridad,
        equipo_comunicacion: data.equipo_comunicacion,
        
        // Procedimientos de emergencia
        plan_emergencia: data.plan_emergencia,
        contactos_emergencia: data.contactos_emergencia,
        hospital_cercano: data.hospital_cercano,
        camara_hiperbarica: data.camara_hiperbarica,
        
        // Autorizaciones
        supervisor_firma: data.supervisor_firma || null,
        jefe_obra_firma: data.jefe_obra_firma || null,
        observaciones: data.observaciones,
        firmado: !!(data.supervisor_firma && data.jefe_obra_firma),
        
        user_id: '00000000-0000-0000-0000-000000000000' // Placeholder hasta que se implemente auth
      };

      const { data: newHPT, error } = await supabase
        .from('hpt')
        .insert([hptData])
        .select(`
          id,
          codigo,
          operacion_id,
          fecha_creacion,
          supervisor,
          plan_trabajo,
          firmado,
          supervisor_firma,
          jefe_operaciones_firma,
          created_at,
          updated_at,
          operacion:operacion_id (
            nombre
          )
        `)
        .single();

      if (error) throw error;

      const formattedNewHPT: HPTItem = {
        id: newHPT.id,
        codigo: newHPT.codigo,
        operacion_id: newHPT.operacion_id,
        operacion_nombre: newHPT.operacion?.nombre || 'Nueva Operación',
        fecha_creacion: newHPT.fecha_creacion,
        supervisor: newHPT.supervisor,
        plan_trabajo: newHPT.plan_trabajo,
        firmado: newHPT.firmado,
        supervisor_firma: newHPT.supervisor_firma,
        jefe_operaciones_firma: newHPT.jefe_operaciones_firma,
        created_at: newHPT.created_at,
        updated_at: newHPT.updated_at
      };

      setHpts(prev => [formattedNewHPT, ...prev]);

      toast({
        title: "HPT Creada",
        description: `${formattedNewHPT.codigo} ha sido creada exitosamente`,
      });

      return formattedNewHPT;
    } catch (err) {
      console.error('Error creating HPT:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el HPT';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getHPTDetail = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hpt')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Los datos ahora vienen directamente de las columnas, no necesitamos deserializar JSON
      const detailData = {
        ...data,
        // Asegurar que los arrays existan
        buzos: data.buzos || [],
        asistentes: data.asistentes || [],
        riesgos_identificados: data.riesgos_identificados || [],
        medidas_control: data.medidas_control || [],
        equipo_buceo: data.equipo_buceo || [],
        herramientas: data.herramientas || [],
        equipo_seguridad: data.equipo_seguridad || [],
        equipo_comunicacion: data.equipo_comunicacion || [],
        contactos_emergencia: data.contactos_emergencia || [],
      };

      return detailData;
    } catch (err) {
      console.error('Error loading HPT detail:', err);
      setError('Error al cargar el detalle del HPT');
      toast({
        title: "Error",
        description: "No se pudo cargar el detalle del HPT",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    hpts,
    loading,
    error,
    createHPT,
    getHPTDetail,
    refreshHPTs: loadHPTs
  };
};
