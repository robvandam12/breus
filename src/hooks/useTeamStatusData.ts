
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useUsuarios } from './useUsuarios';

export const useTeamStatusData = (options?: { includeInactive?: boolean; includeSuspended?: boolean }) => {
    const { profile, isRole, loading: authLoading } = useAuth();
    const { usuarios, isLoading: usersLoading } = useUsuarios();

    const teamMembers = useMemo(() => {
        if (!isRole('supervisor') || !profile?.servicio_id || !usuarios) {
            return [];
        }
        
        return usuarios
            .filter(u => u.servicio_id === profile.servicio_id && u.rol === 'buzo')
            .filter(u => {
                if (u.estado_buzo === 'activo') return true;
                if (options?.includeInactive && u.estado_buzo === 'inactivo') return true;
                if (options?.includeSuspended && u.estado_buzo === 'suspendido') return true;
                // Show divers with unknown status as well, unless filtered. For now we show them.
                if (!u.estado_buzo) return true; 
                return false;
            });
        
    }, [profile, isRole, usuarios, options]);

    return {
        teamMembers,
        isLoading: authLoading || usersLoading,
    };
};
