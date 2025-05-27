
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileCheck, Users, Shield } from "lucide-react";
import { AnexoBravoStep1 } from "./steps/AnexoBravoStep1";
import { AnexoBravoStep2 } from "./steps/AnexoBravoStep2";
import { AnexoBravoStep3 } from "./steps/AnexoBravoStep3";
import { useToast } from "@/hooks/use-toast";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";

interface AnexoBravoWizardData {
  // Datos básicos
  codigo: string;
  fecha_verificacion: string;
  lugar_faena: string;
  empresa_nombre: string;
  buzo_o_empresa_nombre: string;
  asistente_buzo_nombre: string;
  supervisor: string;
  jefe_centro: string;
  
  // Trabajadores del equipo
  trabajadores: Array<{
    id: string;
    nombre: string;
    rut: string;
    orden: number;
  }>;
  
  // Checklist de equipos
  checklist: Array<{
    id: string;
    item: string;
    verificado: boolean;
    observaciones: string;
    orden: number;
  }>;
  
  // Observaciones
  observaciones_generales: string;
  operacion_id?: string;
}

interface AnexoBravoWizardProps {
  operacionId?: string;
  anexoId?: string;
  onComplete?: (anexoId: string) => void;
  onCancel?: () => void;
}

export const AnexoBravoWizard = ({ operacionId, anexoId, onComplete, onCancel }: AnexoBravoWizardProps) => {
  const { toast } = useToast();
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceo();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnexoBravoWizardData>({
    codigo: `AB-${Date.now()}`,
    fecha_verificacion: new Date().toISOString().split('T')[0],
    lugar_faena: '',
    empresa_nombre: '',
    buzo_o_empresa_nombre: '',
    asistente_buzo_nombre: '',
    supervisor: '',
    jefe_centro: '',
    trabajadores: [],
    checklist: [
      { id: '1', item: 'Equipo de comunicación', verificado: false, observaciones: '', orden: 1 },
      { id: '2', item: 'Equipo de respiración', verificado: false, observaciones: '', orden: 2 },
      { id: '3', item: 'Traje de buceo', verificado: false, observaciones: '', orden: 3 },
      { id: '4', item: 'Máscaras y aletas', verificado: false, observaciones: '', orden: 4 },
      { id: '5', item: 'Herramientas de trabajo', verificado: false, observaciones: '', orden: 5 },
      { id: '6', item: 'Equipo de seguridad', verificado: false, observaciones: '', orden: 6 }
    ],
    observaciones_generales: '',
    operacion_id: operacionId
  });

  // Poblar datos de la operación
  useEffect(() => {
    if (operacionId) {
      const operacion = operaciones.find(op => op.id === operacionId);
      if (operacion) {
        // Encontrar el equipo de buceo de la operación
        const equipoBuceo = equipos.find(eq => eq.id === operacion.equipo_buceo_id);
        
        setData(prev => ({
          ...prev,
          lugar_faena: operacion.sitios?.nombre || '',
          empresa_nombre: operacion.salmoneras?.nombre || '',
          buzo_o_empresa_nombre: operacion.contratistas?.nombre || '',
          supervisor: equipoBuceo?.miembros?.find(m => m.rol_equipo === 'supervisor')?.usuario?.nombre || '',
          jefe_centro: '', // Se llena manualmente
          trabajadores: equipoBuceo?.miembros?.map((miembro, index) => ({
            id: miembro.id,
            nombre: `${miembro.usuario.nombre} ${miembro.usuario.apellido}`,
            rut: miembro.usuario.perfil_buzo?.rut || '',
            orden: index + 1
          })) || []
        }));
      }
    }
  }, [operacionId, operaciones, equipos]);

  const steps = [
    {
      id: 1,
      title: "Información General",
      description: "Datos básicos del anexo bravo",
      isValid: data.codigo && data.fecha_verificacion && data.lugar_faena
    },
    {
      id: 2,
      title: "Personal y Equipos",
      description: "Trabajadores y verificación de equipos",
      isValid: data.trabajadores.length > 0
    },
    {
      id: 3,
      title: "Verificación Final",
      description: "Revisión y observaciones generales",
      isValid: true
    }
  ];

  const updateData = (updates: Partial<AnexoBravoWizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
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

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Crear el anexo bravo (será implementado en el hook correspondiente)
      const anexoData = {
        ...data,
        estado: 'borrador',
        firmado: false,
        progreso: 100
      };
      
      // Simular creación exitosa
      const newAnexoId = `anexo-${Date.now()}`;
      
      toast({
        title: "Anexo Bravo creado",
        description: "El anexo bravo ha sido creado como borrador y está listo para firmar.",
      });
      
      if (onComplete) {
        onComplete(newAnexoId);
      }
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el anexo bravo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      default:
        return null;
    }
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return <FileCheck className="w-5 h-5" />;
      case 2:
        return <Users className="w-5 h-5" />;
      case 3:
        return <Shield className="w-5 h-5" />;
      default:
        return <FileCheck className="w-5 h-5" />;
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="w-full h-full max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              {getStepIcon(currentStep)}
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl text-gray-900">
                Anexo Bravo - Lista de Chequeo
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Paso {currentStep} de {steps.length}: {currentStepData?.title}
              </p>
            </div>
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
                step.id === currentStep ? 'bg-emerald-500' : 
                'bg-gray-200'
              }`} />
              <div className="mt-2 text-xs text-center">
                <span className={`${
                  step.id === currentStep ? 'text-emerald-600 font-medium' : 
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {getStepIcon(currentStep)}
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">
                  {currentStepData?.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {currentStepData?.description}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 md:p-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 flex justify-between items-center p-6 gap-4 border-t bg-white">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
          className="min-w-[100px]"
        >
          Cancelar
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2 min-w-[100px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!currentStepData?.isValid || isLoading}
              className="flex items-center gap-2 min-w-[100px] bg-emerald-600 hover:bg-emerald-700"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 min-w-[120px] bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Creando...' : 'Crear Anexo Bravo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
