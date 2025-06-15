
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Inmersion } from '@/types/inmersion';
import type { InmersionCompleta } from '@/types/bitacoras';

const getInmersionesCompletas = async (): Promise<InmersionCompleta[]> => {
  const { data, error } = await supabase
    .from('inmersion')
    .select(`
      *,
      operacion:operacion_id(
        id,
        codigo,
        nombre,
        equipo_buceo_id,
        salmoneras:salmonera_id(nombre),
        sitios:sitio_id(nombre),
        contratistas:contratista_id(nombre)
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
