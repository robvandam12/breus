
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useContextualValidations } from './useContextualValidations';
import { useOperationalContext } from './useOperationalContext';

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
  
  const { validateInmersionCreation, validateDocumentRequirement } = useContextualValidations();
  const { canCreateOperations, requiresDocuments } = useOperationalContext();

  const validateOperation = async (operationId: string): Promise<ValidationResult> => {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Contexto modular actualizado
      const context = {
        moduleActive: canCreateOperations(),
        requiresDocuments: requiresDocuments(),
        allowDirectCreation: true, // Siempre true para core
      };

      let hptStatus: ValidationResult['hptStatus'] = 'not_required';
      let anexoBravoStatus: ValidationResult['anexoBravoStatus'] = 'not_required';

      // Solo validar documentos si el módulo de planificación está activo Y se requieren documentos
      if (canCreateOperations() && requiresDocuments()) {
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
        // Módulo no activo o documentos no requeridos
        if (!canCreateOperations()) {
          warnings.push('Módulo de planificación no activo - Documentos no requeridos');
        } else {
          warnings.push('Configuración no requiere documentos para esta empresa');
        }
      }

      // Validación final contextual
      const isValid = canCreateOperations() && requiresDocuments()
        ? (hptStatus === 'signed' && anexoBravoStatus === 'signed')
        : true; // Si no hay módulo de planificación o no requiere documentos, siempre es válido

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
        isValid: true, // En caso de error, permitir continuar (no bloquear core)
        hptStatus: canCreateOperations() && requiresDocuments() ? 'missing' : 'not_required',
        anexoBravoStatus: canCreateOperations() && requiresDocuments() ? 'missing' : 'not_required',
        errors: canCreateOperations() ? ['Error al validar la operación'] : [],
        warnings: canCreateOperations() ? [] : ['Modo independiente - validación no requerida'],
        context: {
          moduleActive: canCreateOperations(),
          requiresDocuments: requiresDocuments(),
          allowDirectCreation: true,
        }
      };
    }
  };

  const createImmersionWithValidation = async (immersionData: any) => {
    console.log('Creating immersion with contextual validation:', immersionData);
    
    // Usar nueva validación contextual
    const validation = validateInmersionCreation(immersionData);
    
    if (!validation.canProceed) {
      const errorMessage = validation.errors.join(', ');
      throw new Error(`No se puede crear la inmersión: ${errorMessage}`);
    }

    if (validation.warnings.length > 0) {
      const warningMessage = validation.warnings.join(', ');
      console.warn('Advertencias de validación:', warningMessage);
      
      // Solo mostrar toast para advertencias importantes
      if (validation.warnings.some(w => w.includes('Modo directo') || w.includes('mixto'))) {
        toast({
          title: "Información",
          description: warningMessage,
        });
      }
    }

    // Determinar estados de validación según contexto
    const hptValidado = requiresDocuments() && immersionData.operacion_id
      ? await checkDocumentSigned('hpt', immersionData.operacion_id)
      : true; // Si no requiere documentos, marcar como validado

    const anexoBravoValidado = requiresDocuments() && immersionData.operacion_id
      ? await checkDocumentSigned('anexo_bravo', immersionData.operacion_id)
      : true; // Si no requiere documentos, marcar como validado

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
      description: canCreateOperations()
        ? "La inmersión ha sido creada con validaciones contextuales."
        : "La inmersión ha sido creada en modo directo.",
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
    canPlanOperations: canCreateOperations(),
    contextualMode: !canCreateOperations(),
  };
};
