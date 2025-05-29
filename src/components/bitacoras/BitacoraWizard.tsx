
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileText, Users } from "lucide-react";
import { BitacoraStep1 } from "./steps/BitacoraStep1";
import { BitacoraStep2 } from "./steps/BitacoraStep2";
import { BitacoraStep3 } from "./steps/BitacoraStep3";
import { useToast } from "@/hooks/use-toast";

export interface BitacoraSupervisorData {
  // 1. Identificación de la Faena
  fecha_inicio_faena: string;
  hora_inicio_faena: string;
  fecha_termino_faena: string;
  hora_termino_faena: string;
  lugar_trabajo: string;
  tipo_trabajo: string;
  supervisor_nombre_matricula: string;
  
  // 2. Buzos y Asistentes (hasta 6)
  bs_personal: Array<{
    nombre: string;
    matricula: string;
    cargo: string;
    serie_profundimetro: string;
    color_profundimetro: string;
  }>;
  
  // 3. Equipos Usados (hasta 3 bloques)
  bs_equipos_usados: Array<{
    equipo: string;
    numero_registro: string;
  }>;
  
  // 4. Observaciones condiciones físicas previas
  observaciones_previas: string;
  
  // 5. Embarcación de Apoyo
  embarcacion_nombre_matricula: string;
  
  // 6. Tiempo de Buceo
  tiempo_total_buceo: string;
  incluye_descompresion: boolean;
  
  // 7. Contratista de Buceo
  contratista_nombre: string;
  
  // 8. Datos del Buzo Principal
  buzo_principal_datos: {
    apellido_paterno: string;
    apellido_materno: string;
    nombres: string;
    run: string;
  };
  
  // 9. Profundidades
  profundidad_trabajo_mts: number;
  profundidad_maxima_mts: number;
  requiere_camara_hiperbarica: boolean;
  
  // 10. Gestión Preventiva Según Decreto N°44
  gestprev_eval_riesgos_actualizada: boolean;
  gestprev_procedimientos_disponibles_conocidos: boolean;
  gestprev_capacitacion_previa_realizada: boolean;
  gestprev_identif_peligros_control_riesgos_subacuaticos_realizados: boolean;
  gestprev_registro_incidentes_reportados: boolean;
  
  // 11. Medidas Correctivas Implementadas
  medidas_correctivas_texto: string;
  
  // 12. Observaciones Generales
  observaciones_generales_texto: string;
  
  // 13. Firma
  supervisor_buceo_firma: string | null;
  inmersion_id?: string;
}

interface BitacoraWizardProps {
  onSubmit: (data: BitacoraSupervisorData) => void;
  onCancel: () => void;
  initialData?: Partial<BitacoraSupervisorData>;
  inmersionId?: string;
}

export const BitacoraWizard = ({ onSubmit, onCancel, initialData, inmersionId }: BitacoraWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [data, setData] = useState<BitacoraSupervisorData>({
    fecha_inicio_faena: "",
    hora_inicio_faena: "",
    fecha_termino_faena: "",
    hora_termino_faena: "",
    lugar_trabajo: "",
    tipo_trabajo: "",
    supervisor_nombre_matricula: "",
    bs_personal: [],
    bs_equipos_usados: [],
    observaciones_previas: "",
    embarcacion_nombre_matricula: "",
    tiempo_total_buceo: "",
    incluye_descompresion: false,
    contratista_nombre: "",
    buzo_principal_datos: {
      apellido_paterno: "",
      apellido_materno: "",
      nombres: "",
      run: ""
    },
    profundidad_trabajo_mts: 0,
    profundidad_maxima_mts: 0,
    requiere_camara_hiperbarica: false,
    gestprev_eval_riesgos_actualizada: false,
    gestprev_procedimientos_disponibles_conocidos: false,
    gestprev_capacitacion_previa_realizada: false,
    gestprev_identif_peligros_control_riesgos_subacuaticos_realizados: false,
    gestprev_registro_incidentes_reportados: false,
    medidas_correctivas_texto: "",
    observaciones_generales_texto: "",
    supervisor_buceo_firma: null,
    inmersion_id: inmersionId,
    ...initialData,
  });

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateData = (stepData: Partial<BitacoraSupervisorData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return data.fecha_inicio_faena && data.lugar_trabajo && data.tipo_trabajo;
      case 2:
        return data.bs_personal.length > 0 && data.contratista_nombre;
      case 3:
        return data.supervisor_buceo_firma && data.observaciones_generales_texto;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
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
        description: "Complete todos los campos requeridos para finalizar la bitácora",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast({
        title: "Bitácora Finalizada",
        description: "La Bitácora de Supervisor ha sido creada exitosamente",
      });
    } catch (error) {
      console.error('Error submitting bitácora:', error);
      toast({
        title: "Error",
        description: "Error al finalizar la bitácora. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BitacoraStep1 data={data} onUpdate={updateData} />;
      case 2:
        return <BitacoraStep2 data={data} onUpdate={updateData} />;
      case 3:
        return <BitacoraStep3 data={data} onUpdate={updateData} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Identificación y Personal",
      "Equipos y Condiciones",
      "Gestión Preventiva y Firmas"
    ];
    return titles[currentStep - 1];
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <Card className="mb-6 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl">Bitácora de Supervisor</CardTitle>
                <p className="text-sm text-zinc-500">
                  Paso {currentStep} de {totalSteps}: {getStepTitle()}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Auto-guardado
            </Badge>
          </div>
          <Progress value={progressPercentage} className="mt-4 h-2" />
        </CardHeader>
      </Card>

      <Card className="shadow-lg">
        <CardContent className="p-6 md:p-8">
          {renderStep()}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-6 gap-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Cancelar
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-2 min-w-[100px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext() || isSubmitting}
              className="flex items-center gap-2 min-w-[100px] bg-purple-600 hover:bg-purple-700"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext() || isSubmitting}
              className="flex items-center gap-2 min-w-[120px] bg-green-600 hover:bg-green-700"
            >
              <FileText className="w-4 h-4" />
              {isSubmitting ? 'Finalizando...' : 'Finalizar Bitácora'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
