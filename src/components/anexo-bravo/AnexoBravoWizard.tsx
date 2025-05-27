
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileText, Users, CheckSquare, UserCheck, Edit3 } from "lucide-react";
import { AnexoBravoStep1 } from "./steps/AnexoBravoStep1";
import { AnexoBravoStep2 } from "./steps/AnexoBravoStep2";
import { AnexoBravoStep3 } from "./steps/AnexoBravoStep3";
import { AnexoBravoStep4 } from "./steps/AnexoBravoStep4";
import { AnexoBravoStep5 } from "./steps/AnexoBravoStep5";
import { useToast } from "@/hooks/use-toast";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";
import { supabase } from "@/integrations/supabase/client";

interface AnexoBravoWizardProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultOperacionId?: string;
}

export const AnexoBravoWizard = ({ onSubmit, onCancel, defaultOperacionId }: AnexoBravoWizardProps) => {
  const { toast } = useToast();
  const { miembros } = useEquipoBuceo();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    operacion_id: defaultOperacionId || '',
    codigo: '',
    empresa_nombre: '',
    lugar_faena: '',
    buzo_o_empresa_nombre: '',
    asistente_buzo_nombre: '',
    supervisor: '',
    trabajadores: [] as Array<{
      nombre: string;
      rut: string;
      empresa: string;
    }>,
    checklist: [],
    observaciones_generales: ''
  });

  const steps = [
    { id: 1, title: "Información General", description: "Datos básicos del anexo", icon: FileText },
    { id: 2, title: "Personal y Equipos", description: "Trabajadores y equipos", icon: Users },
    { id: 3, title: "Lista de Verificación", description: "Checklist de seguridad", icon: CheckSquare },
    { id: 4, title: "Verificación Final", description: "Revisión y observaciones", icon: UserCheck },
    { id: 5, title: "Resumen", description: "Confirmación final", icon: Edit3 }
  ];

  // Pre-populate data when operation is selected
  useEffect(() => {
    const populateOperationData = async () => {
      if (!defaultOperacionId) return;

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
          .eq('id', defaultOperacionId)
          .single();

        if (error) throw error;

        const operacion = opData;
        
        // Find supervisor and team members
        const supervisor = miembros.find(m => 
          m.equipo_id === operacion.equipo_buceo_id && 
          m.rol_equipo === 'supervisor'
        );

        const teamMembers = miembros.filter(m => 
          m.equipo_id === operacion.equipo_buceo_id
        );

        // Generate code based on operation
        const codigo = `AB-${operacion.codigo}-${Date.now().toString().slice(-4)}`;
        
        setFormData(prev => ({
          ...prev,
          operacion_id: defaultOperacionId,
          codigo,
          empresa_nombre: operacion.salmoneras?.nombre || '',
          lugar_faena: operacion.sitios?.nombre || '',
          buzo_o_empresa_nombre: operacion.contratistas?.nombre || '',
          supervisor: supervisor?.nombre_completo || '',
          trabajadores: teamMembers.map(member => ({
            nombre: member.nombre_completo || member.nombre || '',
            rut: '', // Will need to be filled manually
            empresa: operacion.contratistas?.nombre || ''
          }))
        }));

        console.log('Anexo Bravo data populated:', {
          operacion,
          supervisor,
          teamMembers,
          codigo
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
  }, [defaultOperacionId, miembros, toast]);

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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(formData);
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
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
        return null;
    }
  };

  const progress = Math.round((currentStep / steps.length) * 100);
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="w-full max-w-full h-full flex flex-col">
      {/* Header with Progress */}
      <div className="flex-shrink-0 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <currentStepData.icon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl text-gray-900">
                Crear Anexo Bravo
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Paso {currentStep} de {steps.length}: {currentStepData.title}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {progress}% Completado
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progreso General</span>
            <span>{progress}%</span>
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
                step.id === currentStep ? 'bg-orange-500' : 
                'bg-gray-200'
              }`} />
              <div className="mt-2 text-xs text-center">
                <span className={`${
                  step.id === currentStep ? 'text-orange-600 font-medium' : 
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
        <Card className="border-0 shadow-none h-full">
          <CardContent className="p-6 md:p-8">
            {renderStep()}
          </CardContent>
        </Card>
      </div>

      {/* Navigation - Fixed at bottom */}
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
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2 min-w-[100px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={isLoading}
              className="flex items-center gap-2 min-w-[100px] bg-orange-600 hover:bg-orange-700"
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
