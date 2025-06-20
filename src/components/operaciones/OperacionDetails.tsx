
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Calendar, Users, CheckCircle, AlertTriangle } from "lucide-react";
import { InmersionWizard } from '@/components/inmersion/InmersionWizard';
import { OperacionTeamTab } from '@/components/operaciones/OperacionTeamTab';
import { OperacionDocuments } from '@/components/operaciones/OperacionDocuments';
import { OperacionTimeline } from '@/components/operaciones/OperacionTimeline';
import { OperacionInmersiones } from '@/components/operaciones/OperacionInmersiones';
import { useOperacionDetails } from '@/hooks/useOperacionDetails';
import { OperacionResumenTab } from '@/components/operaciones/OperacionResumenTab';

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
      console.log('Creating inmersion with data:', data);
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
          <TabsTrigger value="equipo">Personal de Buceo</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <OperacionResumenTab operacion={operacion} compliance={compliance} />
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
            onNewInmersion={() => setShowCreateInmersion(true)}
          />
        </TabsContent>

        <TabsContent value="historial" className="space-y-4">
          <OperacionTimeline operacionId={operacionId} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={showCreateInmersion} onOpenChange={setShowCreateInmersion}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión</DialogTitle>
          </DialogHeader>
          <InmersionWizard
            operationId={operacionId}
            onComplete={handleCreateInmersion}
            onCancel={() => setShowCreateInmersion(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
