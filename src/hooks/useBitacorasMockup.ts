
import { useQuery } from '@tanstack/react-query';
import { getOperacionCompleta } from '@/data/mockup';
import { useMockupMode } from './useMockupMode';

export const useBitacorasMockup = () => {
  const { useMockup } = useMockupMode();

  return useQuery({
    queryKey: ['bitacoras-mockup'],
    queryFn: () => {
      if (!useMockup) return { supervisor: [], buzo: [] };
      
      const mockupData = getOperacionCompleta();
      return {
        supervisor: mockupData.bitacorasSupervisor,
        buzo: mockupData.bitacorasBuzo
      };
    },
    enabled: useMockup
  });
};
