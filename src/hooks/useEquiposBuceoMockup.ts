
import { useQuery } from '@tanstack/react-query';
import { getOperacionCompleta } from '@/data/mockup';
import { useMockupMode } from './useMockupMode';

export const useEquiposBuceoMockup = () => {
  const { useMockup } = useMockupMode();

  return useQuery({
    queryKey: ['equipos-buceo-mockup'],
    queryFn: () => {
      if (!useMockup) return [];
      
      const mockupData = getOperacionCompleta();
      
      // Devolver el equipo de buceo con usuarios completos
      return [
        {
          ...mockupData.equipoBuceo,
          miembros: mockupData.equipoBuceo.miembros.map(miembro => ({
            ...miembro,
            usuario: mockupData.usuarios.find(u => u.usuario_id === miembro.usuario_id),
            nombre_completo: `${miembro.usuario?.nombre} ${miembro.usuario?.apellido}`,
            email: miembro.usuario?.email,
            matricula: miembro.usuario?.perfil_buzo?.matricula,
            telefono: miembro.usuario?.telefono || null,
            rol: miembro.rol_equipo
          }))
        }
      ];
    },
    enabled: useMockup
  });
};
