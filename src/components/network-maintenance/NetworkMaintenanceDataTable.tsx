import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Search, 
  Download,
  FileText,
  Calendar,
  Building,
  Users
} from "lucide-react";
import { NetworkMaintenanceWizard } from "./NetworkMaintenanceWizard";
import { useNetworkMaintenance } from "@/hooks/useNetworkMaintenance";
import { toast } from "@/hooks/use-toast";

export const NetworkMaintenanceDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState<'mantencion' | 'faena_redes'>('mantencion');
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedForm, setSelectedForm] = useState<any>(null);

  const { 
    networkMaintenanceForms, 
    loading, 
    createNetworkMaintenance, 
    updateNetworkMaintenance,
    completeNetworkMaintenance,
    deleteNetworkMaintenance,
    refetch 
  } = useNetworkMaintenance();

  const handleCreateForm = (type: 'mantencion' | 'faena_redes') => {
    setSelectedFormType(type);
    setDialogMode('create');
    setSelectedForm(null);
    setShowDialog(true);
  };

  const handleEditForm = (form: any) => {
    setSelectedForm(form);
    setSelectedFormType(form.tipo_formulario);
    setDialogMode('edit');
    setShowDialog(true);
  };

  const handleViewForm = (form: any) => {
    setSelectedForm(form);
    setSelectedFormType(form.tipo_formulario);
    setDialogMode('view');
    setShowDialog(true);
  };

  const handleDeleteForm = async (formId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este formulario?')) {
      try {
        await deleteNetworkMaintenance(formId);
        await refetch();
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  const handleFormComplete = async (formData: any) => {
    try {
      if (dialogMode === 'create') {
        await createNetworkMaintenance({
          ...formData,
          codigo: `MANT-${Date.now()}`,
          tipo_formulario: selectedFormType,
          multix_data: formData,
          estado: 'borrador',
          progreso: 0,
          firmado: false,
          user_id: 'current-user-id', // This should come from auth
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } else if (dialogMode === 'edit' && selectedForm) {
        await updateNetworkMaintenance(selectedForm.id, {
          multix_data: formData,
          updated_at: new Date().toISOString()
        });
      }
      
      setShowDialog(false);
      await refetch();
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedForm(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completado':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completado</Badge>;
      case 'en_progreso':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
      case 'borrador':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Borrador</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'mantencion':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Mantención</Badge>;
      case 'faena_redes':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Faena</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const filteredData = networkMaintenanceForms.filter(form => {
    const matchesSearch = form.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.lugar_trabajo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.estado === statusFilter;
    const matchesTipo = tipoFilter === 'all' || form.tipo_formulario === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  return (
    <div className="space-y-6">
      {/* Header with statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Formularios</p>
                <p className="text-2xl font-bold">{networkMaintenanceForms.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mantenimientos</p>
                <p className="text-2xl font-bold">
                  {networkMaintenanceForms.filter(f => f.tipo_formulario === 'mantencion').length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faenas</p>
                <p className="text-2xl font-bold">
                  {networkMaintenanceForms.filter(f => f.tipo_formulario === 'faena_redes').length}
                </p>
              </div>
              <Network className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold">
                  {networkMaintenanceForms.filter(f => f.estado === 'completado').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Formularios de Mantención de Redes
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => handleCreateForm('mantencion')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Mantención
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => handleCreateForm('faena_redes')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Faena
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por código o lugar de trabajo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de formulario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="mantencion">Mantención</SelectItem>
                <SelectItem value="faena_redes">Faena</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data display */}
          {loading ? (
            <div className="text-center py-8">Cargando formularios...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay formularios registrados
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((form) => (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{form.codigo}</h3>
                      {getStatusBadge(form.estado)}
                    </div>
                    <p className="text-sm text-gray-600">{form.lugar_trabajo}</p>
                    <p className="text-sm text-gray-500">{new Date(form.fecha).toLocaleDateString('es-CL')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewForm(form)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditForm(form)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteForm(form.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for form wizard */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' && 'Crear Formulario'}
              {dialogMode === 'edit' && 'Editar Formulario'}
              {dialogMode === 'view' && 'Ver Formulario'}
            </DialogTitle>
          </DialogHeader>
          <NetworkMaintenanceWizard
            operationId={selectedForm?.operacion_id || 'temp-operation-id'}
            tipoFormulario={selectedFormType}
            onComplete={handleFormComplete}
            onCancel={handleCloseDialog}
            readOnly={dialogMode === 'view'}
            initialData={selectedForm?.multix_data}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
