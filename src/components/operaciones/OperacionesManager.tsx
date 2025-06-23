import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Building, MapPin, Calendar, User, Eye, Edit, MoreVertical, Search } from "lucide-react";

// Mock data para operaciones
const mockOperaciones = [
  {
    id: "op-001",
    codigo: "OP-2024-001",
    descripcion: "Mantención Preventiva Red Centro 15 - Sector Norte",
    salmonera: "AquaChile S.A.",
    sitio: "Centro 15",
    fecha_inicio: "2024-01-15",
    fecha_termino: "2024-01-16",
    supervisor: "Juan Carlos Pérez Morales",
    estado: "planificada",
    riesgos_asociados: 3,
    personal_requerido: 5,
    equipos_necesarios: 8,
    presupuesto_estimado: 1500000,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-14T16:30:00Z"
  },
  {
    id: "op-002",
    codigo: "OP-2024-002",
    descripcion: "Inspección Estructural Centro 8 - Análisis Desgaste Redes",
    salmonera: "Salmones Camanchaca S.A.",
    sitio: "Centro 8",
    fecha_inicio: "2024-01-20",
    fecha_termino: "2024-01-21",
    supervisor: "María Elena González Ruiz",
    estado: "en_curso",
    riesgos_asociados: 2,
    personal_requerido: 3,
    equipos_necesarios: 6,
    presupuesto_estimado: 1200000,
    created_at: "2024-01-12T14:30:00Z",
    updated_at: "2024-01-19T09:00:00Z"
  },
  {
    id: "op-003",
    codigo: "OP-2024-003",
    descripcion: "Limpieza y Mantención Redes Centro 22 - Sector Sur",
    salmonera: "Multiexport Foods S.A.",
    sitio: "Centro 22",
    fecha_inicio: "2024-01-25",
    fecha_termino: "2024-01-26",
    supervisor: "Carlos Alberto Rodríguez Silva",
    estado: "completada",
    riesgos_asociados: 4,
    personal_requerido: 6,
    equipos_necesarios: 10,
    presupuesto_estimado: 1800000,
    created_at: "2024-01-14T09:15:00Z",
    updated_at: "2024-01-22T13:20:00Z"
  },
  {
    id: "op-004",
    codigo: "OP-2024-004",
    descripcion: "Reparación Red de Engorda Centro 5 - Emergencia",
    salmonera: "Cermaq Chile S.A.",
    sitio: "Centro 5",
    fecha_inicio: "2024-01-28",
    fecha_termino: "2024-01-29",
    supervisor: "Roberto Andrés Moreno Vega",
    estado: "cancelada",
    riesgos_asociados: 6,
    personal_requerido: 8,
    equipos_necesarios: 12,
    presupuesto_estimado: 2500000,
    created_at: "2024-01-26T08:00:00Z",
    updated_at: "2024-01-28T18:45:00Z"
  },
  {
    id: "op-005",
    codigo: "OP-2024-005",
    descripcion: "Instalación Nueva Red Centro 12 - Fase 1",
    salmonera: "Nova Austral S.A.",
    sitio: "Centro 12",
    fecha_inicio: "2024-02-01",
    fecha_termino: "2024-02-02",
    supervisor: "Ana Patricia Henríquez Torres",
    estado: "en_espera",
    riesgos_asociados: 5,
    personal_requerido: 7,
    equipos_necesarios: 11,
    presupuesto_estimado: 2200000,
    created_at: "2024-01-20T16:00:00Z",
    updated_at: "2024-01-30T10:15:00Z"
  }
];

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'planificada': return 'bg-blue-100 text-blue-800';
    case 'en_curso': return 'bg-green-100 text-green-800';
    case 'completada': return 'bg-gray-100 text-gray-800';
    case 'cancelada': return 'bg-red-100 text-red-800';
    case 'en_espera': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-200 text-gray-700';
  }
};

export const OperacionesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [operacionSeleccionada, setOperacionSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredOperaciones = mockOperaciones.filter(operacion => {
    const matchesSearch =
      operacion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operacion.salmonera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operacion.sitio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todas' || operacion.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewOperation = (operacion) => {
    setOperacionSeleccionada(operacion);
    setShowModal(true);
  };

  const handleEditOperation = (operacion) => {
    setOperacionSeleccionada(operacion);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOperacionSeleccionada(null);
  };

  const handleCreateOperation = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Operaciones</p>
                <p className="text-2xl font-bold">{mockOperaciones.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Planificadas</p>
                <p className="text-2xl font-bold">
                  {mockOperaciones.filter(op => op.estado === 'planificada').length}
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
                <p className="text-sm text-gray-600">En Curso</p>
                <p className="text-2xl font-bold">
                  {mockOperaciones.filter(op => op.estado === 'en_curso').length}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold">
                  {mockOperaciones.filter(op => op.estado === 'completada').length}
                </p>
              </div>
              <User className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Create Button */}
      <Card className="ios-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestión de Operaciones</CardTitle>
            <Button onClick={handleCreateOperation}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Operación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Buscar operación..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="planificada">Planificada</SelectItem>
                <SelectItem value="en_curso">En Curso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="en_espera">En Espera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Operations Table */}
      <Card className="ios-card shadow-none border border-gray-200/60 rounded-2xl overflow-hidden h-[600px]">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Operaciones</h3>
            <p className="text-sm text-gray-500">Gestiona todas las operaciones de buceo</p>
          </div>
          
          <div className="h-[520px] overflow-y-auto">
            {filteredOperaciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Building className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay operaciones</h3>
                <p className="text-gray-500 mb-6 max-w-sm">
                  No se encontraron operaciones que coincidan con los filtros aplicados.
                </p>
                <Button 
                  onClick={handleCreateOperation}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Operación
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredOperaciones.map((operacion) => (
                  <div key={operacion.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-gray-900 truncate">
                            {operacion.codigo}
                          </h4>
                          <Badge 
                            className={`${getStatusColor(operacion.estado)} text-xs font-medium rounded-full px-2.5 py-1`}
                          >
                            {operacion.estado.charAt(0).toUpperCase() + operacion.estado.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                          {operacion.descripcion}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            <span>{operacion.salmonera}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{operacion.sitio}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                          </div>
                          {operacion.supervisor && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{operacion.supervisor}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOperation(operacion)}
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOperation(operacion)}
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operation Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Operación</DialogTitle>
            <DialogDescription>
              Información detallada de la operación seleccionada.
            </DialogDescription>
          </DialogHeader>
          {operacionSeleccionada && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-bold text-gray-700">Código</h4>
                <p className="text-gray-600">{operacionSeleccionada.codigo}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700">Estado</h4>
                <p className="text-gray-600">{operacionSeleccionada.estado}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700">Descripción</h4>
                <p className="text-gray-600">{operacionSeleccionada.descripcion}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700">Salmonera</h4>
                <p className="text-gray-600">{operacionSeleccionada.salmonera}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700">Sitio</h4>
                <p className="text-gray-600">{operacionSeleccionada.sitio}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700">Fechas</h4>
                <p className="text-gray-600">
                  {new Date(operacionSeleccionada.fecha_inicio).toLocaleDateString()} -{' '}
                  {new Date(operacionSeleccionada.fecha_termino).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <Button onClick={handleCloseModal} className="mt-4">Cerrar</Button>
        </DialogContent>
      </Dialog>

      {/* Create Operation Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Operación</DialogTitle>
            <DialogDescription>
              Ingrese los detalles de la nueva operación.
            </DialogDescription>
          </DialogHeader>
          {/* Add your form or content for creating a new operation here */}
          <Button onClick={handleCloseCreateModal} className="mt-4">Cerrar</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL');
};
