
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { SecurityAlert } from '@/types/security';
import { useEffect } from "react";

export const useSecurityAlerts = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['security_alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_alerts')
        .select(`
          *,
          inmersion:inmersion_id (
            codigo
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Hacemos un cast para asegurar que los datos coincidan con nuestra interfaz estricta.
      return data as SecurityAlert[];
    },
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      if (!user) throw new Error("User must be logged in to acknowledge alerts");

      const { data, error } = await supabase
        .from('security_alerts')
        .update({
          acknowledged: true,
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user.id,
        })
        .eq('id', alertId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security_alerts'] });
      toast({
        title: "Alerta Reconocida",
        description: "La alerta ha sido marcada como reconocida.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo reconocer la alerta. " + error.message,
        variant: "destructive",
      });
    }
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('security-alerts-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'security_alerts' },
        (payload) => {
          console.log('Nueva alerta de seguridad!', payload);
          queryClient.invalidateQueries({ queryKey: ['security_alerts'] });
          const newAlert = payload.new as SecurityAlert;
          toast({
              title: `🚨 Nueva Alerta: ${newAlert.type.replace(/_/g, ' ')}`,
              description: `Prioridad ${newAlert.priority}. Inmersión: ${newAlert.details?.inmersion_code || 'N/A'}`,
              variant: newAlert.priority === 'critical' || newAlert.priority === 'emergency' ? 'destructive' : 'default',
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'security_alerts' },
        (payload) => {
          console.log('Alerta de seguridad actualizada!', payload);
          queryClient.invalidateQueries({ queryKey: ['security_alerts'] });
          const oldAlert = payload.old as SecurityAlert;
          const newAlert = payload.new as SecurityAlert;

          if (newAlert.escalation_level > oldAlert.escalation_level) {
             toast({
              title: `⚠️ Alerta Escalada: ${newAlert.type.replace(/_/g, ' ')}`,
              description: `La alerta para la inmersión ${newAlert.details?.inmersion_code || 'N/A'} ha sido escalada.`,
              variant: 'destructive',
            })
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);


  return {
    alerts,
    isLoading,
    acknowledgeAlert: acknowledgeAlertMutation.mutateAsync,
    isAcknowledging: acknowledgeAlertMutation.isPending,
  };
};
