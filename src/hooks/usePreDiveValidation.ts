
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

      // Verificar HPT
      const { data: hptData, error: hptError } = await supabase
        .from('hpt')
        .select('id, firmado, estado, progreso')
        .eq('operacion_id', operationId);

      if (hptError) throw hptError;

      let hptStatus: 'missing' | 'pending' | 'signed' = 'missing';
      if (hptData && hptData.length > 0) {
        const hpt = hptData[0];
        if (hpt.firmado && hpt.estado === 'firmado') {
          hptStatus = 'signed';
        } else {
          hptStatus = 'pending';
          if (hpt.progreso < 100) {
            warnings.push(`HPT incompleto (${hpt.progreso}% completado)`);
          }
        }
      } else {
        errors.push('HPT no encontrado para esta operación');
      }

      // Verificar Anexo Bravo
      const { data: anexoData, error: anexoError } = await supabase
        .from('anexo_bravo')
        .select('id, firmado, estado, progreso, checklist_completo')
        .eq('operacion_id', operationId);

      if (anexoError) throw anexoError;

      let anexoBravoStatus: 'missing' | 'pending' | 'signed' = 'missing';
      if (anexoData && anexoData.length > 0) {
        const anexo = anexoData[0];
        if (anexo.firmado && anexo.estado === 'firmado') {
          anexoBravoStatus = 'signed';
        } else {
          anexoBravoStatus = 'pending';
          if (anexo.progreso < 100) {
            warnings.push(`Anexo Bravo incompleto (${anexo.progreso}% completado)`);
          }
          if (!anexo.checklist_completo) {
            warnings.push('Checklist de equipos no completado');
          }
        }
      } else {
        errors.push('Anexo Bravo no encontrado para esta operación');
      }

      // Validaciones adicionales
      if (hptStatus === 'signed' && anexoBravoStatus === 'signed') {
        // Verificar que las fechas sean coherentes
        const hpt = hptData[0];
        const anexo = anexoData[0];
        
        // Aquí podrías agregar más validaciones específicas
        // como verificar fechas, equipos, personal, etc.
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
