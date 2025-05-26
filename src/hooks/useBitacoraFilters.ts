
import { useState } from 'react';

export interface BitacoraFilters {
  searchTerm: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  status: string;
  firmado: boolean | null;
  tipo: string;
}

export const useBitacoraFilters = () => {
  const [filters, setFilters] = useState<BitacoraFilters>({
    searchTerm: '',
    dateFrom: null,
    dateTo: null,
    status: '',
    firmado: null,
    tipo: ''
  });

  const filterBitacoras = (bitacoras: any[]) => {
    return bitacoras.filter(bitacora => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
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
      if (filters.status) {
        if (filters.status === 'firmado' && !bitacora.firmado) return false;
        if (filters.status === 'pendiente' && bitacora.firmado) return false;
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
    setFilters,
    filterBitacoras
  };
};
