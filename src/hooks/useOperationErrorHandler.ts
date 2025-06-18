
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface OperationError {
  type: 'validation' | 'network' | 'permission' | 'data' | 'unknown';
  message: string;
  details?: string;
  context?: string;
}

export const useOperationErrorHandler = () => {
  const handleError = useCallback((error: any, context?: string): OperationError => {
    let operationError: OperationError;

    // Analizar el tipo de error
    if (error?.code === 'PGRST116') {
      // No data found - no es realmente un error
      operationError = {
        type: 'data',
        message: 'No se encontraron datos',
        details: 'Esta consulta no devolvió resultados, lo cual puede ser normal.',
        context
      };
    } else if (error?.code === '23503') {
      // Foreign key violation
      operationError = {
        type: 'validation',
        message: 'Error de referencia de datos',
        details: 'Intenta hacer referencia a datos que no existen o han sido eliminados.',
        context
      };
    } else if (error?.code === '23505') {
      // Unique constraint violation
      operationError = {
        type: 'validation',
        message: 'Datos duplicados',
        details: 'Ya existe un registro con estos datos únicos.',
        context
      };
    } else if (error?.message?.includes('permission')) {
      // Permission errors
      operationError = {
        type: 'permission',
        message: 'Sin permisos',
        details: 'No tiene permisos para realizar esta acción.',
        context
      };
    } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      // Network errors
      operationError = {
        type: 'network',
        message: 'Error de conexión',
        details: 'Verifique su conexión a internet e intente nuevamente.',
        context
      };
    } else {
      // Generic error
      operationError = {
        type: 'unknown',
        message: error?.message || 'Error desconocido',
        details: error?.details || 'Ocurrió un error inesperado.',
        context
      };
    }

    // Log para debugging
    console.error(`Operation Error [${operationError.type}] in ${context}:`, {
      original: error,
      processed: operationError
    });

    return operationError;
  }, []);

  const showErrorToast = useCallback((error: OperationError) => {
    const shouldShowToast = error.type !== 'data' || error.context?.includes('critical');
    
    if (shouldShowToast) {
      toast({
        title: error.message,
        description: error.details,
        variant: error.type === 'data' ? 'default' : 'destructive',
      });
    }
  }, []);

  const handleAndShowError = useCallback((error: any, context?: string) => {
    const processedError = handleError(error, context);
    showErrorToast(processedError);
    return processedError;
  }, [handleError, showErrorToast]);

  return {
    handleError,
    showErrorToast,
    handleAndShowError
  };
};
