
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
  Clock,
  Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data para los Anexo Bravo
const mockAnexoBravoData = [
  {
    id: "ab-001",
    numero: "AB-2024-001",
    operacion: "Mantención Red Centro 15",
    salmonera: "AquaChile",
    sitio: "Centro 15",
    fecha_operacion: "2024-01-15",
    supervisor: "Juan Pérez",
    estado: "completado",
    buzos_asignados: 4,
    tipo_trabajo: "Mantención",
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: "ab-002",
    numero: "AB-2024-002", 
    operacion: "Inspección Estructural Centro 8",
    salmonera: "Salmones Camanchaca",
    sitio: "Centro 8",
    fecha_operacion: "2024-01-20",
    supervisor: "María González",
    estado: "en_progreso",
    buzos_asignados: 2,
    tipo_trabajo: "Inspección",
    created_at: "2024-01-12T14:30:00Z"
  },
  {
    id: "ab-003",
    numero: "AB-2024-003",
    operacion: "Limpieza de Redes Centro 22",
    salmonera: "Multiexport Foods",
    sitio: "Centro 22", 
    fecha_operacion: "2024-01-25",
    supervisor: "Carlos Rodríguez",
    estado: "borrador",
    buzos_asignados: 3,
    tipo_trabajo: "Limpieza",
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

const getTipoTrabajoBadge = (tipo: string) => {
  switch (tipo) {
    case 'Mantención':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Mantención</Badge>;
    case 'Inspección':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Inspección</Badge>;
    case 'Limpieza':
      return <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">Limpieza</Badge>;
    default:
      return <Badge variant="outline">{tipo}</Badge>;
  }
};

export const AnexoBravoDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnexo, setEditingAnexo] = useState<string>('');

  const filteredData = mockAnexoBravoData.filter(anexo => {
    const matchesSearch = anexo.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anexo.operacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anexo.salmonera.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || anexo.estado === statusFilter;
    const matchesTipo = tipoFilter === 'all' || anexo.tipo_trabajo === tipoFilter;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const handleCreateAnexo = () => {
    setEditingAnexo('');
    setShowCreateDialog(true);
  };

  const handleEditAnexo = (anexoId: string) => {
    setEditingAnexo(anexoId);
    setShowCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingAnexo('');
  };

  const handleSubmit = async (data: any) => {
    console.log('Anexo Bravo submitted:', data);
    handleCloseDialog();
  };

  const handleCancel = () => {
    handleCloseDialog();
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Anexos</p>
                <p className="text-2xl font-bold">{mockAnexoBravoData.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completados</p>
                <p className="text-2xl font-bold">
                  {mockAnexoBravoData.filter(a => a.estado === 'completado').length}
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
                  {mockAnexoBravoData.filter(a => a.estado === 'en_progreso').length}
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
                  {mockAnexoBravoData.filter(a => a.estado === 'borrador').length}
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
              <Shield className="w-5 h-5" />
              Formularios Anexo Bravo
            </CardTitle>
            <Button onClick={handleCreateAnexo} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Anexo Bravo
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
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de trabajo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Mantención">Mantención</SelectItem>
                <SelectItem value="Inspección">Inspección</SelectItem>
                <SelectItem value="Limpieza">Limpieza</SelectItem>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha Operación</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Supervisor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Buzos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((anexo) => (
                  <tr key={anexo.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-blue-600">{anexo.numero}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="max-w-48 truncate">{anexo.operacion}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {anexo.salmonera}
                      </div>
                    </td>
                    <td className="py-3 px-4">{anexo.sitio}</td>
                    <td className="py-3 px-4">
                      {new Date(anexo.fecha_operacion).toLocaleDateString('es-CL')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {anexo.supervisor}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getTipoTrabajoBadge(anexo.tipo_trabajo)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{anexo.buzos_asignados}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(anexo.estado)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditAnexo(anexo.id)}
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
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron Anexos Bravo que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar Anexo Bravo */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnexo ? 'Editar Anexo Bravo' : 'Nuevo Anexo Bravo'}
            </DialogTitle>
          </DialogHeader>
          <FullAnexoBravoForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
