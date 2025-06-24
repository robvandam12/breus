
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Eye, Edit, Trash2, FileText, Calendar, MapPin, Settings } from "lucide-react";
import { useMaintenanceNetworks } from '@/hooks/useMaintenanceNetworks';
import { NetworkMaintenanceWizard } from './NetworkMaintenanceWizard';
import { UniversalConfirmation } from '@/components/ui/universal-confirmation';
import { useUniversalConfirmation } from '@/hooks/useUniversalConfirmation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const NetworkMaintenanceDataTable = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const {
    maintenanceForms,
    isLoading,
    updateMaintenanceForm,
    deleteMaintenanceForm,
    getFormsByType,
  } = useMaintenanceNetworks();

  const {
    isOpen,
    isLoading: isConfirmLoading,
    options,
    showConfirmation,
    handleConfirm,
    handleCancel,
    setIsOpen
  } = useUniversalConfirmation();

  // Filter forms based on search and filters
  const filteredForms = maintenanceForms.filter(form => {
    const matchesSearch = form.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.lugar_trabajo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || form.estado === statusFilter;
    const matchesType = typeFilter === 'all' || form.tipo_formulario === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateNew = () => {
    setSelectedForm(null);
    setViewMode('create');
    setShowCreateForm(true);
  };

  const handleEdit = (form: any) => {
    setSelectedForm(form);
    setViewMode('edit');
    setShowCreateForm(true);
  };

  const handleView = (form: any) => {
    setSelectedForm(form);
    setViewMode('view');
    setShowCreateForm(true);
  };

  const handleDelete = (form: any) => {
    showConfirmation({
      title: "Eliminar Formulario",
      description: `¿Está seguro de que desea eliminar el formulario "${form.codigo}"? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteMaintenanceForm(form.id);
        } catch (error) {
          console.error('Error deleting form:', error);
        }
      }
    });
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'borrador': 'outline',
      'en_revision': 'secondary',
      'completado': 'default',
      'rechazado': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[estado as keyof typeof variants] || 'outline'}>
        {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  const getTipoFormularioLabel = (tipo: string) => {
    return tipo === 'mantencion' ? 'Mantención' : 'Faena de Redes';
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === 'mantencion' ? Settings : FileText;
  };

  const truncateCode = (code: string, maxLength: number = 15) => {
    if (code.length <= maxLength) return code;
    return `${code.substring(0, maxLength)}...`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Gestión de Mantención de Redes
              </CardTitle>
              <CardDescription>
                Administra formularios de mantención preventiva, correctiva y faenas de redes marinas
              </CardDescription>
            </div>
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Formulario
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Formularios</p>
                <p className="text-2xl font-bold">{maintenanceForms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Mantención</p>
                <p className="text-2xl font-bold">{getFormsByType('mantencion').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Faenas</p>
                <p className="text-2xl font-bold">{getFormsByType('faena_redes').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold">
                  {maintenanceForms.filter(f => f.estado === 'completado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por código o lugar de trabajo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="en_revision">En revisión</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="mantencion">Mantención</SelectItem>
                <SelectItem value="faena_redes">Faena de Redes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Formularios de Mantención de Redes</CardTitle>
          <CardDescription>
            {filteredForms.length} formulario(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay formularios
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'No se encontraron formularios con los filtros aplicados'
                  : 'Comienza creando tu primer formulario de mantención de redes'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button onClick={handleCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Formulario
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Código</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Lugar de Trabajo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => {
                    const TipoIcon = getTipoIcon(form.tipo_formulario);
                    return (
                      <TableRow key={form.id}>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <span title={form.codigo}>
                              {truncateCode(form.codigo)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TipoIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {getTipoFormularioLabel(form.tipo_formulario)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {form.fecha ? format(new Date(form.fecha), 'dd/MM/yyyy', { locale: es }) : 'Sin fecha'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{form.lugar_trabajo || 'Sin especificar'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getEstadoBadge(form.estado)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${form.progreso || 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{form.progreso || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(form)}
                              title="Ver formulario"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {form.estado !== 'completado' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(form)}
                                  title="Editar formulario"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(form)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Eliminar formulario"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para crear/editar formulario */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === 'create' && 'Nuevo Formulario de Mantención'}
              {viewMode === 'edit' && 'Editar Formulario'}
              {viewMode === 'view' && 'Ver Formulario'}
            </DialogTitle>
          </DialogHeader>
          <NetworkMaintenanceWizard
            operacionId="temp-operation-id"
            tipoFormulario="mantencion"
            onComplete={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
            editingFormId={viewMode !== 'create' ? selectedForm?.id : undefined}
            readOnly={viewMode === 'view'}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación universal */}
      <UniversalConfirmation
        open={isOpen}
        onOpenChange={setIsOpen}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
        onConfirm={handleConfirm}
        loading={isConfirmLoading}
      />
    </div>
  );
};
