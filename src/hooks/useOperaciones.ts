
import { useOperacionesQuery } from "./useOperacionesQuery";
import { useOperacionesMutations } from "./useOperacionesMutations";

export type { 
  BasicOperacion, 
  OperacionConRelaciones, 
  Operacion,
  OperacionFormData 
} from "./useOperacionesQuery";

export const useOperaciones = () => {
  const { data: operaciones = [], isLoading, refetch } = useOperacionesQuery();
  const mutations = useOperacionesMutations();

  return {
    operaciones,
    isLoading,
    refetch,
    ...mutations,
  };
};
