
import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, FileText, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateBitacoraSupervisorFormComplete } from "@/components/bitacoras/CreateBitacoraSupervisorFormComplete";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { toast } from "@/hooks/use-toast";

const BitacorasSupervisor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedBitacora, setSelectedBitacora] = useState<any>(null);

  const { bitacorasSupervisor, loadingSupervisor } = useBitacorasSupervisor();

  const filteredBitacoras = bitacorasSupervisor.filter(bitacora =>
    bitacora.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bitacora.supervisor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bitacora.desarrollo_inmersion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (bitacora: any) => {
    if (bitacora.firmado) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Firmada</Badge>;
    }
    if (bitacora.estado_aprobacion === 'aprobada') {
      return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Aprobada</Badge>;
    }
    if (bitacora.estado_aprobacion === 'pendiente') {
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Borrador</Badge>;
  };

  const handleCreateBitacora = () => {
    setShowCreateDialog(true);
  };

  const handleEditBitacora = (bitacora: any) => {
    setSelectedBitacora(bitacora);
    // Aquí podrías abrir un modal de edición
    toast({
      title: "Función en desarrollo",
      description: "La edición de bitácoras estará disponible pronto.",
    });
  };

  const handleViewBitacora = (bitacora: any) => {
    setSelectedBitacora(bitacora);
    // Aquí podrías abrir un modal de vista detallada
    toast({
      title: "Función en desarrollo",
      description: "La vista detallada de bitácoras estará disponible pronto.",
    });
  };

  const handleFormSubmit = () => {
    setShowCreateDialog(false);
    toast({
      title: "Bitácora creada",
      description: "La bitácora de supervisor ha sido creada exitosamente.",
    });
  };

  const handleFormCancel = () => {
    setShowCreateDialog(false);
  };

  if (loadingSupervisor) {
    return (
      <MainLayout
        title="Bitácoras de Supervisor"
        subtitle="Gestión de bitácoras de supervisión de inmersiones"
        icon={FileText}
      >
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Bitácoras de Supervisor"
      subtitle="Gestión de bitácoras de supervisión de inmersiones"
      icon={FileText}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {bitacorasSupervisor.length}
          </div>
          <div className="text-sm text-zinc-500">Total Bitácoras</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {bitacorasSupervisor.filter(b => b.firmado).length}
          </div>
          <div className="text-sm text-zinc-500">Firmadas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {bitacorasSupervisor.filter(b => !b.firmado && b.estado_aprobacion === 'pendiente').length}
          </div>
          <div className="text-sm text-zinc-500">Pendientes</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {bitacorasSupervisor.filter(b => b.estado_aprobacion === 'aprobada').length}
          </div>
          <div className="text-sm text-zinc-500">Aprobadas</div>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Bitácoras de Supervisor
            </CardTitle>
            {/* CORREGIDO: Botón funcional para crear nueva bitácora */}
            <Button onClick={handleCreateBitacora} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Bitácora Supervisor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar bitácoras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Tabla de bitácoras */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Inmersión</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBitacoras.map((bitacora) => (
                <TableRow key={bitacora.bitacora_id}>
                  <TableCell>
                    <div className="font-medium text-blue-600">{bitacora.codigo}</div>
                  </TableCell>
                  <TableCell>{bitacora.supervisor}</TableCell>
                  <TableCell>
                    {bitacora.fecha ? new Date(bitacora.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {bitacora.inmersion ? (
                        <span>{bitacora.inmersion.codigo || 'Inmersión'}</span>
                      ) : (
                        <span className="text-gray-500">Sin inmersión</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(bitacora)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBitacora(bitacora)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBitacora(bitacora)}
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredBitacoras.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron bitácoras de supervisor.</p>
              <Button onClick={handleCreateBitacora} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Bitácora
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear bitácora */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Bitácora de Supervisor</DialogTitle>
          </DialogHeader>
          <CreateBitacoraSupervisorFormComplete
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default BitacorasSupervisor;
