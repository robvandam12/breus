
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useUsuarios } from './useUsuarios';

export const useTeamStatusData = () => {
    const { profile, isRole, loading: authLoading } = useAuth();
    const { usuarios, isLoading: usersLoading } = useUsuarios();

    const teamMembers = useMemo(() => {
        if (!isRole('supervisor') || !profile?.servicio_id || !usuarios) {
            return [];
        }
        
        // NOTE: This is a simplified logic. It returns all divers from the same service company.
        // For a more precise team view, a direct link between supervisors and teams/divers would be needed.
        return usuarios.filter(u => u.servicio_id === profile.servicio_id && u.rol === 'buzo');
        
    }, [profile, isRole, usuarios]);

    return {
        teamMembers,
        isLoading: authLoading || usersLoading,
    };
};
