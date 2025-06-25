
import { useMemo } from 'react';
import { useBitacorasSupervisor } from './useBitacorasSupervisor';
import { useBitacorasBuzo } from './useBitacorasBuzo';
import { useInmersiones } from './useInmersiones';
import { useOperaciones } from './useOperaciones';

export interface PerformanceMetrics {
  totalOperaciones: number;
  inmersionesCompletadas: number;
  promedioTiempoInmersion: number;
  eficienciaOperacional: number;
}

export const usePerformanceMetrics = () => {
  const { bitacorasSupervisor } = useBitacorasSupervisor();
  const { bitacorasBuzo } = useBitacorasBuzo();
  const { inmersiones, isLoading: isLoadingInmersiones } = useInmersiones();
  const { operaciones, isLoading: isLoadingOperaciones } = useOperaciones();

  const isLoading = isLoadingInmersiones || isLoadingOperaciones;

  const metrics: PerformanceMetrics = useMemo(() => {
    const totalOperaciones = operaciones?.length || 0;
    const inmersionesCompletadas = inmersiones?.filter(i => i.estado === 'completada').length || 0;
    
    // Calcular promedio de tiempo de inmersión (simplificado)
    const inmersionesConTiempo = inmersiones?.filter(i => i.hora_inicio && i.hora_fin) || [];
    const promedioTiempoInmersion = inmersionesConTiempo.length > 0 
      ? inmersionesConTiempo.reduce((acc, i) => {
          const inicio = new Date(`2000-01-01T${i.hora_inicio}`);
          const fin = new Date(`2000-01-01T${i.hora_fin}`);
          return acc + (fin.getTime() - inicio.getTime()) / (1000 * 60); // en minutos
        }, 0) / inmersionesConTiempo.length
      : 0;

    // Eficiencia operacional basada en inmersiones completadas vs planificadas
    const eficienciaOperacional = totalOperaciones > 0 
      ? (inmersionesCompletadas / totalOperaciones) * 100 
      : 0;

    return {
      totalOperaciones,
      inmersionesCompletadas,
      promedioTiempoInmersion,
      eficienciaOperacional
    };
  }, [inmersiones, operaciones]);

  return { metrics, isLoading };
};
