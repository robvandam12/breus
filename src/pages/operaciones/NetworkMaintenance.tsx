
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Network, Settings, Wrench } from "lucide-react";
import { NetworkMaintenanceWizard } from "@/components/network-maintenance/NetworkMaintenanceWizard";
import { useIsMobile } from '@/hooks/use-mobile';

export default function NetworkMaintenance() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tipoFormulario, setTipoFormulario] = useState<'mantencion' | 'faena'>('mantencion');
  const [selectedOperacion, setSelectedOperacion] = useState<string>('');
  const isMobile = useIsMobile();

  const handleCreateNew = (tipo: 'mantencion' | 'faena') => {
    setTipoFormulario(tipo);
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setSelectedOperacion('');
  };

  return (
    <MainLayout
      title="Mantención de Redes"
      subtitle="Formularios operativos para mantención y faenas de redes de cultivo"
      icon={Network}
      headerChildren={
        <div className="flex gap-2">
          <Button onClick={() => handleCreateNew('mantencion')}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Mantención
          </Button>
          <Button variant="outline" onClick={() => handleCreateNew('faena')}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Faena
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Cards informativos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Formulario de Mantención de Redes
              </CardTitle>
              <CardDescription>
                Registro completo de trabajos de mantención en redes, sistemas y equipos de cultivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Encabezado general y dotación</li>
                <li>• Equipos de superficie</li>
                <li>• Faenas de mantención (Red/Lobera/Peceras)</li>
                <li>• Sistemas y equipos operacionales</li>
                <li>• Apoyo a faenas</li>
                <li>• Resumen de inmersiones</li>
                <li>• Contingencias y firmas</li>
              </ul>
              <Button 
                className="w-full mt-4" 
                onClick={() => handleCreateNew('mantencion')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Crear Formulario de Mantención
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-green-600" />
                Formulario de Faena de Redes
              </CardTitle>
              <CardDescription>
                Registro específico de faenas operativas y cambios en sistemas de redes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Encabezado general y dotación</li>
                <li>• Iconografía y simbología</li>
                <li>• Matriz Red/Lobera/Peceras</li>
                <li>• Cambio de pecera por buzo</li>
                <li>• Faenas de mantención</li>
                <li>• Sistemas y apoyo faenas</li>
                <li>• Resumen y firmas</li>
              </ul>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => handleCreateNew('faena')}
              >
                <Wrench className="w-4 h-4 mr-2" />
                Crear Formulario de Faena
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lista de formularios existentes - Por implementar */}
        <Card>
          <CardHeader>
            <CardTitle>Formularios de Mantención Recientes</CardTitle>
            <CardDescription>
              Historial de formularios de mantención y faenas de redes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Network className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No hay formularios registrados</p>
              <p className="text-sm text-gray-400 mt-2">
                Los formularios creados aparecerán aquí
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal/Drawer para crear formulario */}
      {isMobile ? (
        <Drawer open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DrawerContent>
            <div className="p-4 pt-6 max-h-[90vh] overflow-y-auto">
              <NetworkMaintenanceWizard 
                operacionId={selectedOperacion || "temp-operacion-id"} 
                tipoFormulario={tipoFormulario}
                onComplete={handleCloseCreateForm}
                onCancel={handleCloseCreateForm}
              />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <NetworkMaintenanceWizard 
              operacionId={selectedOperacion || "temp-operacion-id"} 
              tipoFormulario={tipoFormulario}
              onComplete={handleCloseCreateForm}
              onCancel={handleCloseCreateForm}
            />
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
}
