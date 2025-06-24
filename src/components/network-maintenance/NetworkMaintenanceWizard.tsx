
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Save, Check } from "lucide-react";
import { EncabezadoGeneral } from "./forms/EncabezadoGeneral";
import { DotacionBuceo } from "./forms/DotacionBuceo";
import { EquiposSuperficie } from "./forms/EquiposSuperficie";
import { FaenasMantencion } from "./forms/FaenasMantencion";
import { SistemasEquipos } from "./steps/SistemasEquipos";
import { FirmasDigitales } from "./forms/FirmasDigitales";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface NetworkMaintenanceWizardProps {
  operationId?: string;
  onComplete?: (data: NetworkMaintenanceData) => void;
  onCancel?: () => void;
}

export const NetworkMaintenanceWizard = ({ 
  operationId, 
  onComplete, 
  onCancel 
}: NetworkMaintenanceWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<NetworkMaintenanceData>({
    codigo: `NM-${Date.now()}`,
    operacion_id: operationId || '',
    tipo_formulario: 'mantencion_redes',
    estado: 'borrador',
    progreso: 0,
    
    // Encabezado General
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
    
    // Arrays for repeatable sections
    dotacion_buceo: [],
    equipos_superficie: [],
    faenas_mantencion: [],
    sistemas_equipos: [],
    
    // Firmas
    firmas: {
      supervisor_nombre: '',
      supervisor_firma: '',
      supervisor_firmado: false,
      jefe_centro_nombre: '',
      jefe_centro_firma: '',
      jefe_centro_firmado: false
    }
  });

  const steps = [
    {
      id: 'encabezado',
      title: 'Encabezado General',
      description: 'Información básica de la faena'
    },
    {
      id: 'dotacion',
      title: 'Dotación de Buceo', 
      description: 'Personal y roles asignados'
    },
    {
      id: 'equipos',
      title: 'Equipos de Superficie',
      description: 'Equipos utilizados en superficie'
    },
    {
      id: 'faenas',
      title: 'Faenas de Mantención',
      description: 'Trabajos realizados en redes'
    },
    {
      id: 'sistemas',
      title: 'Sistemas y Equipos',
      description: 'Trabajos en sistemas de jaulas'
    },
    {
      id: 'firmas',
      title: 'Firmas Digitales',
      description: 'Autorización y validación'
    }
  ];

  const updateFormData = (updates: Partial<NetworkMaintenanceData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      // Calculate progress based on completed sections
      const totalSections = steps.length;
      const completedSections = calculateCompletedSections(newData);
      newData.progreso = Math.round((completedSections / totalSections) * 100);
      return newData;
    });
  };

  const calculateCompletedSections = (data: NetworkMaintenanceData): number => {
    let completed = 0;
    
    // Encabezado
    if (data.lugar_trabajo && data.fecha && data.hora_inicio) completed++;
    
    // Dotación
    if (data.dotacion_buceo && data.dotacion_buceo.length > 0) completed++;
    
    // Equipos
    if (data.equipos_superficie && data.equipos_superficie.length > 0) completed++;
    
    // Faenas  
    if (data.faenas_mantencion && data.faenas_mantencion.length > 0) completed++;
    
    // Sistemas
    if (data.sistemas_equipos && data.sistemas_equipos.length > 0) completed++;
    
    // Firmas
    if (data.firmas?.supervisor_firmado && data.firmas?.jefe_centro_firmado) completed++;
    
    return completed;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    const finalData = {
      ...formData,
      estado: formData.firmas?.supervisor_firmado && formData.firmas?.jefe_centro_firmado ? 'completado' : 'borrador'
    };
    
    onComplete?.(finalData);
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'encabezado':
        return (
          <EncabezadoGeneral
            data={{
              lugar_trabajo: formData.lugar_trabajo,
              fecha: formData.fecha,
              temperatura: formData.temperatura,
              hora_inicio: formData.hora_inicio,
              hora_termino: formData.hora_termino,
              profundidad_max: formData.profundidad_max,
              nave_maniobras: formData.nave_maniobras,
              team_s: formData.team_s,
              team_be: formData.team_be,
              team_bi: formData.team_bi,
              matricula_nave: formData.matricula_nave,
              estado_puerto: formData.estado_puerto
            }}
            onChange={(field, value) => updateFormData({ [field]: value })}
          />
        );
      case 'dotacion':
        return (
          <DotacionBuceo
            data={formData.dotacion_buceo || []}
            onChange={(data) => updateFormData({ dotacion_buceo: data })}
          />
        );
      case 'equipos':
        return (
          <EquiposSuperficie
            data={formData.equipos_superficie || []}
            onChange={(data) => updateFormData({ equipos_superficie: data })}
          />
        );
      case 'faenas':
        return (
          <FaenasMantencion
            data={formData.faenas_mantencion || []}
            onChange={(data) => updateFormData({ faenas_mantencion: data })}
          />
        );
      case 'sistemas':
        return (
          <SistemasEquipos
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 'firmas':
        return (
          <FirmasDigitales
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFormComplete = formData.firmas?.supervisor_firmado && formData.firmas?.jefe_centro_firmado;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Mantención de Redes</h2>
            <Badge variant="outline">
              Progreso: {formData.progreso}%
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className="flex flex-col items-center min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === currentStep
                        ? 'bg-blue-500 text-white'
                        : index < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex items-center space-x-2">
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              
              {isLastStep ? (
                <Button onClick={handleSave} disabled={!isFormComplete}>
                  <Save className="w-4 h-4 mr-2" />
                  {isFormComplete ? 'Guardar Completado' : 'Guardar Borrador'}
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
