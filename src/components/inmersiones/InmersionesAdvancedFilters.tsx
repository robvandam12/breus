
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, X, ChevronDown, Calendar, MapPin, User, Anchor } from "lucide-react";
import type { AdvancedInmersionFilters } from "@/hooks/useInmersionesFiltersAdvanced";

interface InmersionesAdvancedFiltersProps {
  filters: AdvancedInmersionFilters;
  updateFilter: (key: keyof AdvancedInmersionFilters, value: any) => void;
  clearFilters: () => void;
  filterOptions: {
    salmoneras: string[];
    sitios: string[];
    supervisores: string[];
    estados: string[];
  };
  hasActiveFilters: boolean;
  totalResults: number;
}

export const InmersionesAdvancedFilters: React.FC<InmersionesAdvancedFiltersProps> = ({
  filters,
  updateFilter,
  clearFilters,
  filterOptions,
  hasActiveFilters,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const removeFilter = (key: keyof AdvancedInmersionFilters, defaultValue: any) => {
    updateFilter(key, defaultValue);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {totalResults} resultados
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda principal */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por código, objetivo, supervisor, operación..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros básicos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={filters.estado} onValueChange={(value) => updateFilter('estado', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {filterOptions.estados.map(estado => (
                <SelectItem key={estado} value={estado}>{estado}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.salmonera} onValueChange={(value) => updateFilter('salmonera', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Salmonera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas las salmoneras</SelectItem>
              {filterOptions.salmoneras.map(salmonera => (
                <SelectItem key={salmonera} value={salmonera}>{salmonera}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.supervisor} onValueChange={(value) => updateFilter('supervisor', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Supervisor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los supervisores</SelectItem>
              {filterOptions.supervisores.map(supervisor => (
                <SelectItem key={supervisor} value={supervisor}>{supervisor}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Filter className="w-4 h-4 mr-2" />
                  Avanzado
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="px-3">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filtros avanzados */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleContent className="space-y-4">
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Sitio</label>
                <Select value={filters.sitio} onValueChange={(value) => updateFilter('sitio', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los sitios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los sitios</SelectItem>
                    {filterOptions.sitios.map(sitio => (
                      <SelectItem key={sitio} value={sitio}>{sitio}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha desde</label>
                <Input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) => updateFilter('fechaDesde', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha hasta</label>
                <Input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) => updateFilter('fechaHasta', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Profundidad mínima (m)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.profundidadMin || ''}
                  onChange={(e) => updateFilter('profundidadMin', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Profundidad máxima (m)</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={filters.profundidadMax || ''}
                  onChange={(e) => updateFilter('profundidadMax', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ordenar por</label>
                <div className="flex gap-2">
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fecha">Fecha</SelectItem>
                      <SelectItem value="codigo">Código</SelectItem>
                      <SelectItem value="profundidad">Profundidad</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Asc</SelectItem>
                      <SelectItem value="desc">Desc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="w-3 h-3" />
                Búsqueda: {filters.searchTerm}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('searchTerm', '')}
                />
              </Badge>
            )}
            {filters.estado !== 'todos' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Anchor className="w-3 h-3" />
                Estado: {filters.estado}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('estado', 'todos')}
                />
              </Badge>
            )}
            {filters.salmonera !== 'todos' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Salmonera: {filters.salmonera}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('salmonera', 'todos')}
                />
              </Badge>
            )}
            {filters.supervisor !== 'todos' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Supervisor: {filters.supervisor}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('supervisor', 'todos')}
                />
              </Badge>
            )}
            {filters.fechaDesde && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Desde: {filters.fechaDesde}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('fechaDesde', '')}
                />
              </Badge>
            )}
            {filters.fechaHasta && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Hasta: {filters.fechaHasta}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter('fechaHasta', '')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
