
import { useMemo } from 'react';
import { useBitacorasSupervisor } from './useBitacorasSupervisor';
import { useBitacorasBuzo } from './useBitacorasBuzo';
import { useInmersionesData } from './useInmersionesData';
import { useOperaciones } from './useOperaciones';
import { useAlertas } from './useAlertas';

export interface DashboardStats {
  totalBitacoras: number;
  bitacorasFirmadas: number;
  inmersionesHoy: number;
  operacionesActivas: number;
  alertasActivas: number;
}

export const useDashboardStats = () => {
  // Nota: Algunos hooks subyacentes podrían no exportar isLoading.
  // El estado de carga es una aproximación.
  const { bitacorasSupervisor } = useBitacorasSupervisor();
  const { bitacorasBuzo } = useBitacorasBuzo();
  const { inmersiones } = useInmersionesData();
  const { operaciones, isLoading: isLoadingOperaciones } = useOperaciones();
  const { alertasNoLeidas, isLoading: isLoadingAlertas } = useAlertas();

  // Una comprobación de carga más robusta verificaría todas las consultas subyacentes.
  const isLoading = isLoadingOperaciones || isLoadingAlertas;

  const stats: DashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const totalBitacoras = (bitacorasSupervisor?.length || 0) + (bitacorasBuzo?.length || 0);
    const bitacorasFirmadas = (bitacorasSupervisor?.filter(b => b.firmado).length || 0) + 
                             (bitacorasBuzo?.filter(b => b.firmado).length || 0);
    
    const inmersionesHoy = inmersiones?.filter(i => i.fecha_inmersion === today).length || 0;
    const operacionesActivas = operaciones?.filter(o => o.estado === 'activa').length || 0;
    const alertasActivas = alertasNoLeidas?.length || 0;

    return {
      totalBitacoras,
      bitacorasFirmadas,
      inmersionesHoy,
      operacionesActivas,
      alertasActivas
    };
  }, [bitacorasSupervisor, bitacorasBuzo, inmersiones, operaciones, alertasNoLeidas]);

  return { stats, isLoading };
};
