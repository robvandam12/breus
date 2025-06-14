import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useOfflineSync } from './useOfflineSync';
import { useEffect } from "react";

export interface Inmersion {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  hora_inicio: string;
  hora_fin?: string;
  operacion_id: string;
  buzo_principal: string;
  buzo_principal_id?: string;
  buzo_asistente?: string;
  buzo_asistente_id?: string;
  supervisor: string;
  supervisor_id?: string;
  objetivo: string;
  estado: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  observaciones?: string;
  hpt_validado: boolean;
  anexo_bravo_validado: boolean;
  created_at: string;
  updated_at: string;
  operacion_nombre?: string;
  current_depth?: number | null;
  planned_bottom_time?: number | null;
  depth_history?: Array<{ depth: number; timestamp: string }>;
}

export interface ValidationStatus {
  hasValidHPT: boolean;
  hasValidAnexoBravo: boolean;
  hasTeam: boolean;
  canExecute: boolean;
  hptCode?: string;
  anexoBravoCode?: string;
}

export interface OperationData {
  id: string;
  codigo: string;
  nombre: string;
  equipo_buceo_id?: string;
  salmoneras?: { nombre: string };
  sitios?: { nombre: string };
  contratistas?: { nombre: string };
}

export interface HPTData {
  id: string;
  codigo: string;
  supervisor: string;
  firmado: boolean;
}

export interface AnexoBravoData {
  id: string;
  codigo: string;
  supervisor: string;
  firmado: boolean;
}

export interface EquipoBuceoData {
  id: string;
  nombre: string;
  miembros: Array<{
    usuario_id: string;
    rol_equipo: string;
    nombre?: string;
  }>;
}

export const useInmersiones = (operacionId?: string) => {
  const queryClient = useQueryClient();
  const { isOnline, addPendingAction } = useOfflineSync();

  const { data: inmersiones = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inmersiones', operacionId],
    queryFn: async () => {
      let query = supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (operacionId) {
        query = query.eq('operacion_id', operacionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data.map(inmersion => ({
        ...inmersion,
        operacion_nombre: inmersion.operacion?.nombre || '',
        depth_history: (inmersion.depth_history as unknown as Array<{ depth: number; timestamp: string }>) ?? [],
      })) as Inmersion[];
    },
  });

  // REAL-TIME SUBSCRIPTION FOR IMMERSIONS
  useEffect(() => {
    const channel = supabase
      .channel('realtime-inmersiones')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inmersion' },
        (payload) => {
          console.log('Cambio en inmersión recibido!', payload);
          queryClient.invalidateQueries({ queryKey: ['inmersiones', operacionId] });
          queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, operacionId]);

  // Nueva función para obtener datos completos de la operación
  const getOperationCompleteData = async (operacionId: string) => {
    try {
      // Obtener datos de la operación
      const { data: operacionData, error: operacionError } = await supabase
        .from('operacion')
        .select(`
          *,
          salmoneras:salmonera_id(nombre),
          sitios:sitio_id(nombre),
          contratistas:contratista_id(nombre)
        `)
        .eq('id', operacionId)
        .single();

      if (operacionError) throw operacionError;

      // Obtener HPT firmado de la operación
      const { data: hptData } = await supabase
        .from('hpt')
        .select('id, codigo, supervisor, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .maybeSingle();

      // Obtener Anexo Bravo firmado de la operación
      const { data: anexoBravoData } = await supabase
        .from('anexo_bravo')
        .select('id, codigo, supervisor, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .maybeSingle();

      // Obtener datos del equipo de buceo si está asignado
      let equipoBuceoData = null;
      if (operacionData.equipo_buceo_id) {
        const { data: equipoData } = await supabase
          .from('equipos_buceo')
          .select(`
            id,
            nombre,
            equipo_buceo_miembros (
              usuario_id,
              rol_equipo,
              usuario:usuario_id (
                nombre,
                apellido
              )
            )
          `)
          .eq('id', operacionData.equipo_buceo_id)
          .single();

        if (equipoData) {
          equipoBuceoData = {
            ...equipoData,
            miembros: equipoData.equipo_buceo_miembros?.map((miembro: any) => ({
              usuario_id: miembro.usuario_id,
              rol_equipo: miembro.rol_equipo,
              nombre: miembro.usuario ? `${miembro.usuario.nombre} ${miembro.usuario.apellido}` : ''
            })) || []
          };
        }
      }

      return {
        operacion: operacionData as OperationData,
        hpt: hptData as HPTData | null,
        anexoBravo: anexoBravoData as AnexoBravoData | null,
        equipoBuceo: equipoBuceoData as EquipoBuceoData | null
      };
    } catch (error) {
      console.error('Error getting operation complete data:', error);
      return null;
    }
  };

  const createInmersionMutation = useMutation({
    mutationFn: async (inmersionData: Omit<Inmersion, 'inmersion_id' | 'created_at' | 'updated_at' | 'operacion_nombre'>) => {
      if (!isOnline) {
        const tempId = `offline_${Date.now()}`;
        const payload = { ...inmersionData, hpt_validado: false, anexo_bravo_validado: false };
        addPendingAction({ type: 'create', table: 'inmersion', payload });
        
        // Optimistic update
        const newInmersion = { ...payload, inmersion_id: tempId, codigo: `OFFLINE-${tempId.slice(-4)}` };
        queryClient.setQueryData(['inmersiones'], (oldData: Inmersion[] = []) => [...oldData, newInmersion]);
        return newInmersion;
      }

      // Obtener datos completos de la operación para poblar campos automáticamente
      const operationData = await getOperationCompleteData(inmersionData.operacion_id);
      
      let finalData = { ...inmersionData };

      if (operationData) {
        // Poblar supervisor desde HPT o Anexo Bravo
        if (!finalData.supervisor && operationData.hpt?.supervisor) {
          finalData.supervisor = operationData.hpt.supervisor;
        } else if (!finalData.supervisor && operationData.anexoBravo?.supervisor) {
          finalData.supervisor = operationData.anexoBravo.supervisor;
        }

        // Poblar buzos desde el equipo de buceo
        if (operationData.equipoBuceo?.miembros) {
          const buzoPrincipal = operationData.equipoBuceo.miembros.find(m => m.rol_equipo === 'buzo_principal' || m.rol_equipo === 'supervisor');
          const buzoAsistente = operationData.equipoBuceo.miembros.find(m => m.rol_equipo === 'buzo_asistente' || m.rol_equipo === 'buzo');

          if (!finalData.buzo_principal && buzoPrincipal?.nombre) {
            finalData.buzo_principal = buzoPrincipal.nombre;
            finalData.buzo_principal_id = buzoPrincipal.usuario_id;
          }

          if (!finalData.buzo_asistente && buzoAsistente?.nombre) {
            finalData.buzo_asistente = buzoAsistente.nombre;
            finalData.buzo_asistente_id = buzoAsistente.usuario_id;
          }
        }

        // Generar código automático si no se proporciona
        if (!finalData.codigo) {
          const timestamp = Date.now().toString().slice(-6);
          finalData.codigo = `INM-${operationData.operacion.codigo}-${timestamp}`;
        }
      }

      const { data, error } = await supabase
        .from('inmersion')
        .insert({
          ...finalData,
          hpt_validado: false,
          anexo_bravo_validado: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: isOnline ? "Inmersión creada" : "Inmersión guardada (Offline)",
        description: isOnline 
          ? "La inmersión ha sido creada exitosamente con datos auto-poblados."
          : "La inmersión se sincronizará cuando haya conexión.",
      });
    },
    onError: (error) => {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    },
  });

  const updateInmersionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Inmersion> }) => {
      if (!isOnline) {
        addPendingAction({ type: 'update', table: 'inmersion', payload: { pk: { inmersion_id: id }, data } });
        queryClient.setQueryData(['inmersiones'], (old: Inmersion[] = []) => 
          old.map(i => i.inmersion_id === id ? { ...i, ...data } : i)
        );
        return { inmersion_id: id, ...data };
      }

      // If updating depth, also update history and perform real-time validation
      if (data.current_depth !== undefined && data.current_depth !== null) {
        const { data: currentInmersion, error: fetchError } = await supabase
          .from('inmersion')
          .select('depth_history, profundidad_max, supervisor_id, codigo, operacion_id')
          .eq('inmersion_id', id)
          .single();

        if (fetchError) throw fetchError;

        // REAL-TIME VALIDATION: Check for depth limit breach and create a security alert
        if (currentInmersion && data.current_depth > currentInmersion.profundidad_max) {
          console.warn(`ALERTA DE PROFUNDIDAD: Inmersión ${currentInmersion.codigo}. Actual: ${data.current_depth}m, Máxima: ${currentInmersion.profundidad_max}m`);
          
          // Find the security rule for depth limit
          const { data: rule, error: ruleError } = await supabase
            .from('security_alert_rules')
            .select('id, priority')
            .eq('type', 'DEPTH_LIMIT')
            .maybeSingle();

          if (ruleError) {
            console.error('Error fetching depth limit rule:', ruleError);
          } else if (rule) {
            // Create a security alert, which will trigger a notification
            const { error: alertError } = await supabase.from('security_alerts').insert({
              inmersion_id: id,
              rule_id: rule.id,
              type: 'DEPTH_LIMIT',
              priority: rule.priority,
              details: {
                current_depth: data.current_depth,
                max_depth: currentInmersion.profundidad_max,
                inmersion_code: currentInmersion.codigo
              }
            });

            if (alertError) {
              console.error('Error creating security alert:', alertError);
              toast({
                title: "Error al crear alerta",
                description: "No se pudo registrar la alerta de seguridad.",
                variant: "destructive",
              });
            } else {
               toast({
                title: "¡Alerta de Seguridad Registrada!",
                description: "Se ha notificado al supervisor sobre el exceso de profundidad.",
                variant: "destructive",
              });
            }
          } else {
            console.warn("Regla de seguridad para 'DEPTH_LIMIT' no encontrada. La alerta no será creada via el nuevo sistema.");
          }
        }

        const currentHistory = (currentInmersion?.depth_history || []) as Array<{ depth: number; timestamp: string }>;
        const newHistoryEntry = {
          depth: data.current_depth,
          timestamp: new Date().toISOString(),
        };
        const newHistory = [...currentHistory, newHistoryEntry];
        data.depth_history = newHistory;
      }

      const { data: updatedData, error } = await supabase
        .from('inmersion')
        .update(data)
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: isOnline ? "Inmersión actualizada" : "Actualización guardada (Offline)",
        description: isOnline 
          ? "La inmersión ha sido actualizada exitosamente."
          : "Se sincronizará cuando haya conexión.",
      });
    },
    onError: (error) => {
      console.error('Error updating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const deleteInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isOnline) {
        addPendingAction({ type: 'delete', table: 'inmersion', payload: { pk: { inmersion_id: id } } });
        queryClient.setQueryData(['inmersiones'], (old: Inmersion[] = []) => 
          old.filter(i => i.inmersion_id !== id)
        );
        return;
      }
      const { error } = await supabase
        .from('inmersion')
        .delete()
        .eq('inmersion_id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: isOnline ? "Inmersión eliminada" : "Eliminación guardada (Offline)",
        description: isOnline
          ? "La inmersión ha sido eliminada exitosamente."
          : "Se sincronizará cuando haya conexión.",
      });
    },
    onError: (error) => {
      console.error('Error deleting inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const executeInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'en_progreso' })
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión ejecutada",
        description: "La inmersión ha sido puesta en ejecución.",
      });
    },
    onError: (error) => {
      console.error('Error executing inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo ejecutar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const completeInmersionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('inmersion')
        .update({ estado: 'completada' })
        .eq('inmersion_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      toast({
        title: "Inmersión completada",
        description: "La inmersión ha sido marcada como completada.",
      });
    },
    onError: (error) => {
      console.error('Error completing inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la inmersión.",
        variant: "destructive",
      });
    },
  });

  const validateOperationDocuments = async (operacionId: string): Promise<ValidationStatus> => {
    try {
      // Verificar HPT firmado
      const { data: hptData } = await supabase
        .from('hpt')
        .select('codigo, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      // Verificar Anexo Bravo firmado
      const { data: anexoData } = await supabase
        .from('anexo_bravo')
        .select('codigo, firmado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .single();

      // Verificar que la operación tenga equipo asignado
      const { data: operacionData } = await supabase
        .from('operacion')
        .select('equipo_buceo_id')
        .eq('id', operacionId)
        .single();

      const hasValidHPT = !!hptData;
      const hasValidAnexoBravo = !!anexoData;
      const hasTeam = !!(operacionData?.equipo_buceo_id);

      return {
        hasValidHPT,
        hasValidAnexoBravo,
        hasTeam,
        canExecute: hasValidHPT && hasValidAnexoBravo && hasTeam,
        hptCode: hptData?.codigo,
        anexoBravoCode: anexoData?.codigo
      };
    } catch (error) {
      console.error('Error validating documents:', error);
      return {
        hasValidHPT: false,
        hasValidAnexoBravo: false,
        hasTeam: false,
        canExecute: false
      };
    }
  };

  return {
    inmersiones,
    isLoading,
    error,
    createInmersion: createInmersionMutation.mutateAsync,
    updateInmersion: updateInmersionMutation.mutateAsync,
    deleteInmersion: deleteInmersionMutation.mutateAsync,
    executeInmersion: executeInmersionMutation.mutateAsync,
    completeInmersion: completeInmersionMutation.mutateAsync,
    validateOperationDocuments,
    getOperationCompleteData,
    refreshInmersiones: refetch,
    isCreating: createInmersionMutation.isPending,
    isUpdating: updateInmersionMutation.isPending,
  };
};
