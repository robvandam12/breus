
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Shield, 
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { AnexoBravoDetailViewModal } from "@/components/anexo-bravo/AnexoBravoDetailViewModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useOperaciones } from "@/hooks/useOperaciones";
import { toast } from "@/hooks/use-toast";

const getStatusBadge = (status: string, firmado: boolean) => {
  if (firmado) {
    return <Badge className="bg-green-100 text-green-800 border-green-200">Firmado</Badge>;
  }
  
  switch (status) {
    case 'en_progreso':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
    case 'borrador':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Borrador</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const AnexoBravoDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnexo, setEditingAnexo] = useState<string>('');
  const [viewingAnexo, setViewingAnexo] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const { anexosBravo, isLoading } = useAnexoBravo();
  const { operaciones } = useOperaciones();

  const filteredData = anexosBravo.filter(anexo => {
    const operacion = operaciones.find(op => op.id === anexo.operacion_id);
    const matchesSearch = anexo.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         anexo.supervisor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operacion?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'firmado' && anexo.firmado) ||
                         (statusFilter === 'borrador' && !anexo.firmado && anexo.estado === 'borrador') ||
                         (statusFilter === 'en_progreso' && !anexo.firmado && anexo.estado === 'en_progreso');
    return matchesSearch && matchesStatus;
  });

  const handleCreateAnexo = () => {
    setEditingAnexo('');
    setShowCreateDialog(true);
  };

  const handleEditAnexo = (anexoId: string) => {
    setEditingAnexo(anexoId);
    setShowCreateDialog(true);
  };

  const handleViewAnexo = (anexo: any) => {
    setViewingAnexo(anexo);
    setShowViewDialog(true);
  };

  const handleDownloadAnexo = (anexo: any) => {
    // Simular descarga - en producción esto generaría un PDF
    const dataStr = JSON.stringify(anexo, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `AnexoBravo_${anexo.codigo}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Descarga iniciada",
      description: `Se ha descargado el Anexo Bravo ${anexo.codigo}`,
    });
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingAnexo('');
  };

  const handleCloseViewDialog = () => {
    setShowViewDialog(false);
    setViewingAnexo(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Anexos</p>
                <p className="text-2xl font-bold">{anexosBravo.length}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Firmados</p>
                <p className="text-2xl font-bold">
                  {anexosBravo.filter(a => a.firmado).length}
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
                  {anexosBravo.filter(a => !a.firmado && a.estado === 'en_progreso').length}
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
                  {anexosBravo.filter(a => !a.firmado && a.estado === 'borrador').length}
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
              Anexos Bravo
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
                  placeholder="Buscar por código, supervisor u operación..."
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
                <SelectItem value="firmado">Firmado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla usando componente estándar */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((anexo) => {
                const operacion = operaciones.find(op => op.id === anexo.operacion_id);
                return (
                  <TableRow key={anexo.id}>
                    <TableCell>
                      <div className="font-medium text-blue-600">{anexo.codigo}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48 truncate">
                        {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {anexo.supervisor}
                      </div>
                    </TableCell>
                    <TableCell>
                      {anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(anexo.estado || 'borrador', anexo.firmado)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${anexo.progreso || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{anexo.progreso || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* CORREGIDO: Agregado onClick al botón Ver */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewAnexo(anexo)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditAnexo(anexo.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadAnexo(anexo)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron Anexos Bravo que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar Anexo */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAnexo ? 'Editar Anexo Bravo' : 'Nuevo Anexo Bravo'}
            </DialogTitle>
          </DialogHeader>
          <FullAnexoBravoForm 
            operacionId=""
            anexoId={editingAnexo}
            onSubmit={() => handleCloseDialog()}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para ver Anexo Bravo */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle Anexo Bravo - {viewingAnexo?.codigo}</DialogTitle>
          </DialogHeader>
          {viewingAnexo && (
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Código</label>
                  <p className="font-medium">{viewingAnexo.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Supervisor</label>
                  <p>{viewingAnexo.supervisor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha</label>
                  <p>{viewingAnexo.fecha ? new Date(viewingAnexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div>{getStatusBadge(viewingAnexo.estado || 'borrador', viewingAnexo.firmado)}</div>
                </div>
              </div>
              {viewingAnexo.lugar_faena && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Lugar de Faena</label>
                  <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{viewingAnexo.lugar_faena}</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={handleCloseViewDialog}>Cerrar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
