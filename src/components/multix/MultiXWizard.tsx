
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, FileText } from "lucide-react";
import { useMultiX } from '@/hooks/useMultiX';
import { EncabezadoGeneral } from './steps/EncabezadoGeneral';
import { DotacionBuceo } from './steps/DotacionBuceo';
import type { MultiXData, MultiXFormData } from '@/types/multix';

interface MultiXWizardProps {
  operacionId: string;
  tipoFormulario: 'mantencion' | 'faena';
  onComplete?: () => void;
  onCancel?: () => void;
}

export const MultiXWizard = ({ 
  operacionId, 
  tipoFormulario, 
  onComplete, 
  onCancel 
}: MultiXWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MultiXData>({
    lugar_trabajo: '',
    fecha: new Date().toISOString().split('T')[0],
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
    tipo_formulario: tipoFormulario,
    progreso: 0,
    firmado: false,
    estado: 'borrador'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { createMultiX, updateMultiX, loading } = useMultiX();

  const getStepsConfig = () => {
    const baseSteps = [
      { id: 1, title: "Encabezado General", description: "Información básica de la operación" },
      { id: 2, title: "Dotación", description: "Personal y roles de buceo" },
      { id: 3, title: "Equipos Superficie", description: "Equipos y horómetros" }
    ];

    if (tipoFormulario === 'mantencion') {
      return [
        ...baseSteps,
        { id: 4, title: "Faenas Mantención", description: "Trabajos en redes" },
        { id: 5, title: "Sistemas y Equipos", description: "Estado operacional" },
        { id: 6, title: "Apoyo Faenas", description: "Actividades de apoyo" },
        { id: 7, title: "Resumen", description: "Inmersiones y navegación" },
        { id: 8, title: "Contingencias", description: "Eventos especiales" },
        { id: 9, title: "Firmas", description: "Validación final" }
      ];
    } else {
      return [
        ...baseSteps,
        { id: 4, title: "Iconografía", description: "Checklist de simbología" },
        { id: 5, title: "Matriz Actividades", description: "Red/Lobera/Peceras" },
        { id: 6, title: "Cambio Pecera", description: "Tareas por buzo" },
        { id: 7, title: "Resumen", description: "Inmersiones y navegación" },
        { id: 8, title: "Contingencias", description: "Eventos especiales" },
        { id: 9, title: "Firmas", description: "Validación final" }
      ];
    }
  };

  const steps = getStepsConfig();
  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (newData: Partial<MultiXData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
    // Limpiar errores relacionados con los campos actualizados
    const updatedFields = Object.keys(newData);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.lugar_trabajo.trim()) {
        newErrors.lugar_trabajo = 'El lugar de trabajo es requerido';
      }
      if (!formData.fecha) {
        newErrors.fecha = 'La fecha es requerida';
      }
      if (!formData.hora_inicio) {
        newErrors.hora_inicio = 'La hora de inicio es requerida';
      }
    }

    if (step === 2) {
      if (formData.dotacion.length === 0) {
        newErrors.dotacion = 'Debe agregar al menos una persona a la dotación';
      }
      
      // Validar que hay al menos un supervisor
      const hasSupervisor = formData.dotacion.some(member => member.rol === 'Supervisor');
      if (!hasSupervisor) {
        newErrors.supervisor = 'Debe asignar al menos un Supervisor';
      }

      // Validar datos completos de cada miembro
      const incompleteMembers = formData.dotacion.filter(member => 
        !member.nombre.trim() || !member.apellido.trim()
      );
      if (incompleteMembers.length > 0) {
        newErrors.members_incomplete = 'Todos los miembros deben tener nombre y apellido completos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        updateProgress();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProgress = () => {
    const newProgress = Math.round((currentStep / totalSteps) * 100);
    setFormData(prev => ({ ...prev, progreso: newProgress }));
  };

  const handleSave = async () => {
    try {
      const multiXFormData: MultiXFormData = {
        operacion_id: operacionId,
        codigo: `MX-${Date.now()}`,
        tipo_formulario: tipoFormulario,
        multix_data: formData
      };

      await createMultiX(multiXFormData);
    } catch (error) {
      console.error('Error saving MultiX:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <EncabezadoGeneral
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      
      case 2:
        return (
          <DotacionBuceo
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      
      default:
        return (
          <div className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {steps[currentStep - 1]?.description}
            </p>
            <p className="text-xs text-gray-400">
              Componente en desarrollo - Fase {currentStep}
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              MultiX - {tipoFormulario === 'mantencion' ? 'Mantención de Redes' : 'Faena de Redes'}
            </CardTitle>
            <CardDescription>
              Paso {currentStep} de {totalSteps}: {steps[currentStep - 1]?.title}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
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
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={onComplete}>
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
