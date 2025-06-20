
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useContextualValidation } from './useContextualValidation';

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
  const { validateForImmersion } = useContextualValidation();

  const validateOperation = async (operationId: string): Promise<ValidationResult> => {
    try {
      const result = await validateForImmersion({ operacion_id: operationId });
      
      // Adaptar resultado al formato esperado
      return {
        isValid: result.isValid,
        hptStatus: result.errors.some(e => e.includes('HPT')) ? 'missing' : 'signed',
        anexoBravoStatus: result.errors.some(e => e.includes('Anexo')) ? 'missing' : 'signed',
        errors: result.errors,
        warnings: result.warnings
      };

    } catch (error) {
      console.error('Error validating operation:', error);
      return {
        isValid: true, // Permitir creación en caso de error
        hptStatus: 'missing',
        anexoBravoStatus: 'missing',
        errors: [],
        warnings: ['Error al validar - se permite continuar']
      };
    }
  };

  const validateAllActiveOperations = async () => {
    setIsLoading(true);
    try {
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

        const operationsWithWarnings = results.filter(r => r.validation.warnings.length > 0);
        if (operationsWithWarnings.length > 0) {
          toast({
            title: "Información de Validación",
            description: `${operationsWithWarnings.length} operación(es) tienen advertencias menores`,
          });
        }
      }
    } catch (error) {
      console.error('Error validating operations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createImmersionWithValidation = async (immersionData: any) => {
    console.log('Creating immersion with contextual validation:', immersionData.operacion_id);
    
    const validation = await validateForImmersion({
      operacion_id: immersionData.operacion_id,
      salmonera_id: immersionData.salmonera_id,
      contratista_id: immersionData.contratista_id,
      sitio_id: immersionData.sitio_id,
      buzo_principal: immersionData.buzo_principal,
      supervisor: immersionData.supervisor,
    });
    
    if (!validation.canProceed) {
      throw new Error(`Validación falló: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      toast({
        title: "Información",
        description: `Se creará la inmersión con advertencias: ${validation.warnings.join(', ')}`,
      });
    }

    const { data, error } = await supabase
      .from('inmersion')
      .insert([{
        ...immersionData,
        hpt_validado: validation.context.hasModuloPlanificacion ? validation.isValid : true,
        anexo_bravo_validado: validation.context.hasModuloPlanificacion ? validation.isValid : true
      }])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Inmersión creada",
      description: "La inmersión ha sido creada exitosamente.",
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
