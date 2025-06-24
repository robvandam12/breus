
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, FileText } from "lucide-react";
import { EncabezadoGeneral } from "./steps/EncabezadoGeneral";
import { DotacionBuceo } from "./steps/DotacionBuceo";
import { EquiposSuperficie } from "./steps/EquiposSuperficie";
import { FaenasMantencion } from "./steps/FaenasMantencion";
import { SistemasEquipos } from "./steps/SistemasEquipos";
import { ApoyoFaenas } from "./steps/ApoyoFaenas";
import { ResumenInmersiones } from "./steps/ResumenInmersiones";
import { Contingencias } from "./steps/Contingencias";
import { FirmasDigitales } from "./steps/FirmasDigitales";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';
import { toast } from "@/hooks/use-toast";

interface NetworkMaintenanceWizardProps {
  initialData?: NetworkMaintenanceData;
  onComplete: (data: NetworkMaintenanceData) => void;
  onCancel: () => void;
  operationId?: string;
  tipoFormulario: 'mantencion' | 'faena_redes';
  readOnly?: boolean;
}

export const NetworkMaintenanceWizard = ({
  initialData,
  onComplete,
  onCancel,
  operationId,
  tipoFormulario,
  readOnly = false
}: NetworkMaintenanceWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<NetworkMaintenanceData>(
    initialData || {
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
      progreso: 0,
      firmado: false,
      estado: 'borrador' as const,
      tipo_formulario: tipoFormulario
    }
  );

  const steps = [
    { number: 1, title: "Encabezado General", component: EncabezadoGeneral },
    { number: 2, title: "Dotación de Buceo", component: DotacionBuceo },
    { number: 3, title: "Equipos de Superficie", component: EquiposSuperficie },
    { number: 4, title: "Faenas de Mantención", component: FaenasMantencion },
    { number: 5, title: "Sistemas y Equipos", component: SistemasEquipos },
    { number: 6, title: "Apoyo a Faenas", component: ApoyoFaenas },
    { number: 7, title: "Resumen Inmersiones", component: ResumenInmersiones },
    { number: 8, title: "Contingencias", component: Contingencias },
    { number: 9, title: "Firmas Digitales", component: FirmasDigitales }
  ];

  const updateFormData = (updates: Partial<NetworkMaintenanceData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.lugar_trabajo && formData.fecha && formData.hora_inicio);
      case 2:
        return formData.dotacion.length > 0;
      case 3:
        return true; // Equipos de superficie son opcionales
      case 4:
        return formData.faenas_mantencion.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (readOnly || validateStep(currentStep)) {
      const newProgress = Math.round((currentStep / steps.length) * 100);
      updateFormData({ progreso: newProgress });
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (readOnly) {
      onCancel();
      return;
    }
    
    const finalData: NetworkMaintenanceData = {
      ...formData,
      progreso: 100,
      estado: formData.firmado ? 'firmado' : 'pendiente_firma'
    };
    
    onComplete(finalData);
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {tipoFormulario === 'mantencion' ? 'Boleta de Mantención de Redes' : 'Boleta de Faena de Redes'}
          </h1>
          <p className="text-gray-600">
            Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Step Navigator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                ${currentStep >= step.number
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
                }
              `}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="w-12 h-px bg-gray-300 mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {steps[currentStep - 1]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {CurrentStepComponent && (
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
                readOnly={readOnly}
                tipoFormulario={tipoFormulario}
              />
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePrevious}
          disabled={readOnly}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Cancelar' : 'Anterior'}
        </Button>

        <div className="flex gap-2">
          {!readOnly && (
            <Button variant="outline" onClick={() => handleSubmit()}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Borrador
            </Button>
          )}
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={readOnly}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              {readOnly ? 'Cerrar' : 'Completar Formulario'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
