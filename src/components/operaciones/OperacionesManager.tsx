
import React, { useState, lazy, Suspense, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Building, AlertTriangle, Search, TableIcon, Grid3X3, MapIcon } from "lucide-react";
import { useOperacionesQuery } from '@/hooks/useOperacionesQuery';
import { useEnterpriseValidation } from '@/hooks/useEnterpriseValidation';
import { EnterpriseSelector } from '@/components/common/EnterpriseSelector';
import { CreateOperacionDialog } from './CreateOperacionDialog';
import { useDebounce } from '@/hooks/useDebounce';

// Lazy loading de componentes pesados
const OperacionesDataTable = lazy(() => import('./OperacionesDataTable').then(module => ({ 
  default: module.OperacionesDataTable 
})));

const OperacionCardView = lazy(() => import('./OperacionCardView').then(module => ({ 
  default: module.OperacionCardView 
})));

// Componente de loading para tabs
const TabLoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-4">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const OperacionesManager = React.memo(() => {
  const { profile } = useAuth();
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Usar debounce para búsqueda y filtros
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedStatusFilter = useDebounce(statusFilter, 100);

  const { validation, loading: validationLoading } = useEnterpriseValidation(
    selectedEnterprise?.salmonera_id || selectedEnterprise?.contratista_id,
    selectedEnterprise?.salmonera_id ? 'salmonera' : 'contratista'
  );

  const { data: operaciones = [], isLoading } = useOperacionesQuery();

  // Auto-configurar empresa para usuarios no superuser
  React.useEffect(() => {
    if (profile && profile.role !== 'superuser') {
      const autoEnterprise = {
        salmonera_id: profile.salmonera_id,
        contratista_id: profile.servicio_id,
        context_metadata: {
          selection_mode: profile.salmonera_id ? 'salmonera_admin' : 'contratista_admin',
          empresa_origen_tipo: profile.salmonera_id ? 'salmonera' : 'contratista'
        }
      };
      setSelectedEnterprise(autoEnterprise);
    }
  }, [profile]);

  // Memoizar enterprise change handler
  const handleEnterpriseChange = useCallback((result: any) => {
    setSelectedEnterprise(result);
  }, []);

  // Memoizar create operation handler
  const handleCreateOperation = useCallback(() => {
    if (!validation.canAccessPlanning) {
      return;
    }
    setShowCreateDialog(true);
  }, [validation.canAccessPlanning]);

  // Memoizar operaciones filtradas
  const filteredOperaciones = useMemo(() => {
    console.log('Filtering operaciones:', {
      total: operaciones.length,
      searchTerm: debouncedSearchTerm,
      statusFilter: debouncedStatusFilter
    });

    return operaciones.filter(operacion => {
      const matchesSearch = !debouncedSearchTerm || 
                           operacion.codigo?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           operacion.nombre?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = debouncedStatusFilter === 'all' || operacion.estado === debouncedStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [operaciones, debouncedSearchTerm, debouncedStatusFilter]);

  // Mostrar selector de empresa para superusers
  if (profile?.role === 'superuser' && !selectedEnterprise) {
    return (
      <div className="space-y-4">
        <EnterpriseSelector
          onSelectionChange={handleEnterpriseChange}
          showCard={false}
          title="Seleccionar Empresa para Operaciones"
          description="Seleccione la empresa para gestionar las operaciones"
          autoSubmit={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mostrar empresa seleccionada para superusers */}
      {profile?.role === 'superuser' && selectedEnterprise && (
        <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
          <span>
            Empresa: {selectedEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEnterprise(null)}
            className="text-blue-600 hover:text-blue-800 h-auto p-1"
          >
            Cambiar
          </Button>
        </div>
      )}

      {/* Mostrar validaciones de módulos con más detalle */}
      {validation.validationMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800">Estado de Módulos</h4>
              <p className="text-sm text-amber-700 mt-1">{validation.validationMessage}</p>
              
              {validation.moduleStatus && (
                <div className="mt-3 space-y-1 text-xs">
                  <div className={`px-2 py-1 rounded ${validation.moduleStatus.planning === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    Planning: {validation.moduleStatus.planning === 'active' ? 'Activo' : 'Inactivo'}
                  </div>
                  <div className={`px-2 py-1 rounded ${validation.moduleStatus.maintenance === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    Mantenimiento: {validation.moduleStatus.maintenance === 'active' ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6" />
              <div>
                <CardTitle>Gestión de Operaciones</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Administre las operaciones de buceo y planificación
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {validation.canAccessPlanning && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Planning Activo
                </Badge>
              )}
              
              <Button
                onClick={handleCreateOperation}
                disabled={!validation.canAccessPlanning || validationLoading}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Operación
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!validation.canAccessPlanning ? (
            <div className="text-center py-12 text-gray-500">
              <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Módulo Planning No Disponible</h3>
              <p className="text-sm max-w-md mx-auto">
                {validation.moduleStatus?.planning === 'inactive' 
                  ? 'El módulo de Planning está desactivado para esta empresa. Contacte al administrador del sistema para activarlo.'
                  : 'Esta empresa no tiene el módulo de Planning configurado. Contacte al administrador para obtener acceso.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filtros y búsqueda */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar operaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="pausada">Pausada</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tabs de visualización con lazy loading */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4" />
                    Tabla
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4" />
                    Tarjetas
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    Mapa
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="space-y-4">
                  <Suspense fallback={<TabLoadingSkeleton />}>
                    <OperacionesDataTable
                      operaciones={filteredOperaciones}
                      isLoading={isLoading}
                      enterpriseContext={selectedEnterprise}
                    />
                  </Suspense>
                </TabsContent>

                <TabsContent value="cards" className="space-y-4">
                  <Suspense fallback={<TabLoadingSkeleton />}>
                    <OperacionCardView
                      operaciones={filteredOperaciones}
                      onSelect={(operacion) => console.log('Ver detalle:', operacion)}
                      onEdit={(operacion) => console.log('Editar:', operacion)}
                      onViewDetail={(operacion) => console.log('Ver detalle:', operacion)}
                      onDelete={(operacionId) => console.log('Eliminar:', operacionId)}
                    />
                  </Suspense>
                </TabsContent>

                <TabsContent value="map" className="space-y-4">
                  <div className="min-h-96 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Vista de Mapa</h3>
                      <p className="text-gray-500">
                        La vista de mapa estará disponible próximamente
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear operación */}
      {showCreateDialog && (
        <CreateOperacionDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          enterpriseContext={selectedEnterprise}
        />
      )}
    </div>
  );
});

OperacionesManager.displayName = 'OperacionesManager';
