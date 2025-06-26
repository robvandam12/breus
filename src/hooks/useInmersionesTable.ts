
import { useState, useMemo } from 'react';

export const useInmersionesTable = () => {
  console.log('useInmersionesTable hook called');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewInmersionDialog, setShowNewInmersionDialog] = useState(false);
  const [showPlannedInmersionDialog, setShowPlannedInmersionDialog] = useState(false);

  // Datos de prueba mientras resolvemos el problema
  const testInmersiones = [
    {
      inmersion_id: '1',
      codigo: 'TEST-001',
      fecha_inmersion: '2024-01-15',
      estado: 'completada',
      buzo_principal: 'Juan Pérez',
      supervisor: 'Carlos Silva',
      profundidad_max: 25,
      operacion_id: null,
      is_independent: true,
      objetivo: 'Inspección de estructuras'
    }
  ];

  const filteredInmersiones = useMemo(() => {
    return testInmersiones.filter(inmersion => {
      const matchesSearch = inmersion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inmersion.objetivo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inmersion.estado === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [testInmersiones, searchTerm, statusFilter]);

  const estadisticas = {
    total: testInmersiones.length,
    completadas: testInmersiones.filter(i => i.estado === 'completada').length,
    enProceso: testInmersiones.filter(i => i.estado === 'en_proceso').length,
  };

  const handleCreateDirectInmersion = async (data: any) => {
    console.log('Creating direct inmersion:', data);
    setShowNewInmersionDialog(false);
  };

  const handleCreatePlannedInmersion = async (data: any) => {
    console.log('Creating planned inmersion:', data);
    setShowPlannedInmersionDialog(false);
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
    isLoading: false,
    estadisticas,
    hasPlanning: false,
    handleCreateDirectInmersion,
    handleCreatePlannedInmersion,
  };
};
