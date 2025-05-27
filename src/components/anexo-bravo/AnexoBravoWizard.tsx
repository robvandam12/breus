
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stepper, Step } from "@/components/ui/stepper";
import { useOperaciones } from '@/hooks/useOperaciones';
import { useForm } from 'react-hook-form';
import { DatosGeneralesStep } from './steps/DatosGeneralesStep';
import { ChecklistStep } from './steps/ChecklistStep';
import { ParticipantesStep } from './steps/ParticipantesStep';
import { EquiposStep } from './steps/EquiposStep';
import { ConfirmacionStep } from './steps/ConfirmacionStep';

interface AnexoBravoWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  defaultOperacionId?: string;
}

export const AnexoBravoWizard: React.FC<AnexoBravoWizardProps> = ({ 
  onSubmit,
  onCancel,
  defaultOperacionId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { operaciones } = useOperaciones();
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  
  const form = useForm({
    defaultValues: {
      operacion_id: defaultOperacionId || '',
      codigo: `AB-${new Date().getTime().toString().slice(-6)}`,
      fecha: new Date().toISOString().split('T')[0],
      supervisor: '',
      empresa_nombre: '',
      lugar_faena: '',
      buzo_o_empresa_nombre: '',
      asistente_buzo_nombre: '',
      asistente_buzo_matricula: '',
      anexo_bravo_checklist: {},
      anexo_bravo_trabajadores: [],
      anexo_bravo_equipos: []
    }
  });

  // Cargar datos de operación cuando cambia defaultOperacionId
  useEffect(() => {
    if (defaultOperacionId) {
      form.setValue('operacion_id', defaultOperacionId);
      
      // Buscar la operación seleccionada
      const operacion = operaciones.find(op => op.id === defaultOperacionId);
      if (operacion) {
        setSelectedOperacion(operacion);
        
        // Prellenar datos de la operación
        form.setValue('supervisor', operacion.supervisor_asignado_nombre || '');
        
        // Si la operación tiene un sitio asociado
        if (operacion.sitio) {
          form.setValue('lugar_faena', operacion.sitio.nombre || '');
        }
        
        // Si la operación tiene un contratista asociado
        if (operacion.contratista) {
          form.setValue('empresa_nombre', operacion.contratista.nombre || '');
          form.setValue('buzo_o_empresa_nombre', operacion.contratista.nombre || '');
        }
        
        // Si hay supervisor asignado y tiene nombre
        if (operacion.supervisor_asignado_nombre) {
          form.setValue('supervisor', operacion.supervisor_asignado_nombre);
        }
      }
    }
  }, [defaultOperacionId, operaciones, form]);

  const steps = [
    { title: "Datos Generales", component: DatosGeneralesStep },
    { title: "Checklist", component: ChecklistStep },
    { title: "Participantes", component: ParticipantesStep },
    { title: "Equipos", component: EquiposStep },
    { title: "Confirmación", component: ConfirmacionStep },
  ];

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="w-full mx-auto max-w-full">
      <Card className="border-0 shadow-none">
        <div className="p-6 pb-0">
          <Stepper value={currentStep} onValueChange={setCurrentStep}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} />
            ))}
          </Stepper>
        </div>

        <div className="p-6">
          <CurrentStepComponent 
            form={form}
            operaciones={operaciones} 
            selectedOperacion={selectedOperacion}
            setSelectedOperacion={setSelectedOperacion}
          />
        </div>

        <div className="p-6 pt-0 flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                Anterior
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep}>
                Siguiente
              </Button>
            ) : (
              <Button 
                onClick={form.handleSubmit(handleSubmit)}
                className="bg-green-600 hover:bg-green-700"
              >
                Crear Anexo Bravo
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
