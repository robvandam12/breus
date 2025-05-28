
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, Anchor, AlertTriangle } from "lucide-react";
import { InmersionStep1 } from "./steps/InmersionStep1";
import { InmersionStep2 } from "./steps/InmersionStep2";
import { InmersionStep3 } from "./steps/InmersionStep3";
import { InmersionOperationSelector } from "./InmersionOperationSelector";
import { useToast } from "@/hooks/use-toast";
import { useInmersion } from "@/hooks/useInmersion";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InmersionWizardProps {
  inmersionId?: string;
  operacionId?: string;
  onComplete?: (inmersionId: string) => void;
  onCancel?: () => void;
}

export const InmersionWizard = ({ inmersionId, operacionId: initialOperacionId, onComplete, onCancel }: InmersionWizardProps) => {
  const { toast } = useToast();
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  const { createInmersion, updateInmersion, isCreating, isUpdating } = useInmersion();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOperacionId, setSelectedOperacionId] = useState(initialOperacionId || '');
  const [showOperacionSelector, setShowOperacionSelector] = useState(!inmersionId && !initialOperacionId);
  const [validationStatus, setValidationStatus] = useState({
    hptValidated: false,
    anexoBravoValidated: false,
    loading: false
  });
  
  const [formData, setFormData] = useState({
    codigo: '',
    operacion_id: '',
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    supervisor: '',
    supervisor_id: '',
    buzo_principal: '',
    buzo_principal_id: '',
    buzo_asistente: '',
    buzo_asistente_id: '',
    objetivo: '',
    profundidad_max: 0,
    temperatura_agua: 0,
    visibilidad: 0,
    corriente: '',
    observaciones: '',
    estado: 'planificada'
  });

  const steps = [
    {
      id: 1,
      title: "Datos Generales",
      description: "Información básica de la inmersión",
      isValid: !!(formData.codigo && formData.operacion_id && formData.fecha_inmersion && formData.hora_inicio)
    },
    {
      id: 2,
      title: "Personal y Roles",
      description: "Asignación de supervisor y buzos",
      isValid: !!(formData.supervisor && formData.buzo_principal)
    },
    {
      id: 3,
      title: "Condiciones y Detalles",
      description: "Condiciones de buceo y observaciones",
      isValid: !!(formData.objetivo && formData.profundidad_max > 0)
    }
  ];

  // Validate HPT and Anexo Bravo when operation is selected
  useEffect(() => {
    const validateDocuments = async () => {
      if (!selectedOperacionId) return;

      setValidationStatus(prev => ({ ...prev, loading: true }));

      try {
        // Check for signed HPT
        const { data: hptData } = await supabase
          .from('hpt')
          .select('id, firmado, estado')
          .eq('operacion_id', selectedOperacionId)
          .eq('firmado', true)
          .eq('estado', 'firmado');

        // Check for signed Anexo Bravo
        const { data: anexoData } = await supabase
          .from('anexo_bravo')
          .select('id, firmado, estado')
          .eq('operacion_id', selectedOperacionId)
          .eq('firmado', true)
          .eq('estado', 'firmado');

        setValidationStatus({
          hptValidated: hptData && hptData.length > 0,
          anexoBravoValidated: anexoData && anexoData.length > 0,
          loading: false
        });

      } catch (error) {
        console.error('Error validating documents:', error);
        setValidationStatus({
          hptValidated: false,
          anexoBravoValidated: false,
          loading: false
        });
      }
    };

    validateDocuments();
  }, [selectedOperacionId]);

  // Auto-populate data when operation is selected
  useEffect(() => {
    const populateOperationData = async () => {
      if (!selectedOperacionId || inmersionId) return;

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
          .eq('id', selectedOperacionId)
          .single();

        if (error) throw error;

        const operacion = opData;
        
        // Find team members if equipo is assigned
        let teamMembers = [];
        if (operacion.equipo_buceo_id) {
          const equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);
          teamMembers = equipo?.miembros || [];
        }

        // Find specific roles
        const supervisor = teamMembers.find(m => m.rol === 'supervisor');
        const buzoPrincipal = teamMembers.find(m => m.rol === 'buzo_principal');
        const buzoAsistente = teamMembers.find(m => m.rol === 'buzo_asistente');

        // Generate codigo based on operation
        const codigo = `INM-${operacion.codigo}-${Date.now().toString().slice(-4)}`;
        
        updateFormData({
          operacion_id: selectedOperacionId,
          codigo,
          supervisor: supervisor?.nombre_completo || '',
          supervisor_id: supervisor?.usuario_id || '',
          buzo_principal: buzoPrincipal?.nombre_completo || '',
          buzo_principal_id: buzoPrincipal?.usuario_id || '',
          buzo_asistente: buzoAsistente?.nombre_completo || '',
          buzo_asistente_id: buzoAsistente?.usuario_id || '',
          objetivo: operacion.nombre || 'Inmersión de buceo comercial'
        });

        console.log('Operation data populated for immersion:', {
          operacion,
          teamMembers,
          codigo
        });

        toast({
          title: "Datos cargados",
          description: "Los datos de la operación han sido cargados automáticamente.",
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
  }, [selectedOperacionId, equipos, inmersionId]);

  const handleOperacionSelected = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setShowOperacionSelector(false);
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.isValid) {
      toast({
        title: "Paso incompleto",
        description: "Complete todos los campos requeridos para continuar",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Formulario incompleto",
        description: "Complete todos los pasos antes de enviar",
        variant: "destructive",
      });
      return;
    }

    if (!validationStatus.hptValidated || !validationStatus.anexoBravoValidated) {
      toast({
        title: "Documentos requeridos",
        description: "Se requiere HPT y Anexo Bravo firmados para crear la inmersión",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      if (inmersionId) {
        result = await updateInmersion({ id: inmersionId, data: formData });
      } else {
        result = await createInmersion(formData);
      }

      toast({
        title: "Inmersión guardada",
        description: "La inmersión ha sido guardada exitosamente",
      });

      if (onComplete && result?.id) {
        onComplete(result.id);
      }
    } catch (error) {
      console.error('Error submitting immersion:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la inmersión",
        variant: "destructive",
      });
    }
  };

  const isFormValid = () => {
    return steps.every(step => step.isValid);
  };

  const getProgress = () => {
    return Math.round((currentStep / steps.length) * 100);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <InmersionStep1 data={formData} onUpdate={updateFormData} />;
      case 2:
        return <InmersionStep2 data={formData} onUpdate={updateFormData} operacionId={selectedOperacionId} />;
      case 3:
        return <InmersionStep3 data={formData} onUpdate={updateFormData} />;
      default:
        return null;
    }
  };

  // Show operation selector if no operation selected
  if (showOperacionSelector) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <InmersionOperationSelector 
          onOperacionSelected={handleOperacionSelected}
          selectedOperacionId={selectedOperacionId}
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
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl text-gray-900">
                {inmersionId ? 'Editar' : 'Crear'} Inmersión
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {getProgress()}% Completado
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

        {/* Document validation status */}
        {selectedOperacionId && (
          <div className="space-y-2 mb-4">
            {validationStatus.loading ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Validando documentos requeridos...
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Alert className={validationStatus.hptValidated ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <AlertDescription className={validationStatus.hptValidated ? "text-green-800" : "text-red-800"}>
                    HPT: {validationStatus.hptValidated ? "✓ Firmado" : "✗ Requerido"}
                  </AlertDescription>
                </Alert>
                <Alert className={validationStatus.anexoBravoValidated ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <AlertDescription className={validationStatus.anexoBravoValidated ? "text-green-800" : "text-red-800"}>
                    Anexo Bravo: {validationStatus.anexoBravoValidated ? "✓ Firmado" : "✗ Requerido"}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={getProgress()} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progreso General</span>
            <span>{getProgress()}%</span>
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
            disabled={isCreating || isUpdating}
            className="ios-button min-w-[100px]"
          >
            Cancelar
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isCreating || isUpdating}
            className="ios-button flex items-center gap-2 min-w-[100px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!steps[currentStep - 1]?.isValid || isCreating || isUpdating}
              className="ios-button flex items-center gap-2 min-w-[100px] bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isCreating || isUpdating || !validationStatus.hptValidated || !validationStatus.anexoBravoValidated}
              className="ios-button flex items-center gap-2 min-w-[120px] bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {isCreating || isUpdating ? 'Guardando...' : (inmersionId ? 'Actualizar' : 'Crear Inmersión')}
            </Button>
          )}
        </div>
      </div>

      {/* Operation Selector Dialog */}
      {showOperacionSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <InmersionOperationSelector 
              onOperacionSelected={handleOperacionSelected}
              selectedOperacionId={selectedOperacionId}
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
