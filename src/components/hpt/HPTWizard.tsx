
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileText, Shield, AlertTriangle } from "lucide-react";
import { HPTStep1 } from "./steps/HPTStep1";
import { HPTStep2 } from "./steps/HPTStep2";
import { HPTStep3 } from "./steps/HPTStep3";
import { HPTStep4 } from "./steps/HPTStep4";
import { HPTStep5 } from "./steps/HPTStep5";
import { HPTStep6 } from "./steps/HPTStep6";
import { HPTOperationSelector } from "./HPTOperationSelector";
import { useToast } from "@/hooks/use-toast";
import { useHPTWizard, HPTFormData } from "@/hooks/useHPTWizard";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { supabase } from "@/integrations/supabase/client";

interface HPTWizardProps {
  operacionId?: string;
  hptId?: string;
  onComplete?: (hptId: string) => void;
  onCancel?: () => void;
}

export const HPTWizard = ({ operacionId: initialOperacionId, hptId, onComplete, onCancel }: HPTWizardProps) => {
  const { toast } = useToast();
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  const [currentOperacionId, setCurrentOperacionId] = useState(initialOperacionId || '');
  const [showOperacionSelector, setShowOperacionSelector] = useState(!initialOperacionId && !hptId);

  const {
    currentStep,
    formData,
    steps,
    updateFormData,
    nextStep,
    prevStep,
    submitHPT,
    isFormComplete,
    progress,
    isLoading,
    autoSaveEnabled,
    setAutoSaveEnabled
  } = useHPTWizard(currentOperacionId, hptId);

  // Pre-populate data when operation is selected
  useEffect(() => {
    const populateOperationData = async () => {
      if (!currentOperacionId || hptId) return; // Don't populate if editing

      try {
        // Get operation with related data
        const { data: opData, error } = await supabase
          .from('operacion')
          .select(`
            *,
            sitios:sitio_id (nombre, ubicacion),
            contratistas:contratista_id (nombre),
            salmoneras:salmonera_id (nombre)
          `)
          .eq('id', currentOperacionId)
          .single();

        if (error) throw error;

        const operacion = opData;
        
        // Find supervisor from team members if equipo is assigned
        let supervisor = null;
        if (operacion.equipo_buceo_id) {
          const equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);
          supervisor = equipo?.miembros?.find(m => 
            m.rol === 'supervisor'
          );
        }

        // Generate folio based on operation
        const folio = `HPT-${operacion.codigo}-${Date.now().toString().slice(-4)}`;
        
        updateFormData({
          operacion_id: currentOperacionId,
          folio,
          empresa_servicio_nombre: operacion.contratistas?.nombre || '',
          supervisor_nombre: supervisor?.nombre_completo || '',
          centro_trabajo_nombre: operacion.sitios?.nombre || '',
          lugar_especifico: operacion.sitios?.ubicacion || '',
          plan_trabajo: operacion.tareas || '',
          descripcion_tarea: operacion.nombre || 'Operación de buceo comercial'
        });

        console.log('Operation data populated:', {
          operacion,
          supervisor,
          folio
        });

      } catch (error) {
        console.error('Error populating operation data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la operación",
          variant: "destructive",
        });
      }
    };

    populateOperationData();
  }, [currentOperacionId, equipos, updateFormData, toast, hptId]);

  const handleOperacionSelected = (operacionId: string) => {
    setCurrentOperacionId(operacionId);
    setShowOperacionSelector(false);
  };

  const handleNext = () => {
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.isValid) {
      toast({
        title: "Paso incompleto",
        description: "Complete todos los campos requeridos para continuar",
        variant: "destructive",
      });
      return;
    }
    nextStep();
  };

  const handleSubmit = async () => {
    try {
      const finalHptId = await submitHPT();
      if (finalHptId && onComplete) {
        onComplete(finalHptId);
      }
    } catch (error) {
      console.error('Error submitting HPT:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <HPTStep1 data={formData} onUpdate={updateFormData} />;
      case 2:
        return <HPTStep2 data={formData} onUpdate={updateFormData} operacionId={currentOperacionId || ''} />;
      case 3:
        return <HPTStep3 data={formData} onUpdate={updateFormData} />;
      case 4:
        return <HPTStep4 data={formData} onUpdate={updateFormData} />;
      case 5:
        return <HPTStep5 data={formData} onUpdate={updateFormData} />;
      case 6:
        return <HPTStep6 data={formData} onUpdate={updateFormData} />;
      default:
        return null;
    }
  };

  // Show operation selector if no operation selected
  if (showOperacionSelector) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <HPTOperationSelector 
          onOperacionSelected={handleOperacionSelected}
          selectedOperacionId={currentOperacionId}
        />
        
        {onCancel && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onCancel} className="ios-button">
              Cancelar
            </Button>
          </div>
        )}
      </div>
    );
  }

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="h-full max-h-[90vh] flex flex-col">
      {/* Header with Progress */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl text-gray-900">
                {hptId ? 'Editar' : 'Crear'} Hoja de Planificación de Tarea (HPT)
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={autoSaveEnabled ? "default" : "secondary"}
              className={autoSaveEnabled ? "bg-green-100 text-green-700" : ""}
            >
              {autoSaveEnabled ? "Auto-guardado ON" : "Auto-guardado OFF"}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {progress}% Completado
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOperacionSelector(true)}
              className="ios-button-sm"
            >
              Cambiar Operación
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progreso General</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-6">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex-1 ${index < steps.length - 1 ? 'mr-2' : ''}`}
            >
              <div className={`h-2 rounded-full ${
                step.id < currentStep ? 'bg-green-500' : 
                step.id === currentStep ? 'bg-blue-500' : 
                'bg-gray-200'
              }`} />
              <div className="mt-2 text-xs text-center">
                <span className={`${
                  step.id === currentStep ? 'text-blue-600 font-medium' : 
                  step.id < currentStep ? 'text-green-600' : 
                  'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto">
        <Card className="border-0 shadow-none">
          <CardContent className="p-6 md:p-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation - Fixed at bottom */}
      <div className="flex-shrink-0 flex justify-between items-center p-4 md:p-6 gap-4 border-t bg-white">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            className="ios-button min-w-[100px]"
          >
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
            disabled={isLoading}
            className="ios-button min-w-[140px]"
          >
            {autoSaveEnabled ? "Desactivar" : "Activar"} Auto-guardado
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
            className="ios-button flex items-center gap-2 min-w-[100px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!steps[currentStep - 1]?.isValid || isLoading}
              className="ios-button flex items-center gap-2 min-w-[100px] bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isFormComplete || isLoading}
              className="ios-button flex items-center gap-2 min-w-[120px] bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Enviando...' : 'Crear HPT'}
            </Button>
          )}
        </div>
      </div>

      {/* Operation Selector Dialog */}
      {showOperacionSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <HPTOperationSelector 
              onOperacionSelected={handleOperacionSelected}
              selectedOperacionId={currentOperacionId}
            />
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowOperacionSelector(false)}
                className="ios-button"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
