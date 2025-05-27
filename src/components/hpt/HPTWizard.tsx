
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Building,
  Shield,
  Users,
  Wrench,
  PenTool
} from "lucide-react";
import { HPTWizardStep1 } from "./HPTWizardStep1";
import { HPTWizardStep2 } from "./HPTWizardStep2";
import { HPTWizardStep3 } from "./HPTWizardStep3";
import { HPTWizardStep4 } from "./HPTWizardStep4";
import { HPTWizardStep5 } from "./HPTWizardStep5";
import { HPTWizardComplete } from "./HPTWizardComplete";
import { HPTWizardData } from "@/hooks/useHPTWizard";

interface HPTWizardProps {
  operacionId?: string;
  onComplete: (hptId: string) => Promise<void>;
  onCancel: () => void;
}

export const HPTWizard = ({ operacionId, onComplete, onCancel }: HPTWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<HPTWizardData>({
    operacion_id: operacionId || '',
    plan_trabajo: '',
    supervisor: '',
    folio: '',
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_termino: '',
    empresa_servicio_nombre: '',
    supervisor_nombre: '',
    centro_trabajo_nombre: '',
    jefe_mandante_nombre: '',
    descripcion_tarea: '',
    es_rutinaria: false,
    lugar_especifico: '',
    estado_puerto: 'abierto',
    hpt_epp: {
      casco: false,
      lentes: false,
      guantes: false,
      botas: false,
      chaleco: false,
      respirador: false,
      arnes: false,
      otros: ''
    },
    hpt_erc: {
      izaje: false,
      buceo: false,
      navegacion: false,
      trabajo_altura: false,
      espacios_confinados: false,
      energia_peligrosa: false,
      materiales_peligrosos: false,
      otros: ''
    },
    hpt_medidas: {
      listas_chequeo_erc_disponibles: 'na',
      personal_competente_disponible: 'na',
      equipos_proteccion_disponibles: 'na',
      procedimientos_emergencia_conocidos: 'na',
      comunicacion_establecida: 'na',
      autorizaciones_vigentes: 'na'
    },
    hpt_riesgos_comp: {
      condiciones_ambientales: { valor: 'na', acciones: '' },
      estado_equipos: { valor: 'na', acciones: '' },
      competencia_personal: { valor: 'na', acciones: '' },
      coordinacion_actividades: { valor: 'na', acciones: '' },
      comunicacion_riesgos: { valor: 'na', acciones: '' }
    },
    hpt_conocimiento: {
      fecha: new Date().toISOString().split('T')[0],
      hora: '',
      duracion: 30,
      relator_nombre: '',
      relator_cargo: '',
      relator_firma_url: ''
    },
    hpt_conocimiento_asistentes: [],
    hpt_firmas: {
      supervisor_servicio_url: '',
      supervisor_mandante_url: ''
    }
  });

  const totalSteps = 5;

  const steps = [
    { number: 1, title: "Información General", icon: Building },
    { number: 2, title: "Equipo de Protección", icon: Shield },
    { number: 3, title: "Evaluación de Riesgos", icon: Wrench },
    { number: 4, title: "Conocimiento", icon: Users },
    { number: 5, title: "Firmas", icon: PenTool }
  ];

  const updateData = (updates: Partial<HPTWizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <HPTWizardStep1 data={data} updateData={updateData} />;
      case 2:
        return <HPTWizardStep2 data={data} updateData={updateData} />;
      case 3:
        return <HPTWizardStep3 data={data} updateData={updateData} />;
      case 4:
        return <HPTWizardStep4 data={data} updateData={updateData} />;
      case 5:
        return <HPTWizardStep5 data={data} updateData={updateData} />;
      default:
        return null;
    }
  };

  const getStepProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Crear HPT
          </h2>
          <p className="text-gray-600">Hoja de Planificación de Tarea</p>
        </div>
        <Badge variant="outline">
          Paso {currentStep} de {totalSteps}
        </Badge>
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-between py-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center ${
              step.number < steps.length ? 'flex-1' : ''
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.number === currentStep
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : step.number < currentStep
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                React.createElement(step.icon, { className: "w-5 h-5" })
              )}
            </div>
            {step.number < steps.length && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
        </div>

        <div>
          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <HPTWizardComplete 
              operacionId={operacionId || ''}
              onComplete={onComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};
