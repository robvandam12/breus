
import { useState } from 'react';
import { useInmersionesContextual } from '@/hooks/useInmersionesContextual';
import { useModuleAccess } from '@/hooks/useModuleAccess';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useOperaciones } from '@/hooks/useOperaciones';
import { toast } from '@/hooks/use-toast';

export const useInmersionesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewInmersionDialog, setShowNewInmersionDialog] = useState(false);
  const [showPlannedInmersionDialog, setShowPlannedInmersionDialog] = useState(false);
  
  const { 
    inmersiones, 
    isLoading, 
    estadisticas, 
    capacidades,
    operationalContext 
  } = useInmersionesContextual();
  
  const { canPlanOperations } = useModuleAccess();
  const { createInmersion } = useInmersiones();
  const { operaciones } = useOperaciones();

  // Filtrar inmersiones
  const filteredInmersiones = inmersiones.filter(inmersion => {
    const matchesSearch = inmersion.objetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.observaciones?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inmersion.estado === statusFilter;
    
    const matchesType = typeFilter === 'all' || 
                       (typeFilter === 'planned' && inmersion.operacion_id && !inmersion.is_independent) ||
                       (typeFilter === 'independent' && (!inmersion.operacion_id || inmersion.is_independent));
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Obtener información contextual
  const getContextInfo = () => {
    const hasPlanning = canPlanOperations;
    const canCreateDirect = capacidades.puedeCrearInmersionesDirectas;

    if (hasPlanning && canCreateDirect) {
      return {
        type: 'mixed',
        message: 'Puedes crear inmersiones planificadas (con operación) o independientes',
        variant: 'default' as const
      };
    } else if (hasPlanning && !canCreateDirect) {
      return {
        type: 'planned-only',
        message: 'Solo puedes crear inmersiones asociadas a operaciones planificadas',
        variant: 'default' as const
      };
    } else if (!hasPlanning && canCreateDirect) {
      return {
        type: 'direct-only',
        message: 'Inmersiones directas disponibles. El módulo de planificación no está activo',
        variant: 'default' as const
      };
    } else {
      return {
        type: 'restricted',
        message: 'Funcionalidad de inmersiones limitada. Contacta a tu administrador',
        variant: 'destructive' as const
      };
    }
  };

  // Tabs disponibles según módulos activos
  const getAvailableTabs = () => {
    const tabs = [];
    
    // Tab "Todas" siempre disponible
    tabs.push({ id: 'all', label: 'Todas', count: estadisticas.total });
    
    // Tab "Independientes" siempre disponible (core functionality)
    tabs.push({ 
      id: 'independent', 
      label: 'Independientes', 
      count: estadisticas.independientes 
    });
    
    // Tab "Planificadas" solo si tiene módulo de planificación
    if (canPlanOperations) {
      tabs.push({ 
        id: 'planned', 
        label: 'Planificadas', 
        count: estadisticas.planificadas 
      });
    }
    
    return tabs;
  };

  // Handlers para creación de inmersiones
  const handleCreateDirectInmersion = async (data: any) => {
    try {
      const inmersionData = {
        ...data,
        is_independent: true,
        operacion_id: null,
      };
      
      await createInmersion(inmersionData);
      toast({
        title: "Inmersión creada",
        description: "La inmersión independiente ha sido creada exitosamente.",
      });
      setShowNewInmersionDialog(false);
    } catch (error) {
      console.error('Error creating direct inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión independiente.",
        variant: "destructive",
      });
    }
  };

  const handleCreatePlannedInmersion = async (data: any) => {
    try {
      const inmersionData = {
        ...data,
        is_independent: false,
      };
      
      await createInmersion(inmersionData);
      toast({
        title: "Inmersión creada",
        description: "La inmersión planificada ha sido creada exitosamente.",
      });
      setShowPlannedInmersionDialog(false);
    } catch (error) {
      console.error('Error creating planned inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión planificada.",
        variant: "destructive",
      });
    }
  };

  return {
    // State
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
    
    // Data
    inmersiones,
    filteredInmersiones,
    isLoading,
    estadisticas,
    capacidades,
    operationalContext,
    
    // Computed
    contextInfo: getContextInfo(),
    availableTabs: getAvailableTabs(),
    hasPlanning: canPlanOperations,
    
    // Handlers
    handleCreateDirectInmersion,
    handleCreatePlannedInmersion,
  };
};
