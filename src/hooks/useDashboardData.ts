
import { useState, useEffect } from 'react';
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

export interface KPIData {
  title: string;
  value: string;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  description?: string;
  icon?: React.ReactNode;
}

export interface ActivityData {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

export interface ChartData {
  date: string;
  inmersiones: number;
  completadas: number;
}

export const useDashboardData = () => {
  const { bitacorasSupervisor } = useBitacorasSupervisor();
  const { bitacorasBuzo } = useBitacorasBuzo();
  const { inmersiones } = useInmersionesData();
  const { operaciones } = useOperaciones();
  const { alertasNoLeidas } = useAlertas();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalBitacoras: 0,
    bitacorasFirmadas: 0,
    inmersionesHoy: 0,
    operacionesActivas: 0,
    alertasActivas: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const totalBitacoras = bitacorasSupervisor.length + bitacorasBuzo.length;
    const bitacorasFirmadas = bitacorasSupervisor.filter(b => b.firmado).length + 
                             bitacorasBuzo.filter(b => b.firmado).length;
    
    const inmersionesHoy = inmersiones.filter(i => i.fecha_inmersion === today).length;
    const operacionesActivas = operaciones.filter(o => o.estado === 'activa').length;

    setStats({
      totalBitacoras,
      bitacorasFirmadas,
      inmersionesHoy,
      operacionesActivas,
      alertasActivas: alertasNoLeidas.length
    });

    setIsLoading(false);
  }, [bitacorasSupervisor, bitacorasBuzo, inmersiones, operaciones, alertasNoLeidas]);

  // Generate KPI data
  const kpis: KPIData[] = [
    {
      title: "Bitácoras Totales",
      value: stats.totalBitacoras.toString(),
      change: { 
        value: `${stats.bitacorasFirmadas}/${stats.totalBitacoras}`, 
        type: "neutral" as const 
      },
      description: "Firmadas/Total",
    },
    {
      title: "Inmersiones Hoy",
      value: stats.inmersionesHoy.toString(),
      change: { value: "+25%", type: "positive" as const },
      description: "Respecto a ayer",
    },
    {
      title: "Operaciones Activas",
      value: stats.operacionesActivas.toString(),
      change: { value: "100%", type: "positive" as const },
      description: "En progreso",
    },
    {
      title: "Alertas Activas",
      value: stats.alertasActivas.toString(),
      change: { 
        value: stats.alertasActivas > 0 ? "-1" : "0", 
        type: stats.alertasActivas > 0 ? "positive" as const : "neutral" as const 
      },
      description: "Requieren atención",
    },
  ];

  // Generate mock activities data
  const activities: ActivityData[] = [
    {
      id: '1',
      type: 'hpt',
      description: 'HPT firmado para Operación Centro Norte',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2', 
      type: 'inmersion',
      description: 'Nueva inmersión registrada',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'active'
    },
    {
      id: '3',
      type: 'bitacora',
      description: 'Bitácora supervisor completada',
      timestamp: '2024-01-15T08:45:00Z',
      status: 'completed'
    }
  ];

  // Generate mock chart data
  const chartData: ChartData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      inmersiones: Math.floor(Math.random() * 10) + 1,
      completadas: Math.floor(Math.random() * 8) + 1
    };
  });

  const upcomingOperations = operaciones
    .filter(op => op.estado === 'activa')
    .slice(0, 3)
    .map(op => ({
      id: parseInt(op.id.slice(-3)),
      name: op.nombre,
      date: op.fecha_inicio,
      supervisor: "Supervisor Asignado",
      status: 'en_progreso',
      divers: Math.floor(Math.random() * 5) + 2
    }));

  return {
    stats,
    kpis,
    activities,
    operations: upcomingOperations,
    chartData,
    isLoading
  };
};
