
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  // Inmersiones donde participó
  inmersiones: {
    como_buzo_principal: any[];
    como_buzo_asistente: any[];
    como_supervisor: any[];
    como_miembro_equipo: any[];
  };
  
  // Asignaciones de cuadrillas
  cuadrillas: {
    actual: any | null;
    historial: any[];
  };
  
  // Bitácoras
  bitacoras: {
    buzo: {
      completadas: any[];
      pendientes: any[];
    };
    supervisor: {
      completadas: any[];
      pendientes: any[];
    };
  };
  
  // Documentos creados
  documentos: {
    hpts: any[];
    anexos_bravo: any[];
  };
  
  // Timeline de actividades
  timeline: ActivityEvent[];
}

export interface ActivityEvent {
  id: string;
  type: 'inmersion' | 'bitacora' | 'documento' | 'cuadrilla';
  subtype?: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  metadata?: any;
}

export const useUserActivity = (userId: string) => {
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserActivity(userId);
    }
  }, [userId]);

  const fetchUserActivity = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener usuario info
      const { data: usuario } = await supabase
        .from('usuario')
        .select('*')
        .eq('usuario_id', userId)
        .single();

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.trim();

      // 1. Inmersiones donde participó
      const [
        inmersionesComoSuper,
        inmersionesComoBuzoPrincipal,
        inmersionesComoBuzoAsistente,
        inmersionesComoMiembro
      ] = await Promise.all([
        // Como supervisor
        supabase
          .from('inmersion')
          .select(`
            *,
            operacion:operacion(codigo, nombre, salmoneras(nombre), sitios(nombre))
          `)
          .eq('supervisor', nombreCompleto)
          .order('fecha_inmersion', { ascending: false })
          .limit(50),

        // Como buzo principal
        supabase
          .from('inmersion')
          .select(`
            *,
            operacion:operacion(codigo, nombre, salmoneras(nombre), sitios(nombre))
          `)
          .eq('buzo_principal', nombreCompleto)
          .order('fecha_inmersion', { ascending: false })
          .limit(50),

        // Como buzo asistente
        supabase
          .from('inmersion')
          .select(`
            *,
            operacion:operacion(codigo, nombre, salmoneras(nombre), sitios(nombre))
          `)
          .eq('buzo_asistente', nombreCompleto)
          .order('fecha_inmersion', { ascending: false })
          .limit(50),

        // Como miembro de equipo
        supabase
          .from('inmersion_team_members')
          .select(`
            *,
            inmersion:inmersion(
              *,
              operacion:operacion(codigo, nombre, salmoneras(nombre), sitios(nombre))
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50)
      ]);

      // 2. Cuadrillas
      const [cuadrillaActual, historialCuadrillas] = await Promise.all([
        // Cuadrilla actual
        supabase
          .from('cuadrilla_miembros')
          .select(`
            *,
            cuadrillas_buceo:cuadrilla_id(*)
          `)
          .eq('usuario_id', userId)
          .eq('disponible', true)
          .single(),

        // Historial de cuadrillas
        supabase
          .from('cuadrilla_miembros')
          .select(`
            *,
            cuadrillas_buceo:cuadrilla_id(*)
          `)
          .eq('usuario_id', userId)
          .order('created_at', { ascending: false })
      ]);

      // 3. Bitácoras
      const [bitacorasBuzo, bitacorasSupervisor] = await Promise.all([
        // Bitácoras como buzo
        supabase
          .from('bitacora_buzo')
          .select(`
            *,
            inmersion:inmersion(codigo, fecha_inmersion, objetivo)
          `)
          .eq('buzo', nombreCompleto)
          .order('created_at', { ascending: false }),

        // Bitácoras como supervisor
        supabase
          .from('bitacora_supervisor')
          .select(`
            *,
            inmersion:inmersion(codigo, fecha_inmersion, objetivo)
          `)
          .eq('supervisor', nombreCompleto)
          .order('created_at', { ascending: false })
      ]);

      // 4. Documentos creados
      const [hpts, anexosBravo] = await Promise.all([
        supabase
          .from('hpt')
          .select(`
            *,
            operacion:operacion(codigo, nombre)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),

        supabase
          .from('anexo_bravo')
          .select(`
            *,
            operacion:operacion(codigo, nombre)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ]);

      // Construir timeline
      const timeline: ActivityEvent[] = [];

      // Agregar inmersiones al timeline
      inmersionesComoSuper.data?.forEach(inmersion => {
        timeline.push({
          id: `inmersion-super-${inmersion.inmersion_id}`,
          type: 'inmersion',
          subtype: 'supervisor',
          title: `Supervisión - ${inmersion.codigo}`,
          description: inmersion.objetivo || 'Sin descripción',
          date: inmersion.fecha_inmersion,
          status: inmersion.estado === 'completada' ? 'completed' : 
                  inmersion.estado === 'cancelada' ? 'cancelled' : 'pending',
          metadata: inmersion
        });
      });

      inmersionesComoBuzoPrincipal.data?.forEach(inmersion => {
        timeline.push({
          id: `inmersion-buzo-${inmersion.inmersion_id}`,
          type: 'inmersion',
          subtype: 'buzo_principal',
          title: `Buzo Principal - ${inmersion.codigo}`,
          description: inmersion.objetivo || 'Sin descripción',
          date: inmersion.fecha_inmersion,
          status: inmersion.estado === 'completada' ? 'completed' : 
                  inmersion.estado === 'cancelada' ? 'cancelled' : 'pending',
          metadata: inmersion
        });
      });

      // Agregar bitácoras al timeline
      bitacorasBuzo.data?.forEach(bitacora => {
        timeline.push({
          id: `bitacora-buzo-${bitacora.bitacora_id}`,
          type: 'bitacora',
          subtype: 'buzo',
          title: `Bitácora Buzo - ${bitacora.codigo}`,
          description: `Inmersión ${bitacora.inmersion?.codigo || 'N/A'}`,
          date: bitacora.fecha.toString(),
          status: bitacora.firmado ? 'completed' : 'pending',
          metadata: bitacora
        });
      });

      bitacorasSupervisor.data?.forEach(bitacora => {
        timeline.push({
          id: `bitacora-super-${bitacora.bitacora_id}`,
          type: 'bitacora',
          subtype: 'supervisor',
          title: `Bitácora Supervisor - ${bitacora.codigo}`,
          description: `Inmersión ${bitacora.inmersion?.codigo || 'N/A'}`,
          date: bitacora.fecha.toString(),
          status: bitacora.firmado ? 'completed' : 'pending',
          metadata: bitacora
        });
      });

      // Agregar documentos al timeline
      hpts.data?.forEach(hpt => {
        timeline.push({
          id: `hpt-${hpt.id}`,
          type: 'documento',
          subtype: 'hpt',
          title: `HPT - ${hpt.codigo}`,
          description: `Operación ${hpt.operacion?.codigo || 'N/A'}`,
          date: hpt.created_at,
          status: hpt.firmado ? 'completed' : 'pending',
          metadata: hpt
        });
      });

      anexosBravo.data?.forEach(anexo => {
        timeline.push({
          id: `anexo-${anexo.id}`,
          type: 'documento',
          subtype: 'anexo_bravo',
          title: `Anexo Bravo - ${anexo.codigo}`,
          description: `Operación ${anexo.operacion?.codigo || 'N/A'}`,
          date: anexo.created_at,
          status: anexo.firmado ? 'completed' : 'pending',
          metadata: anexo
        });
      });

      // Ordenar timeline por fecha
      timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const userActivity: UserActivity = {
        inmersiones: {
          como_buzo_principal: inmersionesComoBuzoPrincipal.data || [],
          como_buzo_asistente: inmersionesComoBuzoAsistente.data || [],
          como_supervisor: inmersionesComoSuper.data || [],
          como_miembro_equipo: inmersionesComoMiembro.data || []
        },
        cuadrillas: {
          actual: cuadrillaActual.data,
          historial: historialCuadrillas.data || []
        },
        bitacoras: {
          buzo: {
            completadas: bitacorasBuzo.data?.filter(b => b.firmado) || [],
            pendientes: bitacorasBuzo.data?.filter(b => !b.firmado) || []
          },
          supervisor: {
            completadas: bitacorasSupervisor.data?.filter(b => b.firmado) || [],
            pendientes: bitacorasSupervisor.data?.filter(b => !b.firmado) || []
          }
        },
        documentos: {
          hpts: hpts.data || [],
          anexos_bravo: anexosBravo.data || []
        },
        timeline: timeline.slice(0, 100) // Limitar a 100 eventos más recientes
      };

      setActivity(userActivity);
    } catch (err) {
      console.error('Error fetching user activity:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activity,
    isLoading,
    error,
    refetch: () => fetchUserActivity(userId)
  };
};
