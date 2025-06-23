
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Network } from "lucide-react";
import { useNetworkMaintenance } from '@/hooks/useNetworkMaintenance';
import { toast } from '@/hooks/use-toast';
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface NetworkMaintenanceWizardProps {
  operacionId?: string;
  tipoFormulario: 'mantencion' | 'faena_redes';
  onComplete: () => void;
  onCancel: () => void;
  editingFormId?: string;
  readOnly?: boolean;
}

export const NetworkMaintenanceWizard = ({ 
  operacionId, 
  tipoFormulario, 
  onComplete, 
  onCancel,
  editingFormId,
  readOnly = false
}: NetworkMaintenanceWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NetworkMaintenanceData>({
    lugar_trabajo: '',
    fecha: '',
    temperatura: 0,
    hora_inicio: '',
    hora_termino: '',
    profundidad_max: 0,
    nave_maniobras: '',
    team_s: '',
    team_be: '',
    team_bi: '',
    matricula_nave: '',
    estado_puerto: '',
    dotacion: [],
    equipos_superficie: [],
    faenas_mantencion: [],
    faenas_redes: [],
    sistemas_equipos: [],
    tipo_formulario: tipoFormulario,
    progreso: 0,
    firmado: false,
    estado: 'borrador'
  });

  const { 
    loading, 
    createNetworkMaintenance, 
    updateNetworkMaintenance, 
    completeNetworkMaintenance 
  } = useNetworkMaintenance();

  const [savedFormId, setSavedFormId] = useState<string | null>(editingFormId || null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const steps = [
    { id: 1, title: "Encabezado General", description: "Información básica de la operación" },
    { id: 2, title: "Dotación de Buceo", description: "Personal y roles asignados" },
    { id: 3, title: "Equipos de Superficie", description: "Compresores y equipos" },
    { id: 4, title: "Faenas de Mantención", description: "Trabajos en redes y estructuras" },
    { id: 5, title: "Sistemas y Equipos", description: "Equipos operacionales" },
    { id: 6, title: "Resumen y Firmas", description: "Validación final" }
  ];

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (newData: Partial<NetworkMaintenanceData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  const handleSave = async (showToast = true) => {
    try {
      if (savedFormId) {
        await updateNetworkMaintenance(savedFormId, formData);
      } else {
        const result = await createNetworkMaintenance({
          operacion_id: operacionId || '',
          codigo: `NM-${Date.now()}`,
          tipo_formulario: tipoFormulario,
          multix_data: formData,
          fecha: formData.fecha || '',
          hora_inicio: formData.hora_inicio || '',
          hora_termino: formData.hora_termino || '',
          lugar_trabajo: formData.lugar_trabajo || '',
          nombre_nave: formData.nave_maniobras || '',
          matricula_nave: formData.matricula_nave || '',
          nombre_centro: '',
          codigo_centro: '',
          fecha_operacion: formData.fecha || '',
          condiciones_meteorologicas: ''
        });
        setSavedFormId(result.id);
      }
      
      setHasUnsavedChanges(false);
      
      if (showToast) {
        toast({
          title: "Guardado exitoso",
          description: "El formulario ha sido guardado correctamente",
        });
      }
    } catch (error) {
      console.error('Error saving form:', error);
      if (showToast) {
        toast({
          title: "Error al guardar",
          description: "No se pudo guardar el formulario",
          variant: "destructive",
        });
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.lugar_trabajo && formData.fecha && formData.hora_inicio);
      case 2:
        return formData.dotacion && formData.dotacion.length > 0;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      const updatedData = {
        ...formData,
        progreso: Math.max(formData.progreso || 0, (currentStep / totalSteps) * 100)
      };
      updateFormData(updatedData);
      
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
      
      await handleSave(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        const finalData = {
          ...formData,
          progreso: 100,
          estado: 'completado' as const,
          firmado: true
        };
        
        updateFormData(finalData);
        
        if (savedFormId) {
          await completeNetworkMaintenance(savedFormId);
        }
        
        toast({
          title: "Formulario completado",
          description: "El formulario de mantención de redes ha sido completado exitosamente",
        });
        
        onComplete();
      } catch (error) {
        console.error('Error completing form:', error);
        toast({
          title: "Error",
          description: "No se pudo completar el formulario",
          variant: "destructive",
        });
      }
    }
  };

  const renderStepContent = () => {
    // Por ahora renderizamos un placeholder para cada paso
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">{steps[currentStep - 1]?.title}</h3>
        <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm">Contenido del paso {currentStep} será implementado próximamente</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-6 w-6" />
              Mantención de Redes - {tipoFormulario === 'mantencion' ? 'Mantención' : 'Faena'}
              {hasUnsavedChanges && <span className="text-amber-500 text-sm">(Sin guardar)</span>}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Paso {currentStep} de {totalSteps}: {steps[currentStep - 1]?.title}
            </p>
          </div>
          <div className="flex gap-2">
            {!readOnly && (
              <Button 
                variant="outline" 
                onClick={() => handleSave(true)}
                disabled={loading || !hasUnsavedChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            )}
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </div>
        <Progress value={progress} className="w-full mt-4" />
      </CardHeader>

      <CardContent>
        {renderStepContent()}

        {!readOnly && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} disabled={loading}>
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Procesando...' : 'Finalizar Mantención'}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
