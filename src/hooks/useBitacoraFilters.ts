
import { useState, useMemo } from 'react';
import { BitacoraSupervisorItem, BitacoraBuzoItem } from '@/hooks/useBitacoras';

export interface BitacoraFilters {
  search: string;
  estado: 'all' | 'firmada' | 'pendiente';
  fechaDesde?: string;
  fechaHasta?: string;
}

export const useBitacoraFilters = () => {
  const [filters, setFilters] = useState<BitacoraFilters>({
    search: '',
    estado: 'all'
  });

  const filterBitacoras = useMemo(() => {
    return <T extends BitacoraSupervisorItem | BitacoraBuzoItem>(bitacoras: T[]): T[] => {
      return bitacoras.filter((bitacora) => {
        // Filtro de búsqueda
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const searchableText = [
            bitacora.codigo,
            bitacora.inmersion_codigo,
            'supervisor' in bitacora ? bitacora.supervisor : bitacora.buzo
          ].join(' ').toLowerCase();
          
          if (!searchableText.includes(searchTerm)) {
            return false;
          }
        }

        // Filtro de estado
        if (filters.estado !== 'all') {
          const estadoFirmado = filters.estado === 'firmada';
          if (bitacora.firmado !== estadoFirmado) {
            return false;
          }
        }

        // Filtro de fecha desde
        if (filters.fechaDesde) {
          if (bitacora.fecha < filters.fechaDesde) {
            return false;
          }
        }

        // Filtro de fecha hasta
        if (filters.fechaHasta) {
          if (bitacora.fecha > filters.fechaHasta) {
            return false;
          }
        }

        return true;
      });
    };
  }, [filters]);

  return {
    filters,
    setFilters,
    filterBitacoras
  };
};
