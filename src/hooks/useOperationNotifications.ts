
import { useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOperationNotifications = (operacionId?: string) => {
  useEffect(() => {
    if (!operacionId) return;

    // Suscribirse a eventos de dominio relacionados con la operación
    const channel = supabase
      .channel(`operation-${operacionId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'domain_event',
          filter: `aggregate_id=eq.${operacionId}`
        },
        (payload) => {
          handleDomainEvent(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [operacionId]);

  const handleDomainEvent = (event: any) => {
    switch (event.event_type) {
      case 'HPT_DONE':
        toast({
          title: "HPT Completado",
          description: `El HPT para la operación ${event.event_data?.codigo} ha sido firmado.`,
        });
        // Emit custom event for other components to listen
        window.dispatchEvent(new CustomEvent('operationUpdated', { 
          detail: { operacionId: event.aggregate_id, type: 'hpt_completed' }
        }));
        break;
        
      case 'ANEXO_DONE':
        toast({
          title: "Anexo Bravo Completado",
          description: `El Anexo Bravo para la operación ${event.event_data?.codigo} ha sido firmado.`,
        });
        window.dispatchEvent(new CustomEvent('operationUpdated', { 
          detail: { operacionId: event.aggregate_id, type: 'anexo_completed' }
        }));
        break;
        
      case 'IMM_CREATED':
        toast({
          title: "Inmersión Creada",
          description: `Nueva inmersión ${event.event_data?.codigo} programada.`,
        });
        break;
        
      case 'OPERATION_READY':
        toast({
          title: "Operación Lista",
          description: "La operación cumple todos los requisitos y está lista para ejecutarse.",
        });
        window.dispatchEvent(new CustomEvent('operationReady', { 
          detail: { operacionId: event.aggregate_id }
        }));
        break;
        
      case 'OPERATION_ASSIGNED':
        toast({
          title: "Asignación Actualizada",
          description: "Se ha actualizado la asignación de personal o equipo.",
        });
        break;
        
      default:
        console.log('Unhandled domain event:', event.event_type);
    }
  };

  const notifyStepComplete = (stepName: string, operacionCodigo?: string) => {
    toast({
      title: `${stepName} Completado`,
      description: operacionCodigo 
        ? `Paso completado para la operación ${operacionCodigo}`
        : "Paso del flujo completado exitosamente",
    });
  };

  const notifyValidationResult = (isValid: boolean, details?: string) => {
    toast({
      title: isValid ? "Validación Exitosa" : "Validación Fallida",
      description: details || (isValid 
        ? "Todos los requisitos han sido validados correctamente"
        : "Hay elementos que requieren atención"),
      variant: isValid ? "default" : "destructive",
    });
  };

  const notifyAssignmentComplete = (type: 'sitio' | 'equipo' | 'supervisor') => {
    const messages = {
      sitio: "Sitio asignado correctamente",
      equipo: "Equipo de buceo asignado",
      supervisor: "Supervisor asignado a la operación"
    };
    
    toast({
      title: "Asignación Completada",
      description: messages[type],
    });
  };

  const notifyOperationReady = (operacionCodigo: string) => {
    toast({
      title: "¡Operación Lista!",
      description: `La operación ${operacionCodigo} está completamente configurada y lista para inmersiones.`,
    });
  };

  return {
    notifyStepComplete,
    notifyValidationResult,
    notifyAssignmentComplete,
    notifyOperationReady
  };
};
