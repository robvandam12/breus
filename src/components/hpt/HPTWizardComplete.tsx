
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useHPTWizard } from '@/hooks/useHPTWizard';
import { HPTOperationSelector } from './HPTOperationSelector';
import { HPTWizardStep1 } from './HPTWizardStep1';
import { HPTWizardStep2 } from './HPTWizardStep2';
import { HPTWizardStep3 } from './HPTWizardStep3';
import { HPTWizardStep4 } from './HPTWizardStep4';
import { HPTWizardStep5 } from './HPTWizardStep5';
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useAuthRoles } from '@/hooks/useAuthRoles';
import { supabase } from '@/integrations/supabase/client';

interface HPTWizardCompleteProps {
  operacionId?: string;
  hptId?: string;
  onComplete?: (hptId: string) => void;
  onCancel?: () => void;
}

export const HPTWizardComplete: React.FC<HPTWizardCompleteProps> = ({
  operacionId: initialOperacionId,
  hptId,
  onComplete,
  onCancel
}) => {
  const { permissions } = useAuthRoles();
  const [currentOperacionId, setCurrentOperacionId] = useState(initialOperacionId || '');
  const [showOperacionSelector, setShowOperacionSelector] = useState(!initialOperacionId && !hptId);

  const {
    currentStep,
    data,
    steps,
    updateData,
    nextStep,
    prevStep,
    submitHPT,
    isLoading
  } = useHPTWizard(currentOperacionId, hptId);

  // Auto-poblar datos cuando se selecciona una operación
  useEffect(() => {
    const populateOperacionData = async () => {
      if (!currentOperacionId || hptId) return;

      try {
        const { data: operacion, error } = await supabase
          .from('operacion')
          .select(`
            *,
            salmoneras:salmonera_id (nombre, rut),
            centros:centro_id (nombre, ubicacion),
            contratistas:contratista_id (nombre, rut)
          `)
          .eq('id', currentOperacionId)
          .single();

        if (error) throw error;

        // Actualizar los datos usando el método updateData del hook
        const dataToUpdate = {
          empresa_servicio_nombre: operacion.contratistas?.nombre || '',
          centro_trabajo_nombre: operacion.centros?.nombre || '',
          descripcion_tarea: operacion.tareas || ''
        };
        
        // Llamar updateData con cada campo individualmente
        Object.entries(dataToUpdate).forEach(([key, value]) => {
          updateData(key, value);
        });

        console.log('HPT data auto-populated from operation');
      } catch (error) {
        console.error('Error populating operation data:', error);
      }
    };

    populateOperacionData();
  }, [currentOperacionId, hptId, updateData]);

  const handleOperacionSelected = (operacionId: string) => {
    setCurrentOperacionId(operacionId);
    setShowOperacionSelector(false);
  };

  const handleSubmit = async () => {
    try {
      const finalData = {
        ...data,
        operacion_id: currentOperacionId,
        firmado: true,
        estado: 'firmado'
      };
      const result = await submitHPT(finalData);
      if (onComplete && result) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Error submitting HPT:', error);
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

  if (showOperacionSelector) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <HPTOperationSelector 
          onOperacionSelected={handleOperacionSelected}
          selectedOperacionId={currentOperacionId}
        />
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {hptId ? 'Editar' : 'Crear'} HPT (Hoja de Planificación de Trabajo)
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <Badge variant="outline">
              {progress.toFixed(0)}% Completado
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Steps Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : "outline"}
                size="sm"
                className="h-auto p-2 flex flex-col items-center gap-1"
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

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              
              {currentStep < steps.length ? (
                <Button onClick={nextStep}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Enviando...' : 'Completar HPT'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
