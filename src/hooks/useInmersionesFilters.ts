
import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { BuzoInmersion } from '@/types/inmersion';

export const useInmersionesFilters = (inmersiones: BuzoInmersion[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterMes, setFilterMes] = useState('todos');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredInmersiones = useMemo(() => {
    let filtered = inmersiones;

    // Filtrar por búsqueda
    if (debouncedSearchTerm) {
      const lowercasedTerm = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(inmersion =>
        inmersion.codigo.toLowerCase().includes(lowercasedTerm) ||
        inmersion.objetivo.toLowerCase().includes(lowercasedTerm) ||
        inmersion.operacionNombre.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Filtrar por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(inmersion => inmersion.estado === filterEstado);
    }

    // Filtrar por mes
    if (filterMes !== 'todos') {
      const targetMonth = parseInt(filterMes, 10);
      filtered = filtered.filter(inmersion => {
        const inmersionDate = new Date(inmersion.fecha_inmersion);
        return inmersionDate.getMonth() === targetMonth;
      });
    }

    return filtered;
  }, [inmersiones, debouncedSearchTerm, filterEstado, filterMes]);

  return {
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    filterMes,
    setFilterMes,
    filteredInmersiones,
  };
};
