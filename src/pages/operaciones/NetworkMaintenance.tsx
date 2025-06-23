
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Network, Settings, Wrench, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NetworkMaintenanceWizard } from "@/components/network-maintenance/NetworkMaintenanceWizard";
import { NetworkMaintenanceList } from "@/components/network-maintenance/NetworkMaintenanceList";
import { ContextualOperationBadge } from "@/components/contextual/ContextualOperationBadge";
import { useIsMobile } from '@/hooks/use-mobile';
import { useContextualOperations } from '@/hooks/useContextualOperations';
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

export default function NetworkMaintenance() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tipoFormulario, setTipoFormulario] = useState<'mantencion' | 'faena'>('mantencion');
  const [selectedOperacion, setSelectedOperacion] = useState<string>('');
  const [editingForm, setEditingForm] = useState<{id: string, data: NetworkMaintenanceData} | null>(null);
  const [viewingForm, setViewingForm] = useState<{id: string, data: NetworkMaintenanceData} | null>(null);
  const isMobile = useIsMobile();
  
  const { createOperacionWithContext } = useContextualOperations();

  const handleCreateNew = (tipo: 'mantencion' | 'faena') => {
    setTipoFormulario(tipo);
    setEditingForm(null);
    setViewingForm(null);
    setShowCreateForm(true);
  };

  const handleEdit = (formId: string, formData: NetworkMaintenanceData) => {
    setEditingForm({ id: formId, data: formData });
    setTipoFormulario((formData.tipo_formulario as 'mantencion' | 'faena') || 'mantencion');
    setViewingForm(null);
    setShowCreateForm(true);
  };

  const handleView = (formId: string, formData: NetworkMaintenanceData) => {
    setViewingForm({ id: formId, data: formData });
    setEditingForm(null);
    setTipoFormulario((formData.tipo_formulario as 'mantencion' | 'faena') || 'mantencion');
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setSelectedOperacion('');
    setEditingForm(null);
    setViewingForm(null);
  };

  // Crear operación temporal para formularios operativos directos
  const createDirectOperation = async () => {
    try {
      const operacion = await createOperacionWithContext({
        codigo: `NM-OP-${Date.now()}`,
        nombre: `Operación ${tipoFormulario === 'mantencion' ? 'Mantención' : 'Faena'} - ${new Date().toLocaleDateString('es-CL')}`,
        estado: 'activa',
        fecha_inicio: new Date().toISOString().split('T')[0],
        tareas: `Operación creada automáticamente para formulario de ${tipoFormulario}`
      }, 'operativa_directa');
      
      setSelectedOperacion(operacion.id);
      return operacion.id;
    } catch (error) {
      console.error('Error creating direct operation:', error);
      return "temp-operacion-id"; // Fallback
    }
  };

  const renderWizard = () => {
    if (viewingForm) {
      return (
        <div className="pointer-events-none opacity-75">
          <NetworkMaintenanceWizard 
            operacionId={selectedOperacion || "temp-operacion-id"} 
            tipoFormulario={tipoFormulario}
            onComplete={handleCloseCreateForm}
            onCancel={handleCloseCreateForm}
            editingFormId={viewingForm.id}
          />
        </div>
      );
    }

    return (
      <NetworkMaintenanceWizard 
        operacionId={selectedOperacion || "temp-operacion-id"} 
        tipoFormulario={tipoFormulario}
        onComplete={handleCloseCreateForm}
        onCancel={handleCloseCreateForm}
        editingFormId={editingForm?.id}
      />
    );
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
        {/* Información contextual */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>Formularios Operativos Directos:</strong> Los formularios de mantención de redes se crean como operaciones independientes que no requieren documentación previa (HPT/Anexo Bravo).
          </AlertDescription>
        </Alert>

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
                onClick={async () => {
                  setTipoFormulario('mantencion');
                  const operacionId = await createDirectOperation();
                  setSelectedOperacion(operacionId);
                  setShowCreateForm(true);
                }}
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
                <li>•⎇ Cambio de pecera por buzo</li>
                <li>• Faenas de mantención</li>
                <li>• Sistemas y apoyo faenas</li>
                <li>• Resumen y firmas</li>
              </ul>
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={async () => {
                  setTipoFormulario('faena');
                  const operacionId = await createDirectOperation();
                  setSelectedOperacion(operacionId);
                  setShowCreateForm(true);
                }}
              >
                <Wrench className="w-4 h-4 mr-2" />
                Crear Formulario de Faena
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lista de formularios existentes */}
        <Card>
          <CardHeader>
            <CardTitle>Formularios de Mantención Recientes</CardTitle>
            <CardDescription>
              Historial de formularios de mantención y faenas de redes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetworkMaintenanceList 
              onEdit={handleEdit}
              onView={handleView}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modal/Drawer para crear/editar formulario */}
      {isMobile ? (
        <Drawer open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DrawerContent>
            <div className="p-4 pt-6 max-h-[90vh] overflow-y-auto">
              {selectedOperacion && (
                <div className="mb-4">
                  <ContextualOperationBadge operacionId={selectedOperacion} showDetails />
                </div>
              )}
              {renderWizard()}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedOperacion && (
              <div className="mb-4">
                <ContextualOperationBadge operacionId={selectedOperacion} showDetails />
              </div>
            )}
            {renderWizard()}
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
}
