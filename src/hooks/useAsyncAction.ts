
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";

interface UseAsyncActionOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export const useAsyncAction = (options: UseAsyncActionOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    successMessage = "Operación completada exitosamente",
    errorMessage = "Ocurrió un error al realizar la operación",
    showSuccessToast = true,
    showErrorToast = true
  } = options;

  const execute = async <T>(asyncFunction: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      
      if (showSuccessToast) {
        toast({
          title: "Éxito",
          description: successMessage,
        });
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : errorMessage;
      setError(errorMsg);
      
      if (showErrorToast) {
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
      
      console.error('AsyncAction error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
