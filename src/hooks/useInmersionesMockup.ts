
import { useQuery } from '@tanstack/react-query';
import { getOperacionCompleta } from '@/data/mockup';
import { useMockupMode } from './useMockupMode';

export const useInmersionesMockup = () => {
  const { useMockup } = useMockupMode();

  return useQuery({
    queryKey: ['inmersiones-mockup'],
    queryFn: () => {
      if (!useMockup) return [];
      
      const mockupData = getOperacionCompleta();
      return mockupData.inmersiones;
    },
    enabled: useMockup
  });
};
