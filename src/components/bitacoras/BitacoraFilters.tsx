
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Search } from "lucide-react";
import { BitacoraFilters as IBitacoraFilters } from "@/hooks/useBitacoraFilters";

interface BitacoraFiltersProps {
  onFiltersChange: (filters: Partial<IBitacoraFilters>) => void;
  activeFilters: IBitacoraFilters;
}

export const BitacoraFilters = ({ onFiltersChange, activeFilters }: BitacoraFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof IBitacoraFilters, value: string) => {
    onFiltersChange({
      ...activeFilters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      estado: 'all',
      fechaDesde: '',
      fechaHasta: '',
    });
    setShowAdvanced(false);
  };

  const hasActiveFilters = activeFilters.searchTerm || 
    activeFilters.estado !== 'all' || 
    activeFilters.fechaDesde || 
    activeFilters.fechaHasta;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por código, supervisor o buzo..."
            value={activeFilters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={activeFilters.estado} onValueChange={(value) => updateFilter('estado', value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="firmada">Firmadas</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Limpiar
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha desde</label>
            <Input
              type="date"
              value={activeFilters.fechaDesde || ''}
              onChange={(e) => updateFilter('fechaDesde', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha hasta</label>
            <Input
              type="date"
              value={activeFilters.fechaHasta || ''}
              onChange={(e) => updateFilter('fechaHasta', e.target.value)}
            />
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Búsqueda: {activeFilters.searchTerm}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('searchTerm', '')}
              />
            </Badge>
          )}
          {activeFilters.estado !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Estado: {activeFilters.estado}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('estado', 'all')}
              />
            </Badge>
          )}
          {activeFilters.fechaDesde && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Desde: {activeFilters.fechaDesde}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('fechaDesde', '')}
              />
            </Badge>
          )}
          {activeFilters.fechaHasta && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Hasta: {activeFilters.fechaHasta}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('fechaHasta', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
