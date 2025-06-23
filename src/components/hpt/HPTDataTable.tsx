
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

// Mock data real para las HPT
const mockHPTData = [
  {
    id: "hpt-001",
    numero: "HPT-2024-001",
    operacion: "Mantención Preventiva Red Centro 15 - Sector Norte",
    salmonera: "AquaChile S.A.",
    sitio: "Centro 15",
    fecha_planificacion: "2024-01-15",
    supervisor: "Juan Carlos Pérez Morales",
    estado: "completado",
    buzos_asignados: 4,
    profundidad_max: 25.5,
    duracion_estimada: "4 horas",
    equipos_requeridos: ["Compresor principal", "Equipo autonomo x4", "Herramientas corte"],
    riesgos_identificados: 3,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T16:30:00Z",
    firmado_por: "Juan Carlos Pérez Morales",
    fecha_firma: "2024-01-10T11:15:00Z"
  },
  {
    id: "hpt-002",
    numero: "HPT-2024-002", 
    operacion: "Inspección Estructural Centro 8 - Análisis Desgaste Redes",
    salmonera: "Salmones Camanchaca S.A.",
    sitio: "Centro 8",
    fecha_planificacion: "2024-01-20",
    supervisor: "María Elena González Ruiz",
    estado: "en_progreso",
    buzos_asignados: 2,
    profundidad_max: 18.0,
    duracion_estimada: "2.5 horas",
    equipos_requeridos: ["Cámara subacuática", "Equipo autonomo x2", "Kit medición"],
    riesgos_identificados: 2,
    created_at: "2024-01-12T14:30:00Z",
    updated_at: "2024-01-19T09:00:00Z",
    firmado_por: "María Elena González Ruiz",
    fecha_firma: "2024-01-12T15:45:00Z"
  },
  {
    id: "hpt-003",
    numero: "HPT-2024-003",
    operacion: "Limpieza y Mantención Redes Centro 22 - Sector Sur",
    salmonera: "Multiexport Foods S.A.",
    sitio: "Centro 22", 
    fecha_planificacion: "2024-01-25",
    supervisor: "Carlos Alberto Rodríguez Silva",
    estado: "borrador",
    buzos_asignados: 3,
    profundidad_max: 22.0,
    duracion_estimada: "6 horas",
    equipos_requeridos: ["Equipo autonomo x3", "Herramientas limpieza", "Bolsas residuos"],
    riesgos_identificados: 4,
    created_at: "2024-01-14T09:15:00Z",
    updated_at: "2024-01-22T13:20:00Z",
    firmado_por: null,
    fecha_firma: null
  },
  {
    id: "hpt-004",
    numero: "HPT-2024-004",
    operacion: "Reparación Red de Engorda Centro 5 - Emergencia",
    salmonera: "Cermaq Chile S.A.",
    sitio: "Centro 5",
    fecha_planificacion: "2024-01-28",
    supervisor: "Roberto Andrés Moreno Vega",
    estado: "completado",
    buzos_asignados: 6,
    profundidad_max: 30.0,
    duracion_estimada: "8 horas",
    equipos_requeridos: ["Equipo superficie x2", "Equipo autonomo x4", "Kit reparación", "Grúa auxiliar"],
    riesgos_identificados: 6,
    created_at: "2024-01-26T08:00:00Z",
    updated_at: "2024-01-28T18:45:00Z",
    firmado_por: "Roberto Andrés Moreno Vega",
    fecha_firma: "2024-01-26T09:30:00Z"
  },
  {
    id: "hpt-005",
    numero: "HPT-2024-005",
    operacion: "Instalación Nueva Red Centro 12 - Fase 1",
    salmonera: "Nova Austral S.A.",
    sitio: "Centro 12",
    fecha_planificacion: "2024-02-01",
    supervisor: "Ana Patricia Henríquez Torres",
    estado: "planificado",
    buzos_asignados: 5,
    profundidad_max: 35.0,
    duracion_estimada: "12 horas",
    equipos_requeridos: ["Equipo superficie x3", "Equipo autonomo x2", "Kit instalación", "Barcaza apoyo"],
    riesgos_identificados: 5,
    created_at: "2024-01-20T16:00:00Z",
    updated_at: "2024-01-30T10:15:00Z",
    firmado_por: "Ana Patricia Henríquez Torres",
    fecha_firma: "2024-01-20T17:20:00Z"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completado':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completado</Badge>;
    case 'en_progreso':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
    case 'planificado':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Planificado</Badge>;
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
                         hpt.salmonera.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hpt.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
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
                  placeholder="Buscar por número, operación, salmonera o supervisor..."
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
                <SelectItem value="planificado">Planificado</SelectItem>
                <SelectItem value="en_progreso">En Progreso</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla usando el componente Table estándar */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número HPT</TableHead>
                  <TableHead>Operación</TableHead>
                  <TableHead>Salmonera</TableHead>
                  <TableHead>Sitio</TableHead>
                  <TableHead>Fecha Planificación</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Buzos</TableHead>
                  <TableHead>Profundidad Máx.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((hpt) => (
                  <TableRow key={hpt.id}>
                    <TableCell>
                      <div className="font-medium text-blue-600">{hpt.numero}</div>
                      <div className="text-xs text-gray-500">
                        {hpt.duracion_estimada}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48 truncate font-medium">{hpt.operacion}</div>
                      <div className="text-xs text-gray-500">
                        {hpt.equipos_requeridos.length} equipos • {hpt.riesgos_identificados} riesgos
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {hpt.salmonera}
                      </div>
                    </TableCell>
                    <TableCell>{hpt.sitio}</TableCell>
                    <TableCell>
                      {new Date(hpt.fecha_planificacion).toLocaleDateString('es-CL')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{hpt.supervisor}</div>
                          {hpt.fecha_firma && (
                            <div className="text-xs text-gray-500">
                              Firmado {new Date(hpt.fecha_firma).toLocaleDateString('es-CL')}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{hpt.buzos_asignados}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{hpt.profundidad_max}m</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(hpt.estado)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
