
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useModuleAccess } from './useModuleAccess';
import { useContextualValidation } from './useContextualValidation';

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
  
  const { canPlanOperations, isModuleActive, modules } = useModuleAccess();
  const { validateInmersionCreation } = useContextualValidation();

  const validateOperation = async (operationId: string): Promise<ValidationResult> => {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Contexto modular
      const context = {
        moduleActive: canPlanOperations,
        requiresDocuments: canPlanOperations,
        allowDirectCreation: true, // CORE: Siempre permitir creación directa
      };

      let hptStatus: ValidationResult['hptStatus'] = 'not_required';
      let anexoBravoStatus: ValidationResult['anexoBravoStatus'] = 'not_required';

      // Solo validar documentos si el módulo de planificación está activo
      if (canPlanOperations) {
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
        warnings.push('Módulo de planificación no activo - Documentos no requeridos');
      }

      // Validación final contextual
      const isValid = canPlanOperations 
        ? (hptStatus === 'signed' && anexoBravoStatus === 'signed')
        : true; // CORE: Sin módulo de planificación, siempre válido

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
        hptStatus: canPlanOperations ? 'missing' : 'not_required',
        anexoBravoStatus: canPlanOperations ? 'missing' : 'not_required',
        errors: canPlanOperations ? ['Error al validar la operación'] : [],
        warnings: canPlanOperations ? [] : ['Modo core - validación no requerida'],
        context: {
          moduleActive: canPlanOperations,
          requiresDocuments: canPlanOperations,
          allowDirectCreation: true, // CORE: Siempre permitir
        }
      };
    }
  };

  const createImmersionWithValidation = async (immersionData: any) => {
    console.log('Creating immersion with contextual validation:', immersionData);
    
    // CORE: Para inmersiones independientes, no validar operación
    if (immersionData.is_independent || !immersionData.operacion_id) {
      console.log('Creating independent immersion (core functionality)');
      
      // Crear inmersión independiente sin validaciones complejas
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

    // PLANNING: Para inmersiones con operación, usar validación contextual
    const validation = await validateInmersionCreation(immersionData);
    
    if (!validation.canProceed) {
      const errorMessage = validation.errors.join(', ');
      throw new Error(`No se puede crear la inmersión: ${errorMessage}`);
    }

    if (validation.warnings.length > 0) {
      const warningMessage = validation.warnings.join(', ');
      console.warn('Advertencias de validación:', warningMessage);
      
      toast({
        title: "Información",
        description: `Inmersión creada con advertencias: ${warningMessage}`,
      });
    }

    // Determinar estados de validación según contexto
    const hptValidado = validation.context.requiresDocuments 
      ? (immersionData.operacion_id ? await checkDocumentSigned('hpt', immersionData.operacion_id) : false)
      : true; // CORE: Si no requiere documentos, marcar como validado

    const anexoBravoValidado = validation.context.requiresDocuments
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
      description: canPlanOperations 
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
    canPlanOperations,
    contextualMode: !canPlanOperations,
  };
};
