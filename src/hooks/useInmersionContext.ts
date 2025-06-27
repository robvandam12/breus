
import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CompanyOption {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
}

export interface OperationOption {
  id: string;
  codigo: string;
  nombre: string;
}

export const useInmersionContext = () => {
  const { profile } = useAuth();

  // Obtener salmoneras disponibles
  const { data: salmoneras = [] } = useQuery({
    queryKey: ['salmoneras-for-inmersion'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa')
        .order('nombre');
      
      if (error) throw error;
      return data.map(s => ({ ...s, tipo: 'salmonera' as const }));
    }
  });

  // Obtener contratistas para una salmonera específica
  const getContratistasForSalmonera = async (salmoneraId: string) => {
    const { data, error } = await supabase
      .from('salmonera_contratista')
      .select(`
        contratistas:contratista_id (
          id,
          nombre
        )
      `)
      .eq('salmonera_id', salmoneraId)
      .eq('estado', 'activa');

    if (error) throw error;
    return data
      .filter(item => item.contratistas)
      .map(item => ({
        id: item.contratistas!.id,
        nombre: item.contratistas!.nombre,
        tipo: 'contratista' as const
      }));
  };

  // Obtener operaciones para una salmonera y contratista específicos
  const getOperationsForContext = async (salmoneraId: string, contratistaId?: string) => {
    let query = supabase
      .from('operacion')
      .select('id, codigo, nombre')
      .eq('salmonera_id', salmoneraId)
      .eq('estado', 'activa')
      .order('fecha_inicio', { ascending: false });

    if (contratistaId) {
      query = query.eq('contratista_id', contratistaId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  };

  // Determinar el contexto según el rol del usuario
  const getContextForUser = () => {
    if (!profile) return null;

    const isSuperuser = profile.rol === 'superuser';
    const isSalmonera = profile.rol === 'admin_salmonera' && profile.salmonera_id;
    const isContratista = profile.rol === 'admin_servicio' && profile.servicio_id;

    return {
      isSuperuser,
      isSalmonera,
      isContratista,
      userSalmoneraId: profile.salmonera_id,
      userContratistaId: profile.servicio_id,
      canSelectSalmonera: isSuperuser,
      canSelectContratista: isSuperuser || isSalmonera,
      preSelectedSalmonera: isSalmonera ? profile.salmonera_id : null,
      preSelectedContratista: isContratista ? profile.servicio_id : null
    };
  };

  return {
    salmoneras,
    getContratistasForSalmonera,
    getOperationsForContext,
    getContextForUser
  };
};
