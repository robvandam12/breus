
import { useState } from 'react';

export interface BitacoraFilters {
  searchTerm: string;
  search: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  status: string;
  estado: string;
  firmado: boolean | null;
  tipo: string;
}

export const useBitacoraFilters = () => {
  const [filters, setFilters] = useState<BitacoraFilters>({
    searchTerm: '',
    search: '',
    dateFrom: null,
    dateTo: null,
    status: '',
    estado: '',
    firmado: null,
    tipo: ''
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

      // Status filter
      if (filters.status || filters.estado) {
        const status = filters.status || filters.estado;
        if (status === 'firmado' && !bitacora.firmado) return false;
        if (status === 'pendiente' && bitacora.firmado) return false;
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
