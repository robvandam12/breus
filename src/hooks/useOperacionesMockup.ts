
import { useQuery } from '@tanstack/react-query';
import { getOperacionCompleta } from '@/data/mockup';
import { useMockupMode } from './useMockupMode';

export const useOperacionesMockup = () => {
  const { useMockup } = useMockupMode();

  return useQuery({
    queryKey: ['operaciones-mockup'],
    queryFn: () => {
      if (!useMockup) return [];
      
      const mockupData = getOperacionCompleta();
      
      // Devolver el array de operaciones en el formato esperado
      return [
        {
          ...mockupData.operacion,
          salmoneras: mockupData.operacion.salmoneras,
          sitios: mockupData.operacion.sitios,
          contratistas: mockupData.operacion.contratistas,
          equipos_buceo: {
            id: mockupData.equipoBuceo.id,
            nombre: mockupData.equipoBuceo.nombre,
            miembros: mockupData.equipoBuceo.miembros
          }
        }
      ];
    },
    enabled: useMockup
  });
};
