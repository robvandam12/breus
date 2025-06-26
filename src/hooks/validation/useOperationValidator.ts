
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ValidationResult {
  success: boolean;
  isValid: boolean;
  message: string;
  suggestions?: string[];
  nextStep?: string;
}

export const useOperationValidator = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateForInmersion = async (
    operationId: string, 
    requiresDocuments: boolean
  ): Promise<ValidationResult> => {
    setIsValidating(true);
    try {
      // Verificar si la operación existe y está disponible
      const { data: operation } = await supabase
        .from('operacion')
        .select('id, nombre, codigo, estado')
        .eq('id', operationId)
        .single();

      if (!operation) {
        return {
          success: false,
          isValid: false,
          message: 'Operación no encontrada',
          nextStep: 'Crear inmersión independiente'
        };
      }

      if (operation.estado !== 'activa') {
        return {
          success: false,
          isValid: false,
          message: `La operación ${operation.codigo} no está activa`,
          nextStep: 'Seleccionar operación activa'
        };
      }

      // Verificar documentos requeridos si aplica
      if (requiresDocuments) {
        const { data: hpt } = await supabase
          .from('hpt')
          .select('id, firmado')
          .eq('operacion_id', operationId)
          .eq('firmado', true)
          .maybeSingle();

        const { data: anexo } = await supabase
          .from('anexo_bravo')
          .select('id, firmado')
          .eq('operacion_id', operationId)
          .eq('firmado', true)
          .maybeSingle();

        if (!hpt || !anexo) {
          return {
            success: false,
            isValid: false,
            message: 'Operación requiere HPT y Anexo Bravo firmados',
            suggestions: ['Completar documentos requeridos', 'Crear inmersión independiente']
          };
        }
      }

      return {
        success: true,
        isValid: true,
        message: `Inmersión puede asociarse a ${operation.codigo}`,
        nextStep: 'Proceder con inmersión planificada'
      };

    } catch (error) {
      console.error('Error validating operation:', error);
      return {
        success: false,
        isValid: false,
        message: 'Error en validación',
        nextStep: 'Reintentar o crear inmersión independiente'
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateForInmersion,
    isValidating
  };
};
