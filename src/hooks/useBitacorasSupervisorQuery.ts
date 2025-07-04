import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BitacoraSupervisorCompleta } from '@/types/bitacoras';

const getBitacorasSupervisor = async (): Promise<BitacoraSupervisorCompleta[]> => {
  const { data, error } = await supabase
    .from('bitacora_supervisor')
    .select(`
      *,
      inmersion:inmersion_id(*,
        operacion:operacion_id(*,
          salmoneras:salmonera_id(nombre),
          sitios:sitio_id(nombre),
          contratistas:contratista_id(nombre)
        )
      )
    `)
    .order('fecha', { ascending: false });

  if (error) throw new Error(error.message);
  
  const mappedData = data?.map(item => ({
    ...item,
    inmersiones_buzos: Array.isArray(item.inmersiones_buzos) ? item.inmersiones_buzos : [],
    equipos_utilizados: Array.isArray(item.equipos_utilizados) ? item.equipos_utilizados : [],
    diving_records: Array.isArray(item.diving_records) ? item.diving_records : [],
  })) || [];

  return mappedData as unknown as BitacoraSupervisorCompleta[];
};

export const useBitacorasSupervisorQuery = () => {
  return useQuery<BitacoraSupervisorCompleta[]>({
    queryKey: ['bitacorasSupervisor'],
    queryFn: getBitacorasSupervisor,
  });
};

// Helper functions
export const getBitacoraSupervisorById = (bitacoras: BitacoraSupervisorCompleta[], bitacoraId: string) => {
  return bitacoras.find(b => b.bitacora_id === bitacoraId);
};

export const hasExistingBitacora = (bitacoras: BitacoraSupervisorCompleta[], inmersionId: string) => {
  return bitacoras.some(b => b.inmersion_id === inmersionId);
};