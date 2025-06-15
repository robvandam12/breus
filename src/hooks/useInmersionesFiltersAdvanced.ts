
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { Inmersion } from '@/types/inmersion';

export interface AdvancedInmersionFilters {
  searchTerm: string;
  estado: string;
  salmonera: string;
  sitio: string;
  supervisor: string;
  fechaDesde: string;
  fechaHasta: string;
  profundidadMin: number | null;
  profundidadMax: number | null;
  sortBy: 'fecha' | 'codigo' | 'profundidad' | 'supervisor';
  sortOrder: 'asc' | 'desc';
}

export const useInmersionesFiltersAdvanced = (inmersiones: Inmersion[]) => {
  const [filters, setFilters] = useState<AdvancedInmersionFilters>({
    searchTerm: '',
    estado: 'todos',
    salmonera: 'todos',
    sitio: 'todos',
    supervisor: 'todos',
    fechaDesde: '',
    fechaHasta: '',
    profundidadMin: null,
    profundidadMax: null,
    sortBy: 'fecha',
    sortOrder: 'desc',
  });

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

  // Obtener opciones únicas para los filtros
  const filterOptions = useMemo(() => {
    const salmoneras = [...new Set(inmersiones.map(i => i.operacion?.salmoneras?.nombre).filter(Boolean))];
    const sitios = [...new Set(inmersiones.map(i => i.operacion?.sitios?.nombre).filter(Boolean))];
    const supervisores = [...new Set(inmersiones.map(i => i.supervisor).filter(Boolean))];
    const estados = [...new Set(inmersiones.map(i => i.estado))];

    return { salmoneras, sitios, supervisores, estados };
  }, [inmersiones]);

  const filteredAndSortedInmersiones = useMemo(() => {
    let filtered = inmersiones;

    // Búsqueda por texto
    if (debouncedSearchTerm) {
      const lowercasedTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(inmersion =>
        inmersion.codigo.toLowerCase().includes(lowercasedTerm) ||
        inmersion.objetivo.toLowerCase().includes(lowercasedTerm) ||
        inmersion.supervisor.toLowerCase().includes(lowercasedTerm) ||
        inmersion.operacion?.nombre?.toLowerCase().includes(lowercasedTerm) ||
        inmersion.operacion?.salmoneras?.nombre?.toLowerCase().includes(lowercasedTerm) ||
        inmersion.operacion?.sitios?.nombre?.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Filtros específicos
    if (filters.estado !== 'todos') {
      filtered = filtered.filter(i => i.estado === filters.estado);
    }

    if (filters.salmonera !== 'todos') {
      filtered = filtered.filter(i => i.operacion?.salmoneras?.nombre === filters.salmonera);
    }

    if (filters.sitio !== 'todos') {
      filtered = filtered.filter(i => i.operacion?.sitios?.nombre === filters.sitio);
    }

    if (filters.supervisor !== 'todos') {
      filtered = filtered.filter(i => i.supervisor === filters.supervisor);
    }

    // Filtros de fecha
    if (filters.fechaDesde) {
      filtered = filtered.filter(i => i.fecha_inmersion >= filters.fechaDesde);
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter(i => i.fecha_inmersion <= filters.fechaHasta);
    }

    // Filtros de profundidad
    if (filters.profundidadMin !== null) {
      filtered = filtered.filter(i => i.profundidad_max >= filters.profundidadMin);
    }

    if (filters.profundidadMax !== null) {
      filtered = filtered.filter(i => i.profundidad_max <= filters.profundidadMax);
    }

    // Ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'fecha':
          aValue = new Date(a.fecha_inmersion);
          bValue = new Date(b.fecha_inmersion);
          break;
        case 'codigo':
          aValue = a.codigo;
          bValue = b.codigo;
          break;
        case 'profundidad':
          aValue = a.profundidad_max;
          bValue = b.profundidad_max;
          break;
        case 'supervisor':
          aValue = a.supervisor;
          bValue = b.supervisor;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [inmersiones, debouncedSearchTerm, filters]);

  const updateFilter = (key: keyof AdvancedInmersionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      estado: 'todos',
      salmonera: 'todos',
      sitio: 'todos',
      supervisor: 'todos',
      fechaDesde: '',
      fechaHasta: '',
      profundidadMin: null,
      profundidadMax: null,
      sortBy: 'fecha',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = 
    filters.searchTerm || 
    filters.estado !== 'todos' ||
    filters.salmonera !== 'todos' ||
    filters.sitio !== 'todos' ||
    filters.supervisor !== 'todos' ||
    filters.fechaDesde ||
    filters.fechaHasta ||
    filters.profundidadMin !== null ||
    filters.profundidadMax !== null;

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredAndSortedInmersiones,
    filterOptions,
    hasActiveFilters,
  };
};
