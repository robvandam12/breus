import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileText, AlertTriangle } from "lucide-react";
import { HPTStep1 } from "./steps/HPTStep1";
import { HPTStep2 } from "./steps/HPTStep2";
import { HPTStep3 } from "./steps/HPTStep3";
import { HPTStep4 } from "./steps/HPTStep4";
import { HPTStep5 } from "./steps/HPTStep5";
import { HPTStep6 } from "./steps/HPTStep6";
import { useToast } from "@/hooks/use-toast";

interface HPTData {
  // Paso 1: Información General
  operacion_id: string;
  fecha_programada: string;
  hora_inicio: string;
  hora_fin: string;
  supervisor: string;
  jefe_obra: string;
  descripcion_trabajo: string;
  plan_trabajo: string; // Added this property
  
  // Paso 2: Equipo de Buceo
  buzos: Array<{
    nombre: string;
    certificacion: string;
    vencimiento: string;
    rol: string;
  }>;
  asistentes: Array<{
    nombre: string;
    rol: string;
  }>;
  
  // Paso 3: Análisis de Riesgos
  tipo_trabajo: string;
  profundidad_maxima: number;
  corrientes: string;
  visibilidad: string;
  temperatura: number;
  riesgos_identificados: string[];
  medidas_control: string[];
  
  // Paso 4: Equipos y Herramientas
  equipo_buceo: string[];
  herramientas: string[];
  equipo_seguridad: string[];
  equipo_comunicacion: string[];
  
  // Paso 5: Procedimientos de Emergencia
  plan_emergencia: string;
  contactos_emergencia: Array<{
    nombre: string;
    cargo: string;
    telefono: string;
  }>;
  hospital_cercano: string;
  camara_hiperbarica: string;
  
  // Paso 6: Autorizaciones
  supervisor_firma: string | null;
  jefe_obra_firma: string | null;
  observaciones: string;
}

interface HPTWizardProps {
  onSubmit: (data: HPTData) => void;
  onCancel: () => void;
  initialData?: Partial<HPTData>;
}

export const HPTWizard = ({ onSubmit, onCancel, initialData }: HPTWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [data, setData] = useState<HPTData>({
    operacion_id: "",
    fecha_programada: "",
    hora_inicio: "",
    hora_fin: "",
    supervisor: "",
    jefe_obra: "",
    descripcion_trabajo: "",
    plan_trabajo: "",
    buzos: [],
    asistentes: [],
    tipo_trabajo: "",
    profundidad_maxima: 0,
    corrientes: "",
    visibilidad: "",
    temperatura: 0,
    riesgos_identificados: [],
    medidas_control: [],
    equipo_buceo: [],
    herramientas: [],
    equipo_seguridad: [],
    equipo_comunicacion: [],
    plan_emergencia: "",
    contactos_emergencia: [],
    hospital_cercano: "",
    camara_hiperbarica: "",
    supervisor_firma: null,
    jefe_obra_firma: null,
    observaciones: "",
    ...initialData,
  });

  const totalSteps = 6;
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
      localStorage.setItem('hpt-draft', JSON.stringify({
        ...data,
        lastSaved: new Date().toISOString()
      }));
      console.log('HPT Draft saved automatically');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const updateData = (stepData: Partial<HPTData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return data.operacion_id && data.supervisor && data.plan_trabajo;
      case 2:
        return data.buzos.length > 0;
      case 3:
        return data.tipo_trabajo && data.profundidad_maxima > 0;
      case 4:
        return data.equipo_buceo.length > 0;
      case 5:
        return data.plan_emergencia && data.contactos_emergencia.length > 0;
      case 6:
        return data.supervisor_firma && data.jefe_obra_firma;
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
        description: "Complete todos los campos requeridos para finalizar el HPT",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      localStorage.removeItem('hpt-draft');
      toast({
        title: "HPT Finalizada",
        description: "La Hoja de Preparación de Trabajo ha sido creada exitosamente",
      });
    } catch (error) {
      console.error('Error submitting HPT:', error);
      toast({
        title: "Error",
        description: "Error al finalizar el HPT. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <HPTStep1 data={data} onUpdate={updateData} />;
      case 2:
        return <HPTStep2 data={data} onUpdate={updateData} />;
      case 3:
        return <HPTStep3 data={data} onUpdate={updateData} />;
      case 4:
        return <HPTStep4 data={data} onUpdate={updateData} />;
      case 5:
        return <HPTStep5 data={data} onUpdate={updateData} />;
      case 6:
        return <HPTStep6 data={data} onUpdate={updateData} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Información General",
      "Equipo de Buceo",
      "Análisis de Riesgos",
      "Equipos y Herramientas",
      "Procedimientos de Emergencia",
      "Autorizaciones y Firmas"
    ];
    return titles[currentStep - 1];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle>Hoja de Preparación de Trabajo (HPT)</CardTitle>
                <p className="text-sm text-zinc-500">
                  Paso {currentStep} de {totalSteps}: {getStepTitle()}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
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
              {isSubmitting ? 'Finalizando...' : 'Finalizar HPT'}
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
