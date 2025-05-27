
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Search, FileText, CalendarDays, Calendar, MapPin, 
  User, Building, Plus, Edit, Trash2, Anchor, CheckCircle, AlertCircle
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useOperaciones } from "@/hooks/useOperaciones";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { OperacionDetailsDialog } from './OperacionDetailsDialog';

export function OperacionesManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'active' | 'completed' | 'pending'>('active');
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCreateDocumentDialog, setShowCreateDocumentDialog] = useState(false);
  
  const { operaciones, isLoading } = useOperaciones();

  const filterOperaciones = () => {
    return operaciones.filter((op) => {
      // Filtrar por modo de vista
      const viewCondition = 
        viewMode === 'all' ? true :
        viewMode === 'active' ? op.estado === 'activa' :
        viewMode === 'completed' ? op.estado === 'completada' :
        viewMode === 'pending' ? true : true; // Sin estado_aprobacion en el tipo
      
      // Filtrar por término de búsqueda
      const searchCondition = 
        op.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (op.sitios?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return viewCondition && searchCondition;
    });
  };

  const handleSelectOperacion = (operacion: any) => {
    setSelectedOperacion(operacion);
    setShowDetailsDialog(true);
  };

  const handleShowCreateDocument = (operacion: any) => {
    if (!operacion.equipo_buceo_id) {
      toast({
        title: "Equipo de buceo no asignado",
        description: "Esta operación no tiene un equipo de buceo asignado. Asigne un equipo antes de crear documentos.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedOperacion(operacion);
    setShowCreateDocumentDialog(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (estado: string) => {
    if (estado === 'activa') {
      return { className: "bg-green-100 text-green-700", label: "Activa" };
    } else if (estado === 'completada') {
      return { className: "bg-blue-100 text-blue-700", label: "Completada" };
    } else if (estado === 'cancelada') {
      return { className: "bg-red-100 text-red-700", label: "Cancelada" };
    }
    return { className: "bg-gray-100 text-gray-700", label: estado || "Desconocido" };
  };

  const filteredOperaciones = filterOperaciones();

  return (
    <div className="space-y-6">
      {/* Tabs y Buscador */}
      <Card className="ios-card">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl">Operaciones de Buceo</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Buscar operaciones..." 
                className="pl-9 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="active" 
            value={viewMode}
            onValueChange={(value) => setViewMode(value as any)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="active" className="text-xs md:text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Activas
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs md:text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                Pendientes
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs md:text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completadas
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs md:text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                Todas
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tabla de operaciones */}
      <Card className="ios-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-inherit">
                <TableHead>Código</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead>Sitio</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Documentos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperaciones.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CalendarDays className="h-12 w-12 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-500">No hay operaciones</h3>
                      <p className="text-sm text-gray-400">No se encontraron operaciones con los filtros actuales</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {filteredOperaciones.map((operacion) => {
                const statusBadge = getStatusBadge(operacion.estado);
                
                return (
                  <TableRow key={operacion.id} className="cursor-pointer" onClick={() => handleSelectOperacion(operacion)}>
                    <TableCell className="font-medium">{operacion.codigo}</TableCell>
                    <TableCell>{operacion.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{operacion.sitios?.nombre || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(operacion.fecha_inicio)}</TableCell>
                    <TableCell>
                      <Badge className={statusBadge.className}>
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="bg-gray-50">
                          <FileText className="w-3 h-3 mr-1" />
                          0
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowCreateDocument(operacion);
                        }}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Documento
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOperacion(operacion);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo de detalles de operación */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedOperacion && (
            <OperacionDetailsDialog
              operacion={selectedOperacion}
              onClose={() => setShowDetailsDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para crear documentos */}
      <Dialog open={showCreateDocumentDialog} onOpenChange={setShowCreateDocumentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nuevo documento</DialogTitle>
            <DialogDescription>
              Seleccione el tipo de documento que desea crear para esta operación.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col gap-2"
              asChild
            >
              <Link to={`/formularios/hpt?operacion=${selectedOperacion?.id}`}>
                <FileText className="h-8 w-8 text-blue-600" />
                <span>Hoja de Planificación de Tarea (HPT)</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col gap-2"
              asChild
            >
              <Link to={`/formularios/anexo-bravo?operacion=${selectedOperacion?.id}`}>
                <FileText className="h-8 w-8 text-green-600" />
                <span>Anexo Bravo</span>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col gap-2 md:col-span-2"
              asChild
            >
              <Link to={`/inmersiones?operacion=${selectedOperacion?.id}`}>
                <Anchor className="h-8 w-8 text-teal-600" />
                <span>Inmersión</span>
              </Link>
            </Button>
          </div>
          
          <DialogFooter className="border-t p-4">
            <Button variant="outline" onClick={() => setShowCreateDocumentDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
