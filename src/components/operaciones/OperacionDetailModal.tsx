import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from "@/components/ui/badge";
import { Edit, Info } from "lucide-react";
import { OperacionInfo } from "@/components/operaciones/OperacionInfo";
import { OperacionDocuments } from "@/components/operaciones/OperacionDocuments";
import { OperacionInmersiones } from "@/components/operaciones/OperacionInmersiones";
import { OperacionTimeline } from "@/components/operaciones/OperacionTimeline";
import { EditOperacionForm } from "@/components/operaciones/EditOperacionForm";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useModularSystem } from "@/hooks/useModularSystem";

interface OperacionDetailModalProps {
  operacion: any;
  isOpen: boolean;
  onClose: () => void;
}

const OperacionDetailModal = ({ operacion, isOpen, onClose }: OperacionDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInmersionDialogOpen, setIsInmersionDialogOpen] = useState(false);
  const { updateOperacion } = useOperaciones();
  const { 
    canPlanOperations, 
    canManageNetworks, 
    hasModuleAccess,
    getUserContext,
    modules,
    isSuperuser 
  } = useModularSystem();

  const userContext = getUserContext();

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
      setIsInmersionDialogOpen(false);
    } catch (error) {
      console.error('Error creating inmersion:', error);
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

  // Definir pestañas disponibles según contexto modular del usuario
  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "general", title: "General", required: true }
    ];

    // Solo mostrar documentos si tiene acceso a planning
    if (hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      baseTabs.push({ id: "documentos", title: "Documentos", required: false });
    }

    // Inmersiones siempre disponible (core) - aquí se gestiona el personal por inmersión
    baseTabs.push({ id: "inmersiones", title: "Inmersiones", required: true });

    // Solo mostrar formularios de mantención si tiene el módulo
    if (hasModuleAccess(modules.MAINTENANCE_NETWORKS)) {
      baseTabs.push({ id: "formularios", title: "Formularios Operativos", required: false });
    }

    // Timeline siempre disponible
    baseTabs.push({ id: "timeline", title: "Timeline", required: true });

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  // Ajustar activeTab si la pestaña actual no está disponible
  React.useEffect(() => {
    const isTabAvailable = availableTabs.some(tab => tab.id === activeTab);
    if (!isTabAvailable) {
      setActiveTab("general");
    }
  }, [availableTabs, activeTab]);

  const renderContextualMessage = () => {
    if (userContext.isContratista && !hasModuleAccess(modules.PLANNING_OPERATIONS)) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Acceso Limitado</h4>
              <p className="text-sm text-blue-700">
                Como contratista, puedes ver esta operación y crear inmersiones asociadas, pero no modificar la planificación.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-4">
            {renderContextualMessage()}
            <OperacionInfo operacion={operacion} />
          </div>
        );
      case "documentos":
        return <OperacionDocuments operacionId={operacion.id} operacion={operacion} />;
      case "inmersiones":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Inmersiones de la Operación</h3>
                <p className="text-sm text-gray-600">
                  {userContext.isContratista 
                    ? "Crea inmersiones asociadas a esta operación planificada. El personal de buceo se gestiona por cada inmersión individual."
                    : "Gestiona las inmersiones de esta operación. El personal de buceo se asigna específicamente a cada inmersión."
                  }
                </p>
              </div>
              <Button onClick={() => setIsInmersionDialogOpen(true)}>
                Nueva Inmersión
              </Button>
            </div>
            <OperacionInmersiones operacion={operacion} />
          </div>
        );
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
            {/* Solo mostrar botón de editar si puede planificar operaciones */}
            {userContext.canCreateOperations && (
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
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
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

        {/* Inmersion Creation Dialog */}
        <Dialog open={isInmersionDialogOpen} onOpenChange={setIsInmersionDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Nueva Inmersión para {operacion.nombre}</DialogTitle>
            </DialogHeader>
            <InmersionWizard
              operationId={operacion.id}
              onComplete={handleCreateInmersion}
              onCancel={() => setIsInmersionDialogOpen(false)}
              showOperationSelector={false}
            />
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default OperacionDetailModal;
