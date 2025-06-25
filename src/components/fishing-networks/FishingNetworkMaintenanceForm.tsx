
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Network } from "lucide-react";
import { Step1DatosGenerales } from "./steps/Step1DatosGenerales";
import { DotacionTable } from "./components/DotacionTable";
import { Step3EquipoInmersion } from "./steps/Step3EquipoInmersion";
import { Step4FichasBuzos } from "./steps/Step4FichasBuzos";
import { Step5Otros } from "./steps/Step5Otros";
import { Step6Contingencias } from "./steps/Step6Contingencias";
import { Step7Totales } from "./steps/Step7Totales";
import { Step8Observaciones } from "./steps/Step8Observaciones";
import { Step9Firmas } from "./steps/Step9Firmas";
import type { FishingNetworkMaintenanceData } from '@/types/fishing-networks';

export interface FishingNetworkMaintenanceFormProps {
  initialData?: FishingNetworkMaintenanceData;
  onComplete: (data: FishingNetworkMaintenanceData) => void;
  onCancel: () => void;
  readOnly?: boolean;
}

export const FishingNetworkMaintenanceForm = ({
  initialData,
  onComplete,
  onCancel,
  readOnly = false
}: FishingNetworkMaintenanceFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<FishingNetworkMaintenanceData>(
    initialData || {
      datos_generales: {
        lugar_trabajo: '',
        fecha: '',
        hora_inicio_faena: '',
        hora_termino_faena: '',
        profundidad_maxima: 0,
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
      fichas_buzos: [],
      otros: {
        navegacion_relevo: false,
        cableado_perfilada_buceo: false,
        revision_documental: false,
        relevo: false,
      },
      contingencias: {
        bloom_algas: false,
        enfermedad_peces: false,
        marea_roja: false,
        manejo_cambio_redes: false,
        otro: '',
      },
      totales: {
        horas_inmersion: 0,
        horas_trabajo: 0,
        total_horas: 0,
        jaulas_intervenidas: '',
      },
      observaciones_generales: '',
      firmas: {
        supervisor_buceo: { nombre: '', firma: '' },
        jefe_centro: { nombre: '', firma: '' },
      },
    }
  );

  const steps = [
    { number: 1, title: "Datos Generales", component: Step1DatosGenerales },
    { number: 2, title: "Dotación", component: DotacionTable },
    { number: 3, title: "Equipo Inmersión", component: Step3EquipoInmersion },
    { number: 4, title: "Fichas Buzos", component: Step4FichasBuzos },
    { number: 5, title: "Otros", component: Step5Otros },
    { number: 6, title: "Contingencias", component: Step6Contingencias },
    { number: 7, title: "Totales", component: Step7Totales },
    { number: 8, title: "Observaciones", component: Step8Observaciones },
    { number: 9, title: "Firmas", component: Step9Firmas },
  ];

  const updateFormData = (updates: Partial<FishingNetworkMaintenanceData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (readOnly) {
      onCancel();
      return;
    }
    onComplete(formData);
  };

  const getCurrentStepComponent = () => {
    const StepComponent = steps[currentStep - 1]?.component;
    if (!StepComponent) return <div>Paso no encontrado</div>;

    return (
      <StepComponent
        formData={formData}
        updateFormData={updateFormData}
        readOnly={readOnly}
      />
    );
  };

  const progress = (currentStep / steps.length) * 100;

  // Validar si el formulario está completo para firmas
  const isFormComplete = () => {
    const hasBasicData = formData.datos_generales.lugar_trabajo && formData.datos_generales.fecha;
    const hasFirmas = formData.firmas.supervisor_buceo.firma && formData.firmas.jefe_centro.firma;
    return hasBasicData && hasFirmas;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Boleta de Mantención de Redes</h1>
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
            <Network className="w-5 h-5" />
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
            {getCurrentStepComponent()}
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
            <Button 
              onClick={handleSubmit} 
              className={isFormComplete() ? "bg-green-600 hover:bg-green-700" : ""}
              disabled={readOnly && !isFormComplete()}
            >
              {readOnly ? 'Cerrar' : 'Completar Formulario'}
            </Button>
          )}
        </div>
      </div>

      {/* Estado del formulario */}
      {currentStep === steps.length && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Estado del Formulario</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Datos completos:</span>
              <span className={formData.datos_generales.lugar_trabajo && formData.datos_generales.fecha ? 'text-green-600' : 'text-gray-500'}>
                {formData.datos_generales.lugar_trabajo && formData.datos_generales.fecha ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fichas buzos:</span>
              <span className="text-blue-600">{formData.fichas_buzos.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Firmas:</span>
              <span className={isFormComplete() ? 'text-green-600' : 'text-gray-500'}>
                {(formData.firmas.supervisor_buceo.firma ? 1 : 0) + (formData.firmas.jefe_centro.firma ? 1 : 0)}/2
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total horas:</span>
              <span className="text-blue-600">{formData.totales.total_horas}h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
