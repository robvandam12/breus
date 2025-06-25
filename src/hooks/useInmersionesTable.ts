
import { useState, useMemo } from 'react';
import { useInmersionesContextual } from '@/hooks/useInmersionesContextual';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useCompanyContext } from '@/hooks/useCompanyContext';
import { toast } from '@/hooks/use-toast';

export const useInmersionesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewInmersionDialog, setShowNewInmersionDialog] = useState(false);
  const [showPlannedInmersionDialog, setShowPlannedInmersionDialog] = useState(false);

  // Use contextual hooks
  const { 
    inmersiones, 
    isLoading: isLoadingContextual,
    canCreateDirectImmersion,
    canCreatePlannedOperations,
    capacidades,
    hasPlanning
  } = useInmersionesContextual();

  const { createInmersion } = useInmersiones();
  const { context } = useCompanyContext();

  // Filter inmersions based on search and filters
  const filteredInmersiones = useMemo(() => {
    if (!inmersiones) return [];

    return inmersiones.filter(inmersion => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        inmersion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inmersion.objetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inmersion.buzo_principal?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || inmersion.estado === statusFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || 
        (typeFilter === 'planned' && inmersion.operacion_id) ||
        (typeFilter === 'independent' && (!inmersion.operacion_id || inmersion.is_independent));

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [inmersiones, searchTerm, statusFilter, typeFilter]);

  // Calculate statistics
  const estadisticas = useMemo(() => {
    if (!inmersiones) {
      return {
        total: 0,
        planificadas: 0,
        en_proceso: 0,
        completadas: 0,
        independientes: 0
      };
    }

    return {
      total: inmersiones.length,
      planificadas: inmersiones.filter(i => i.estado === 'planificada').length,
      en_proceso: inmersiones.filter(i => i.estado === 'en_progreso' || i.estado === 'en_proceso').length,
      completadas: inmersiones.filter(i => i.estado === 'completada').length,
      independientes: inmersiones.filter(i => !i.operacion_id || i.is_independent).length
    };
  }, [inmersiones]);

  // Context info
  const contextInfo = useMemo(() => {
    if (!context.selectedCompany) {
      return {
        empresa: context.isSuperuser ? 'Ninguna empresa seleccionada' : 'Sin empresa asignada',
        tipo: null,
        modulos: []
      };
    }

    return {
      empresa: context.selectedCompany.nombre,
      tipo: context.selectedCompany.tipo,
      modulos: context.selectedCompany.modulos
    };
  }, [context]);

  const handleCreateDirectInmersion = async (data: any) => {
    try {
      if (!context.selectedCompany) {
        toast({
          title: "Error",
          description: "Debe seleccionar una empresa antes de crear una inmersión",
          variant: "destructive",
        });
        return;
      }

      await createInmersion({
        ...data,
        is_independent: true,
        contexto_operativo: 'independiente',
        company_id: context.selectedCompany.id,
        company_type: context.selectedCompany.tipo
      });
      
      setShowNewInmersionDialog(false);
      toast({
        title: "Inmersión creada",
        description: "La inmersión independiente ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating direct immersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión independiente.",
        variant: "destructive",
      });
    }
  };

  const handleCreatePlannedInmersion = async (data: any) => {
    try {
      if (!context.selectedCompany) {
        toast({
          title: "Error",
          description: "Debe seleccionar una empresa antes de crear una inmersión",
          variant: "destructive",
        });
        return;
      }

      await createInmersion({
        ...data,
        company_id: context.selectedCompany.id,
        company_type: context.selectedCompany.tipo
      });
      
      setShowPlannedInmersionDialog(false);
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating planned immersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
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
    showPlannedInmersionDialog,
    setShowPlannedInmersionDialog,
    filteredInmersiones,
    isLoading: isLoadingContextual,
    estadisticas,
    capacidades,
    contextInfo,
    hasPlanning,
    handleCreateDirectInmersion,
    handleCreatePlannedInmersion,
  };
};
