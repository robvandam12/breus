
import { useBitacorasSupervisorQuery, getBitacoraSupervisorById, hasExistingBitacora } from "./useBitacorasSupervisorQuery";
import { useBitacorasSupervisorMutations } from "./useBitacorasSupervisorMutations";

export type { BitacoraSupervisorFormData } from "./useBitacorasSupervisorMutations";

export const useBitacorasSupervisor = () => {
  const { data: bitacorasSupervisor = [], isLoading: loadingSupervisor, refetch: refetchSupervisor } = useBitacorasSupervisorQuery();
  const mutations = useBitacorasSupervisorMutations();

  return {
    bitacorasSupervisor,
    loadingSupervisor,
    refetchSupervisor,
    getBitacoraSupervisorById: (bitacoraId: string) => getBitacoraSupervisorById(bitacorasSupervisor, bitacoraId),
    hasExistingBitacora: (inmersionId: string) => hasExistingBitacora(bitacorasSupervisor, inmersionId),
    ...mutations,
  };
};
