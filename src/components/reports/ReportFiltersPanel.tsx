
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Filter, RefreshCw } from "lucide-react";

interface ReportFiltersPanelProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export const ReportFiltersPanel = ({ filters, onFiltersChange }: ReportFiltersPanelProps) => {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateRange: { from: new Date(), to: new Date() },
      tipo: 'todos',
      sitio: 'todos'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Reporte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rango de fechas */}
            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <DatePicker
                date={filters.dateRange?.from}
                onSelect={(date) => handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  from: date
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Fecha de fin</Label>
              <DatePicker
                date={filters.dateRange?.to}
                onSelect={(date) => handleFilterChange('dateRange', {
                  ...filters.dateRange,
                  to: date
                })}
              />
            </div>

            {/* Tipo de operación */}
            <div className="space-y-2">
              <Label>Tipo de Operación</Label>
              <Select 
                value={filters.tipo} 
                onValueChange={(value) => handleFilterChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="mantencion">Mantención</SelectItem>
                  <SelectItem value="inspeccion">Inspección</SelectItem>
                  <SelectItem value="reparacion">Reparación</SelectItem>
                  <SelectItem value="emergencia">Emergencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sitio */}
            <div className="space-y-2">
              <Label>Sitio</Label>
              <Select 
                value={filters.sitio} 
                onValueChange={(value) => handleFilterChange('sitio', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sitio..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los sitios</SelectItem>
                  <SelectItem value="alpha">Sitio Alpha</SelectItem>
                  <SelectItem value="beta">Sitio Beta</SelectItem>
                  <SelectItem value="gamma">Sitio Gamma</SelectItem>
                  <SelectItem value="delta">Sitio Delta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contratista */}
            <div className="space-y-2">
              <Label>Contratista</Label>
              <Select 
                value={filters.contratista || 'todos'} 
                onValueChange={(value) => handleFilterChange('contratista', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los contratistas</SelectItem>
                  <SelectItem value="aquatech">AquaTech Diving</SelectItem>
                  <SelectItem value="marine">Marine Services Ltd</SelectItem>
                  <SelectItem value="deepsea">Deep Sea Solutions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select 
                value={filters.estado || 'todos'} 
                onValueChange={(value) => handleFilterChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
                  <SelectItem value="en_curso">En Curso</SelectItem>
                  <SelectItem value="planificada">Planificadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <Button onClick={resetFilters} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Resetear Filtros
            </Button>
            <div className="text-sm text-gray-500">
              Filtros aplicados se reflejarán automáticamente en los reportes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de filtros aplicados */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Filtros Aplicados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Período:</span>
              <p className="text-gray-600">
                {filters.dateRange?.from?.toLocaleDateString()} - {filters.dateRange?.to?.toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Tipo:</span>
              <p className="text-gray-600 capitalize">{filters.tipo}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Sitio:</span>
              <p className="text-gray-600 capitalize">{filters.sitio}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Estado:</span>
              <p className="text-gray-600 capitalize">{filters.estado || 'todos'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
