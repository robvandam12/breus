
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AnexoBravoStep1 } from './steps/AnexoBravoStep1';
import { AnexoBravoStep2 } from './steps/AnexoBravoStep2';
import { AnexoBravoStep3 } from './steps/AnexoBravoStep3';
import { AnexoBravoStep4 } from './steps/AnexoBravoStep4';
import { AnexoBravoStep5 } from './steps/AnexoBravoStep5';
import { AnexoBravoOperationSelector } from './AnexoBravoOperationSelector';
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { toast } from '@/hooks/use-toast';

interface FullAnexoBravoFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  operacionId?: string;
  anexoId?: string;
}

export const FullAnexoBravoForm: React.FC<FullAnexoBravoFormProps> = ({
  onSubmit,
  onCancel,
  operacionId: initialOperacionId,
  anexoId
}) => {
  const { equipos } = useEquiposBuceoEnhanced();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOperacionId, setCurrentOperacionId] = useState(initialOperacionId || '');
  const [showOperacionSelector, setShowOperacionSelector] = useState(!initialOperacionId && !anexoId);
  const [formData, setFormData] = useState({
    codigo: `AB-${Date.now()}`,
    fecha: new Date().toISOString().split('T')[0],
    supervisor: '',
    jefe_centro: '',
    lugar_faena: '',
    buzo_o_empresa_nombre: '',
    empresa_nombre: '',
    anexo_bravo_checklist: {},
    anexo_bravo_trabajadores: [],
    anexo_bravo_firmas: {},
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_hora_inicio: '',
    bitacora_hora_termino: '',
    bitacora_relator: '',
    autorizacion_armada: false
  });

  const steps = [
    { id: 1, title: "Datos Generales", isValid: !!(formData.codigo && formData.supervisor && formData.jefe_centro) },
    { id: 2, title: "Personal y Equipos", isValid: true },
    { id: 3, title: "Checklist de Seguridad", isValid: true },
    { id: 4, title: "Bitácora", isValid: !!(formData.bitacora_fecha && formData.bitacora_relator) },
    { id: 5, title: "Firmas y Revisión", isValid: true }
  ];

  const progress = (currentStep / steps.length) * 100;

  // Auto-poblar datos cuando se selecciona una operación
  useEffect(() => {
    const populateOperacionData = async () => {
      if (!currentOperacionId || anexoId) return;

      try {
        const { data: operacion, error } = await supabase
          .from('operacion')
          .select(`
            *,
            salmoneras:salmonera_id (nombre, rut),
            sitios:sitio_id (nombre, ubicacion),
            contratistas:contratista_id (nombre, rut)
          `)
          .eq('id', currentOperacionId)
          .single();

        if (error) throw error;

        // Ya no hay equipos asignados automáticamente a operaciones
        // El personal se gestiona a nivel de inmersión individual

        setFormData(prev => ({
          ...prev,
          codigo: `AB-${operacion.codigo}-${Date.now().toString().slice(-4)}`,
          empresa_nombre: operacion.contratistas?.nombre || '',
          lugar_faena: operacion.sitios?.nombre || '',
          buzo_o_empresa_nombre: operacion.contratistas?.nombre || ''
        }));

        console.log('Anexo Bravo data auto-populated from operation');
      } catch (error) {
        console.error('Error populating operation data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la operación",
          variant: "destructive",
        });
      }
    };

    populateOperacionData();
  }, [currentOperacionId, anexoId]);

  const handleOperacionSelected = (operacionId: string) => {
    setCurrentOperacionId(operacionId);
    setShowOperacionSelector(false);
  };

  const updateFormData = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const finalData = {
        ...formData,
        operacion_id: currentOperacionId,
        firmado: true,
        estado: 'firmado'
      };
      await onSubmit(finalData);
    } catch (error) {
      console.error('Error submitting Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el Anexo Bravo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AnexoBravoStep1 data={formData} onUpdate={updateFormData} />;
      case 2:
        return <AnexoBravoStep2 data={formData} onUpdate={updateFormData} />;
      case 3:
        return <AnexoBravoStep3 data={formData} onUpdate={updateFormData} />;
      case 4:
        return <AnexoBravoStep4 data={formData} onUpdate={updateFormData} />;
      case 5:
        return <AnexoBravoStep5 data={formData} onUpdate={updateFormData} />;
      default:
        return null;
    }
  };

  if (showOperacionSelector) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <AnexoBravoOperationSelector 
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header con progreso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {anexoId ? 'Editar' : 'Crear'} Anexo Bravo
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

      {/* Navegación de pasos */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(step.id)}
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

      {/* Contenido del paso actual */}
      {renderStepContent()}

      {/* Navegación inferior */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
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
                <Button onClick={handleNext}>
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
                  {isLoading ? 'Enviando...' : 'Completar Anexo Bravo'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
