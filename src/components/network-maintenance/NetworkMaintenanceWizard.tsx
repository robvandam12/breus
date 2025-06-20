
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Network } from "lucide-react";
import { EncabezadoGeneral } from './steps/EncabezadoGeneral';
import { DotacionBuceo } from './steps/DotacionBuceo';
import { EquiposSuperficie } from './steps/EquiposSuperficie';
import { FaenasMantencion } from './steps/FaenasMantencion';
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface NetworkMaintenanceWizardProps {
  operacionId: string;
  tipoFormulario: 'mantencion' | 'faena';
  onComplete: () => void;
  onCancel: () => void;
}

export const NetworkMaintenanceWizard = ({ 
  operacionId, 
  tipoFormulario, 
  onComplete, 
  onCancel 
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
    tipo_formulario: tipoFormulario,
    progreso: 0,
    firmado: false,
    estado: 'borrador'
  });

  // Diferentes pasos según el tipo de formulario
  const getSteps = () => {
    const baseSteps = [
      { id: 1, title: "Encabezado General", description: "Información básica de la operación" },
      { id: 2, title: "Dotación de Buceo", description: "Personal y roles asignados" },
      { id: 3, title: "Equipos de Superficie", description: "Compresores y equipos" }
    ];

    if (tipoFormulario === 'mantencion') {
      return [
        ...baseSteps,
        { id: 4, title: "Faenas de Mantención", description: "Trabajos en redes y estructuras" },
        { id: 5, title: "Sistemas y Equipos", description: "Equipos operacionales" },
        { id: 6, title: "Resumen y Firmas", description: "Validación final" }
      ];
    } else {
      return [
        ...baseSteps,
        { id: 4, title: "Iconografía", description: "Simbología utilizada" },
        { id: 5, title: "Matriz de Actividades", description: "Actividades por jaula" },
        { id: 6, title: "Resumen y Firmas", description: "Validación final" }
      ];
    }
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (newData: Partial<NetworkMaintenanceData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
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
        return true; // Faenas/Iconografía son opcionales
      case 5:
        return true; // Sistemas son opcionales
      case 6:
        return true; // Validación final
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Aquí enviaríamos los datos
      console.log('Network Maintenance data to submit:', formData);
      onComplete();
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
        if (tipoFormulario === 'mantencion') {
          return (
            <FaenasMantencion 
              formData={formData} 
              updateFormData={updateFormData}
            />
          );
        } else {
          return (
            <div className="text-center py-8">
              <Network className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Iconografía</h3>
              <p className="text-gray-500">Componente en desarrollo...</p>
            </div>
          );
        }
      case 5:
        return (
          <div className="text-center py-8">
            <Network className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tipoFormulario === 'mantencion' ? 'Sistemas y Equipos' : 'Matriz de Actividades'}
            </h3>
            <p className="text-gray-500">Componente en desarrollo...</p>
          </div>
        );
      case 6:
        return (
          <div className="text-center py-8">
            <Network className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Resumen y Firmas</h3>
            <p className="text-gray-500">Componente en desarrollo...</p>
          </div>
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
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Paso {currentStep} de {totalSteps}: {steps[currentStep - 1]?.title}
            </p>
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
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Finalizar Mantención
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
