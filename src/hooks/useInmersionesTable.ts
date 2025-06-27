
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InmersionData {
  inmersion_id: string;
  codigo: string;
  estado: string;
  fecha_inmersion: string;
  objetivo: string;
  buzo_principal: string;
  supervisor: string;
  profundidad_max: number;
  is_independent: boolean;
  operacion_id: string | null;
  external_operation_code?: string;
}

export const useInmersionesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewInmersionDialog, setShowNewInmersionDialog] = useState(false);

  const { data: inmersiones = [], isLoading } = useQuery({
    queryKey: ['inmersiones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion')
        .select(`
          *,
          operacion:operacion_id (
            codigo,
            nombre
          )
        `)
        .order('fecha_inmersion', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const filteredInmersiones = useMemo(() => {
    return inmersiones.filter((inmersion) => {
      const matchesSearch = !searchTerm || 
        inmersion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inmersion.objetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inmersion.observaciones?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || inmersion.estado === statusFilter;

      const matchesType = typeFilter === 'all' || 
        (typeFilter === 'independent' && (inmersion.is_independent || !inmersion.operacion_id)) ||
        (typeFilter === 'planned' && !inmersion.is_independent && inmersion.operacion_id);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [inmersiones, searchTerm, statusFilter, typeFilter]);

  const estadisticas = useMemo(() => {
    return {
      total: inmersiones.length,
      completadas: inmersiones.filter(i => i.estado === 'completada').length,
      enProceso: inmersiones.filter(i => i.estado === 'en_proceso').length,
    };
  }, [inmersiones]);

  const handleCreateDirectInmersion = async (data: any) => {
    try {
      const { error } = await supabase
        .from('inmersion')
        .insert([{
          ...data,
          estado: 'planificada',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setShowNewInmersionDialog(false);
      toast({
        title: "Éxito",
        description: "Inmersión creada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al crear la inmersión",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    showNewInmersionDialog,
    setShowNewInmersionDialog,
    filteredInmersiones,
    isLoading,
    estadisticas,
    handleCreateDirectInmersion,
  };
};
