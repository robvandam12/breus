
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface EnterpriseOption {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
  rut?: string;
}

export interface EnterpriseContextState {
  selectedSalmonera: EnterpriseOption | null;
  selectedContratista: EnterpriseOption | null;
  availableSalmoneras: EnterpriseOption[];
  availableContratistas: EnterpriseOption[];
  isLoading: boolean;
  canSelectSalmonera: boolean;
  canSelectContratista: boolean;
  mustSelectBoth: boolean;
}

export interface EnterpriseSelectionResult {
  salmonera_id: string;
  contratista_id: string | null;
  context_metadata: {
    user_role: string;
    selection_mode: 'superuser' | 'salmonera_admin' | 'contratista_admin' | 'inherited';
    empresa_origen_id: string;
    empresa_origen_tipo: 'salmonera' | 'contratista';
  };
}

export const useEnterpriseContext = () => {
  const { profile } = useAuth();
  const [selectedSalmonera, setSelectedSalmonera] = useState<EnterpriseOption | null>(null);
  const [selectedContratista, setSelectedContratista] = useState<EnterpriseOption | null>(null);

  // Obtener salmoneras disponibles
  const { data: salmoneras = [], isLoading: loadingSalmoneras } = useQuery({
    queryKey: ['available-salmoneras', profile?.role],
    queryFn: async () => {
      if (!profile) return [];

      let query = supabase.from('salmoneras').select('id, nombre, rut').eq('estado', 'activa');

      // Si es admin_salmonera, solo mostrar su salmonera
      if (profile.role === 'admin_salmonera' && profile.salmonera_id) {
        query = query.eq('id', profile.salmonera_id);
      }

      const { data, error } = await query.order('nombre');
      if (error) throw error;

      return data.map(s => ({
        id: s.id,
        nombre: s.nombre,
        tipo: 'salmonera' as const,
        rut: s.rut
      }));
    },
    enabled: !!profile
  });

  // Obtener contratistas asociados a la salmonera seleccionada
  const { data: contratistas = [], isLoading: loadingContratistas } = useQuery({
    queryKey: ['associated-contratistas', selectedSalmonera?.id, profile?.role],
    queryFn: async () => {
      if (!profile) return [];

      // Si es admin_servicio, solo mostrar su contratista
      if (profile.role === 'admin_servicio' && profile.servicio_id) {
        const { data, error } = await supabase
          .from('contratistas')
          .select('id, nombre, rut')
          .eq('id', profile.servicio_id)
          .eq('estado', 'activo');

        if (error) throw error;
        return data.map(c => ({
          id: c.id,
          nombre: c.nombre,
          tipo: 'contratista' as const,
          rut: c.rut
        }));
      }

      // Para otros roles, obtener contratistas asociados a la salmonera
      if (!selectedSalmonera?.id) return [];

      const { data, error } = await supabase
        .from('salmonera_contratista')
        .select(`
          contratista_id,
          contratistas!inner(id, nombre, rut, estado)
        `)
        .eq('salmonera_id', selectedSalmonera.id)
        .eq('estado', 'activa')
        .eq('contratistas.estado', 'activo');

      if (error) throw error;

      return data.map(sc => ({
        id: sc.contratistas.id,
        nombre: sc.contratistas.nombre,
        tipo: 'contratista' as const,
        rut: sc.contratistas.rut
      }));
    },
    enabled: !!profile && (!!selectedSalmonera?.id || profile.role === 'admin_servicio')
  });

  // Auto-seleccionar empresas según el rol del usuario
  useEffect(() => {
    if (!profile || loadingSalmoneras) return;

    // Admin salmonera: auto-seleccionar su salmonera
    if (profile.role === 'admin_salmonera' && salmoneras.length === 1) {
      setSelectedSalmonera(salmoneras[0]);
    }

    // Admin servicio: auto-seleccionar su contratista y obtener salmonera asociada
    if (profile.role === 'admin_servicio' && profile.servicio_id && !selectedContratista) {
      // Buscar la salmonera asociada a este contratista
      const loadAssociatedSalmonera = async () => {
        try {
          const { data, error } = await supabase
            .from('salmonera_contratista')
            .select(`
              salmonera_id,
              salmoneras!inner(id, nombre, rut)
            `)
            .eq('contratista_id', profile.servicio_id)
            .eq('estado', 'activa')
            .single();

          if (!error && data) {
            setSelectedSalmonera({
              id: data.salmoneras.id,
              nombre: data.salmoneras.nombre,
              tipo: 'salmonera',
              rut: data.salmoneras.rut
            });
          }
        } catch (error) {
          console.error('Error loading associated salmonera:', error);
        }
      };

      loadAssociatedSalmonera();
    }
  }, [profile, salmoneras, loadingSalmoneras]);

  // Auto-seleccionar contratista para admin_servicio
  useEffect(() => {
    if (profile?.role === 'admin_servicio' && contratistas.length === 1 && !selectedContratista) {
      setSelectedContratista(contratistas[0]);
    }
  }, [profile, contratistas, selectedContratista]);

  const canSelectSalmonera = profile?.role === 'superuser' || profile?.role === 'admin_salmonera';
  const canSelectContratista = profile?.role === 'superuser' || profile?.role === 'admin_salmonera';
  const mustSelectBoth = profile?.role === 'superuser';

  const getSelectionResult = (): EnterpriseSelectionResult | null => {
    if (!selectedSalmonera) return null;

    const baseResult = {
      salmonera_id: selectedSalmonera.id,
      contratista_id: selectedContratista?.id || null,
      context_metadata: {
        user_role: profile?.role || 'unknown',
        empresa_origen_id: '',
        empresa_origen_tipo: 'salmonera' as const
      }
    };

    switch (profile?.role) {
      case 'superuser':
        return {
          ...baseResult,
          context_metadata: {
            ...baseResult.context_metadata,
            selection_mode: 'superuser',
            empresa_origen_id: selectedSalmonera.id,
            empresa_origen_tipo: 'salmonera'
          }
        };

      case 'admin_salmonera':
        return {
          ...baseResult,
          context_metadata: {
            ...baseResult.context_metadata,
            selection_mode: 'salmonera_admin',
            empresa_origen_id: selectedSalmonera.id,
            empresa_origen_tipo: 'salmonera'
          }
        };

      case 'admin_servicio':
        return {
          ...baseResult,
          contratista_id: selectedContratista?.id || profile.servicio_id || null,
          context_metadata: {
            ...baseResult.context_metadata,
            selection_mode: 'contratista_admin',
            empresa_origen_id: selectedContratista?.id || profile.servicio_id || '',
            empresa_origen_tipo: 'contratista'
          }
        };

      default:
        return {
          ...baseResult,
          context_metadata: {
            ...baseResult.context_metadata,
            selection_mode: 'inherited',
            empresa_origen_id: selectedSalmonera.id,
            empresa_origen_tipo: 'salmonera'
          }
        };
    }
  };

  const validateSelection = (): boolean => {
    if (!selectedSalmonera) {
      toast({
        title: "Selección requerida",
        description: "Debe seleccionar una salmonera",
        variant: "destructive"
      });
      return false;
    }

    if (mustSelectBoth && !selectedContratista) {
      toast({
        title: "Selección requerida", 
        description: "Debe seleccionar tanto salmonera como contratista",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const resetSelection = () => {
    setSelectedSalmonera(null);
    setSelectedContratista(null);
  };

  return {
    state: {
      selectedSalmonera,
      selectedContratista,
      availableSalmoneras: salmoneras,
      availableContratistas: contratistas,
      isLoading: loadingSalmoneras || loadingContratistas,
      canSelectSalmonera,
      canSelectContratista,
      mustSelectBoth
    },
    actions: {
      setSelectedSalmonera,
      setSelectedContratista,
      getSelectionResult,
      validateSelection,
      resetSelection
    }
  };
};
