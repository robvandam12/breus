
import { useMemo } from 'react';
import { useOperaciones } from './useOperaciones';

export const useDashboardData = () => {
  const { operaciones, isLoading } = useOperaciones();

  const upcomingOperations = useMemo(() => {
    if (!operaciones) return [];
    return operaciones
      .filter(op => op.estado === 'activa')
      .slice(0, 3)
      .map(op => ({
        id: parseInt(op.id.slice(-3), 16) % 1000,
        name: op.nombre,
        date: op.fecha_inicio,
        supervisor: "Supervisor Asignado",
        status: 'en_progreso' as const,
        divers: Math.floor(Math.random() * 5) + 2
      }));
  }, [operaciones]);

  return {
    operations: upcomingOperations,
    isLoading
  };
};
