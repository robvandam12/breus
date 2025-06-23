
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
  Clock,
  Shield
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data real para los Anexo Bravo
const mockAnexoBravoData = [
  {
    id: "ab-001",
    numero: "AB-2024-001",
    operacion: "Mantención Preventiva Red Centro 15 - Sector Norte",
    salmonera: "AquaChile S.A.",
    sitio: "Centro 15",
    fecha_operacion: "2024-01-15",
    supervisor: "Juan Carlos Pérez Morales",
    estado: "completado",
    buzos_asignados: 4,
    tipo_trabajo: "Mantención Preventiva",
    profundidad_trabajo: 25.5,
    temperatura_agua: 12.5,
    visibilidad: 8.0,
    corrientes: "Moderadas (0.5-1.0 kt)",
    equipos_seguridad: ["Casco", "Chaleco salvavidas", "Arnés", "Comunicación"],
    riesgos_evaluados: ["Enredo en redes", "Corrientes", "Fauna marina", "Equipos defectuosos"],
    medidas_emergencia: "Buzo de seguridad en superficie, comunicación continua",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T16:30:00Z",
    firmado_por: "Juan Carlos Pérez Morales",
    fecha_firma: "2024-01-10T11:15:00Z"
  },
  {
    id: "ab-002",
    numero: "AB-2024-002", 
    operacion: "Inspección Estructural Centro 8 - Análisis Desgaste Redes",
    salmonera: "Salmones Camanchaca S.A.",
    sitio: "Centro 8",
    fecha_operacion: "2024-01-20",
    supervisor: "María Elena González Ruiz",
    estado: "en_progreso",
    buzos_asignados: 2,
    tipo_trabajo: "Inspección Técnica",
    profundidad_trabajo: 18.0,
    temperatura_agua: 13.2,
    visibilidad: 6.5,
    corrientes: "Leves (< 0.5 kt)",
    equipos_seguridad: ["Casco", "Chaleco salvavidas", "Cámara subacuática", "GPS"],
    riesgos_evaluados: ["Baja visibilidad", "Equipos electrónicos", "Tiempo de exposición"],
    medidas_emergencia: "Protocolo de comunicación cada 15 min, tiempo máximo 45 min",
    created_at: "2024-01-12T14:30:00Z",
    updated_at: "2024-01-19T09:00:00Z",
    firmado_por: "María Elena González Ruiz",
    fecha_firma: "2024-01-12T15:45:00Z"
  },
  {
    id: "ab-003",
    numero: "AB-2024-003",
    operacion: "Limpieza y Mantención Redes Centro 22 - Sector Sur",
    salmonera: "Multiexport Foods S.A.",
    sitio: "Centro 22", 
    fecha_operacion: "2024-01-25",
    supervisor: "Carlos Alberto Rodríguez Silva",
    estado: "borrador",
    buzos_asignados: 3,
    tipo_trabajo: "Limpieza y Mantención",
    profundidad_trabajo: 22.0,
    temperatura_agua: 11.8,
    visibilidad: 4.0,
    corrientes: "Fuertes (1.0-1.5 kt)",
    equipos_seguridad: ["Casco", "Chaleco salvavidas", "Arnés", "Línea de vida"],
    riesgos_evaluados: ["Corrientes fuertes", "Baja visibilidad", "Trabajo prolongado", "Fauna agresiva"],
    medidas_emergencia: "Buzo de seguridad, cabo de vida obligatorio, rotación cada 30 min",
    created_at: "2024-01-14T09:15:00Z",
    updated_at: "2024-01-22T13:20:00Z",
    firmado_por: null,
    fecha_firma: null
  },
  {
    id: "ab-004",
    numero: "AB-2024-004",
    operacion: "Reparación Red de Engorda Centro 5 - Emergencia",
    salmonera: "Cermaq Chile S.A.",
    sitio: "Centro 5",
    fecha_operacion: "2024-01-28",
    supervisor: "Roberto Andrés Moreno Vega",
    estado: "completado",
    buzos_asignados: 6,
    tipo_trabajo: "Reparación de Emergencia",
    profundidad_trabajo: 30.0,
    temperatura_agua: 10.5,
    visibilidad: 3.5,
    corrientes: "Variables (0.5-2.0 kt)",
    equipos_seguridad: ["Casco", "Chaleco salvavidas", "Arnés", "Comunicación", "Iluminación", "Kit emergencia"],
    riesgos_evaluados: ["Alta profundidad", "Corrientes variables", "Visibilidad crítica", "Reparación compleja", "Fatiga del personal", "Condiciones meteorológicas"],
    medidas_emergencia: "Equipo médico en superficie, 2 buzos de seguridad, comunicación permanente, protocolo evacuación",
    created_at: "2024-01-26T08:00:00Z",
    updated_at: "2024-01-28T18:45:00Z",
    firmado_por: "Roberto Andrés Moreno Vega",
    fecha_firma: "2024-01-26T09:30:00Z"
  },
  {
    id: "ab-005",
    numero: "AB-2024-005",
    operacion: "Instalación Nueva Red Centro 12 - Fase 1",
    salmonera: "Nova Austral S.A.",
    sitio: "Centro 12",
    fecha_operacion: "2024-02-01",
    supervisor: "Ana Patricia Henríquez Torres",
    estado: "planificado",
    buzos_asignados: 5,
    tipo_trabajo: "Instalación",
    profundidad_trabajo: 35.0,
    temperatura_agua: 9.8,
    visibilidad: 7.5,
    corrientes: "Moderadas (0.5-1.0 kt)",
    equipos_seguridad: ["Casco", "Chaleco salvavidas", "Arnés", "Comunicación", "GPS", "Sonar"],
    riesgos_evaluados: ["Profundidad extrema", "Instalación compleja", "Coordinación múltiple", "Tiempo extendido", "Condiciones variables"],
    medidas_emergencia: "Cámara hiperbárica disponible, equipo médico especializado, buzos de seguridad certificados, comunicación redundante",
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

const getTipoTrabajoBadge = (tipo: string) => {
  switch (tipo) {
    case 'Mantención Preventiva':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Mantención</Badge>;
    case 'Inspección Técnica':
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Inspección</Badge>;
    case 'Limpieza y Mantención':
      return <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">Limpieza</Badge>;
    case 'Reparación de Emergencia':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Emergencia</Badge>;
    case 'Instalación':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Instalación</Badge>;
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
                         anexo.salmonera.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anexo.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
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
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de trabajo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Mantención Preventiva">Mantención</SelectItem>
                <SelectItem value="Inspección Técnica">Inspección</SelectItem>
                <SelectItem value="Limpieza y Mantención">Limpieza</SelectItem>
                <SelectItem value="Reparación de Emergencia">Emergencia</SelectItem>
                <SelectItem value="Instalación">Instalación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla usando el componente Table estándar */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Operación</TableHead>
                  <TableHead>Salmonera</TableHead>
                  <TableHead>Sitio</TableHead>
                  <TableHead>Fecha Operación</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Profundidad</TableHead>
                  <TableHead>Buzos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((anexo) => (
                  <TableRow key={anexo.id}>
                    <TableCell>
                      <div className="font-medium text-blue-600">{anexo.numero}</div>
                      <div className="text-xs text-gray-500">
                        Temp: {anexo.temperatura_agua}°C • Vis: {anexo.visibilidad}m
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48 truncate font-medium">{anexo.operacion}</div>
                      <div className="text-xs text-gray-500">
                        {anexo.riesgos_evaluados.length} riesgos evaluados
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {anexo.salmonera}
                      </div>
                    </TableCell>
                    <TableCell>{anexo.sitio}</TableCell>
                    <TableCell>
                      {new Date(anexo.fecha_operacion).toLocaleDateString('es-CL')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{anexo.supervisor}</div>
                          {anexo.fecha_firma && (
                            <div className="text-xs text-gray-500">
                              Firmado {new Date(anexo.fecha_firma).toLocaleDateString('es-CL')}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTipoTrabajoBadge(anexo.tipo_trabajo)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">{anexo.profundidad_trabajo}m</span>
                      <div className="text-xs text-gray-500">{anexo.corrientes}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{anexo.buzos_asignados}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(anexo.estado)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
