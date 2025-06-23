
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Edit, 
  Download,
  Calendar,
  Building,
  Users,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data para las HPT
const mockHPTData = [
  {
    id: "hpt-001",
    numero: "HPT-2024-001",
    operacion: "Mantención Red Centro 15",
    salmonera: "AquaChile",
    sitio: "Centro 15",
    fecha_planificacion: "2024-01-15",
    supervisor: "Juan Pérez",
    estado: "completado",
    buzos_asignados: 4,
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "hpt-002",
    numero: "HPT-2024-002", 
    operacion: "Inspección Estructural Centro 8",
    salmonera: "Salmones Camanchaca",
    sitio: "Centro 8",
    fecha_planificacion: "2024-01-20",
    supervisor: "María González",
    estado: "en_progreso",
    buzos_asignados: 2,
    created_at: "2024-01-12T14:30:00Z"
  },
  {
    id: "hpt-003",
    numero: "HPT-2024-003",
    operacion: "Limpieza de Redes Centro 22",
    salmonera: "Multiexport Foods",
    sitio: "Centro 22", 
    fecha_planificacion: "2024-01-25",
    supervisor: "Carlos Rodríguez",
    estado: "borrador",
    buzos_asignados: 3,
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

export const HPTDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingHPT, setEditingHPT] = useState<string>('');

  const filteredData = mockHPTData.filter(hpt => {
    const matchesSearch = hpt.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hpt.operacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hpt.salmonera.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hpt.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateHPT = () => {
    setEditingHPT('');
    setShowCreateDialog(true);
  };

  const handleEditHPT = (hptId: string) => {
    setEditingHPT(hptId);
    setShowCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingHPT('');
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total HPT</p>
                <p className="text-2xl font-bold">{mockHPTData.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold">
                  {mockHPTData.filter(h => h.estado === 'completado').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold">
                  {mockHPTData.filter(h => h.estado === 'en_progreso').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Borradores</p>
                <p className="text-2xl font-bold">
                  {mockHPTData.filter(h => h.estado === 'borrador').length}
                </p>
              </div>
              <Edit className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Hojas de Planificación de Trabajo
            </CardTitle>
            <Button onClick={handleCreateHPT} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva HPT
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Número</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Operación</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Salmonera</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Sitio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha Planificación</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Supervisor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Buzos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((hpt) => (
                  <tr key={hpt.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-blue-600">{hpt.numero}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-48 truncate">{hpt.operacion}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {hpt.salmonera}
                      </div>
                    </td>
                    <td className="py-3 px-4">{hpt.sitio}</td>
                    <td className="py-3 px-4">
                      {new Date(hpt.fecha_planificacion).toLocaleDateString('es-CL')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {hpt.supervisor}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{hpt.buzos_asignados}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(hpt.estado)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditHPT(hpt.id)}
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
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron HPT que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar HPT */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingHPT ? 'Editar HPT' : 'Nueva Hoja de Planificación de Trabajo'}
            </DialogTitle>
          </DialogHeader>
          <HPTWizardComplete 
            onComplete={handleCloseDialog}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
