
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from "@/components/ui/badge";
import { Edit, Plus } from "lucide-react";
import { OperacionInfo } from "@/components/operaciones/OperacionInfo";
import { OperacionDocuments } from "@/components/operaciones/OperacionDocuments";
import { OperacionTimeline } from "@/components/operaciones/OperacionTimeline";
import { OperacionTeamManagerEnhanced } from "@/components/operaciones/OperacionTeamManagerEnhanced";
import { EditOperacionForm } from "@/components/operaciones/EditOperacionForm";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useModularSystem } from "@/hooks/useModularSystem";
import { toast } from "@/hooks/use-toast";

interface OperacionDetailModalProps {
  operacion: any;
  isOpen: boolean;
  onClose: () => void;
}

export const OperacionDetailModal = ({ operacion, isOpen, onClose }: OperacionDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showInmersionWizard, setShowInmersionWizard] = useState(false);
  const [editingInmersion, setEditingInmersion] = useState<any>(null);
  const [viewingInmersion, setViewingInmersion] = useState<any>(null);
  
  const { updateOperacion } = useOperaciones();
  const { inmersiones, createInmersion, updateInmersion, deleteInmersion } = useInmersiones();
  const { 
    canPlanOperations, 
    canManageNetworks, 
    hasModuleAccess,
    isSuperuser 
  } = useModularSystem();

  // Filtrar inmersiones de esta operación
  const operacionInmersiones = inmersiones.filter(inmersion => inmersion.operacion_id === operacion.id);

  const handleEditOperacion = async (data: any) => {
    try {
      await updateOperacion({ id: operacion.id, data });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating operacion:', error);
    }
  };

  const handleCreateInmersion = async (data: any) => {
    try {
      const inmersionData = {
        ...data,
        operacion_id: operacion.id
      };
      await createInmersion(inmersionData);
      setShowInmersionWizard(false);
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInmersion = async (data: any) => {
    try {
      await updateInmersion({ id: editingInmersion.inmersion_id, data });
      setEditingInmersion(null);
      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error updating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInmersion = async (id: string) => {
    try {
      await deleteInmersion(id);
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmersión.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getInmersionStatusColor = (estado: string) => {
    const colors = {
      'planificada': 'bg-yellow-100 text-yellow-700',
      'en_progreso': 'bg-blue-100 text-blue-700',
      'completada': 'bg-green-100 text-green-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  // Definir pestañas disponibles según módulos activos
  const availableTabs = [
    { id: "general", title: "General", required: true },
    ...(canPlanOperations || isSuperuser ? [{ id: "personal", title: "Personal de Buceo", required: false }] : []),
    ...(canPlanOperations || isSuperuser ? [{ id: "documentos", title: "Documentos", required: false }] : []),
    { id: "inmersiones", title: "Inmersiones", required: true },
    ...(canManageNetworks || isSuperuser ? [{ id: "formularios", title: "Formularios Operativos", required: false }] : []),
    { id: "timeline", title: "Timeline", required: true }
  ];

  // Ajustar activeTab si la pestaña actual no está disponible
  React.useEffect(() => {
    const isTabAvailable = availableTabs.some(tab => tab.id === activeTab);
    if (!isTabAvailable) {
      setActiveTab("general");
    }
  }, [availableTabs, activeTab]);

  const renderInmersionesContent = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Inmersiones de la Operación</h3>
          <Button onClick={() => setShowInmersionWizard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inmersión
          </Button>
        </div>

        <div className="grid gap-4">
          {operacionInmersiones.map((inmersion) => (
            <Card key={inmersion.inmersion_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                    <p className="text-sm text-gray-600">{inmersion.objetivo}</p>
                  </div>
                  <Badge className={getInmersionStatusColor(inmersion.estado)}>
                    {inmersion.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Fecha:</span> {inmersion.fecha_inmersion}
                  </div>
                  <div>
                    <span className="font-medium">Supervisor:</span> {inmersion.supervisor}
                  </div>
                  <div>
                    <span className="font-medium">Buzo Principal:</span> {inmersion.buzo_principal}
                  </div>
                  <div>
                    <span className="font-medium">Profundidad:</span> {inmersion.profundidad_max}m
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingInmersion(inmersion)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingInmersion(inmersion)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteInmersion(inmersion.inmersion_id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {operacionInmersiones.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium">No hay inmersiones registradas</p>
                  <p className="text-sm">Crea la primera inmersión para esta operación</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <OperacionInfo operacion={operacion} />;
      case "personal":
        return (
          <OperacionTeamManagerEnhanced 
            operacionId={operacion.id} 
            salmoneraId={operacion.salmonera_id || undefined}
            contratistaId={operacion.contratista_id || undefined}
          />
        );
      case "documentos":
        return <OperacionDocuments operacionId={operacion.id} operacion={operacion} />;
      case "inmersiones":
        return renderInmersionesContent();
      case "formularios":
        return (
          <div className="space-y-4">
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Formularios Operativos</h3>
              <p className="text-gray-600 mt-2">
                Accede a los formularios de mantención de redes y faenas operativas
              </p>
              <Button 
                className="mt-4" 
                onClick={() => window.open('/operaciones/network-maintenance', '_blank')}
              >
                Ir a Mantención de Redes
              </Button>
            </div>
          </div>
        );
      case "timeline":
        return <OperacionTimeline operacionId={operacion.id} />;
      default:
        return <div>Contenido no encontrado</div>;
    }
  };

  // Si estamos mostrando el wizard de inmersión
  if (showInmersionWizard) {
    return (
      <Dialog open={true} onOpenChange={() => setShowInmersionWizard(false)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <InmersionWizard
            operationId={operacion.id}
            onComplete={handleCreateInmersion}
            onCancel={() => setShowInmersionWizard(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Si estamos editando una inmersión
  if (editingInmersion) {
    return (
      <Dialog open={true} onOpenChange={() => setEditingInmersion(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <InmersionWizard
            operationId={operacion.id}
            initialData={editingInmersion}
            onComplete={handleUpdateInmersion}
            onCancel={() => setEditingInmersion(null)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Si estamos viendo una inmersión
  if (viewingInmersion) {
    return (
      <Dialog open={true} onOpenChange={() => setViewingInmersion(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <InmersionWizard
            operationId={operacion.id}
            initialData={viewingInmersion}
            onComplete={() => setViewingInmersion(null)}
            onCancel={() => setViewingInmersion(null)}
            readOnly={true}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto z-50">
        {/* Header del Modal */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{operacion.nombre}</h2>
            <p className="text-gray-600">Código: {operacion.codigo}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(operacion.estado)}>
              {operacion.estado}
            </Badge>
            {(canPlanOperations || isSuperuser) && (
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar Operación
                </Button>
                <DialogContent className="max-w-3xl">
                  <EditOperacionForm
                    operacion={operacion}
                    onSubmit={handleEditOperacion}
                    onCancel={() => setIsEditDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-${availableTabs.length}`}>
              {availableTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {renderTabContent()}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OperacionDetailModal;
