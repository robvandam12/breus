
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, X, ChevronRight, ChevronLeft } from "lucide-react";
import { BitacoraInmersionSelector } from "./BitacoraInmersionSelector";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoraEnhanced";
import { Separator } from "@/components/ui/separator";
import { bitacoraBuzoFormSchema, BitacoraBuzoFormValues } from "./buzoFormSchema";
import { Step2Personal } from "./buzo-form-steps/Step2Personal";
import { Step3Ambiental } from "./buzo-form-steps/Step3Ambiental";
import { Step4Tecnico } from "./buzo-form-steps/Step4Tecnico";
import { Step5Tiempos } from "./buzo-form-steps/Step5Tiempos";
import { Step6Trabajo } from "./buzo-form-steps/Step6Trabajo";
import { useToast } from "@/hooks/use-toast";

interface CreateBitacoraBuzoFormCompleteProps {
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
  inmersionId?: string;
}

export const CreateBitacoraBuzoFormComplete = ({ 
  onSubmit, 
  onCancel,
  inmersionId,
}: CreateBitacoraBuzoFormCompleteProps) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(inmersionId ? 2 : 1);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>(inmersionId || '');
  const totalSteps = 6;
  const { toast } = useToast();

  const form = useForm<BitacoraBuzoFormValues>({
    resolver: zodResolver(bitacoraBuzoFormSchema),
    defaultValues: {
      inmersion_id: inmersionId || "",
      empresa_nombre: "",
      centro_nombre: "",
      buzo: "",
      datostec_equipo_usado: "",
      objetivo_proposito: "",
      trabajos_realizados: "",
      estado_fisico_post: "",
      profundidad_maxima: 0,
      condcert_buceo_altitud: false,
      condcert_certificados_equipos_usados: false,
      condcert_buceo_areas_confinadas: false
    }
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    register,
    formState: { errors },
  } = form;
  
  const formValues = watch();
  const draftKey = `bitacora_buzo_draft_${selectedInmersionId}`;

  useEffect(() => {
    if (selectedInmersionId) {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        reset(JSON.parse(savedDraft));
        toast({
          title: "Borrador Cargado",
          description: "Se ha cargado un borrador guardado para esta inmersión.",
        });
      }
    }
  }, [selectedInmersionId, reset, draftKey, toast]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (selectedInmersionId) {
        localStorage.setItem(draftKey, JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedInmersionId, draftKey]);

  const handleInmersionSelected = (inmersionId: string) => {
    setSelectedInmersionId(inmersionId);
    setValue('inmersion_id', inmersionId);
    setCurrentStep(2);
  };

  const handleFormSubmit = async (data: BitacoraBuzoFormValues) => {
    setLoading(true);
    try {
      const formData: BitacoraBuzoFormData = {
        codigo: `BIT-BUZ-${Date.now()}`,
        inmersion_id: data.inmersion_id,
        buzo: data.buzo,
        fecha: new Date().toISOString().split('T')[0],
        trabajos_realizados: data.trabajos_realizados,
        observaciones_tecnicas: data.observaciones_tecnicas,
        estado_fisico_post: data.estado_fisico_post,
        profundidad_maxima: data.profundidad_maxima,
        firmado: false,
        estado_aprobacion: 'pendiente',
        // Campos completos
        folio: data.folio,
        codigo_verificacion: data.codigo_verificacion,
        empresa_nombre: data.empresa_nombre,
        centro_nombre: data.centro_nombre,
        buzo_rut: data.buzo_rut,
        supervisor_nombre: data.supervisor_nombre,
        supervisor_rut: data.supervisor_rut,
        supervisor_correo: data.supervisor_correo,
        jefe_centro_correo: data.jefe_centro_correo,
        contratista_nombre: data.contratista_nombre,
        contratista_rut: data.contratista_rut,
        // Condiciones ambientales
        condamb_estado_puerto: data.condamb_estado_puerto,
        condamb_estado_mar: data.condamb_estado_mar,
        condamb_temp_aire_c: data.condamb_temp_aire_c,
        condamb_temp_agua_c: data.condamb_temp_agua_c,
        condamb_visibilidad_fondo_mts: data.condamb_visibilidad_fondo_mts,
        condamb_corriente_fondo_nudos: data.condamb_corriente_fondo_nudos,
        // Datos técnicos del buceo
        datostec_equipo_usado: data.datostec_equipo_usado,
        datostec_traje: data.datostec_traje,
        datostec_hora_dejo_superficie: data.datostec_hora_dejo_superficie,
        datostec_hora_llegada_fondo: data.datostec_hora_llegada_fondo,
        datostec_hora_salida_fondo: data.datostec_hora_salida_fondo,
        datostec_hora_llegada_superficie: data.datostec_hora_llegada_superficie,
        // Tiempos y tabulación
        tiempos_total_fondo: data.tiempos_total_fondo,
        tiempos_total_descompresion: data.tiempos_total_descompresion,
        tiempos_total_buceo: data.tiempos_total_buceo,
        tiempos_tabulacion_usada: data.tiempos_tabulacion_usada,
        tiempos_intervalo_superficie: data.tiempos_intervalo_superficie,
        tiempos_nitrogeno_residual: data.tiempos_nitrogeno_residual,
        tiempos_grupo_repetitivo_anterior: data.tiempos_grupo_repetitivo_anterior,
        tiempos_nuevo_grupo_repetitivo: data.tiempos_nuevo_grupo_repetitivo,
        // Objetivo del buceo
        objetivo_proposito: data.objetivo_proposito,
        objetivo_tipo_area: data.objetivo_tipo_area,
        objetivo_caracteristicas_dimensiones: data.objetivo_caracteristicas_dimensiones,
        // Condiciones y certificaciones
        condcert_buceo_altitud: data.condcert_buceo_altitud,
        condcert_certificados_equipos_usados: data.condcert_certificados_equipos_usados,
        condcert_buceo_areas_confinadas: data.condcert_buceo_areas_confinadas,
        condcert_observaciones: data.condcert_observaciones,
        // Validador final
        validador_nombre: data.validador_nombre
      };

      await onSubmit(formData);
      localStorage.removeItem(draftKey);
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (inmersionId && currentStep === 2) {
      onCancel();
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (currentStep === 1 && !inmersionId) {
    return (
      <div className="max-w-5xl mx-auto">
        <BitacoraInmersionSelector 
          onInmersionSelected={handleInmersionSelected}
          selectedInmersionId={selectedInmersionId}
        />
      </div>
    );
  }

  const stepProps = { register, errors, setValue, watch };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nueva Bitácora de Buzo Completa</CardTitle>
              <p className="text-sm text-zinc-500">
                Paso {currentStep > 1 ? currentStep -1 : 1} de {totalSteps-1} - Registro completo de inmersión de buzo
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep-1) / (totalSteps-1)) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {currentStep === 2 && <Step2Personal {...stepProps} />}
          {currentStep === 3 && <Step3Ambiental {...stepProps} />}
          {currentStep === 4 && <Step4Tecnico {...stepProps} />}
          {currentStep === 5 && <Step5Tiempos {...stepProps} />}
          {currentStep === 6 && <Step6Trabajo {...stepProps} />}

          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > (inmersionId ? 2 : 1) && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} className="bg-teal-600 hover:bg-teal-700">
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creando...
                    </>
                  ) : (
                    "Crear Bitácora"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
