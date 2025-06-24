import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Network, 
  Users, 
  Settings, 
  CheckCircle,
  Save,
  FileText
} from "lucide-react";
import { useMaintenanceNetworks } from "@/hooks/useMaintenanceNetworks";
import { toast } from "@/hooks/use-toast";

// Importar los pasos de Network Maintenance
import { EncabezadoGeneral } from "../network-maintenance/steps/EncabezadoGeneral";
import { DotacionBuceo } from "../network-maintenance/steps/DotacionBuceo";
import { EquiposSuperficie } from "../network-maintenance/steps/EquiposSuperficie";
import { FaenasMantencion } from "../network-maintenance/steps/FaenasMantencion";

interface MaintenanceNetworksWizardProps {
  inmersionId: string;
  onComplete?: () => void;
  onCancel?: () => void;
  existingForm?: any;
}

export const MaintenanceNetworksWizard = ({
  inmersionId,
  onComplete,
  onCancel,
  existingForm
}: MaintenanceNetworksWizardProps) => {
  const [activeStep, setActiveStep] = useState("general");
  const [formData, setFormData] = useState({
    // Datos generales requeridos
    lugar_trabajo: existingForm?.form_data?.lugar_trabajo || '',
    fecha: existingForm?.form_data?.fecha || new Date().toISOString().split('T')[0],
    temperatura: existingForm?.form_data?.temperatura || 0,
    hora_inicio: existingForm?.form_data?.hora_inicio || '',
    hora_termino: existingForm?.form_data?.hora_termino || '',
    profundidad_max: existingForm?.form_data?.profundidad_max || 0,
    nave_maniobras: existingForm?.form_data?.nave_maniobras || '',
    team_s: existingForm?.form_data?.team_s || '',
    team_be: existingForm?.form_data?.team_be || '',
    team_bi: existingForm?.form_data?.team_bi || '',
    matricula_nave: existingForm?.form_data?.matricula_nave || '',
    estado_puerto: existingForm?.form_data?.estado_puerto || '',
    
    // Dotación y equipos
    dotacion: existingForm?.form_data?.dotacion || [],
    equipos_superficie: existingForm?.form_data?.equipos_superficie || [],
    
    // Faenas específicas
    faenas_mantencion: existingForm?.form_data?.faenas_mantencion || [],
    faenas_redes: existingForm?.form_data?.faenas_redes || [],
    
    // Tipo de formulario
    tipo_formulario: existingForm?.form_type || 'mantencion',
    
    // Control requerido
    progreso: 0,
    firmado: false,
    estado: 'borrador' as const,
  });

  const { 
    canAccessModule,
    createMaintenanceForm,
    updateMaintenanceForm,
    isCreating,
    isUpdating
  } = useMaintenanceNetworks();

  if (!canAccessModule) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Módulo de Mantención de Redes no disponible</p>
            <p className="text-sm">Contacta al administrador para activar este módulo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleSaveDraft = async () => {
    try {
      const maintenanceForm = {
        inmersion_id: inmersionId,
        module_name: 'maintenance_networks',
        form_type: formData.tipo_formulario as 'mantencion' | 'faena_redes',
        form_data: formData,
        status: 'draft' as const,
      };

      if (existingForm) {
        await updateMaintenanceForm({
          id: existingForm.id,
          data: maintenanceForm
        });
      } else {
        await createMaintenanceForm(maintenanceForm);
      }
      
      toast({
        title: "Borrador Guardado",
        description: "Los cambios han sido guardados como borrador.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const maintenanceForm = {
        inmersion_id: inmersionId,
        module_name: 'maintenance_networks',
        form_type: formData.tipo_formulario as 'mantencion' | 'faena_redes',
        form_data: formData,
        status: 'completed' as const,
      };

      if (existingForm) {
        await updateMaintenanceForm({
          id: existingForm.id,
          data: maintenanceForm
        });
      } else {
        await createMaintenanceForm(maintenanceForm);
      }
      
      onComplete?.();
    } catch (error) {
      console.error('Error completing form:', error);
    }
  };

  const isFormValid = () => {
    return formData.fecha && formData.lugar_trabajo && formData.dotacion.length > 0;
  };

  const getStepProgress = () => {
    const steps = ['general', 'dotacion', 'equipos', 'faenas'];
    const currentIndex = steps.indexOf(activeStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const getStepStatus = (step: string) => {
    switch (step) {
      case 'general':
        return formData.fecha && formData.lugar_trabajo ? 'completed' : 'pending';
      case 'dotacion':
        return formData.dotacion.length > 0 ? 'completed' : 'pending';
      case 'equipos':
        return formData.equipos_superficie.length > 0 ? 'completed' : 'pending';
      case 'faenas':
        return (formData.faenas_mantencion.length > 0 || formData.faenas_redes.length > 0) ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-600" />
            Mantención de Redes
          </h2>
          <p className="text-gray-600">Formulario operativo para mantención de redes</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={existingForm?.status === 'completed' ? 'default' : 'secondary'}>
            {existingForm?.status === 'completed' ? 'Completado' : 'Borrador'}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso del formulario</span>
              <span>{Math.round(getStepProgress())}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Wizard Steps */}
      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            General
            {getStepStatus('general') === 'completed' && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="dotacion" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Dotación
            {getStepStatus('dotacion') === 'completed' && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="equipos" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Equipos
            {getStepStatus('equipos') === 'completed' && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </TabsTrigger>
          <TabsTrigger value="faenas" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Faenas
            {getStepStatus('faenas') === 'completed' && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <EncabezadoGeneral
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="dotacion" className="mt-6">
          <DotacionBuceo
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="equipos" className="mt-6">
          <EquiposSuperficie
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="faenas" className="mt-6">
          <FaenasMantencion
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isCreating || isUpdating}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Borrador
          </Button>
          
          <Button 
            onClick={handleComplete}
            disabled={!isFormValid() || isCreating || isUpdating}
          >
            {isCreating || isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                Guardando...
              </div>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completar
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
