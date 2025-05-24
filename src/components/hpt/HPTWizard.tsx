
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

interface HPTData {
  // Paso 1: Información General
  operacionId: string;
  fechaProgramada: string;
  horaInicio: string;
  horaFin: string;
  supervisor: string;
  jefeObra: string;
  descripcionTrabajo: string;
  
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
  tipoTrabajo: string;
  profundidadMaxima: number;
  corrientes: string;
  visibilidad: string;
  temperatura: number;
  riesgosIdentificados: string[];
  medidasControl: string[];
  
  // Paso 4: Equipos y Herramientas
  equipoBuceo: string[];
  herramientas: string[];
  equipoSeguridad: string[];
  equipoComunicacion: string[];
  
  // Paso 5: Procedimientos de Emergencia
  planEmergencia: string;
  contactosEmergencia: Array<{
    nombre: string;
    cargo: string;
    telefono: string;
  }>;
  hospitalCercano: string;
  camaraHiperbarica: string;
  
  // Paso 6: Autorizaciones
  supervisorFirma: string | null;
  jefeObraFirma: string | null;
  observaciones: string;
}

interface HPTWizardProps {
  onSubmit: (data: HPTData) => void;
  onCancel: () => void;
  initialData?: Partial<HPTData>;
}

export const HPTWizard = ({ onSubmit, onCancel, initialData }: HPTWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<HPTData>({
    operacionId: "",
    fechaProgramada: "",
    horaInicio: "",
    horaFin: "",
    supervisor: "",
    jefeObra: "",
    descripcionTrabajo: "",
    buzos: [],
    asistentes: [],
    tipoTrabajo: "",
    profundidadMaxima: 0,
    corrientes: "",
    visibilidad: "",
    temperatura: 0,
    riesgosIdentificados: [],
    medidasControl: [],
    equipoBuceo: [],
    herramientas: [],
    equipoSeguridad: [],
    equipoComunicacion: [],
    planEmergencia: "",
    contactosEmergencia: [],
    hospitalCercano: "",
    camaraHiperbarica: "",
    supervisorFirma: null,
    jefeObraFirma: null,
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
    localStorage.setItem('hpt-draft', JSON.stringify({
      ...data,
      lastSaved: new Date().toISOString()
    }));
    console.log('HPT Draft saved automatically');
  };

  const updateData = (stepData: Partial<HPTData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return data.operacionId && data.fechaProgramada && data.supervisor && data.jefeObra;
      case 2:
        return data.buzos.length > 0;
      case 3:
        return data.tipoTrabajo && data.profundidadMaxima > 0;
      case 4:
        return data.equipoBuceo.length > 0;
      case 5:
        return data.planEmergencia && data.contactosEmergencia.length > 0;
      case 6:
        return data.supervisorFirma && data.jefeObraFirma;
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

  const handleSubmit = () => {
    if (data.supervisorFirma && data.jefeObraFirma) {
      onSubmit(data);
      localStorage.removeItem('hpt-draft');
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
            className="flex items-center gap-2"
          >
            Cancelar
          </Button>
          <Button 
            variant="outline" 
            onClick={saveDraft}
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
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className="flex items-center gap-2"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext()}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <FileText className="w-4 h-4" />
              Finalizar HPT
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
