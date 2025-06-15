
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Calendar, Users, CheckCircle, AlertTriangle } from "lucide-react";
import { CreateInmersionForm } from '@/components/inmersiones/CreateInmersionForm';
import { OperacionTeamTab } from '@/components/operaciones/OperacionTeamTab';
import { OperacionDocuments } from '@/components/operaciones/OperacionDocuments';
import { OperacionTimeline } from '@/components/operaciones/OperacionTimeline';
import { OperacionInmersiones } from '@/components/operaciones/OperacionInmersiones';
import { useOperacionDetails } from '@/hooks/useOperacionDetails';

interface OperacionDetailsProps {
  operacionId: string;
  onClose: () => void;
}

export const OperacionDetails: React.FC<OperacionDetailsProps> = ({ operacionId, onClose }) => {
  const [showCreateInmersion, setShowCreateInmersion] = useState(false);
  const [activeTab, setActiveTab] = useState('resumen');
  
  const { operacion, isLoading, createInmersion, compliance } = useOperacionDetails(operacionId);
  
  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      setShowCreateInmersion(false);
    } catch (error) {
      console.error('Error al crear la inmersión desde el componente:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Cargando detalles...</p>
      </div>
    );
  }

  if (!operacion) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No se encontró la operación</p>
      </div>
    );
  }

  const getStatusColor = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const canCreateInmersiones = compliance?.canExecute;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{operacion.nombre}</h2>
          <p className="text-gray-600">Código: {operacion.codigo}</p>
        </div>
        <Badge className={getStatusColor(operacion.estado)}>
          {operacion.estado}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="equipo">Equipo de Buceo</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Sitio: {operacion.sitio_nombre || 'No asignado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Contratista: {operacion.contratista_nombre || 'No asignado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    Fecha inicio: {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                  </span>
                </div>
                {operacion.fecha_fin && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Fecha fin: {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado de Cumplimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Equipo Asignado</span>
                  {compliance?.hasTeam ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HPT Válido</span>
                  {compliance?.hasValidHPT ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Anexo Bravo Válido</span>
                  {compliance?.hasValidAnexo ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Puede Ejecutar Inmersiones</span>
                  {compliance?.canExecute ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipo" className="space-y-4">
          <OperacionTeamTab 
            operacionId={operacionId} 
            operacion={operacion}
          />
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <OperacionDocuments 
            operacionId={operacionId} 
            operacion={operacion}
          />
        </TabsContent>

        <TabsContent value="inmersiones" className="space-y-4">
          <OperacionInmersiones 
            operacionId={operacionId}
            canCreateInmersiones={canCreateInmersiones}
            onNewInmersion={() => setShowCreateInmersion(true)}
          />
        </TabsContent>

        <TabsContent value="historial" className="space-y-4">
          <OperacionTimeline operacionId={operacionId} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={showCreateInmersion} onOpenChange={setShowCreateInmersion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión</DialogTitle>
          </DialogHeader>
          <CreateInmersionForm
            defaultOperacionId={operacionId}
            onSubmit={handleCreateInmersion}
            onCancel={() => setShowCreateInmersion(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
