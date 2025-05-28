
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

export interface HPTFormData {
  // Información básica
  codigo: string;
  folio: string;
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  
  // Empresa y personal
  empresa_servicio_nombre: string;
  supervisor_nombre: string;
  centro_trabajo_nombre: string;
  jefe_mandante_nombre: string;
  
  // Trabajo
  descripcion_tarea: string;
  lugar_especifico: string;
  es_rutinaria: boolean;
  tipo_trabajo: string;
  descripcion_trabajo: string;
  
  // Condiciones ambientales
  estado_puerto: string;
  profundidad_maxima: number;
  temperatura: number;
  corrientes: string;
  visibilidad: string;
  
  // Secciones del HPT
  hpt_conocimiento: any;
  hpt_conocimiento_asistentes: any[];
  hpt_riesgos_comp: any;
  hpt_medidas: any;
  hpt_erc: any;
  hpt_epp: any;
  
  // Firmas
  hpt_firmas: any;
  
  // Plan de emergencia
  plan_emergencia: string;
  hospital_cercano: string;
  camara_hiperbarica: string;
  
  observaciones: string;
}

interface HPTWizardStep {
  id: number;
  title: string;
  isValid: boolean;
  isCompleted: boolean;
}

export const useHPTWizard = (operacionId?: string) => {
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<HPTFormData>({
    codigo: '',
    folio: '',
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_termino: '',
    empresa_servicio_nombre: '',
    supervisor_nombre: '',
    centro_trabajo_nombre: '',
    jefe_mandante_nombre: '',
    descripcion_tarea: '',
    lugar_especifico: '',
    es_rutinaria: false,
    tipo_trabajo: '',
    descripcion_trabajo: '',
    estado_puerto: '',
    profundidad_maxima: 0,
    temperatura: 0,
    corrientes: '',
    visibilidad: '',
    hpt_conocimiento: {},
    hpt_conocimiento_asistentes: [],
    hpt_riesgos_comp: {},
    hpt_medidas: {},
    hpt_erc: {},
    hpt_epp: {},
    hpt_firmas: {},
    plan_emergencia: '',
    hospital_cercano: '',
    camara_hiperbarica: '',
    observaciones: ''
  });

  // Auto-populate data when operation is selected
  useEffect(() => {
    const populateOperationData = async () => {
      if (!operacionId) return;

      try {
        console.log('Populating HPT data for operation:', operacionId);
        
        // Get operation data
        const { data: operacion, error: opError } = await supabase
          .from('operacion')
          .select(`
            *,
            salmoneras:salmonera_id (nombre),
            sitios:sitio_id (nombre),
            contratistas:contratista_id (nombre)
          `)
          .eq('id', operacionId)
          .single();

        if (opError) throw opError;

        // Get assigned diving team
        const equipoAsignado = operacion.equipo_buceo_id 
          ? equipos.find(eq => eq.id === operacion.equipo_buceo_id)
          : null;

        console.log('Operation:', operacion);
        console.log('Assigned team:', equipoAsignado);

        // Generate unique code and folio
        const hptCode = `HPT-${operacion.codigo}-${Date.now().toString().slice(-4)}`;
        const folio = `${Date.now().toString().slice(-6)}`;

        // Auto-populate form data
        const autoUpdates: Partial<HPTFormData> = {
          codigo: hptCode,
          folio: folio,
          fecha: new Date().toISOString().split('T')[0],
          empresa_servicio_nombre: operacion.contratistas?.nombre || '',
          centro_trabajo_nombre: operacion.sitios?.nombre || '',
          descripcion_tarea: operacion.nombre || '',
          lugar_especifico: operacion.sitios?.nombre || '',
          descripcion_trabajo: operacion.tareas || '',
          plan_emergencia: `Plan de emergencia para operación ${operacion.codigo}`,
          hospital_cercano: 'Hospital Regional más cercano',
          camara_hiperbarica: 'Cámara hiperbárica disponible en puerto base'
        };

        // If there's an assigned team, populate personnel
        if (equipoAsignado?.miembros) {
          const supervisor = equipoAsignado.miembros.find(m => m.rol === 'supervisor');
          const jefeMandante = equipoAsignado.miembros.find(m => m.rol === 'supervisor') || 
                              equipoAsignado.miembros[0]; // Fallback to first member
          
          if (supervisor) {
            autoUpdates.supervisor_nombre = supervisor.nombre_completo;
          }
          
          if (jefeMandante) {
            autoUpdates.jefe_mandante_nombre = jefeMandante.nombre_completo;
          }

          // Auto-populate asistentes from diving team
          const asistentesData = equipoAsignado.miembros.map((miembro) => ({
            id: miembro.id,
            nombre: miembro.nombre_completo,
            rut: '', // RUT not available in EquipoBuceoMiembro
            empresa: operacion.contratistas?.nombre || '',
            firma_url: '',
            conocimiento_verificado: false,
            rol: miembro.rol
          }));
          
          autoUpdates.hpt_conocimiento_asistentes = asistentesData;
        }

        setFormData(prev => ({ ...prev, ...autoUpdates }));
        
        console.log('HPT auto-populated data:', autoUpdates);
        
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

    populateOperationData();
  }, [operacionId, equipos, operaciones]);

  const steps: HPTWizardStep[] = [
    {
      id: 1,
      title: "Información General",
      isValid: !!(
        formData.codigo &&
        formData.fecha &&
        formData.empresa_servicio_nombre &&
        formData.supervisor_nombre
      ),
      isCompleted: !!(
        formData.codigo &&
        formData.fecha &&
        formData.empresa_servicio_nombre &&
        formData.supervisor_nombre &&
        formData.descripcion_tarea
      )
    },
    {
      id: 2,
      title: "Conocimiento del Trabajo",
      isValid: Object.keys(formData.hpt_conocimiento).length > 0,
      isCompleted: Object.keys(formData.hpt_conocimiento).length > 0 && 
                   formData.hpt_conocimiento_asistentes?.length > 0
    },
    {
      id: 3,
      title: "Estándares de Riesgos Críticos",
      isValid: Object.keys(formData.hpt_erc).length > 0,
      isCompleted: Object.keys(formData.hpt_erc).length > 0
    },
    {
      id: 4,
      title: "Medidas de Control",
      isValid: Object.keys(formData.hpt_medidas).length > 0,
      isCompleted: Object.keys(formData.hpt_medidas).length > 0
    },
    {
      id: 5,
      title: "EPP",
      isValid: Object.keys(formData.hpt_epp).length > 0,
      isCompleted: Object.keys(formData.hpt_epp).length > 0
    },
    {
      id: 6,
      title: "Firmas y Finalización",
      isValid: Object.keys(formData.hpt_firmas).length > 0,
      isCompleted: Object.keys(formData.hpt_firmas).length > 0
    }
  ];

  const updateFormData = (updates: Partial<HPTFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const currentStepData = steps[currentStep - 1];
    if (!currentStepData.isValid) {
      toast({
        title: "Paso incompleto",
        description: "Complete todos los campos requeridos antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
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
    setCurrentStep(step);
  };

  const getProgress = () => {
    const completedSteps = steps.filter(step => step.isCompleted).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const isFormValid = () => {
    return steps.every(step => step.isValid);
  };

  const submitHPT = async () => {
    if (!isFormValid()) {
      toast({
        title: "Formulario incompleto",
        description: "Complete todos los pasos antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const hptData = {
        ...formData,
        operacion_id: operacionId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        estado: 'borrador',
        progreso: getProgress()
      };

      const { data, error } = await supabase
        .from('hpt')
        .insert([hptData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "HPT creado",
        description: "El HPT ha sido creado exitosamente.",
      });

      return data;
    } catch (error) {
      console.error('Error creating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el HPT.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    currentStep,
    formData,
    steps,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    getProgress,
    isFormValid,
    submitHPT
  };
};
