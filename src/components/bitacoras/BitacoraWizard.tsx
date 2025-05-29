
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BitacoraStep1 } from "./steps/BitacoraStep1";
import { BitacoraStep2 } from "./steps/BitacoraStep2";
import { BitacoraStep3 } from "./steps/BitacoraStep3";
import { BitacoraStep4 } from "./steps/BitacoraStep4";
import { BitacoraStep5 } from "./steps/BitacoraStep5";
import { CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";

export interface BitacoraSupervisorData {
  // Paso 1 - Información General
  fecha_inicio_faena: string;
  fecha_termino_faena: string;
  hora_inicio_faena: string;
  hora_termino_faena: string;
  lugar_trabajo: string;
  tipo_trabajo: string;
  supervisor_nombre_matricula: string;
  observaciones_previas: string;
  estado_mar: string;
  visibilidad_fondo: string;

  // Paso 2 - Personal y Equipos
  bs_personal: Array<{
    nombre: string;
    matricula: string;
    cargo: string;
    serie_profundimetro: string;
    color_profundimetro: string;
  }>;
  bs_equipos_usados: Array<{
    equipo: string;
    numero_registro: string;
  }>;
  embarcacion_nombre_matricula: string;
  tiempo_total_buceo: string;
  contratista_nombre: string;
  buzo_principal_datos: {
    apellido_paterno: string;
    apellido_materno: string;
    nombres: string;
    run: string;
  };

  // Paso 2 - Registros de Inmersión (nuevo)
  registros_inmersion: Array<{
    buzo_id: string;
    buzo_nombre: string;
    profundidad_maxima: number;
    hora_dejo_superficie: string;
    hora_llego_superficie: string;
    tiempo_descenso: number;
    tiempo_fondo: number;
    tiempo_ascenso: number;
    tabulacion_usada: string;
    tiempo_usado: number;
  }>;

  // Paso 3 - Inmersiones
  inmersiones: Array<{
    codigo: string;
    buzo: string;
    profundidad: number;
    tiempo: string;
    observaciones: string;
  }>;

  // Paso 3 - Profundidades y Gestión Preventiva (campos faltantes)
  profundidad_trabajo_mts: number;
  profundidad_maxima_mts: number;
  gestprev_eval_riesgos_actualizada: boolean;
  gestprev_procedimientos_disponibles_conocidos: boolean;
  gestprev_capacitacion_previa_realizada: boolean;
  gestprev_identif_peligros_control_riesgos_subacuaticos_realizados: boolean;
  gestprev_registro_incidentes_reportados: boolean;
  medidas_correctivas_texto: string;
  observaciones_generales_texto: string;
  supervisor_buceo_firma: string | null;

  // Paso 4 - Datos Técnicos (nuevo)
  equipos_utilizados: string[];
  matricula_equipo: string;
  vigencia_equipo: string;
  trabajo_realizar: string;
  embarcacion_apoyo: string;

  // Paso 5 - Cierre y Validación (nuevo)
  validacion_contratista: boolean;

  // Otros campos
  operacion_id: string;
  inmersion_id: string;
}

interface BitacoraWizardProps {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  operacionId?: string;
}

export const BitacoraWizard = ({ 
  data, 
  onUpdate, 
  onSubmit, 
  onCancel,
  operacionId 
}: BitacoraWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { 
      id: 1, 
      title: 'Información General', 
      isValid: !!(data.fecha_inicio_faena && data.lugar_trabajo && data.supervisor_nombre_matricula) 
    },
    { 
      id: 2, 
      title: 'Registro de Inmersión', 
      isValid: data.registros_inmersion && data.registros_inmersion.length > 0 
    },
    { 
      id: 3, 
      title: 'Inmersiones', 
      isValid: data.inmersiones && data.inmersiones.length > 0 
    },
    { 
      id: 4, 
      title: 'Datos Técnicos', 
      isValid: !!(data.equipos_utilizados && data.trabajo_realizar) 
    },
    { 
      id: 5, 
      title: 'Cierre y Validación', 
      isValid: true 
    }
  ];

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const getProgress = () => {
    return Math.round((currentStep / steps.length) * 100);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BitacoraStep1 data={data} onUpdate={onUpdate} />;
      case 2:
        return <BitacoraStep2 data={data} onUpdate={onUpdate} />;
      case 3:
        return <BitacoraStep3 data={data} onUpdate={onUpdate} />;
      case 4:
        return <BitacoraStep4 data={data} onUpdate={onUpdate} />;
      case 5:
        return <BitacoraStep5 data={data} onUpdate={onUpdate} />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  const isFormValid = () => {
    return steps.every(step => step.isValid);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header with progress */}
      <Card className="ios-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Crear Bitácora de Supervisor</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <Badge variant={operacionId ? "default" : "secondary"}>
              {operacionId ? 'Con Operación' : 'Independiente'}
            </Badge>
          </div>
          <Progress value={getProgress()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step navigation */}
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(step.id)}
                className="ios-button h-auto p-2 flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-1">
                  {step.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span className="font-semibold">{step.id}</span>
                </div>
                <span className="text-xs text-center leading-tight">
                  {step.title}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current step content */}
      {renderStepContent()}

      {/* Bottom navigation */}
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="ios-button"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} className="ios-button">
                Cancelar
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!steps[currentStep - 1]?.isValid}
                  className="ios-button"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={onSubmit}
                  disabled={!isFormValid()}
                  className="ios-button bg-green-600 hover:bg-green-700"
                >
                  Completar Bitácora
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
