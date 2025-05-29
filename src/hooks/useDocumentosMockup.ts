
import { useQuery } from '@tanstack/react-query';
import { getOperacionCompleta } from '@/data/mockup';
import { useMockupMode } from './useMockupMode';

export const useDocumentosMockup = () => {
  const { useMockup } = useMockupMode();

  return useQuery({
    queryKey: ['documentos-mockup'],
    queryFn: () => {
      if (!useMockup) return { hpt: [], anexoBravo: [] };
      
      const mockupData = getOperacionCompleta();
      return {
        hpt: [mockupData.hpt],
        anexoBravo: [mockupData.anexoBravo]
      };
    },
    enabled: useMockup
  });
};
