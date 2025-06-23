
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Network } from "lucide-react";
import { EncabezadoGeneral } from './steps/EncabezadoGeneral';
import { DotacionBuceo } from './steps/DotacionBuceo';
import { EquiposSuperficie } from './steps/EquiposSuperficie';
import { FaenasMantencion } from './steps/FaenasMantencion';
import { SistemasEquipos } from './steps/SistemasEquipos';
import { ResumenFirmas } from './steps/ResumenFirmas';
import { useNetworkMaintenance } from '@/hooks/useNetworkMaintenance';
import { toast } from '@/hooks/use-toast';
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface NetworkMaintenanceWizardProps {
  operacionId: string;
  tipoFormulario: 'mantencion' | 'faena';
  onComplete: () => void;
  onCancel: () => void;
  editingFormId?: string;
}

export const NetworkMaintenanceWizard = ({ 
  operacionId, 
  tipoFormulario, 
  onComplete, 
  onCancel,
  editingFormId
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

  // Guardado automático cada 30 segundos si hay cambios
  useEffect(() => {
    if (!hasUnsavedChanges || loading) return;

    const autoSaveInterval = setInterval(async () => {
      await handleSave(false); // Guardado silencioso
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, loading]);

  const handleSave = async (showToast = true) => {
    try {
      if (savedFormId) {
        // Actualizar formulario existente
        await updateNetworkMaintenance(savedFormId, formData);
      } else {
        // Crear nuevo formulario
        const result = await createNetworkMaintenance({
          operacion_id: operacionId,
          codigo: `NM-${Date.now()}`,
          tipo_formulario: tipoFormulario,
          network_maintenance_data: formData
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
        return formData.dotacion.length > 0;
      case 3:
        return true; // Equipos son opcionales
      case 4:
        return true; // Faenas son opcionales inicialmente
      case 5:
        return true; // Sistemas son opcionales
      case 6:
        return !!(formData.supervisor_responsable); // Requiere supervisor para firma
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      // Guardar progreso antes de avanzar
      const updatedData = {
        ...formData,
        progreso: Math.max(formData.progreso, (currentStep / totalSteps) * 100)
      };
      updateFormData(updatedData);
      
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
      
      // Guardado automático al avanzar paso
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
        // Actualizar estado final
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
    switch (currentStep) {
      case 1:
        return (
          <EncabezadoGeneral 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <DotacionBuceo 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <EquiposSuperficie 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <FaenasMantencion 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <SistemasEquipos 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <ResumenFirmas 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
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
            <Button 
              variant="outline" 
              onClick={() => handleSave(true)}
              disabled={loading || !hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </div>
        <Progress value={progress} className="w-full mt-4" />
      </CardHeader>

      <CardContent>
        {renderStepContent()}

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
      </CardContent>
    </Card>
  );
};
