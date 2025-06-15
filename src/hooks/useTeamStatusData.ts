
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { useUsuarios } from './useUsuarios';

export const useTeamStatusData = () => {
    const { profile, isRole, isLoading: authLoading } = useAuth();
    const { users, isLoading: usersLoading } = useUsuarios();

    const teamMembers = useMemo(() => {
        if (!isRole('supervisor') || !profile?.servicio_id || !users) {
            return [];
        }
        
        // NOTE: This is a simplified logic. It returns all divers from the same service company.
        // For a more precise team view, a direct link between supervisors and teams/divers would be needed.
        return users.filter(u => u.servicio_id === profile.servicio_id && u.rol === 'buzo');
        
    }, [profile, isRole, users]);

    return {
        teamMembers,
        isLoading: authLoading || usersLoading,
    };
};
