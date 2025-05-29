
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
    // Datos generales
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    lugar_faena: '', // Auto-poblado desde sitio de operación
    empresa_nombre: '', // Auto-poblado desde salmonera
    supervisor_servicio_nombre: '',
    supervisor_mandante_nombre: '',
    buzo_o_empresa_nombre: '', // Auto-poblado desde empresa contratista
    buzo_matricula: '',
    asistente_buzo_nombre: '',
    asistente_buzo_matricula: '',
    autorizacion_armada: false,
    autorizacion_documento_url: '',
    supervisor: '', // Agregado para cumplir con AnexoBravoFormData
    
    // Bitácora
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_hora_inicio: '',
    bitacora_hora_termino: '',
    bitacora_relator: '',
    
    // Checklist y equipos
    anexo_bravo_checklist: {},
    anexo_bravo_trabajadores: [],
    
    // Firmas
    anexo_bravo_firmas: {
      supervisor_servicio_url: '',
      supervisor_mandante_url: '',
      jefe_centro_url: ''
    },
    
    observaciones_generales: '',
    jefe_centro_nombre: ''
  });

  const steps = [
    { 
      id: 1, 
      title: 'Datos Generales', 
      isValid: !!(formData.codigo && formData.lugar_faena && formData.empresa_nombre) 
    },
    { 
      id: 2, 
      title: 'Personal', 
      isValid: !!(formData.supervisor_servicio_nombre && formData.buzo_o_empresa_nombre) 
    },
    { 
      id: 3, 
      title: 'Checklist', 
      isValid: Object.keys(formData.anexo_bravo_checklist).length > 0 
    },
    { 
      id: 4, 
      title: 'Trabajadores', 
      isValid: formData.anexo_bravo_trabajadores.length > 0 
    },
    { 
      id: 5, 
      title: 'Firmas', 
      isValid: true // Firmas ahora se hacen después de crear el anexo
    }
  ];

  const handleOperacionSelected = (operacionId: string) => {
    setCurrentOperacionId(operacionId);
    setShowOperacionSelector(false);
  };

  // Auto-populate data when operation is selected
  useEffect(() => {
    const populateOperacionData = async () => {
      if (!currentOperacionId || anexoId) return; // Don't populate if editing

      try {
        console.log('Populating operation data for:', currentOperacionId);
        
        // Get operation data
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

        // Get assigned diving team
        const equipoAsignado = operacion.equipo_buceo_id 
          ? equipos.find(eq => eq.id === operacion.equipo_buceo_id)
          : null;

        console.log('Operation data:', operacion);
        console.log('Assigned team:', equipoAsignado);

        // Create updates object - implementando las observaciones del usuario
        const autoDataUpdates: Partial<typeof formData> = {
          codigo: `AB-${operacion.codigo}-${Date.now().toString().slice(-4)}`,
          fecha: new Date().toISOString().split('T')[0],
          lugar_faena: operacion.sitios?.nombre || operacion.sitios?.ubicacion || '', // Sitio de operación
          empresa_nombre: operacion.salmoneras?.nombre || '', // Salmonera
          buzo_o_empresa_nombre: operacion.contratistas?.nombre || '', // Empresa contratista
          supervisor: operacion.contratistas?.nombre || '', // Para cumplir con el tipo
          bitacora_fecha: new Date().toISOString().split('T')[0],
          bitacora_relator: ''
        };

        // If there's an assigned team, populate personnel data
        if (equipoAsignado?.miembros) {
          const supervisor = equipoAsignado.miembros.find(m => m.rol === 'supervisor');
          const buzoPrincipal = equipoAsignado.miembros.find(m => m.rol === 'buzo_principal');
          const buzoAsistente = equipoAsignado.miembros.find(m => m.rol === 'buzo_asistente');
          
          if (supervisor) {
            autoDataUpdates.supervisor_servicio_nombre = supervisor.nombre_completo;
            autoDataUpdates.bitacora_relator = supervisor.nombre_completo;
          }
          
          if (buzoPrincipal) {
            autoDataUpdates.buzo_matricula = buzoPrincipal.matricula || '';
          }
          
          if (buzoAsistente) {
            autoDataUpdates.asistente_buzo_nombre = buzoAsistente.nombre_completo;
            autoDataUpdates.asistente_buzo_matricula = buzoAsistente.matricula || '';
          }

          // Auto-populate workers from diving team
          const trabajadores = equipoAsignado.miembros.map((miembro, index) => ({
            id: `auto-${index}`,
            nombre: miembro.nombre_completo,
            rut: '', // RUT not available in EquipoBuceoMiembro, leave empty for manual entry
            cargo: miembro.rol === 'supervisor' ? 'Supervisor' : 
                   miembro.rol === 'buzo_principal' ? 'Buzo Principal' : 'Buzo Asistente',
            empresa: operacion.contratistas?.nombre || ''
          }));
          
          autoDataUpdates.anexo_bravo_trabajadores = trabajadores;
        }

        setFormData(prev => ({ ...prev, ...autoDataUpdates }));
        
        console.log('Anexo Bravo auto-populated data:', autoDataUpdates);
        
        toast({
          title: "Datos cargados",
          description: "Los datos de la operación han sido cargados automáticamente.",
        });
      } catch (error) {
        console.error('Error populating operation data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la operación.",
          variant: "destructive",
        });
      }
    };

    populateOperacionData();
  }, [currentOperacionId, anexoId, equipos]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
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

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        operacion_id: currentOperacionId,
        firmado: false, // Se firma después de crear
        estado: 'borrador'
      };

      await onSubmit(submitData);
      
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente. Ahora puede firmarlo desde la lista de Anexos Bravo.",
      });
    } catch (error) {
      console.error('Error submitting Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    // Para envío final, no requiere firmas (se firman después)
    const requiredSteps = steps.slice(0, 4); // Solo los primeros 4 pasos
    return requiredSteps.every(step => step.isValid);
  };

  const getProgress = () => {
    return Math.round((currentStep / steps.length) * 100);
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
        return <div>Paso no encontrado</div>;
    }
  };

  // Show operation selector if no operation selected
  if (showOperacionSelector) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <AnexoBravoOperationSelector 
          onOperacionSelected={handleOperacionSelected}
          selectedOperacionId={currentOperacionId}
        />
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onCancel} className="ios-button">
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header with progress */}
      <Card className="ios-card">
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
            <div className="flex items-center gap-2">
              <Badge variant={currentOperacionId ? "default" : "secondary"}>
                {currentOperacionId ? 'Con Operación' : 'Independiente'}
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
          <Progress value={getProgress()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step navigation */}
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(step.id)}
                className="ios-button h-auto p-2 flex flex-col items-center gap-1"
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

      {/* Current step content */}
      {renderStepContent()}

      {/* Bottom navigation */}
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="ios-button"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} className="ios-button">
                Cancelar
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!steps[currentStep - 1]?.isValid}
                  className="ios-button"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isLoading}
                  className="ios-button bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Creando...' : 'Crear Anexo Bravo'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operation Selector Dialog */}
      {showOperacionSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <AnexoBravoOperationSelector 
              onOperacionSelected={handleOperacionSelected}
              selectedOperacionId={currentOperacionId}
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
