
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { AnexoBravoStep1 } from "@/components/anexo-bravo/steps/AnexoBravoStep1";
import { AnexoBravoStep2 } from "@/components/anexo-bravo/steps/AnexoBravoStep2";
import { AnexoBravoStep3 } from "@/components/anexo-bravo/steps/AnexoBravoStep3";
import { AnexoBravoStep4 } from "@/components/anexo-bravo/steps/AnexoBravoStep4";
import { AnexoBravoStep5 } from "@/components/anexo-bravo/steps/AnexoBravoStep5";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";

interface EnhancedAnexoBravoFormProps {
  operacionId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  type?: 'simple' | 'completo';
}

export const EnhancedAnexoBravoForm = ({ 
  operacionId, 
  onSubmit, 
  onCancel,
  type = 'completo'
}: EnhancedAnexoBravoFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    operacion_id: operacionId,
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    
    // Step 1: Información General
    empresa_nombre: '',
    lugar_faena: '',
    jefe_centro_nombre: '',
    
    // Step 2: Identificación del Buzo
    buzo_o_empresa_nombre: '',
    buzo_matricula: '',
    autorizacion_armada: false,
    asistente_buzo_nombre: '',
    asistente_buzo_matricula: '',
    
    // Step 3: Checklist de Equipos (se maneja como jsonb)
    anexo_bravo_checklist: {},
    
    // Step 4: Bitácora y Trabajadores
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_hora_inicio: '',
    bitacora_hora_termino: '',
    bitacora_relator: '',
    anexo_bravo_trabajadores: [],
    
    // Step 5: Firmas y Observaciones
    observaciones_generales: '',
    supervisor_servicio_firma: null,
    supervisor_servicio_nombre: null,
    supervisor_servicio_timestamp: null,
    supervisor_mandante_firma: null,
    supervisor_mandante_nombre: null,
    supervisor_mandante_timestamp: null,
    
    // Metadatos
    form_version: 2,
    estado: 'borrador',
    firmado: false,
    progreso: 0
  });

  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Auto-completar datos basados en la operación
    const operacion = operaciones.find(op => op.id === operacionId);
    if (operacion) {
      const salmonera = salmoneras.find(s => s.id === operacion.salmonera_id);
      const contratista = contratistas.find(c => c.id === operacion.contratista_id);
      const sitio = sitios.find(s => s.id === operacion.sitio_id);
      
      setFormData(prev => ({
        ...prev,
        codigo: `AB-${operacion.codigo}-${Date.now()}`,
        empresa_nombre: salmonera?.nombre || '',
        lugar_faena: sitio?.nombre || '',
        buzo_o_empresa_nombre: contratista?.nombre || ''
      }));
    }
  }, [operacionId, operaciones, salmoneras, contratistas, sitios]);

  const updateFormData = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }));
    
    // Actualizar progreso automáticamente
    const updatedData = { ...formData, ...newData };
    const calculatedProgress = calculateProgress(updatedData);
    setFormData(prev => ({ ...prev, ...newData, progreso: calculatedProgress }));
  };

  const calculateProgress = (data: any) => {
    let completedFields = 0;
    let totalFields = 0;

    // Step 1 (4 campos requeridos)
    totalFields += 4;
    if (data.empresa_nombre) completedFields++;
    if (data.lugar_faena) completedFields++;
    if (data.fecha) completedFields++;
    if (data.jefe_centro_nombre) completedFields++;

    // Step 2 (3 campos principales)
    totalFields += 3;
    if (data.buzo_o_empresa_nombre) completedFields++;
    if (data.buzo_matricula) completedFields++;
    if (data.asistente_buzo_nombre) completedFields++;

    // Step 3 (checklist con al menos 10 items verificados)
    totalFields += 1;
    const checklistItems = Object.values(data.anexo_bravo_checklist || {});
    const verifiedItems = checklistItems.filter((item: any) => item?.verificado).length;
    if (verifiedItems >= 10) completedFields++;

    // Step 4 (3 campos de bitácora)
    totalFields += 3;
    if (data.bitacora_fecha) completedFields++;
    if (data.bitacora_hora_inicio) completedFields++;
    if (data.bitacora_relator) completedFields++;

    // Step 5 (al menos una firma)
    totalFields += 1;
    if (data.supervisor_servicio_firma || data.supervisor_mandante_firma) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.empresa_nombre && formData.lugar_faena && formData.fecha;
      case 2:
        return formData.buzo_o_empresa_nombre;
      case 3:
        return true; // Siempre puede continuar desde el checklist
      case 4:
        return formData.bitacora_fecha && formData.bitacora_relator;
      case 5:
        return true; // Último paso
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      firmado: !!(formData.supervisor_servicio_firma && formData.supervisor_mandante_firma),
      estado: (formData.supervisor_servicio_firma && formData.supervisor_mandante_firma) ? 'firmado' : 'borrador'
    };
    
    onSubmit(finalData);
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
    <div className="max-w-6xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Anexo Bravo - {getStepTitle()}
            </CardTitle>
            <div className="text-sm text-gray-500">
              Paso {currentStep} de {totalSteps}
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progreso del formulario</span>
              <span>{formData.progreso}% completado</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <AnexoBravoStep1 data={formData} onUpdate={updateFormData} />
          )}
          {currentStep === 2 && (
            <AnexoBravoStep2 data={formData} onUpdate={updateFormData} />
          )}
          {currentStep === 3 && (
            <AnexoBravoStep3 data={formData} onUpdate={updateFormData} />
          )}
          {currentStep === 4 && (
            <AnexoBravoStep4 data={formData} onUpdate={updateFormData} />
          )}
          {currentStep === 5 && (
            <AnexoBravoStep5 data={formData} onUpdate={updateFormData} />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
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
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Finalizar Anexo Bravo
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
