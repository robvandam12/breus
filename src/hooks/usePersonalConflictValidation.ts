
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PersonalConflict {
  user_id: string;
  inmersion_code: string;
  inmersion_date: string;
  inmersion_id: string;
  conflict_type: 'same_day' | 'overlapping_time';
}

export const usePersonalConflictValidation = (targetDate?: string) => {
  const { data: conflicts = [], isLoading } = useQuery({
    queryKey: ['personal-conflicts', targetDate],
    queryFn: async () => {
      if (!targetDate) return [];

      // Obtener todas las inmersiones de la fecha objetivo
      const { data: inmersiones, error } = await supabase
        .from('inmersion')
        .select(`
          inmersion_id,
          codigo,
          fecha_inmersion,
          hora_inicio,
          hora_fin,
          inmersion_team_members!inner (
            user_id,
            role,
            is_emergency
          )
        `)
        .eq('fecha_inmersion', targetDate)
        .in('estado', ['planificada', 'en_progreso']);

      if (error) throw error;

      const conflicts: PersonalConflict[] = [];
      
      inmersiones?.forEach(inmersion => {
        inmersion.inmersion_team_members?.forEach(member => {
          if (!member.is_emergency) {
            conflicts.push({
              user_id: member.user_id,
              inmersion_code: inmersion.codigo,
              inmersion_date: inmersion.fecha_inmersion,
              inmersion_id: inmersion.inmersion_id,
              conflict_type: 'same_day'
            });
          }
        });
      });

      return conflicts;
    },
    enabled: !!targetDate,
  });

  const checkUserConflict = (userId: string): PersonalConflict | null => {
    return conflicts.find(conflict => conflict.user_id === userId) || null;
  };

  const getAvailablePersonal = async (date: string, role: 'buzo' | 'supervisor') => {
    const { data: allPersonal } = await supabase
      .from('usuario')
      .select('usuario_id, nombre, apellido, email, rol, estado_buzo')
      .eq('estado_buzo', 'activo')
      .in('rol', role === 'supervisor' ? ['supervisor', 'admin_servicio'] : ['buzo']);

    if (!allPersonal) return [];

    const conflictedUsers = conflicts.map(c => c.user_id);
    
    return allPersonal.map(person => ({
      ...person,
      isAvailable: !conflictedUsers.includes(person.usuario_id),
      conflict: checkUserConflict(person.usuario_id)
    }));
  };

  return {
    conflicts,
    isLoading,
    checkUserConflict,
    getAvailablePersonal
  };
};
