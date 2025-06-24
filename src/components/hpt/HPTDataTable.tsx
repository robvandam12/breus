import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useHPT } from "@/hooks/useHPT";
import { useOperaciones } from "@/hooks/useOperaciones";
import { toast } from "@/hooks/use-toast";

const getStatusBadge = (status: string, firmado: boolean) => {
  if (firmado) {
    return <Badge className="bg-green-100 text-green-800 border-green-200">Completado</Badge>;
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

export const HPTDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingHPT, setEditingHPT] = useState<string>('');
  const [viewingHPT, setViewingHPT] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const { hpts, isLoading } = useHPT();
  const { operaciones } = useOperaciones();

  const filteredData = hpts.filter(hpt => {
    const operacion = operaciones.find(op => op.id === hpt.operacion_id);
    const matchesSearch = hpt.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hpt.supervisor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operacion?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completado' && hpt.firmado) ||
                         (statusFilter === 'borrador' && !hpt.firmado && hpt.estado === 'borrador') ||
                         (statusFilter === 'en_progreso' && !hpt.firmado && hpt.estado === 'en_progreso');
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

  const handleViewHPT = (hpt: any) => {
    setViewingHPT(hpt);
    setShowViewDialog(true);
  };

  const handleDownloadHPT = (hpt: any) => {
    // Simular descarga - en producción esto generaría un PDF
    const dataStr = JSON.stringify(hpt, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `HPT_${hpt.codigo}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Descarga iniciada",
      description: `Se ha descargado el HPT ${hpt.codigo}`,
    });
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingHPT('');
  };

  const handleCloseViewDialog = () => {
    setShowViewDialog(false);
    setViewingHPT(null);
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
                <p className="text-sm text-gray-600">Total HPT</p>
                <p className="text-2xl font-bold">{hpts.length}</p>
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
                  {hpts.filter(h => h.firmado).length}
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
                  {hpts.filter(h => !h.firmado && h.estado === 'en_progreso').length}
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
                  {hpts.filter(h => !h.firmado && h.estado === 'borrador').length}
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
                <SelectItem value="completado">Completado</SelectItem>
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
                <TableHead>Fecha Planificación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((hpt) => {
                const operacion = operaciones.find(op => op.id === hpt.operacion_id);
                return (
                  <TableRow key={hpt.id}>
                    <TableCell>
                      <div className="font-medium text-blue-600">{hpt.codigo || hpt.folio}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48 truncate">
                        {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {hpt.supervisor}
                      </div>
                    </TableCell>
                    <TableCell>
                      {hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(hpt.estado || 'borrador', hpt.firmado)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${hpt.progreso || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{hpt.progreso || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadHPT(hpt)}
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

      {/* Dialog para ver HPT */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle HPT - {viewingHPT?.codigo}</DialogTitle>
          </DialogHeader>
          {viewingHPT && (
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Código</label>
                  <p className="font-medium">{viewingHPT.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Supervisor</label>
                  <p>{viewingHPT.supervisor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha</label>
                  <p>{viewingHPT.fecha ? new Date(viewingHPT.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div>{getStatusBadge(viewingHPT.estado || 'borrador', viewingHPT.firmado)}</div>
                </div>
              </div>
              {viewingHPT.plan_trabajo && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Plan de Trabajo</label>
                  <p className="mt-1 text-sm bg-gray-50 p-3 rounded">{viewingHPT.plan_trabajo}</p>
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
