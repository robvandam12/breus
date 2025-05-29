
import { useOperacionesMockup } from './useOperacionesMockup';
import { useEquiposBuceoMockup } from './useEquiposBuceoMockup';
import { useInmersionesMockup } from './useInmersionesMockup';
import { useBitacorasMockup } from './useBitacorasMockup';
import { useDocumentosMockup } from './useDocumentosMockup';
import { useMockupMode } from './useMockupMode';

export const useMockupData = () => {
  const { useMockup } = useMockupMode();
  
  const operacionesQuery = useOperacionesMockup();
  const equiposQuery = useEquiposBuceoMockup();
  const inmersionesQuery = useInmersionesMockup();
  const bitacorasQuery = useBitacorasMockup();
  const documentosQuery = useDocumentosMockup();

  const isLoading = operacionesQuery.isLoading || 
                   equiposQuery.isLoading || 
                   inmersionesQuery.isLoading || 
                   bitacorasQuery.isLoading || 
                   documentosQuery.isLoading;

  return {
    useMockup,
    isLoading,
    operaciones: operacionesQuery.data || [],
    equipos: equiposQuery.data || [],
    inmersiones: inmersionesQuery.data || [],
    bitacorasSupervisor: bitacorasQuery.data?.supervisor || [],
    bitacorasBuzo: bitacorasQuery.data?.buzo || [],
    hpt: documentosQuery.data?.hpt || [],
    anexoBravo: documentosQuery.data?.anexoBravo || []
  };
};
