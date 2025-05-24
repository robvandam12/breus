
import { useState, useEffect } from 'react';
import { useBitacoras } from './useBitacoras';
import { useInmersiones } from './useInmersiones';
import { useOperaciones } from './useOperaciones';
import { useAlertas } from './useAlertas';

export interface DashboardStats {
  totalBitacoras: number;
  bitacorasFirmadas: number;
  inmersionesHoy: number;
  operacionesActivas: number;
  alertasActivas: number;
}

export const useDashboardData = () => {
  const { bitacorasSupervisor, bitacorasBuzo } = useBitacoras();
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  const { alertasNoLeidas } = useAlertas();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalBitacoras: 0,
    bitacorasFirmadas: 0,
    inmersionesHoy: 0,
    operacionesActivas: 0,
    alertasActivas: 0
  });

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
  }, [bitacorasSupervisor, bitacorasBuzo, inmersiones, operaciones, alertasNoLeidas]);

  const upcomingOperations = operaciones
    .filter(op => op.estado === 'activa')
    .slice(0, 3)
    .map(op => ({
      id: parseInt(op.id.slice(-3)),
      name: op.nombre,
      date: op.fecha_inicio,
      supervisor: "Supervisor Asignado",
      status: 'en_progreso',
      divers: Math.floor(Math.random() * 5) + 2 // Random for demo
    }));

  return {
    stats,
    upcomingOperations
  };
};
