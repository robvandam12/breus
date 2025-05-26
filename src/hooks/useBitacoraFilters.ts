
import { useState } from 'react';

export interface BitacoraFilters {
  search: string;
  searchTerm: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  estado: 'all' | 'firmada' | 'pendiente';
  firmado: boolean | null;
  tipo: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export const useBitacoraFilters = () => {
  const [filters, setFilters] = useState<BitacoraFilters>({
    search: '',
    searchTerm: '',
    dateFrom: null,
    dateTo: null,
    estado: 'all',
    firmado: null,
    tipo: '',
    fechaDesde: undefined,
    fechaHasta: undefined
  });

  const updateFilters = (newFilters: Partial<BitacoraFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filterBitacoras = (bitacoras: any[]) => {
    return bitacoras.filter(bitacora => {
      // Search term filter
      if (filters.searchTerm || filters.search) {
        const searchTerm = filters.searchTerm || filters.search;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          bitacora.codigo?.toLowerCase().includes(searchLower) ||
          bitacora.supervisor?.toLowerCase().includes(searchLower) ||
          bitacora.buzo?.toLowerCase().includes(searchLower) ||
          bitacora.inmersion_codigo?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Date from filter
      if (filters.dateFrom && bitacora.fecha) {
        const bitacoraDate = new Date(bitacora.fecha);
        if (bitacoraDate < filters.dateFrom) return false;
      }

      // Date to filter
      if (filters.dateTo && bitacora.fecha) {
        const bitacoraDate = new Date(bitacora.fecha);
        if (bitacoraDate > filters.dateTo) return false;
      }

      // Estado filter
      if (filters.estado !== 'all') {
        if (filters.estado === 'firmada' && !bitacora.firmado) return false;
        if (filters.estado === 'pendiente' && bitacora.firmado) return false;
      }

      // Date range filters
      if (filters.fechaDesde && bitacora.fecha) {
        const bitacoraDate = new Date(bitacora.fecha);
        const fromDate = new Date(filters.fechaDesde);
        if (bitacoraDate < fromDate) return false;
      }

      if (filters.fechaHasta && bitacora.fecha) {
        const bitacoraDate = new Date(bitacora.fecha);
        const toDate = new Date(filters.fechaHasta);
        if (bitacoraDate > toDate) return false;
      }

      // Firmado filter
      if (filters.firmado !== null) {
        if (bitacora.firmado !== filters.firmado) return false;
      }

      return true;
    });
  };

  return {
    filters,
    setFilters: updateFilters,
    filterBitacoras
  };
};
