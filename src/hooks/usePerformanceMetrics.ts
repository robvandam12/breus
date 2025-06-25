
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
  tiempoPromedioInmersion: number;
  tasaCompletitud: number;
  indiceCalidad: number;
  tendenciaSemanal: Array<{ periodo: string; valor: number }>;
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

    // Tasa de completitud
    const totalInmersiones = inmersiones?.length || 0;
    const tasaCompletitud = totalInmersiones > 0 
      ? (inmersionesCompletadas / totalInmersiones) * 100 
      : 0;

    // Índice de calidad basado en bitácoras firmadas
    const totalBitacoras = (bitacorasSupervisor?.length || 0) + (bitacorasBuzo?.length || 0);
    const bitacorasFirmadas = (bitacorasSupervisor?.filter(b => b.firmado).length || 0) + 
                             (bitacorasBuzo?.filter(b => b.firmado).length || 0);
    const indiceCalidad = totalBitacoras > 0 
      ? (bitacorasFirmadas / totalBitacoras) * 100 
      : 0;

    // Tendencia semanal (simulada con datos de los últimos 7 días)
    const tendenciaSemanal = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - (6 - i));
      const periodo = fecha.toLocaleDateString('es-CL', { weekday: 'short' });
      
      // Simular valores basados en la eficiencia operacional con variación
      const variacion = (Math.random() - 0.5) * 20;
      const valor = Math.max(0, Math.min(100, eficienciaOperacional + variacion));
      
      return { periodo, valor: Math.round(valor) };
    });

    return {
      totalOperaciones,
      inmersionesCompletadas,
      promedioTiempoInmersion,
      eficienciaOperacional,
      tiempoPromedioInmersion: promedioTiempoInmersion,
      tasaCompletitud,
      indiceCalidad,
      tendenciaSemanal
    };
  }, [inmersiones, operaciones, bitacorasSupervisor, bitacorasBuzo]);

  return { metrics, isLoading };
};
