
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
          miembros: mockupData.equipoBuceo.miembros.map(miembro => {
            const usuario = mockupData.usuarios.find(u => u.usuario_id === miembro.usuario_id);
            return {
              ...miembro,
              usuario: usuario,
              nombre_completo: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario no encontrado',
              email: usuario?.email || 'Sin email',
              matricula: usuario?.perfil_buzo?.matricula || null,
              telefono: null, // No existe en la estructura actual
              rol: miembro.rol_equipo
            };
          })
        }
      ];
    },
    enabled: useMockup
  });
};
