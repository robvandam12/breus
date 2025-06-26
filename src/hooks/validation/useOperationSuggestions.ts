
import { supabase } from '@/integrations/supabase/client';

export const useOperationSuggestions = () => {
  const getOperationSuggestions = async (query: string): Promise<string[]> => {
    if (query.length < 2) return [];

    try {
      const { data: operations } = await supabase
        .from('operacion')
        .select('codigo, nombre')
        .eq('estado', 'activa')
        .ilike('codigo', `%${query}%`)
        .limit(5);

      return operations?.map(op => `${op.codigo} - ${op.nombre}`) || [];
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  };

  return { getOperationSuggestions };
};
