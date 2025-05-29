import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ValidationResult {
  isValid: boolean;
  hptStatus: 'missing' | 'pending' | 'signed';
  anexoBravoStatus: 'missing' | 'pending' | 'signed';
  errors: string[];
  warnings: string[];
}

export interface OperationValidation {
  operationId: string;
  operationName: string;
  validation: ValidationResult;
}

export const usePreDiveValidation = () => {
  const [validations, setValidations] = useState<OperationValidation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateOperation = async (operationId: string): Promise<ValidationResult> => {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Verificar HPT con validación más estricta
      const { data: hptData, error: hptError } = await supabase
        .from('hpt')
        .select('id, firmado, estado, progreso')
        .eq('operacion_id', operationId)
        .eq('firmado', true)
        .eq('estado', 'firmado');

      if (hptError) throw hptError;

      let hptStatus: 'missing' | 'pending' | 'signed' = 'missing';
      if (hptData && hptData.length > 0) {
        hptStatus = 'signed';
      } else {
        // Verificar si existe pero no está firmado
        const { data: hptPending } = await supabase
          .from('hpt')
          .select('id, estado, progreso')
          .eq('operacion_id', operationId);
        
        if (hptPending && hptPending.length > 0) {
          hptStatus = 'pending';
          errors.push('HPT existe pero no está firmado');
        } else {
          errors.push('HPT no encontrado para esta operación');
        }
      }

      // Verificar Anexo Bravo con validación más estricta
      const { data: anexoData, error: anexoError } = await supabase
        .from('anexo_bravo')
        .select('id, firmado, estado, progreso, checklist_completo')
        .eq('operacion_id', operationId)
        .eq('firmado', true)
        .eq('estado', 'firmado');

      if (anexoError) throw anexoError;

      let anexoBravoStatus: 'missing' | 'pending' | 'signed' = 'missing';
      if (anexoData && anexoData.length > 0) {
        anexoBravoStatus = 'signed';
      } else {
        // Verificar si existe pero no está firmado
        const { data: anexoPending } = await supabase
          .from('anexo_bravo')
          .select('id, estado, progreso, checklist_completo')
          .eq('operacion_id', operationId);
        
        if (anexoPending && anexoPending.length > 0) {
          anexoBravoStatus = 'pending';
          errors.push('Anexo Bravo existe pero no está firmado');
          if (!anexoPending[0].checklist_completo) {
            errors.push('Checklist de equipos no está completo');
          }
        } else {
          errors.push('Anexo Bravo no encontrado para esta operación');
        }
      }

      const isValid = hptStatus === 'signed' && anexoBravoStatus === 'signed' && errors.length === 0;

      return {
        isValid,
        hptStatus,
        anexoBravoStatus,
        errors,
        warnings
      };

    } catch (error) {
      console.error('Error validating operation:', error);
      return {
        isValid: false,
        hptStatus: 'missing',
        anexoBravoStatus: 'missing',
        errors: ['Error al validar la operación'],
        warnings: []
      };
    }
  };

  const validateAllActiveOperations = async () => {
    setIsLoading(true);
    try {
      // Obtener todas las operaciones activas
      const { data: operations, error } = await supabase
        .from('operacion')
        .select('id, nombre')
        .eq('estado', 'activa');

      if (error) throw error;

      if (operations && operations.length > 0) {
        const validationPromises = operations.map(async (op) => {
          const validation = await validateOperation(op.id);
          return {
            operationId: op.id,
            operationName: op.nombre,
            validation
          };
        });

        const results = await Promise.all(validationPromises);
        setValidations(results);

        // Mostrar alertas para operaciones con problemas
        const invalidOperations = results.filter(r => !r.validation.isValid);
        if (invalidOperations.length > 0) {
          toast({
            title: "Validaciones Pendientes",
            description: `${invalidOperations.length} operación(es) requieren atención antes de permitir inmersiones`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error validating operations:', error);
      toast({
        title: "Error de Validación",
        description: "No se pudieron validar las operaciones",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createImmersionWithValidation = async (immersionData: any) => {
    console.log('Validating operation before creating immersion:', immersionData.operacion_id);
    
    const validation = await validateOperation(immersionData.operacion_id);
    
    if (!validation.isValid) {
      const errorMessage = validation.errors.join(', ');
      throw new Error(`No se puede crear la inmersión: ${errorMessage}`);
    }

    if (validation.warnings.length > 0) {
      const warningMessage = validation.warnings.join(', ');
      console.warn('Advertencias de validación:', warningMessage);
    }

    // Si la validación pasa, crear la inmersión
    const { data, error } = await supabase
      .from('inmersion')
      .insert([{
        ...immersionData,
        hpt_validado: true,
        anexo_bravo_validado: true
      }])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Inmersión validada",
      description: "Los documentos han sido validados exitosamente.",
    });
    
    return data;
  };

  useEffect(() => {
    validateAllActiveOperations();
  }, []);

  return {
    validations,
    isLoading,
    validateOperation,
    validateAllActiveOperations,
    createImmersionWithValidation
  };
};
