
import { useState, useMemo } from 'react';

export interface BitacoraFilters {
  searchTerm: string;
  estado: 'all' | 'firmada' | 'pendiente';
  fechaDesde: string;
  fechaHasta: string;
}

const ITEMS_PER_PAGE = 10;

export const useBitacoraFilters = (initialData: any[]) => {
  const [filters, setFilters] = useState<BitacoraFilters>({
    searchTerm: '',
    estado: 'all',
    fechaDesde: '',
    fechaHasta: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  const updateFilters = (newFilters: Partial<BitacoraFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    if (!initialData) return [];
    return initialData.filter(bitacora => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          bitacora.codigo?.toLowerCase().includes(searchLower) ||
          bitacora.supervisor?.toLowerCase().includes(searchLower) ||
          bitacora.buzo?.toLowerCase().includes(searchLower) ||
          (bitacora.inmersion_codigo && bitacora.inmersion_codigo.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }
      
      // Estado filter
      if (filters.estado !== 'all') {
        const isFirmada = bitacora.firmado === true || bitacora.estado === 'firmado' || bitacora.estado_aprobacion === 'aprobada';
        if (filters.estado === 'firmada' && !isFirmada) return false;
        if (filters.estado === 'pendiente' && isFirmada) return false;
      }

      // Date range filters
      if (filters.fechaDesde && bitacora.fecha) {
        const bitacoraDate = new Date(bitacora.fecha + 'T00:00:00');
        const fromDate = new Date(filters.fechaDesde + 'T00:00:00');
        if (bitacoraDate < fromDate) return false;
      }

      if (filters.fechaHasta && bitacora.fecha) {
        const bitacoraDate = new Date(bitacora.fecha + 'T00:00:00');
        const toDate = new Date(filters.fechaHasta + 'T00:00:00');
        if (bitacoraDate > toDate) return false;
      }

      return true;
    });
  }, [initialData, filters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);


  return {
    filters,
    setFilters: updateFilters,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    totalItems: filteredData.length,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};
