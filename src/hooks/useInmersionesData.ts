
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InmersionCompleta } from '@/types/bitacoras';

const getInmersionesCompletas = async (): Promise<InmersionCompleta[]> => {
  const { data, error } = await supabase
    .from('inmersion')
    .select(`
      *,
      operacion:operacion(*,
        salmoneras:salmonera_id(*),
        sitios:sitio_id(*),
        contratistas:contratista_id(*)
      )
    `)
    .order('fecha_inmersion', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as any) || [];
};

export const useInmersionesData = () => {
  const { 
    data: inmersiones = [], 
    isLoading: loadingInmersiones, 
    error: errorInmersiones 
  } = useQuery<InmersionCompleta[]>({
    queryKey: ['inmersionesCompletas'],
    queryFn: getInmersionesCompletas,
  });

  return { inmersiones, loadingInmersiones, errorInmersiones };
};
