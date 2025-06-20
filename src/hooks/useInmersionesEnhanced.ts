
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useContextualValidation } from "./useContextualValidation";

interface CreateInmersionData {
  // Campos básicos
  codigo?: string;
  fecha_inmersion: string;
  hora_inicio: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  objetivo: string;
  corriente: string;
  buzo_principal: string;
  supervisor: string;
  buzo_asistente?: string;
  observaciones?: string;
  
  // Campos para inmersión independiente (sin operación)
  salmonera_id?: string;
  contratista_id?: string;
  sitio_id?: string;
  centro_trabajo_nombre?: string;
  lugar_trabajo?: string;
  tipo_trabajo?: string;
  
  // Campo para inmersión con operación (planificación activa)
  operacion_id?: string;
}

interface InmersionResult {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  objetivo: string;
  corriente: string;
  buzo_principal: string;
  supervisor: string;
  buzo_asistente?: string;
  observaciones?: string;
  operacion_id?: string;
  salmonera_id?: string;
  contratista_id?: string;
  sitio_id?: string;
  estado: string;
  created_at: string;
  updated_at: string;
  operacion?: any;
  salmoneras?: any;
  sitios?: any;
  contratistas?: any;
  operacion_nombre?: string;
}

export const useInmersionesEnhanced = (operacionId?: string) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { validateForImmersion } = useContextualValidation();

  const { data: inmersiones = [], isLoading, refetch } = useQuery({
    queryKey: ['inmersiones-enhanced', operacionId, profile?.salmonera_id],
    queryFn: async () => {
      let query = supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            id, codigo, nombre,
            salmoneras:salmonera_id(nombre),
            sitios:sitio_id(nombre),
            contratistas:contratista_id(nombre)
          ),
          salmoneras:salmonera_id(nombre),
          sitios:sitio_id(nombre),
          contratistas:contratista_id(nombre)
        `)
        .order('created_at', { ascending: false });

      // Filtrar por operación específica
      if (operacionId) {
        query = query.eq('operacion_id', operacionId);
      }
      // Si no hay operación específica, filtrar por salmonera del usuario
      else if (profile?.salmonera_id && profile?.role === 'admin_salmonera') {
        query = query.eq('salmonera_id', profile.salmonera_id);
      }
      // Para contratistas, filtrar por su ID
      else if (profile?.servicio_id && profile?.role === 'admin_servicio') {
        query = query.eq('contratista_id', profile.servicio_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(inmersion => ({
        ...inmersion,
        // Determinar el nombre de la operación desde diferentes fuentes
        operacion_nombre: inmersion.operacion?.nombre || 
                         `Inmersión ${inmersion.codigo}` ||
                         'Inmersión Independiente',
        depth_history: Array.isArray(inmersion.depth_history) ? inmersion.depth_history : [],
      })) as InmersionResult[];
    },
  });

  const createInmersionMutation = useMutation({
    mutationFn: async (inmersionData: CreateInmersionData) => {
      console.log('Creating immersion with data:', inmersionData);

      // Validación contextual
      const validation = await validateForImmersion({
        operacion_id: inmersionData.operacion_id,
        salmonera_id: inmersionData.salmonera_id,
        contratista_id: inmersionData.contratista_id,
        sitio_id: inmersionData.sitio_id,
        buzo_principal: inmersionData.buzo_principal,
        supervisor: inmersionData.supervisor,
      });

      if (!validation.canProceed) {
        throw new Error(`Validación falló: ${validation.errors.join(', ')}`);
      }

      // Mostrar advertencias si las hay
      if (validation.warnings.length > 0) {
        console.warn('Validation warnings:', validation.warnings);
        toast({
          title: "Advertencias",
          description: validation.warnings.join(', '),
        });
      }

      // Generar código si no se proporciona
      let finalData = { ...inmersionData };
      if (!finalData.codigo) {
        const timestamp = Date.now().toString().slice(-6);
        if (finalData.operacion_id) {
          // Si hay operación, obtener su código
          const { data: operacion } = await supabase
            .from('operacion')
            .select('codigo')
            .eq('id', finalData.operacion_id)
            .single();
          finalData.codigo = `INM-${operacion?.codigo || 'OP'}-${timestamp}`;
        } else {
          // Inmersión independiente
          finalData.codigo = `INM-IND-${timestamp}`;
        }
      }

      // Asegurar que tenemos salmonera_id si no hay operación
      if (!finalData.operacion_id && !finalData.salmonera_id && profile?.salmonera_id) {
        finalData.salmonera_id = profile.salmonera_id;
      }

      // Preparar datos para inserción asegurando que codigo sea requerido
      const insertData = {
        codigo: finalData.codigo!, // Asegurar que existe
        fecha_inmersion: finalData.fecha_inmersion,
        hora_inicio: finalData.hora_inicio,
        profundidad_max: finalData.profundidad_max,
        temperatura_agua: finalData.temperatura_agua,
        visibilidad: finalData.visibilidad,
        objetivo: finalData.objetivo,
        corriente: finalData.corriente,
        buzo_principal: finalData.buzo_principal,
        supervisor: finalData.supervisor,
        buzo_asistente: finalData.buzo_asistente,
        observaciones: finalData.observaciones || '',
        operacion_id: finalData.operacion_id,
        salmonera_id: finalData.salmonera_id,
        contratista_id: finalData.contratista_id,
        sitio_id: finalData.sitio_id,
        anexo_bravo_validado: validation.context.hasModuloPlanificacion ? validation.isValid : true,
        estado: 'planificada'
      };

      // Crear la inmersión
      const { data, error } = await supabase
        .from('inmersion')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones-enhanced'] });
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      
      const isIndependent = !variables.operacion_id;
      toast({
        title: "Inmersión creada",
        description: isIndependent 
          ? "Inmersión independiente creada exitosamente"
          : "Inmersión vinculada a operación creada exitosamente",
      });
    },
    onError: (error: any) => {
      console.error('Error creating immersion:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    },
  });

  return {
    inmersiones,
    isLoading,
    refetch,
    createInmersion: createInmersionMutation.mutateAsync,
    isCreating: createInmersionMutation.isPending,
  };
};
