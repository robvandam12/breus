
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAlertas } from "@/hooks/useAlertas";

export const NotificationToasts = () => {
  const { toast } = useToast();
  const { alertas } = useAlertas();

  useEffect(() => {
    // Mostrar notificaciones para alertas de alta prioridad
    const alertasAlta = alertas.filter(a => a.prioridad === 'alta' && !a.leida);
    
    if (alertasAlta.length > 0) {
      const nuevasAlertas = alertasAlta.slice(0, 3); // Máximo 3 notificaciones
      
      nuevasAlertas.forEach((alerta, index) => {
        setTimeout(() => {
          toast({
            title: "⚠️ Alerta de Alta Prioridad",
            description: alerta.descripcion,
            variant: "destructive",
          });
        }, index * 1000); // Espaciar las notificaciones
      });
    }
  }, [alertas, toast]);

  return null; // Este componente no renderiza nada visible
};
