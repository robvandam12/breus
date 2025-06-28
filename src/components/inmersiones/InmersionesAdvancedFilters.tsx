
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";

interface AdvancedFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  filterOptions: any;
}

export const InmersionesAdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  filterOptions 
}: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (field: string, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      buzo: '',
      supervisor: '',
      salmonera: '',
      centro: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: '',
      profundidadMin: '',
      profundidadMax: ''
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros Avanzados
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} activos
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="buzo">Buzo Principal</Label>
              <Select
                value={filters.buzo}
                onValueChange={(value) => handleFilterChange('buzo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los buzos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los buzos</SelectItem>
                  {filterOptions.buzos?.map((buzo: string) => (
                    <SelectItem key={buzo} value={buzo}>
                      {buzo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor</Label>
              <Select
                value={filters.supervisor}
                onValueChange={(value) => handleFilterChange('supervisor', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los supervisores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los supervisores</SelectItem>
                  {filterOptions.supervisores?.map((supervisor: string) => (
                    <SelectItem key={supervisor} value={supervisor}>
                      {supervisor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={filters.estado}
                onValueChange={(value) => handleFilterChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  {filterOptions.estados?.map((estado: string) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salmonera">Salmonera</Label>
              <Select
                value={filters.salmonera}
                onValueChange={(value) => handleFilterChange('salmonera', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las salmoneras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las salmoneras</SelectItem>
                  {filterOptions.salmoneras?.map((salmonera: string) => (
                    <SelectItem key={salmonera} value={salmonera}>
                      {salmonera}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="centro">Centro</Label>
              <Select
                value={filters.centro}
                onValueChange={(value) => handleFilterChange('centro', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los centros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los centros</SelectItem>
                  {filterOptions.centros?.map((centro: string) => (
                    <SelectItem key={centro} value={centro}>
                      {centro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="fechaDesde">Fecha Desde</Label>
              <Input
                id="fechaDesde"
                type="date"
                value={filters.fechaDesde}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fechaHasta">Fecha Hasta</Label>
              <Input
                id="fechaHasta"
                type="date"
                value={filters.fechaHasta}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="profundidadMin">Profundidad Mín (m)</Label>
              <Input
                id="profundidadMin"
                type="number"
                step="0.1"
                value={filters.profundidadMin}
                onChange={(e) => handleFilterChange('profundidadMin', e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="profundidadMax">Profundidad Máx (m)</Label>
              <Input
                id="profundidadMax"
                type="number"
                step="0.1"
                value={filters.profundidadMax}
                onChange={(e) => handleFilterChange('profundidadMax', e.target.value)}
                placeholder="100"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
