
import { useMemo } from 'react';
import { useUsuarios } from './useUsuarios';

export const useTeamStatusData = () => {
  const { usuarios, isLoading } = useUsuarios();

  const teamStats = useMemo(() => {
    if (!usuarios || usuarios.length === 0) {
      return {
        totalBuzos: 0,
        buzosActivos: 0,
        buzosDisponibles: 0,
        supervisores: 0,
        adminsSalmonera: 0,
        totalPersonal: 0
      };
    }

    const buzos = usuarios.filter(usuario => usuario.rol === 'buzo');
    const supervisores = usuarios.filter(usuario => usuario.rol === 'supervisor');
    const adminsSalmonera = usuarios.filter(usuario => usuario.rol === 'admin_salmonera');
    
    return {
      totalBuzos: buzos.length,
      buzosActivos: buzos.filter(buzo => buzo.estado_buzo === 'activo').length,
      buzosDisponibles: buzos.filter(buzo => buzo.estado_buzo === 'disponible').length,
      supervisores: supervisores.length,
      adminsSalmonera: adminsSalmonera.length,
      totalPersonal: usuarios.length
    };
  }, [usuarios]);

  return {
    teamStats,
    isLoading,
    usuarios
  };
};
