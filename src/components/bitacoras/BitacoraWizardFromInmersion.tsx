
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, FileText } from "lucide-react";
import { BitacoraStep1 } from './steps/BitacoraStep1';
import { BitacoraStep2Buzos } from './steps/BitacoraStep2Buzos';
import { BitacoraStep3Equipos } from './steps/BitacoraStep3Equipos';
import { BitacoraStep4Trabajos } from './steps/BitacoraStep4Trabajos';
import { BitacoraStep5DatosBuzos } from './steps/BitacoraStep5DatosBuzos';
import { BitacoraStep6Firmas } from './steps/BitacoraStep6Firmas';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { useOperaciones } from '@/hooks/useOperaciones';

export interface BitacoraSupervisorData {
  // Información básica
  codigo: string;
  fecha_inicio_faena?: string;
  fecha_termino_faena?: string;
  lugar_trabajo?: string;
  supervisor_nombre_matricula?: string;
  estado_mar?: string;
  visibilidad_fondo?: number;
  hora_inicio_faena?: string;
  hora_termino_faena?: string;
  desarrollo_inmersion: string;
  incidentes?: string;
  evaluacion_general: string;
  
  // Inmersión relacionada
  inmersion_id: string;
  supervisor?: string;
  
  // Buzos y asistentes (Paso 2)
  inmersiones_buzos?: Array<{
    nombre: string;
    apellido: string;
    rut: string;
    rol: string;
    profundidad_trabajo?: number;
    tiempo_inmersion?: number;
    del_equipo_buceo: boolean;
  }>;
  buzos_asistentes?: Array<{
    nombre: string;
    apellido: string;
    rut: string;
    rol: string;
    del_equipo_buceo: boolean;
  }>;
  
  // Equipos utilizados (Paso 3)
  equipos_utilizados?: Array<{
    nombre: string;
    tipo: string;
    estado: string;
    observaciones?: string;
  }>;
  
  // Trabajos realizados (Paso 4)
  trabajo_a_realizar?: string;
  descripcion_trabajo?: string;
  observaciones_generales_texto?: string;
  embarcacion_apoyo?: string;
  
  // Datos detallados del buceo (Paso 5)
  diving_records?: Array<{
    buzo_nombre: string;
    profundidad_maxima: number;
    tiempo_fondo: number;
    tiempo_descompresion: number;
    equipos_usados: string[];
    observaciones?: string;
  }>;
  
  // Control y validación
  validacion_contratista?: boolean;
  comentarios_validacion?: string;
  operacion_id?: string;
  empresa_nombre?: string;
  centro_nombre?: string;
  equipo_buceo_id?: string;
}

interface BitacoraWizardFromInmersionProps {
  inmersionId: string;
  onComplete: (data: BitacoraSupervisorData) => void;
  onCancel: () => void;
}

export const BitacoraWizardFromInmersion = ({ 
  inmersionId, 
  onComplete, 
  onCancel 
}: BitacoraWizardFromInmersionProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BitacoraSupervisorData>({
    codigo: `BS-${Date.now()}`,
    inmersion_id: inmersionId,
    desarrollo_inmersion: '',
    evaluacion_general: '',
    inmersiones_buzos: [],
    buzos_asistentes: [],
    equipos_utilizados: [],
    diving_records: []
  });
  
  const { inmersiones } = useInmersiones();
  const { equipos } = useEquiposBuceoEnhanced();
  const { operaciones } = useOperaciones();
  
  const selectedInmersion = inmersiones.find(i => i.inmersion_id === inmersionId);
  const selectedOperation = selectedInmersion ? operaciones.find(op => op.id === selectedInmersion.operacion_id) : null;
  const assignedTeam = selectedOperation?.equipo_buceo_id 
    ? equipos.find(eq => eq.id === selectedOperation.equipo_buceo_id)
    : null;

  // Auto-poblar datos de la inmersión y equipo
  useEffect(() => {
    if (selectedInmersion && selectedOperation && assignedTeam) {
      // Auto-poblar buzos del equipo usando las propiedades correctas
      const buzosEquipo = assignedTeam.miembros?.map(miembro => {
        // Usar las propiedades correctas del tipo EquipoBuceoMiembro
        const nombreCompleto = miembro.nombre_completo || 'Sin nombre';
        const rol = miembro.rol || 'Buzo';
        
        return {
          nombre: nombreCompleto,
          apellido: '',
          rut: '',
          rol: rol,
          profundidad_trabajo: 0,
          tiempo_inmersion: 0,
          del_equipo_buceo: true
        };
      }) || [];

      setFormData(prev => ({
        ...prev,
        lugar_trabajo: selectedOperation.nombre,
        supervisor: selectedInmersion.supervisor,
        supervisor_nombre_matricula: selectedInmersion.supervisor,
        operacion_id: selectedOperation.id,
        equipo_buceo_id: selectedOperation.equipo_buceo_id,
        inmersiones_buzos: buzosEquipo,
        fecha_inicio_faena: selectedInmersion.fecha_inmersion
      }));
    }
  }, [selectedInmersion, selectedOperation, assignedTeam]);

  const steps = [
    { id: 1, title: "Información General", description: "Datos básicos de la bitácora" },
    { id: 2, title: "Buzos y Asistentes", description: "Personal participante" },
    { id: 3, title: "Equipos Utilizados", description: "Equipos y herramientas" },
    { id: 4, title: "Trabajos Realizados", description: "Descripción de actividades" },
    { id: 5, title: "Datos del Buceo", description: "Información detallada del buceo" },
    { id: 6, title: "Firmas y Validación", description: "Validación final" }
  ];

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (newData: Partial<BitacoraSupervisorData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.codigo && formData.desarrollo_inmersion && formData.evaluacion_general);
      case 2:
        return formData.inmersiones_buzos ? formData.inmersiones_buzos.length > 0 : false;
      case 3:
        return true; // Equipos son opcionales
      case 4:
        return !!(formData.trabajo_a_realizar || formData.descripcion_trabajo);
      case 5:
        return true; // Datos del buceo son opcionales pero recomendados
      case 6:
        return true; // Validación final
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onComplete(formData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BitacoraStep1 
            data={formData} 
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <BitacoraStep2Buzos 
            data={formData} 
            onUpdate={updateFormData}
            equipoBuceo={assignedTeam}
          />
        );
      case 3:
        return (
          <BitacoraStep3Equipos 
            data={formData} 
            onUpdate={updateFormData}
          />
        );
      case 4:
        return (
          <BitacoraStep4Trabajos 
            data={formData} 
            onUpdate={updateFormData}
          />
        );
      case 5:
        return (
          <BitacoraStep5DatosBuzos 
            data={formData} 
            onUpdate={updateFormData}
          />
        );
      case 6:
        return (
          <BitacoraStep6Firmas 
            data={formData} 
            onUpdate={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Bitácora de Supervisor - {selectedInmersion?.codigo || 'Nueva'}
            </CardTitle>
            <CardDescription>
              Paso {currentStep} de {totalSteps}: {steps[currentStep - 1]?.title}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
        <Progress value={progress} className="w-full mt-4" />
      </CardHeader>

      <CardContent>
        {renderStepContent()}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Finalizar Bitácora
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
