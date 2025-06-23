
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Network, 
  Plus, 
  Settings, 
  FileText, 
  Activity,
  Eye,
  Edit,
  Download,
  Search,
  Building,
  Users,
  Calendar,
  Clock
} from "lucide-react";
import { useMaintenanceNetworks } from "@/hooks/useMaintenanceNetworks";
import { NetworkMaintenanceWizard } from "@/components/network-maintenance/NetworkMaintenanceWizard";
import { NetworkMaintenanceList } from "@/components/network-maintenance/NetworkMaintenanceList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Mock data para formularios de mantención
const mockMaintenanceData = [
  {
    id: "mant-001",
    numero: "MANT-2024-001",
    tipo: "mantencion",
    operacion: "Mantención Preventiva Centro 15",
    salmonera: "AquaChile",
    sitio: "Centro 15",
    fecha: "2024-01-15",
    supervisor: "Juan Pérez",
    estado: "completado",
    buzos: 4,
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "faena-001",
    numero: "FAENA-2024-001",
    tipo: "faena_redes",
    operacion: "Faena Redes Centro 8",
    salmonera: "Salmones Camanchaca",
    sitio: "Centro 8",
    fecha: "2024-01-20",
    supervisor: "María González",
    estado: "en_progreso",
    buzos: 6,
    created_at: "2024-01-12T14:30:00Z"
  },
  {
    id: "mant-002",
    numero: "MANT-2024-002",
    tipo: "mantencion",
    operacion: "Mantención Correctiva Centro 22",
    salmonera: "Multiexport Foods",
    sitio: "Centro 22",
    fecha: "2024-01-25",
    supervisor: "Carlos Rodríguez",
    estado: "borrador",
    buzos: 3,
    created_at: "2024-01-14T09:15:00Z"
  }
];

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

export const NetworkMaintenanceManager = () => {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>('');
  const [editingFormId, setEditingFormId] = useState<string>('');
  const [selectedFormType, setSelectedFormType] = useState<'mantencion' | 'faena_redes'>('mantencion');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [showDialog, setShowDialog] = useState(false);

  const { canAccessModule, maintenanceForms = mockMaintenanceData, isLoading } = useMaintenanceNetworks();

  const filteredData = mockMaintenanceData.filter(form => {
    const matchesSearch = form.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.operacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.salmonera.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.estado === statusFilter;
    const matchesTipo = tipoFilter === 'all' || form.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  if (!canAccessModule) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Network className="w-16 h-16 mx-auto mb-6 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Módulo de Mantención de Redes</h3>
            <p className="text-gray-600 mb-4">
              Este módulo no está disponible para tu organización
            </p>
            <p className="text-sm text-gray-500">
              Contacta al administrador para solicitar acceso a este módulo
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCreateForm = (type: 'mantencion' | 'faena_redes') => {
    setSelectedFormType(type);
    setEditingFormId('');
    setShowDialog(true);
  };

  const handleEditForm = (formId: string, formData: any) => {
    setEditingFormId(formId);
    setSelectedInmersionId(formData.inmersion_id);
    setSelectedFormType(formData.form_type);
    setShowDialog(true);
  };

  const handleViewForm = (formId: string, formData: any) => {
    console.log('View form:', formId, formData);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingFormId('');
    setSelectedInmersionId('');
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Formularios</p>
                <p className="text-2xl font-bold">{mockMaintenanceData.length}</p>
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
                  {mockMaintenanceData.filter(f => f.tipo === 'mantencion').length}
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
                  {mockMaintenanceData.filter(f => f.tipo === 'faena_redes').length}
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
                  {mockMaintenanceData.filter(f => f.estado === 'completado').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles principales */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Mantención de Redes
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
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por número, operación o salmonera..."
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

          {/* Tabla de datos */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Número</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Operación</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Salmonera</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Sitio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Supervisor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Buzos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((form) => (
                  <tr key={form.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-blue-600">{form.numero}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getTipoBadge(form.tipo)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-48 truncate">{form.operacion}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {form.salmonera}
                      </div>
                    </td>
                    <td className="py-3 px-4">{form.sitio}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(form.fecha).toLocaleDateString('es-CL')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {form.supervisor}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{form.buzos}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(form.estado)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewForm(form.id, form)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditForm(form.id, form)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron formularios que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Network className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Módulo de Mantención de Redes
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Mantenimientos:</strong> Registra trabajos de mantenimiento preventivo y correctivo</p>
                <p>• <strong>Faenas:</strong> Documenta operaciones específicas en redes de cultivo</p>
                <p>• <strong>Formularios operativos:</strong> Captura datos para análisis y reportes</p>
                <p>• <strong>Trazabilidad completa:</strong> Seguimiento desde planificación hasta ejecución</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para formularios */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFormId ? 'Editar Formulario' : `Nuevo Formulario de ${selectedFormType === 'mantencion' ? 'Mantención' : 'Faena'}`}
            </DialogTitle>
          </DialogHeader>
          <NetworkMaintenanceWizard
            operacionId={selectedInmersionId}
            tipoFormulario={selectedFormType}
            onComplete={handleCloseDialog}
            onCancel={handleCloseDialog}
            editingFormId={editingFormId || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
