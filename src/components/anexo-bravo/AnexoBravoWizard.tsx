
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileText, AlertTriangle } from "lucide-react";
import { AnexoBravoStep1 } from "./steps/AnexoBravoStep1";
import { AnexoBravoStep2 } from "./steps/AnexoBravoStep2";
import { AnexoBravoStep3 } from "./steps/AnexoBravoStep3";
import { AnexoBravoStep4 } from "./steps/AnexoBravoStep4";
import { AnexoBravoStep5 } from "./steps/AnexoBravoStep5";
import { useToast } from "@/hooks/use-toast";

interface AnexoBravoData {
  // Información General (Paso 1)
  empresa_nombre: string;
  lugar_faena: string;
  fecha: string;
  jefe_centro_nombre: string;
  
  // Identificación del Buzo (Paso 2)
  buzo_o_empresa_nombre: string;
  buzo_matricula: string;
  autorizacion_armada: boolean;
  asistente_buzo_nombre: string;
  asistente_buzo_matricula: string;
  
  // Chequeo de Equipos (Paso 3)
  anexo_bravo_checklist: Record<string, any>;
  
  // Bitácora de Buceo (Paso 4)
  bitacora_hora_inicio: string;
  bitacora_hora_termino: string;
  bitacora_fecha: string;
  bitacora_relator: string;
  anexo_bravo_trabajadores: Array<{
    nombre: string;
    rut: string;
  }>;
  
  // Firmas (Paso 5)
  supervisor_servicio_firma: string | null;
  supervisor_mandante_firma: string | null;
  observaciones_generales: string;
}

interface AnexoBravoWizardProps {
  onSubmit: (data: AnexoBravoData) => void;
  onCancel: () => void;
  initialData?: Partial<AnexoBravoData>;
}

export const AnexoBravoWizard = ({ onSubmit, onCancel, initialData }: AnexoBravoWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [data, setData] = useState<AnexoBravoData>({
    empresa_nombre: "",
    lugar_faena: "",
    fecha: "",
    jefe_centro_nombre: "",
    buzo_o_empresa_nombre: "",
    buzo_matricula: "",
    autorizacion_armada: false,
    asistente_buzo_nombre: "",
    asistente_buzo_matricula: "",
    anexo_bravo_checklist: {},
    bitacora_hora_inicio: "",
    bitacora_hora_termino: "",
    bitacora_fecha: "",
    bitacora_relator: "",
    anexo_bravo_trabajadores: [],
    supervisor_servicio_firma: null,
    supervisor_mandante_firma: null,
    observaciones_generales: "",
    ...initialData,
  });

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [data]);

  const saveDraft = () => {
    try {
      localStorage.setItem('anexo-bravo-draft', JSON.stringify({
        ...data,
        lastSaved: new Date().toISOString()
      }));
      console.log('Anexo Bravo Draft saved automatically');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const updateData = (stepData: Partial<AnexoBravoData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return data.empresa_nombre && data.lugar_faena && data.fecha && data.jefe_centro_nombre;
      case 2:
        return data.buzo_o_empresa_nombre && data.buzo_matricula;
      case 3:
        return Object.keys(data.anexo_bravo_checklist).length > 0;
      case 4:
        return data.bitacora_hora_inicio && data.bitacora_hora_termino && data.bitacora_relator;
      case 5:
        return data.supervisor_servicio_firma && data.supervisor_mandante_firma;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      saveDraft();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNext()) {
      toast({
        title: "Error",
        description: "Complete todos los campos requeridos para finalizar el Anexo Bravo",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      localStorage.removeItem('anexo-bravo-draft');
      toast({
        title: "Anexo Bravo Finalizado",
        description: "El Anexo Bravo ha sido creado exitosamente",
      });
    } catch (error) {
      console.error('Error submitting Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "Error al finalizar el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AnexoBravoStep1 data={data} onUpdate={updateData} />;
      case 2:
        return <AnexoBravoStep2 data={data} onUpdate={updateData} />;
      case 3:
        return <AnexoBravoStep3 data={data} onUpdate={updateData} />;
      case 4:
        return <AnexoBravoStep4 data={data} onUpdate={updateData} />;
      case 5:
        return <AnexoBravoStep5 data={data} onUpdate={updateData} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Información General",
      "Identificación del Buzo",
      "Chequeo de Equipos e Insumos",
      "Bitácora de Buceo y Participantes",
      "Firmas de Autorización"
    ];
    return titles[currentStep - 1];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-orange-600" />
              <div>
                <CardTitle>Anexo Bravo</CardTitle>
                <p className="text-sm text-zinc-500">
                  Paso {currentStep} de {totalSteps}: {getStepTitle()}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-700">
              Draft Auto-guardado
            </Badge>
          </div>
          <Progress value={progressPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            Cancelar
          </Button>
          <Button 
            variant="outline" 
            onClick={saveDraft}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Draft
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext() || isSubmitting}
              className="flex items-center gap-2"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext() || isSubmitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <FileText className="w-4 h-4" />
              {isSubmitting ? 'Finalizando...' : 'Finalizar Anexo Bravo'}
            </Button>
          )}
        </div>
      </div>

      {!canProceedToNext() && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">
              Complete todos los campos requeridos para continuar
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
