
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  retryCallback?: () => void;
}

export const useErrorHandler = (defaultOptions: ErrorHandlerOptions = {}) => {
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((
    error: unknown, 
    options: ErrorHandlerOptions = {}
  ) => {
    const finalOptions = { ...defaultOptions, ...options };
    
    const processedError = error instanceof Error 
      ? error 
      : new Error(finalOptions.fallbackMessage || 'Error desconocido');
    
    setError(processedError);

    if (finalOptions.showToast !== false) {
      toast({
        title: 'Error',
        description: processedError.message,
        variant: 'destructive',
      });
    }

    // Log error en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('Error capturado:', processedError);
    }
  }, [defaultOptions]);

  const retry = useCallback(async () => {
    if (!defaultOptions.retryCallback) return;
    
    setIsRetrying(true);
    try {
      await defaultOptions.retryCallback();
      setError(null);
    } catch (retryError) {
      handleError(retryError, { showToast: true });
    } finally {
      setIsRetrying(false);
    }
  }, [defaultOptions.retryCallback, handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    retry,
    clearError,
    isRetrying,
    hasError: !!error
  };
};
