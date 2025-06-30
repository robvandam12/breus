
import { useOperacionesQuery } from "./useOperacionesQuery";
import { useOperacionesMutations } from "./useOperacionesMutations";

export type { 
  OperacionConRelaciones, 
  Operacion
} from "./useOperacionesQuery";

export type { 
  OperacionFormData 
} from "./useOperacionesMutations";

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
