
import { useMemo } from 'react';
import type { Inmersion } from '@/hooks/useInmersiones';

export interface FilterState {
  buzo: string;
  supervisor: string;
  salmonera: string;
  centro: string;
  estado: string;
  fechaDesde: string;
  fechaHasta: string;
  profundidadMin: string;
  profundidadMax: string;
}

export const useInmersionesFiltersAdvanced = (inmersiones: Inmersion[], filters: FilterState) => {
  return useMemo(() => {
    return inmersiones.filter(inmersion => {
      // Filtro por buzo principal
      if (filters.buzo && !inmersion.buzo_principal?.toLowerCase().includes(filters.buzo.toLowerCase())) {
        return false;
      }

      // Filtro por supervisor
      if (filters.supervisor && !inmersion.supervisor?.toLowerCase().includes(filters.supervisor.toLowerCase())) {
        return false;
      }

      // Filtro por salmonera
      if (filters.salmonera) {
        const salmoneraNombre = inmersion.operacion?.salmoneras?.nombre || '';
        if (!salmoneraNombre.toLowerCase().includes(filters.salmonera.toLowerCase())) {
          return false;
        }
      }

      // Filtro por centro
      if (filters.centro) {
        const centroNombre = inmersion.operacion?.centros?.nombre || '';
        if (!centroNombre.toLowerCase().includes(filters.centro.toLowerCase())) {
          return false;
        }
      }

      // Filtro por estado
      if (filters.estado && inmersion.estado !== filters.estado) {
        return false;
      }

      // Filtro por fecha desde
      if (filters.fechaDesde) {
        const fechaInmersion = new Date(inmersion.fecha_inmersion);
        const fechaDesde = new Date(filters.fechaDesde);
        if (fechaInmersion < fechaDesde) {
          return false;
        }
      }

      // Filtro por fecha hasta
      if (filters.fechaHasta) {
        const fechaInmersion = new Date(inmersion.fecha_inmersion);
        const fechaHasta = new Date(filters.fechaHasta);
        if (fechaInmersion > fechaHasta) {
          return false;
        }
      }

      // Filtro por profundidad mínima
      if (filters.profundidadMin) {
        const profundidadMin = parseFloat(filters.profundidadMin);
        const profundidadInmersion = inmersion.profundidad_max || 0;
        if (profundidadInmersion < profundidadMin) {
          return false;
        }
      }

      // Filtro por profundidad máxima
      if (filters.profundidadMax) {
        const profundidadMax = parseFloat(filters.profundidadMax);
        const profundidadInmersion = inmersion.profundidad_max || 0;
        if (profundidadInmersion > profundidadMax) {
          return false;
        }
      }

      return true;
    });
  }, [inmersiones, filters]);
};

// Función para obtener opciones únicas para los filtros
export const useFilterOptions = (inmersiones: Inmersion[]) => {
  return useMemo(() => {
    const buzos = new Set<string>();
    const supervisores = new Set<string>();
    const salmoneras = new Set<string>();
    const centros = new Set<string>();
    const estados = new Set<string>();

    inmersiones.forEach(inmersion => {
      if (inmersion.buzo_principal) buzos.add(inmersion.buzo_principal);
      if (inmersion.supervisor) supervisores.add(inmersion.supervisor);
      if (inmersion.operacion?.salmoneras?.nombre) salmoneras.add(inmersion.operacion.salmoneras.nombre);
      if (inmersion.operacion?.centros?.nombre) centros.add(inmersion.operacion.centros.nombre);
      if (inmersion.estado) estados.add(inmersion.estado);
    });

    return {
      buzos: Array.from(buzos).sort(),
      supervisores: Array.from(supervisores).sort(),
      salmoneras: Array.from(salmoneras).sort(),
      centros: Array.from(centros).sort(),
      estados: Array.from(estados).sort(),
    };
  }, [inmersiones]);
};
