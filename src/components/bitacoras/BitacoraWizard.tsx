
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileText, Users } from "lucide-react";
import { BitacoraStep1 } from "./steps/BitacoraStep1";
import { BitacoraStep2 } from "./steps/BitacoraStep2";
import { BitacoraStep4 } from "./steps/BitacoraStep4";
import { BitacoraStep5 } from "./steps/BitacoraStep5";
import { useToast } from "@/hooks/use-toast";

export interface BitacoraSupervisorData {
  // 1. Información General de la Faena
  fecha_inicio_faena: string;
  hora_inicio_faena: string;
  hora_termino_faena: string;
  lugar_trabajo: string;
  supervisor_nombre_matricula: string;
  estado_mar: string;
  visibilidad_fondo: number;
  
  // 2. Registro de Inmersión por Buzo
  inmersiones_buzos: Array<{
    id: string;
    nombre: string;
    profundidad_maxima: number;
    hora_dejo_superficie: string;
    hora_llego_superficie: string;
    tiempo_descenso: number;
    tiempo_fondo: number;
    tiempo_ascenso: number;
    tabulacion_usada: string;
    tiempo_usado: number;
  }>;
  
  // 3. Datos Técnicos de la Faena
  equipos_utilizados: Array<{
    id: string;
    nombre: string;
    matricula: string;
    vigencia: string;
  }>;
  trabajo_a_realizar: string;
  descripcion_trabajo: string;
  embarcacion_apoyo: string;
  
  // 4. Cierre y Validación
  observaciones_generales_texto: string;
  validacion_contratista: boolean;
  comentarios_validacion: string;
  
  // Campos técnicos
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
  observaciones_previas: string;
  embarcacion_nombre_matricula: string;
  tiempo_total_buceo: string;
  incluye_descompresion: boolean;
  contratista_nombre: string;
  buzo_principal_datos: {
    apellido_paterno: string;
    apellido_materno: string;
    nombres: string;
    run: string;
  };
  profundidad_trabajo_mts: number;
  profundidad_maxima_mts: number;
  requiere_camara_hiperbarica: boolean;
  gestprev_eval_riesgos_actualizada: boolean;
  gestprev_procedimientos_disponibles_conocidos: boolean;
  gestprev_capacitacion_previa_realizada: boolean;
  gestprev_identif_peligros_control_riesgos_subacuaticos_realizados: boolean;
  gestprev_registro_incidentes_reportados: boolean;
  medidas_correctivas_texto: string;
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
    hora_termino_faena: "",
    lugar_trabajo: "",
    supervisor_nombre_matricula: "",
    estado_mar: "",
    visibilidad_fondo: 0,
    inmersiones_buzos: [],
    equipos_utilizados: [],
    trabajo_a_realizar: "",
    descripcion_trabajo: "",
    embarcacion_apoyo: "",
    observaciones_generales_texto: "",
    validacion_contratista: false,
    comentarios_validacion: "",
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
    supervisor_buceo_firma: null,
    inmersion_id: inmersionId,
    ...initialData,
  });

  const totalSteps = 4; // Paso 1, 2, 4, 5 (saltamos el 3)
  const stepMapping = [1, 2, 4, 5]; // Mapeo de pasos mostrados a pasos reales
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateData = (stepData: Partial<BitacoraSupervisorData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return data.fecha_inicio_faena && data.lugar_trabajo && data.supervisor_nombre_matricula && data.estado_mar;
      case 2:
        return data.inmersiones_buzos.length > 0;
      case 3: // Paso 4 real
        return data.equipos_utilizados.length > 0 && data.trabajo_a_realizar;
      case 4: // Paso 5 real
        return data.observaciones_generales_texto.trim().length > 0;
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
        title: "Bitácora Creada",
        description: "La Bitácora de Supervisor ha sido creada exitosamente. Ahora puede firmarla desde la lista.",
      });
    } catch (error) {
      console.error('Error submitting bitácora:', error);
      toast({
        title: "Error",
        description: "Error al crear la bitácora. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const realStep = stepMapping[currentStep - 1];
    switch (realStep) {
      case 1:
        return <BitacoraStep1 data={data} onUpdate={updateData} />;
      case 2:
        return <BitacoraStep2 data={data} onUpdate={updateData} />;
      case 4:
        return <BitacoraStep4 data={data} onUpdate={updateData} />;
      case 5:
        return <BitacoraStep5 data={data} onUpdate={updateData} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      "Información General",
      "Registro de Inmersión",
      "Datos Técnicos",
      "Cierre y Validación"
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
              {isSubmitting ? 'Creando...' : 'Crear Bitácora'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
