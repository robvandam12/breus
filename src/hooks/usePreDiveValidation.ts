
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useContextualValidation } from './useContextualValidation';
import { useEnhancedValidation } from './useEnhancedValidation';

export interface ValidationResult {
  isValid: boolean;
  hptStatus: 'missing' | 'pending' | 'signed' | 'not_required';
  anexoBravoStatus: 'missing' | 'pending' | 'signed' | 'not_required';
  errors: string[];
  warnings: string[];
  context: {
    moduleActive: boolean;
    requiresDocuments: boolean;
    allowDirectCreation: boolean;
  };
}

export interface OperationValidation {
  operationId: string;
  operationName: string;
  validation: ValidationResult;
}

export const usePreDiveValidation = () => {
  const [validations, setValidations] = useState<OperationValidation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { validateOperationByType } = useContextualValidation();
  const { validateWithErrorHandling } = useEnhancedValidation();

  const validateOperation = async (operationId: string): Promise<ValidationResult> => {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Usar validación contextual para obtener el contexto modular
      const contextualResult = validateOperationByType('create_planned_immersion', { 
        operacion_id: operationId 
      });

      const context = {
        moduleActive: contextualResult.context.moduleAccess.planning,
        requiresDocuments: contextualResult.context.requiresDocuments,
        allowDirectCreation: contextualResult.context.allowDirectCreation,
      };

      let hptStatus: ValidationResult['hptStatus'] = 'not_required';
      let anexoBravoStatus: ValidationResult['anexoBravoStatus'] = 'not_required';

      // Solo validar documentos si el módulo de planificación está activo
      if (context.moduleActive && context.requiresDocuments) {
        // Verificar HPT
        const { data: hptData } = await supabase
          .from('hpt')
          .select('id, firmado, estado, progreso')
          .eq('operacion_id', operationId);

        if (hptData && hptData.length > 0) {
          const hpt = hptData[0];
          if (hpt.firmado && hpt.estado === 'firmado') {
            hptStatus = 'signed';
          } else {
            hptStatus = 'pending';
            warnings.push('HPT existe pero no está firmado');
          }
        } else {
          hptStatus = 'missing';
          warnings.push('HPT no encontrado para esta operación');
        }

        // Verificar Anexo Bravo
        const { data: anexoData } = await supabase
          .from('anexo_bravo')
          .select('id, firmado, estado, progreso, checklist_completo')
          .eq('operacion_id', operationId);

        if (anexoData && anexoData.length > 0) {
          const anexo = anexoData[0];
          if (anexo.firmado && anexo.estado === 'firmado') {
            anexoBravoStatus = 'signed';
          } else {
            anexoBravoStatus = 'pending';
            warnings.push('Anexo Bravo existe pero no está firmado');
          }
        } else {
          anexoBravoStatus = 'missing';
          warnings.push('Anexo Bravo no encontrado para esta operación');
        }
      } else {
        // Módulo no activo - documentos no requeridos (funcionalidad core)
        warnings.push('Modo core activo - Documentos no requeridos');
      }

      // Validación final contextual
      const isValid = context.requiresDocuments 
        ? (hptStatus === 'signed' && anexoBravoStatus === 'signed')
        : true; // CORE: Sin requisitos de documentos, siempre válido

      return {
        isValid,
        hptStatus,
        anexoBravoStatus,
        errors,
        warnings,
        context
      };

    } catch (error) {
      console.error('Error validating operation:', error);
      return {
        isValid: true, // CORE: En caso de error, permitir (funcionalidad core)
        hptStatus: 'not_required',
        anexoBravoStatus: 'not_required',
        errors: ['Error al validar la operación'],
        warnings: ['Modo fallback activo - validación simplificada'],
        context: {
          moduleActive: false,
          requiresDocuments: false,
          allowDirectCreation: true, // CORE: Siempre permitir
        }
      };
    }
  };

  const createImmersionWithValidation = async (immersionData: any) => {
    console.log('Creating immersion with contextual validation:', immersionData);
    
    // CORE: Para inmersiones independientes, usar validación simplificada
    if (immersionData.is_independent || !immersionData.operacion_id) {
      console.log('Creating independent immersion (core functionality)');
      
      // Usar validateWithErrorHandling para manejo automático de errores
      const { success, result } = await validateWithErrorHandling(
        'create_immersion',
        immersionData,
        { showToast: false } // Manejar toast manualmente
      );
      
      if (!success) {
        throw new Error('No se puede crear la inmersión independiente');
      }

      // Crear inmersión independiente
      const { data, error } = await supabase
        .from('inmersion')
        .insert([{
          ...immersionData,
          is_independent: true,
          hpt_validado: true, // Core no requiere HPT
          anexo_bravo_validado: true, // Core no requiere Anexo Bravo
          contexto_operativo: 'independiente'
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Inmersión creada",
        description: "La inmersión independiente ha sido creada exitosamente.",
      });
      
      return data;
    }

    // PLANNING: Para inmersiones con operación, usar validación contextual completa
    const { success, result } = await validateWithErrorHandling(
      'create_planned_immersion',
      immersionData,
      { showToast: false } // Manejar toast manualmente
    );
    
    if (!success || !result?.canProceed) {
      const errorMessage = result?.errors?.join(', ') || 'No se puede crear la inmersión';
      throw new Error(errorMessage);
    }

    if (result.warnings.length > 0) {
      const warningMessage = result.warnings.join(', ');
      console.warn('Advertencias de validación:', warningMessage);
      
      toast({
        title: "Información",
        description: `Inmersión creada con advertencias: ${warningMessage}`,
      });
    }

    // Determinar estados de validación según contexto
    const hptValidado = result.context?.requiresDocuments 
      ? (immersionData.operacion_id ? await checkDocumentSigned('hpt', immersionData.operacion_id) : false)
      : true; // CORE: Si no requiere documentos, marcar como validado

    const anexoBravoValidado = result.context?.requiresDocuments
      ? (immersionData.operacion_id ? await checkDocumentSigned('anexo_bravo', immersionData.operacion_id) : false)
      : true; // CORE: Si no requiere documentos, marcar como validado

    // Crear la inmersión
    const { data, error } = await supabase
      .from('inmersion')
      .insert([{
        ...immersionData,
        hpt_validado: hptValidado,
        anexo_bravo_validado: anexoBravoValidado
      }])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Inmersión creada",
      description: result.context?.moduleAccess?.planning 
        ? "La inmersión ha sido creada con validaciones completas."
        : "La inmersión ha sido creada en modo core.",
    });
    
    return data;
  };

  // Helper para verificar documentos firmados
  const checkDocumentSigned = async (docType: 'hpt' | 'anexo_bravo', operacionId: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from(docType)
        .select('firmado, estado')
        .eq('operacion_id', operacionId)
        .eq('firmado', true)
        .eq('estado', 'firmado')
        .single();
      
      return !!data;
    } catch {
      return false;
    }
  };

  return {
    validations,
    isLoading,
    validateOperation,
    createImmersionWithValidation,
    // Helpers de compatibilidad
    canPlanOperations: false, // Deprecated: usar contextual hooks
    contextualMode: true, // Siempre usar modo contextual
  };
};
