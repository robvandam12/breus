import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { OperacionConRelaciones } from '@/hooks/useOperaciones';

export const useOperacionesFilters = (operaciones: OperacionConRelaciones[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredOperaciones = useMemo(() => {
    if (!operaciones) return [];
    return operaciones.filter(op => {
      const matchesSearch = op.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           op.codigo.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || op.estado === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [operaciones, debouncedSearchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredOperaciones,
  };
};
