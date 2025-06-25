
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Network } from "lucide-react";
import { NetworkInstallationStep1 } from "./steps/NetworkInstallationStep1";
import { NetworkInstallationStep2 } from "./steps/NetworkInstallationStep2";
import { NetworkInstallationStep3 } from "./steps/NetworkInstallationStep3";
import { NetworkInstallationStep4 } from "./steps/NetworkInstallationStep4";
import { NetworkInstallationStep5 } from "./steps/NetworkInstallationStep5";
import { NetworkInstallationStep6 } from "./steps/NetworkInstallationStep6";
import { NetworkInstallationStep7 } from "./steps/NetworkInstallationStep7";
import type { NetworkInstallationData } from '@/types/fishing-networks';

interface NetworkInstallationFormProps {
  onComplete: (data: NetworkInstallationData) => void;
  onCancel: () => void;
  readOnly?: boolean;
  initialData?: NetworkInstallationData;
}

export const NetworkInstallationForm = ({ 
  onComplete, 
  onCancel, 
  readOnly = false,
  initialData 
}: NetworkInstallationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NetworkInstallationData>(
    initialData || {
      seleccion_inicial: {
        red_lober: false,
        red_pecera: false,
        faena_instalacion: false,
        faena_cambio: false,
        faena_retiro: false,
      },
      instalacion_redes: {
        instalacion_redes: {},
        instalacion_impias: {},
        contrapeso_250kg: {},
        contrapeso_150kg: {},
        reticulado_cabecera: {},
      },
      cambio_franjas: {
        costura_ftc_fcd: '',
        costura_fced_fcs: '',
        costura_fces_fcs: '',
        costura_fma: '',
      },
      cambio_pecera_buzos: {},
      observaciones_generales: '',
      firmas: {
        supervisor_buceo: { nombre: '', firma: '' },
        jefe_centro: { nombre: '', firma: '' },
      },
    }
  );

  const totalSteps = 7;

  const updateFormData = (updates: Partial<NetworkInstallationData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Selección Inicial";
      case 2: return "Leyenda de Franjas";
      case 3: return "Instalación de Loberos/Peceras";
      case 4: return "Cambio de Franjas";
      case 5: return "Cambio de Pecera por Buzo";
      case 6: return "Observaciones Generales";
      case 7: return "Firmas Digitales";
      default: return "Formulario";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NetworkInstallationStep1
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 2:
        return <NetworkInstallationStep2 />;
      case 3:
        return (
          <NetworkInstallationStep3
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 4:
        return (
          <NetworkInstallationStep4
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 5:
        return (
          <NetworkInstallationStep5
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 6:
        return (
          <NetworkInstallationStep6
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 7:
        return (
          <NetworkInstallationStep7
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Instalación / Cambio de Redes - {getStepTitle()}
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Paso {currentStep} de {totalSteps}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {!readOnly && (
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {currentStep === totalSteps ? (
              <Button onClick={handleSubmit}>
                Completar Formulario
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

