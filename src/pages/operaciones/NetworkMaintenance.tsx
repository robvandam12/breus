
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Network, Settings, Wrench, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NetworkMaintenanceWizard } from "@/components/network-maintenance/NetworkMaintenanceWizard";
import { useContextualOperations } from '@/hooks/useContextualOperations';
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

export default function NetworkMaintenance() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tipoFormulario, setTipoFormulario] = useState<'mantencion' | 'faena'>('mantencion');
  const [selectedOperacion, setSelectedOperacion] = useState<string>('');

  const { createDirectOperation } = useContextualOperations();

  const handleCreateNew = async (tipo: 'mantencion' | 'faena') => {
    setTipoFormulario(tipo);
    
    try {
      const operacion = await createDirectOperation({
        codigo: `NM-OP-${Date.now()}`,
        nombre: `Operación ${tipo === 'mantencion' ? 'Mantención' : 'Faena'} - ${new Date().toLocaleDateString('es-CL')}`,
        estado: 'activa',
        fecha_inicio: new Date().toISOString().split('T')[0],
        tareas: `Operación creada automáticamente para formulario de ${tipo}`
      });
      
      setSelectedOperacion(operacion.id);
      setShowCreateForm(true);
    } catch (error) {
      console.error('Error creating direct operation:', error);
      setSelectedOperacion("temp-operacion-id");
      setShowCreateForm(true);
    }
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
        {/* Información contextual */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            <strong>Formularios Operativos Directos:</strong> Los formularios de mantención de redes se crean como operaciones independientes que no requieren documentación previa (HPT/Anexo Bravo).
          </AlertDescription>
        </Alert>

        {/* Cards informativos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
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
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• Encabezado general y dotación</li>
                <li>• Equipos de superficie</li>
                <li>• Faenas de mantención</li>
                <li>• Sistemas y equipos operacionales</li>
                <li>• Resumen de inmersiones</li>
                <li>• Contingencias y firmas</li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleCreateNew('mantencion')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Crear Formulario de Mantención
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
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
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li>• Encabezado general y dotación</li>
                <li>• Equipos de superficie</li>
                <li>• Faenas específicas de redes</li>
                <li>• Sistemas de apoyo</li>
                <li>• Registro de cambios</li>
                <li>• Resumen y firmas</li>
              </ul>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handleCreateNew('faena')}
              >
                <Wrench className="w-4 h-4 mr-2" />
                Crear Formulario de Faena
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Actividad</CardTitle>
            <CardDescription>
              Estadísticas de formularios de mantención de redes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-blue-600">Mantenciones Hoy</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-green-600">Faenas Completadas</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-orange-600">En Progreso</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-purple-600">Total Este Mes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal para crear/editar formulario */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedOperacion && (
            <NetworkMaintenanceWizard 
              operacionId={selectedOperacion} 
              tipoFormulario={tipoFormulario}
              onComplete={handleCloseCreateForm}
              onCancel={handleCloseCreateForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
