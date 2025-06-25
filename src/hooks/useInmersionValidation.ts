
import { useContextualValidation } from './useContextualValidation';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export const useInmersionValidation = () => {
  const { validateOperationByType } = useContextualValidation();
  const { profile } = useAuth();

  const validateInmersionForm = (formData: any) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validaciones básicas requeridas
    if (!formData.codigo?.trim()) {
      errors.push('El código de inmersión es requerido');
    }

    if (!formData.fecha_inmersion) {
      errors.push('La fecha de inmersión es requerida');
    }

    if (!formData.hora_inicio) {
      errors.push('La hora de inicio es requerida');
    }

    if (!formData.objetivo?.trim()) {
      errors.push('El objetivo de la inmersión es requerido');
    }

    if (!formData.buzo_principal?.trim()) {
      errors.push('El buzo principal es requerido');
    }

    if (!formData.supervisor?.trim()) {
      errors.push('El supervisor es requerido');
    }

    if (!formData.profundidad_max || formData.profundidad_max <= 0) {
      errors.push('La profundidad máxima debe ser mayor a 0');
    }

    if (!formData.temperatura_agua || formData.temperatura_agua < 0) {
      errors.push('La temperatura del agua es requerida');
    }

    if (!formData.visibilidad || formData.visibilidad <= 0) {
      errors.push('La visibilidad debe ser mayor a 0');
    }

    if (!formData.corriente?.trim()) {
      errors.push('La información de corriente es requerida');
    }

    // Validación contextual según tipo de inmersión
    const operationType = formData.operacion_id ? 'create_planned_immersion' : 'create_immersion';
    const contextValidation = validateOperationByType(operationType, formData);

    if (!contextValidation.canProceed) {
      errors.push(...contextValidation.errors);
    }

    warnings.push(...contextValidation.warnings);

    // Validaciones de profundidad y seguridad
    if (formData.profundidad_max > 40) {
      warnings.push('Profundidad superior a 40m requiere protocolos especiales de descompresión');
    }

    if (formData.profundidad_max > 60) {
      errors.push('Profundidad superior a 60m requiere autorización especial');
    }

    // Validar hora fin si está presente
    if (formData.hora_fin && formData.hora_inicio) {
      const horaInicio = new Date(`2000-01-01T${formData.hora_inicio}`);
      const horaFin = new Date(`2000-01-01T${formData.hora_fin}`);
      
      if (horaFin <= horaInicio) {
        errors.push('La hora de fin debe ser posterior a la hora de inicio');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      contextValidation
    };
  };

  const showValidationResults = (validationResult: ReturnType<typeof validateInmersionForm>) => {
    if (validationResult.errors.length > 0) {
      toast({
        title: "Errores de validación",
        description: validationResult.errors.join('. '),
        variant: "destructive",
      });
    }

    if (validationResult.warnings.length > 0) {
      toast({
        title: "Advertencias",
        description: validationResult.warnings.join('. '),
      });
    }
  };

  return {
    validateInmersionForm,
    showValidationResults
  };
};
