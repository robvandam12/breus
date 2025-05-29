
import React, { useState, useCallback } from 'react';
import { useHPT, HPTFormData } from '@/hooks/useHPT';
import { toast } from '@/hooks/use-toast';

export interface HPTWizardStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  isValid: boolean;
}

export interface HPTWizardData extends Omit<HPTFormData, 'codigo'> {
  // Datos Generales (Paso 1)
  folio: string;
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  empresa_servicio_nombre: string;
  supervisor_nombre: string;
  centro_trabajo_nombre: string;
  jefe_mandante_nombre: string;
  descripcion_tarea: string;
  es_rutinaria: boolean;
  lugar_especifico: string;
  estado_puerto: 'abierto' | 'cerrado';

  // EPP (Paso 2)
  hpt_epp: {
    casco: boolean;
    lentes: boolean;
    guantes: boolean;
    botas: boolean;
    chaleco: boolean;
    respirador: boolean;
    arnes: boolean;
    otros: string;
  };

  // ERC (Paso 3)
  hpt_erc: {
    izaje: boolean;
    buceo: boolean;
    navegacion: boolean;
    trabajo_altura: boolean;
    espacios_confinados: boolean;
    energia_peligrosa: boolean;
    materiales_peligrosos: boolean;
    otros: string;
  };

  // Medidas Clave (Paso 4)
  hpt_medidas: {
    listas_chequeo_erc_disponibles: 'si' | 'no' | 'na';
    personal_competente_disponible: 'si' | 'no' | 'na';
    equipos_proteccion_disponibles: 'si' | 'no' | 'na';
    procedimientos_emergencia_conocidos: 'si' | 'no' | 'na';
    comunicacion_establecida: 'si' | 'no' | 'na';
    autorizaciones_vigentes: 'si' | 'no' | 'na';
  };

  // Riesgos Complementarios (Paso 5)
  hpt_riesgos_comp: {
    condiciones_ambientales: { valor: 'si' | 'no' | 'na'; acciones: string };
    estado_equipos: { valor: 'si' | 'no' | 'na'; acciones: string };
    competencia_personal: { valor: 'si' | 'no' | 'na'; acciones: string };
    coordinacion_actividades: { valor: 'si' | 'no' | 'na'; acciones: string };
    comunicacion_riesgos: { valor: 'si' | 'no' | 'na'; acciones: string };
  };

  // Difusión y Firmas (Paso 6)
  hpt_conocimiento: {
    fecha: string;
    hora: string;
    duracion: number;
    relator_nombre: string;
    relator_cargo: string;
    relator_firma_url?: string;
  };
  hpt_conocimiento_asistentes: Array<{
    nombre: string;
    rut: string;
    empresa: string;
    firma_url?: string;
  }>;
  hpt_firmas: {
    supervisor_servicio_url?: string;
    supervisor_mandante_url?: string;
  };
}

const initialData: HPTWizardData = {
  operacion_id: '',
  plan_trabajo: '',
  supervisor: '',
  folio: '',
  fecha: new Date().toISOString().split('T')[0],
  hora_inicio: '',
  hora_termino: '',
  empresa_servicio_nombre: '',
  supervisor_nombre: '',
  centro_trabajo_nombre: '',
  jefe_mandante_nombre: '',
  descripcion_tarea: '',
  es_rutinaria: false,
  lugar_especifico: '',
  estado_puerto: 'abierto',
  hpt_epp: {
    casco: false,
    lentes: false,
    guantes: false,
    botas: false,
    chaleco: false,
    respirador: false,
    arnes: false,
    otros: ''
  },
  hpt_erc: {
    izaje: false,
    buceo: false,
    navegacion: false,
    trabajo_altura: false,
    espacios_confinados: false,
    energia_peligrosa: false,
    materiales_peligrosos: false,
    otros: ''
  },
  hpt_medidas: {
    listas_chequeo_erc_disponibles: 'na',
    personal_competente_disponible: 'na',
    equipos_proteccion_disponibles: 'na',
    procedimientos_emergencia_conocidos: 'na',
    comunicacion_establecida: 'na',
    autorizaciones_vigentes: 'na'
  },
  hpt_riesgos_comp: {
    condiciones_ambientales: { valor: 'na', acciones: '' },
    estado_equipos: { valor: 'na', acciones: '' },
    competencia_personal: { valor: 'na', acciones: '' },
    coordinacion_actividades: { valor: 'na', acciones: '' },
    comunicacion_riesgos: { valor: 'na', acciones: '' }
  },
  hpt_conocimiento: {
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    duracion: 30,
    relator_nombre: '',
    relator_cargo: '',
    relator_firma_url: ''
  },
  hpt_conocimiento_asistentes: [],
  hpt_firmas: {
    supervisor_servicio_url: '',
    supervisor_mandante_url: ''
  }
};

export const useHPTWizard = (operacionId?: string, hptId?: string) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<HPTWizardData>({
    ...initialData,
    operacion_id: operacionId || ''
  });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  const { createHPT, updateHPT, signHPT, isCreating, isUpdating, isSigning } = useHPT();

  const steps: HPTWizardStep[] = [
    {
      id: 1,
      title: "Datos Generales",
      description: "Información básica de la tarea",
      fields: ['folio', 'fecha', 'hora_inicio', 'descripcion_tarea', 'lugar_especifico'],
      isValid: true // Siempre válido
    },
    {
      id: 2,
      title: "Equipo de Protección Personal",
      description: "Selección de EPP requerido",
      fields: ['hpt_epp'],
      isValid: true // Siempre válido
    },
    {
      id: 3,
      title: "Estándares de Riesgos Críticos",
      description: "Identificación de ERC aplicables",
      fields: ['hpt_erc'],
      isValid: true // Siempre válido
    },
    {
      id: 4,
      title: "Medidas Clave",
      description: "Verificación de medidas de control",
      fields: ['hpt_medidas', 'hpt_riesgos_comp'],
      isValid: true // Siempre válido
    },
    {
      id: 5,
      title: "Difusión y Firmas",
      description: "Registro de difusión y firmas",
      fields: ['hpt_conocimiento', 'hpt_firmas'],
      isValid: true // Siempre válido
    }
  ];

  const updateData = useCallback((updates: Partial<HPTWizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const saveDraft = useCallback(async () => {
    // Solo guardar draft si se ha avanzado hasta el paso 3 o más y no existe HPT
    if (!data.operacion_id || currentStep < 3 || hptId) return;

    try {
      // Generar código único más robusto usando timestamp y random más largo
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substr(2, 9);
      const codigo = data.folio || `HPT-${operacionId?.slice(-4) || timestamp.slice(-6)}-${random}`;
      
      const hptData: HPTFormData = {
        ...data,
        codigo
      };

      await createHPT(hptData);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }, [data, hptId, createHPT, currentStep, operacionId]);

  const submitHPT = useCallback(async () => {
    try {
      // Generar código único más robusto usando timestamp y random más largo
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substr(2, 9);
      const codigo = data.folio || `HPT-${operacionId?.slice(-4) || timestamp.slice(-6)}-${random}`;
      
      const hptData: HPTFormData = {
        ...data,
        codigo
      };

      let finalHptId = hptId;
      
      if (!finalHptId) {
        const result = await createHPT(hptData);
        // finalHptId = result.id; // Assuming createHPT returns the created HPT
      } else {
        await updateHPT({ id: finalHptId, data: hptData });
      }

      toast({
        title: "HPT creado",
        description: "La Hoja de Planificación de Tarea ha sido creada exitosamente. Ahora puede firmarla.",
      });

      return finalHptId;
    } catch (error) {
      console.error('Error submitting HPT:', error);
      throw error;
    }
  }, [data, hptId, createHPT, updateHPT, operacionId]);

  const isFormComplete = useCallback(() => {
    return true; // Siempre completo
  }, []);

  const getCurrentStepProgress = useCallback(() => {
    return Math.round((currentStep / steps.length) * 100);
  }, [currentStep, steps.length]);

  // Auto-save every 30 seconds, but only if we're past step 3 and no HPT exists
  React.useEffect(() => {
    if (!autoSaveEnabled || currentStep < 3 || hptId) return;

    const interval = setInterval(() => {
      if (data.operacion_id) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoSaveEnabled, data.operacion_id, saveDraft, currentStep, hptId]);

  return {
    currentStep,
    data,
    steps,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    saveDraft,
    submitHPT,
    isFormComplete: isFormComplete(),
    progress: getCurrentStepProgress(),
    isLoading: isCreating || isUpdating || isSigning,
    autoSaveEnabled,
    setAutoSaveEnabled
  };
};
