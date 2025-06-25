
import { useContextualValidation } from './useContextualValidation';
import { useContextualNavigation } from './useContextualNavigation';
import { toast } from './use-toast';

interface EnhancedValidationOptions {
  showToast?: boolean;
  redirectOnError?: boolean;
  customErrorHandler?: (error: string, requiredModule?: string) => void;
}

export const useEnhancedValidation = () => {
  const { validateOperationByType, validateModuleAccess } = useContextualValidation();
  const { isRouteAccessible } = useContextualNavigation();

  // Validación con manejo automático de errores
  const validateWithErrorHandling = async (
    operationType: string, 
    data?: any, 
    options: EnhancedValidationOptions = {}
  ) => {
    const { 
      showToast = true, 
      redirectOnError = false, 
      customErrorHandler 
    } = options;

    try {
      const result = validateOperationByType(operationType, data);

      // Manejo de errores
      if (!result.canProceed) {
        const errorMessage = result.errors[0] || 'Operación no permitida';
        
        if (customErrorHandler) {
          customErrorHandler(errorMessage, result.requiredModule);
        } else if (showToast) {
          toast({
            title: "Acceso Denegado",
            description: errorMessage,
            variant: "destructive",
          });
        }

        if (redirectOnError && result.requiredModule) {
          // Aquí podrías implementar redirección a página de activación de módulos
          console.log(`Redirect to module activation: ${result.requiredModule}`);
        }

        return { success: false, result };
      }

      // Manejo de advertencias
      if (result.warnings.length > 0 && showToast) {
        toast({
          title: "Información",
          description: result.warnings[0],
          variant: "default",
        });
      }

      return { success: true, result };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de validación';
      
      if (showToast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }

      return { success: false, error: errorMessage };
    }
  };

  // Validar acceso a ruta con manejo automático
  const validateRouteAccess = (path: string, options: EnhancedValidationOptions = {}) => {
    const { showToast = true } = options;
    const result = isRouteAccessible(path);

    if (!result.accessible && showToast) {
      toast({
        title: "Acceso Denegado",
        description: result.reason || "No tienes permisos para acceder a esta sección",
        variant: "destructive",
      });
    }

    return result;
  };

  // Wrapper para acciones que requieren módulos específicos
  const withModuleValidation = (
    moduleId: string, 
    action: () => void | Promise<void>,
    options: EnhancedValidationOptions = {}
  ) => {
    return async () => {
      const result = validateModuleAccess(moduleId);
      
      if (!result.canProceed) {
        if (options.showToast !== false) {
          toast({
            title: "Módulo Requerido",
            description: `Esta función requiere el módulo '${moduleId}'`,
            variant: "destructive",
          });
        }
        return;
      }

      await action();
    };
  };

  return {
    validateWithErrorHandling,
    validateRouteAccess,
    withModuleValidation,
  };
};
