
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HPTWizardStep1 } from './HPTWizardStep1';
import { HPTWizardStep2 } from './HPTWizardStep2';
import { HPTWizardStep3 } from './HPTWizardStep3';
import { HPTWizardStep4 } from './HPTWizardStep4';
import { HPTWizardStep5 } from './HPTWizardStep5';
import { HPTOperationSelector } from './HPTOperationSelector';
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';

interface HPTWizardProps {
  operacionId?: string;
  hptId?: string;
  onComplete?: (hptId: string) => void;
  onCancel?: () => void;
}

export const HPTWizard: React.FC<HPTWizardProps> = ({
  operacionId: initialOperacionId,
  hptId,
  onComplete,
  onCancel
}) => {
  const { equipos } = useEquiposBuceoEnhanced();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOperacionId, setCurrentOperacionId] = useState(initialOperacionId || '');
  const [showOperacionSelector, setShowOperacionSelector] = useState(!initialOperacionId && !hptId);

  const [formData, setFormData] = useState<any>({
    folio: '',
    fecha: new Date().toISOString().split('T')[0],
    empresa_servicio_nombre: '',
    centro_trabajo_nombre: '',
    lugar_especifico: '',
    descripcion_tarea: '',
    plan_trabajo: '',
    supervisor_nombre: '',
    supervisor_cargo: '',
    supervisor_firma: '',
    aprueba_nombre: '',
    aprueba_cargo: '',
    aprueba_firma: '',
    responsable_nombre: '',
    responsable_cargo: '',
    responsable_firma: '',
    riesgos_tarea: [],
    personal_participante: [],
    equipos_utilizados: [],
    procedimientos_seguridad: [],
    observaciones: '',
    operacion_id: currentOperacionId,
    estado: 'borrador'
  });

  const steps = [
    { id: 1, title: "Información General", isValid: !!(formData.folio && formData.fecha && formData.empresa_servicio_nombre && formData.centro_trabajo_nombre) },
    { id: 2, title: "Personal y Supervisor", isValid: !!(formData.supervisor_nombre && formData.responsable_nombre) },
    { id: 3, title: "Análisis de Riesgos", isValid: formData.riesgos_tarea && formData.riesgos_tarea.length > 0 },
    { id: 4, title: "Equipos y Procedimientos", isValid: formData.equipos_utilizados && formData.procedimientos_seguridad },
    { id: 5, title: "Aprobaciones y Observaciones", isValid: true }
  ];

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
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

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
      setCurrentStep(stepNumber);
    }
  };

  const saveDraft = async () => {
    setIsLoading(true);
    try {
      const hptData = { ...formData, operacion_id: currentOperacionId, estado: 'borrador' };
      
      if (hptId) {
        // Update existing HPT
        const { data, error } = await supabase
          .from('hpt')
          .update(hptData)
          .eq('id', hptId)
          .select()
          .single();

        if (error) throw error;
        console.log('HPT actualizado:', data);
      } else {
        // Create new HPT
        const { data, error } = await supabase
          .from('hpt')
          .insert([hptData])
          .select()
          .single();

        if (error) throw error;
        console.log('HPT guardado como borrador:', data);
      }
      
      console.log('HPT guardado como borrador');
    } catch (error) {
      console.error('Error al guardar borrador:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitHPT = async () => {
    setIsLoading(true);
    try {
      const hptData = { ...formData, operacion_id: currentOperacionId, estado: 'firmado', firmado: true };

      if (hptId) {
        // Update existing HPT
        const { data, error } = await supabase
          .from('hpt')
          .update(hptData)
          .eq('id', hptId)
          .select()
          .single();

        if (error) throw error;
        console.log('HPT actualizado y firmado:', data);
        return hptId;
      } else {
        // Create new HPT
        const { data, error } = await supabase
          .from('hpt')
          .insert([hptData])
          .select()
          .single();

        if (error) throw error;
        console.log('HPT firmado y guardado:', data);
        return data.id;
      }
    } catch (error) {
      console.error('Error al firmar HPT:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = () => {
    return steps.every(step => step.isValid);
  };

  // Poblar datos automáticamente cuando se selecciona una operación
  useEffect(() => {
    const populateOperacionData = async () => {
      if (!currentOperacionId || hptId) return; // No poblar si es edición

      try {
        // Obtener datos de la operación
        const { data: operacion, error: opError } = await supabase
          .from('operacion')
          .select(`
            *,
            salmoneras:salmonera_id (nombre, rut),
            sitios:sitio_id (nombre, ubicacion),
            contratistas:contratista_id (nombre, rut)
          `)
          .eq('id', currentOperacionId)
          .single();

        if (opError) throw opError;

        // Since operations no longer have direct team assignments, we'll use available teams
        const availableTeams = equipos || [];
        const selectedTeam = availableTeams.length > 0 ? availableTeams[0] : null;

        // Crear objeto con las propiedades que existen en el tipo de datos
        const autoDataUpdates: any = {
          folio: `HPT-${operacion.codigo}-${Date.now().toString().slice(-4)}`,
          fecha: new Date().toISOString().split('T')[0],
          empresa_servicio_nombre: operacion.contratistas?.nombre || '',
          centro_trabajo_nombre: operacion.sitios?.nombre || '',
          lugar_especifico: operacion.sitios?.ubicacion || '',
          descripcion_tarea: operacion.tareas || 'Operación de buceo comercial',
          plan_trabajo: operacion.nombre || ''
        };

        // Si hay equipo disponible, poblar datos del supervisor
        if (selectedTeam?.miembros) {
          const supervisor = selectedTeam.miembros.find(m => m.rol === 'supervisor');
          if (supervisor) {
            autoDataUpdates.supervisor_nombre = supervisor.nombre_completo;
            autoDataUpdates.supervisor = supervisor.nombre_completo;
          }
        }

        setFormData(prev => ({ ...prev, ...autoDataUpdates }));
        console.log('Datos poblados automáticamente:', autoDataUpdates);
      } catch (error) {
        console.error('Error populating operation data:', error);
      }
    };

    populateOperacionData();
  }, [currentOperacionId, hptId, equipos]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <HPTWizardStep1 data={formData} updateData={updateData} />;
      case 2:
        return <HPTWizardStep2 data={formData} updateData={updateData} />;
      case 3:
        return <HPTWizardStep3 data={formData} updateData={updateData} />;
      case 4:
        return <HPTWizardStep4 data={formData} updateData={updateData} />;
      case 5:
        return <HPTWizardStep5 data={formData} updateData={updateData} />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showOperacionSelector && (
        <HPTOperationSelector
          onOperacionSelected={setCurrentOperacionId}
          selectedOperacionId={currentOperacionId}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {hptId ? 'Editar' : 'Crear'} Hoja de Planificación de Tarea (HPT)
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Paso {currentStep} de {totalSteps}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <Badge variant="outline">
              {progress.toFixed(0)}% Completado
            </Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(step.id)}
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

      {renderStepContent()}

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Guardando...' : 'Guardar Borrador'}
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!steps[currentStep - 1]?.isValid}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={submitHPT}
                  disabled={!isFormComplete() || isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
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
