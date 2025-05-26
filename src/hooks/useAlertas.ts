
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Alerta {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'bitacora_pendiente' | 'inmersion_sin_validar' | 'operacion_vencida' | 'hpt_pendiente';
  prioridad: 'alta' | 'media' | 'baja';
  leida: boolean;
  fecha_creacion: string;
  created_at: string;
  updated_at: string;
}

export const useAlertas = () => {
  const queryClient = useQueryClient();

  // Fetch alertas
  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ['alertas'],
    queryFn: async () => {
      console.log('Fetching alertas...');
      
      // Por ahora retornamos datos mock ya que no tenemos la tabla en Supabase
      const mockAlertas: Alerta[] = [
        {
          id: '1',
          titulo: 'HPT pendiente de firma',
          descripcion: 'HPT-001 requiere firma del supervisor mandante',
          tipo: 'hpt_pendiente',
          prioridad: 'alta',
          leida: false,
          fecha_creacion: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          titulo: 'Inmersión completada',
          descripcion: 'Inmersión INM-002 ha sido completada exitosamente',
          tipo: 'bitacora_pendiente',
          prioridad: 'media',
          leida: true,
          fecha_creacion: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return mockAlertas;
    },
  });

  // Marcar como leída
  const marcarComoLeidaMutation = useMutation({
    mutationFn: async (alertaId: string) => {
      console.log('Marcando alerta como leída:', alertaId);
      // Aquí iría la llamada a Supabase
      return { id: alertaId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
      toast({
        title: "Alerta marcada como leída",
        description: "La alerta ha sido marcada como leída.",
      });
    },
  });

  const alertasNoLeidas = alertas.filter(alerta => !alerta.leida);

  // Agregar alertas por prioridad para StatsChart
  const alertasPorPrioridad = alertas.reduce((acc, alerta) => {
    acc[alerta.prioridad] = (acc[alerta.prioridad] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    alertas,
    alertasNoLeidas,
    alertasPorPrioridad,
    isLoading,
    marcarComoLeida: marcarComoLeidaMutation.mutateAsync,
  };
};
