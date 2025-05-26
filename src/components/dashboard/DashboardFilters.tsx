
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, RefreshCw, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardFiltersProps {
  onFiltersChange: (filters: DashboardFilterState) => void;
}

export interface DashboardFilterState {
  fechaInicio: string;
  fechaFin: string;
  salmonera: string;
  contratista: string;
  sitio: string;
  tipoOperacion: string;
  estadoOperacion: string;
  supervisor: string;
  buzo: string;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<DashboardFilterState>({
    fechaInicio: '',
    fechaFin: '',
    salmonera: 'all',
    contratista: 'all',
    sitio: 'all',
    tipoOperacion: 'all',
    estadoOperacion: 'all',
    supervisor: 'all',
    buzo: 'all'
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterChange = (key: keyof DashboardFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: DashboardFilterState = {
      fechaInicio: '',
      fechaFin: '',
      salmonera: 'all',
      contratista: 'all',
      sitio: 'all',
      tipoOperacion: 'all',
      estadoOperacion: 'all',
      supervisor: 'all',
      buzo: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      value !== '' && value !== 'all'
    ).length;
  };

  const getQuickDateFilters = () => [
    { label: 'Hoy', value: 'today' },
    { label: 'Esta semana', value: 'week' },
    { label: 'Este mes', value: 'month' },
    { label: 'Últimos 3 meses', value: '3months' },
    { label: 'Este año', value: 'year' }
  ];

  const setQuickDateFilter = (period: string) => {
    const today = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'today':
        startDate = today;
        break;
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case '3months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
    }
    
    const newFilters = {
      ...filters,
      fechaInicio: startDate.toISOString().split('T')[0],
      fechaFin: today.toISOString().split('T')[0]
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <CardTitle>Filtros del Dashboard</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()} filtros activos</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvancedFilters ? 'Ocultar' : 'Avanzado'}
            </Button>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filtros de Fecha */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium">Período de Tiempo</Label>
          </div>
          
          {/* Quick Date Filters */}
          <div className="flex flex-wrap gap-2">
            {getQuickDateFilters().map((filter) => (
              <Button
                key={filter.value}
                variant="outline"
                size="sm"
                onClick={() => setQuickDateFilter(filter.value)}
                className="text-xs"
              >
                {filter.label}
              </Button>
            ))}
          </div>
          
          {/* Custom Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio" className="text-sm">Fecha Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fecha_fin" className="text-sm">Fecha Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={filters.fechaFin}
                onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="salmonera" className="text-sm">Salmonera</Label>
            <Select value={filters.salmonera} onValueChange={(value) => handleFilterChange('salmonera', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las salmoneras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las salmoneras</SelectItem>
                <SelectItem value="blumar">Blumar S.A.</SelectItem>
                <SelectItem value="otros">Otras salmoneras</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="contratista" className="text-sm">Contratista</Label>
            <Select value={filters.contratista} onValueChange={(value) => handleFilterChange('contratista', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los contratistas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los contratistas</SelectItem>
                <SelectItem value="aerocam">Aerocam Chile Ltda.</SelectItem>
                <SelectItem value="otros">Otros contratistas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="estado_operacion" className="text-sm">Estado Operación</Label>
            <Select value={filters.estadoOperacion} onValueChange={(value) => handleFilterChange('estadoOperacion', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="planificada">Planificada</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros Avanzados */}
        {showAdvancedFilters && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700">Filtros Avanzados</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="sitio" className="text-sm">Sitio</Label>
                <Select value={filters.sitio} onValueChange={(value) => handleFilterChange('sitio', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los sitios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los sitios</SelectItem>
                    <SelectItem value="centro_pa">Centro Punta Arenas</SelectItem>
                    <SelectItem value="barco_austral">Barco Austral</SelectItem>
                    <SelectItem value="centro_chiloe">Centro Chiloé Sur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tipo_operacion" className="text-sm">Tipo Operación</Label>
                <Select value={filters.tipoOperacion} onValueChange={(value) => handleFilterChange('tipoOperacion', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="mantencion">Mantención</SelectItem>
                    <SelectItem value="inspeccion">Inspección</SelectItem>
                    <SelectItem value="reparacion">Reparación</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="renovacion">Renovación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="supervisor" className="text-sm">Supervisor</Label>
                <Select value={filters.supervisor} onValueChange={(value) => handleFilterChange('supervisor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los supervisores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los supervisores</SelectItem>
                    <SelectItem value="pedro_martinez">Pedro Martinez</SelectItem>
                    <SelectItem value="carlos_lopez">Carlos López</SelectItem>
                    <SelectItem value="ana_torres">Ana Torres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="buzo" className="text-sm">Buzo</Label>
                <Select value={filters.buzo} onValueChange={(value) => handleFilterChange('buzo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los buzos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los buzos</SelectItem>
                    <SelectItem value="juan_perez">Juan Pérez</SelectItem>
                    <SelectItem value="diego_torres">Diego Torres</SelectItem>
                    <SelectItem value="luis_gonzalez">Luis González</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Acciones Rápidas */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {getActiveFiltersCount() > 0 
              ? `${getActiveFiltersCount()} filtro(s) aplicado(s)` 
              : 'Sin filtros aplicados'
            }
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
