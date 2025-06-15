
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacorasBuzo } from '@/hooks/useBitacorasBuzo';
import { useOperaciones } from '@/hooks/useOperaciones';

export const useBuzoStats = () => {
  const { profile } = useAuth();
  const { inmersiones, isLoading: isLoadingInmersiones } = useInmersiones();
  const { bitacorasBuzo, isLoading: isLoadingBitacoras } = useBitacorasBuzo();
  const { operaciones, isLoading: isLoadingOperaciones } = useOperaciones();

  const [stats, setStats] = useState({
    totalOperaciones: 0,
    bitacorasPendientes: 0,
    bitacorasCompletadas: 0,
    inmersionesMes: 0
  });
  
  const isLoading = isLoadingInmersiones || isLoadingBitacoras || isLoadingOperaciones;

  useEffect(() => {
    if (isLoading || !profile?.nombre || !profile?.apellido) return;
    
    const buzoFullName = `${profile.nombre} ${profile.apellido}`;

    const buzoBitacoras = bitacorasBuzo.filter(b => b.buzo === buzoFullName);
    const buzoInmersiones = inmersiones.filter(i => 
      i.buzo_principal === buzoFullName ||
      i.buzo_asistente === buzoFullName
    );
    
    const buzoOperaciones = operaciones.filter(op => 
      buzoInmersiones.some(inm => inm.operacion_id === op.id)
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const inmersionesMes = buzoInmersiones.filter(inm => {
      if (!inm.fecha_inmersion) return false;
      const inmDate = new Date(inm.fecha_inmersion);
      return inmDate.getMonth() === currentMonth && inmDate.getFullYear() === currentYear;
    }).length;

    setStats({
      totalOperaciones: buzoOperaciones.length,
      bitacorasPendientes: buzoBitacoras.filter(b => !b.firmado).length,
      bitacorasCompletadas: buzoBitacoras.filter(b => b.firmado).length,
      inmersionesMes
    });
  }, [inmersiones, bitacorasBuzo, operaciones, profile, isLoading]);

  return { stats, isLoading };
};
