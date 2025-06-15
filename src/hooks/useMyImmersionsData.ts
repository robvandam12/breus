
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useInmersiones } from './useInmersiones';
import { useBitacorasBuzo } from './useBitacorasBuzo';

export const useMyImmersionsData = () => {
  const { profile, isLoading: authLoading } = useAuth();
  const { inmersiones, isLoading: inmersionesLoading } = useInmersiones();
  const { bitacorasBuzo, isLoading: bitacorasLoading } = useBitacorasBuzo();

  const fullName = useMemo(() => profile ? `${profile.nombre} ${profile.apellido}` : '', [profile]);

  const myImmersions = useMemo(() => {
    if (!profile || !inmersiones) return [];
    return inmersiones.filter(i => 
        i.buzo_principal_id === profile.id || 
        i.buzo_asistente_id === profile.id ||
        // Fallback for older data that might not have the ID
        i.buzo_principal === fullName ||
        i.buzo_asistente === fullName
    ).sort((a, b) => new Date(b.fecha_inmersion).getTime() - new Date(a.fecha_inmersion).getTime());
  }, [inmersiones, profile, fullName]);

  const pendingBitacorasCount = useMemo(() => {
    if (!profile || !bitacorasBuzo) return 0;
    // NOTE: This will be more reliable once user_id is added to bitacora_buzo table
    return bitacorasBuzo.filter(b => b.buzo === fullName && !b.firmado).length;
  }, [bitacorasBuzo, profile, fullName]);
  
  const upcomingImmersions = useMemo(() => {
      return myImmersions.filter(i => i.estado === 'planificada' && new Date(i.fecha_inmersion) >= new Date())
  }, [myImmersions]);


  return {
    myImmersions,
    last5Immersions: myImmersions.slice(0, 5),
    pendingBitacorasCount,
    upcomingImmersions: upcomingImmersions.slice(0, 3),
    isLoading: authLoading || inmersionesLoading || bitacorasLoading,
  };
};
