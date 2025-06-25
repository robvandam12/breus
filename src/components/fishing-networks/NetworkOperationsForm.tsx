
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { NetworkOperationsStep1 } from "./steps/NetworkOperationsStep1";
import { NetworkOperationsStep2 } from "./steps/NetworkOperationsStep2";
import { NetworkOperationsStep3 } from "./steps/NetworkOperationsStep3";
import { NetworkOperationsStep4 } from "./steps/NetworkOperationsStep4";
import { NetworkOperationsStep5 } from "./steps/NetworkOperationsStep5";
import { NetworkOperationsStep6 } from "./steps/NetworkOperationsStep6";
import type { NetworkOperationsData } from '@/types/fishing-networks';

interface NetworkOperationsFormProps {
  onComplete: (data: NetworkOperationsData) => void;
  onCancel: () => void;
  readOnly?: boolean;
  initialData?: NetworkOperationsData;
}

export const NetworkOperationsForm = ({ 
  onComplete, 
  onCancel, 
  readOnly = false,
  initialData 
}: NetworkOperationsFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NetworkOperationsData>(
    initialData || {
      datos_generales: {
        lugar_trabajo: '',
        supervisor: '',
        hora_inicio_faena: '',
        hora_termino_faena: '',
        profundidad_maxima: 0,
        team_s: 0,
        team_e: 0,
        team_b: 0,
        fecha: '',
        temperatura: 0,
        nave_maniobras: '',
        matricula_nave: '',
        estado_puerto: '',
      },
      dotacion: {
        contratista: { rol: 'Contratista', nombre: '', apellido: '', matricula: '' },
        supervisor: { rol: 'Supervisor', nombre: '', apellido: '', matricula: '' },
        buzo_emerg_1: { rol: 'Buzo Emerg 1', nombre: '', apellido: '', matricula: '' },
        buzo_emerg_2: { rol: 'Buzo Emerg 2', nombre: '', apellido: '', matricula: '' },
        buzo_1: { rol: 'Buzo Nº 1', nombre: '', apellido: '', matricula: '' },
        buzo_2: { rol: 'Buzo Nº 2', nombre: '', apellido: '', matricula: '' },
        buzo_3: { rol: 'Buzo Nº 3', nombre: '', apellido: '', matricula: '' },
        buzo_4: { rol: 'Buzo Nº 4', nombre: '', apellido: '', matricula: '' },
        buzo_5: { rol: 'Buzo Nº 5', nombre: '', apellido: '', matricula: '' },
        buzo_6: { rol: 'Buzo Nº 6', nombre: '', apellido: '', matricula: '' },
        buzo_7: { rol: 'Buzo Nº 7', nombre: '', apellido: '', matricula: '' },
        buzo_8: { rol: 'Buzo Nº 8', nombre: '', apellido: '', matricula: '' },
        compresor_1: { rol: 'Compresor 1', nombre: '', apellido: '', matricula: '' },
        compresor_2: { rol: 'Compresor 2', nombre: '', apellido: '', matricula: '' },
      },
      equipo_inmersion: {
        equipo: 'liviano',
        hora_inicio: '',
        hora_termino: '',
        profundidad: 0,
        horometro_inicio: 0,
        horometro_termino: 0,
      },
      observaciones_generales: '',
      firmas: {
        supervisor_buceo: { nombre: '', firma: '' },
        jefe_centro: { nombre: '', firma: '' },
      },
    }
  );

  const totalSteps = 6;

  const updateFormData = (updates: Partial<NetworkOperationsData>) => {
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
      case 1: return "Datos Generales";
      case 2: return "Dotación de Personal";
      case 3: return "Equipo de Inmersión";
      case 4: return "Esquema de Jaulas";
      case 5: return "Observaciones";
      case 6: return "Firmas Digitales";
      default: return "Formulario";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NetworkOperationsStep1
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 2:
        return (
          <NetworkOperationsStep2
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 3:
        return (
          <NetworkOperationsStep3
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 4:
        return <NetworkOperationsStep4 />;
      case 5:
        return (
          <NetworkOperationsStep5
            formData={formData}
            updateFormData={updateFormData}
            readOnly={readOnly}
          />
        );
      case 6:
        return (
          <NetworkOperationsStep6
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
            <Activity className="w-5 h-5" />
            Faenas de Redes - {getStepTitle()}
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

