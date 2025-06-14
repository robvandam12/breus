
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Inmersion } from "@/types/inmersion";
import { useEffect } from "react";

export const useActiveImmersions = () => {
  const queryClient = useQueryClient();

  const { data: activeImmersions = [], isLoading } = useQuery({
    queryKey: ['active_inmersions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          inmersion_id,
          codigo,
          estado,
          buzo_principal,
          supervisor,
          current_depth,
          planned_bottom_time,
          depth_history,
          hora_inicio,
          fecha_inmersion,
          operacion:operacion_id (
            codigo,
            nombre
          )
        `)
        .in('estado', ['en_progreso', 'planificada'])
        .order('fecha_inmersion', { ascending: true })
        .order('hora_inicio', { ascending: true });

      if (error) throw error;
      return data as Inmersion[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('realtime-active-inmersions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inmersion', filter: 'estado=in.en_progreso,planificada' },
        (payload) => {
          console.log('Change received in active immersions!', payload);
          queryClient.invalidateQueries({ queryKey: ['active_inmersions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { activeImmersions, isLoading };
};
