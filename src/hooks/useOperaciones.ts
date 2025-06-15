
import { useOperacionesQuery, Operacion, OperacionConRelaciones, OperacionFormData } from './useOperacionesQuery';
import { useOperacionesMutations } from './useOperacionesMutations';

export type { Operacion, OperacionConRelaciones, OperacionFormData };

export const useOperaciones = () => {
  const { operaciones, isLoading, refetch } = useOperacionesQuery();
  const mutations = useOperacionesMutations();

  return {
    operaciones,
    isLoading,
    refetch,
    ...mutations,
  };
};
