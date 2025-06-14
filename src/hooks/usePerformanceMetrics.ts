
import { useState, useEffect } from 'react';
import { useBitacoraEnhanced } from './useBitacoraEnhanced';
import { useInmersiones } from './useInmersiones';
import { useOperaciones } from './useOperaciones';

export interface PerformanceMetrics {
  eficienciaOperacional: number;
  tiempoPromedioInmersion: number;
  tasaCompletitud: number;
  indiceCalidad: number;
  tendenciaSemanal: {
    periodo: string;
    valor: number;
  }[];
}

export const usePerformanceMetrics = () => {
  const { bitacorasSupervisor, bitacorasBuzo } = useBitacoraEnhanced();
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    eficienciaOperacional: 0,
    tiempoPromedioInmersion: 0,
    tasaCompletitud: 0,
    indiceCalidad: 0,
    tendenciaSemanal: []
  });

  useEffect(() => {
    const calculateMetrics = () => {
      // Calcular eficiencia operacional
      const totalOperaciones = operaciones.length;
      const operacionesCompletadas = operaciones.filter(op => op.estado === 'completada').length;
      const eficienciaOperacional = totalOperaciones > 0 ? (operacionesCompletadas / totalOperaciones) * 100 : 0;

      // Calcular tiempo promedio de inmersión (simulado)
      const inmersionesCompletas = inmersiones.filter(i => i.estado === 'completada');
      const tiempoPromedioInmersion = inmersionesCompletas.length > 0 ? 
        inmersionesCompletas.reduce((acc, _) => acc + (Math.random() * 180 + 120), 0) / inmersionesCompletas.length : 0;

      // Calcular tasa de completitud
      const totalTareas = bitacorasSupervisor.length + bitacorasBuzo.length + inmersiones.length;
      const tareasCompletadas = bitacorasSupervisor.filter(b => b.firmado).length + 
                               bitacorasBuzo.filter(b => b.firmado).length + 
                               inmersiones.filter(i => i.estado === 'completada').length;
      const tasaCompletitud = totalTareas > 0 ? (tareasCompletadas / totalTareas) * 100 : 0;

      // Calcular índice de calidad (basado en validaciones)
      const inmersionesValidadas = inmersiones.filter(i => i.hpt_validado && i.anexo_bravo_validado).length;
      const indiceCalidad = inmersiones.length > 0 ? (inmersionesValidadas / inmersiones.length) * 100 : 0;

      // Generar tendencia semanal (simulada)
      const tendenciaSemanal = Array.from({ length: 7 }, (_, i) => ({
        periodo: `Día ${i + 1}`,
        valor: Math.floor(Math.random() * 30 + 70)
      }));

      setMetrics({
        eficienciaOperacional: Math.round(eficienciaOperacional * 10) / 10,
        tiempoPromedioInmersion: Math.round(tiempoPromedioInmersion),
        tasaCompletitud: Math.round(tasaCompletitud * 10) / 10,
        indiceCalidad: Math.round(indiceCalidad * 10) / 10,
        tendenciaSemanal
      });
    };

    calculateMetrics();
  }, [bitacorasSupervisor, bitacorasBuzo, inmersiones, operaciones]);

  return { metrics };
};
