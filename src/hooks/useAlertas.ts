
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSecurityAlerts } from "./useSecurityAlerts";
import type { SecurityAlert } from "@/types/security";

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

const mapSecurityAlertToAlerta = (securityAlert: SecurityAlert): Alerta => {
  const priorityMap = {
    emergency: 'alta' as const,
    critical: 'alta' as const,
    warning: 'media' as const,
    info: 'baja' as const,
  };

  const typeMap: { [key: string]: Alerta['tipo'] } = {
    DEPTH_LIMIT: 'inmersion_sin_validar',
    ASCENT_RATE: 'inmersion_sin_validar',
    BOTTOM_TIME: 'inmersion_sin_validar',
  };

  return {
    id: securityAlert.id,
    titulo: `Alerta: ${securityAlert.type.replace(/_/g, ' ')}`,
    descripcion: `Inmersión ${securityAlert.inmersion?.codigo || 'N/A'}. Prioridad: ${securityAlert.priority}, Nivel Esc: ${securityAlert.escalation_level}`,
    tipo: typeMap[securityAlert.type] || 'inmersion_sin_validar',
    prioridad: priorityMap[securityAlert.priority],
    leida: securityAlert.acknowledged,
    fecha_creacion: securityAlert.created_at,
    created_at: securityAlert.created_at,
    updated_at: securityAlert.acknowledged_at || securityAlert.created_at,
  };
};

export const useAlertas = () => {
  const { alerts: securityAlerts, isLoading: isLoadingSecurity, acknowledgeAlert } = useSecurityAlerts();

  const alertas: Alerta[] = securityAlerts.map(mapSecurityAlertToAlerta);
  const isLoading = isLoadingSecurity;

  const marcarComoLeidaMutation = useMutation({
    mutationFn: (alertaId: string) => acknowledgeAlert(alertaId),
    // onSuccess y onError son manejados por el hook subyacente useSecurityAlerts,
    // que ya muestra sus propios toasts. No es necesario duplicarlos aquí.
  });

  const alertasNoLeidas = alertas.filter(alerta => !alerta.leida);

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
