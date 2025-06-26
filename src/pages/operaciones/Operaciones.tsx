
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock } from "lucide-react";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { GlobalTimeline } from "@/components/timeline/GlobalTimeline";
import { useIsMobile } from '@/hooks/use-mobile';
import { useModularSystem } from '@/hooks/useModularSystem';

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const isMobile = useIsMobile();
  const { getUserContext, hasModuleAccess, modules } = useModularSystem();
  
  const userContext = getUserContext();

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  return (
    <MainLayout
      title="Operaciones"
      subtitle={
        userContext.canCreateOperations 
          ? "Gestión de operaciones de buceo y documentos asociados"
          : "Visualización de operaciones y creación de inmersiones asociadas"
      }
      icon={Calendar}
      headerChildren={
        userContext.canCreateOperations && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Operación
          </Button>
        )
      }
    >
      <div className="space-y-6">
        {/* Mensaje contextual para contratistas */}
        {userContext.isContratista && !hasModuleAccess(modules.PLANNING_OPERATIONS) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Vista de Contratista</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Puedes ver las operaciones disponibles y crear inmersiones asociadas. 
                  Tu salmonera gestiona la planificación de operaciones.
                </p>
              </div>
            </div>
          </div>
        )}

        {userContext.isContratista && hasModuleAccess(modules.PLANNING_OPERATIONS) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Módulo de Planificación Activo</h4>
                <p className="text-sm text-green-700 mt-1">
                  Tu salmonera tiene activo el módulo de planificación. Puedes asociar inmersiones a operaciones planificadas.
                </p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="operaciones" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="operaciones">
              <Calendar className="w-4 h-4 mr-2" />
              Operaciones
            </TabsTrigger>
            <TabsTrigger value="actividad">
              <Clock className="w-4 h-4 mr-2" />
              Actividad
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="operaciones">
            <OperacionesManager />
          </TabsContent>
          
          <TabsContent value="actividad">
            <GlobalTimeline />
          </TabsContent>
        </Tabs>
      </div>

      {/* Formulario de creación solo para salmoneras */}
      {userContext.canCreateOperations && (
        <>
          {isMobile ? (
            <Drawer open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DrawerContent>
                <div className="p-4 pt-6 max-h-[90vh] overflow-y-auto">
                  <CreateOperacionForm onClose={handleCloseCreateForm} />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <CreateOperacionForm onClose={handleCloseCreateForm} />
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </MainLayout>
  );
}
