
import { useInmersiones as useBaseInmersiones } from './useInmersiones';
import { useContextualOperations } from './useContextualOperations';
import { toast } from '@/hooks/use-toast';

export const useInmersionesContextual = (operacionId?: string) => {
  const baseHook = useBaseInmersiones(operacionId);
  const { validateInmersionCreation, operationalContext } = useContextualOperations();

  const createInmersionWithContext = async (inmersionData: any) => {
    try {
      console.log('Creating immersion with contextual validation...');
      
      // Validación contextual antes de crear
      const validation = await validateInmersionCreation(inmersionData.operacion_id);
      
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(', ');
        throw new Error(`Validación contextual falló: ${errorMessage}`);
      }

      // Mostrar advertencias si las hay
      if (validation.warnings.length > 0) {
        const warningMessage = validation.warnings.join(', ');
        toast({
          title: "Información",
          description: warningMessage,
          variant: "default",
        });
      }

      // Establecer contexto en los datos de inmersión
      const contextualData = {
        ...inmersionData,
        context_type: inmersionData.operacion_id ? 'planned' : 'direct',
        requires_validation: validation.requiresDocuments,
        validation_status: validation.requiresDocuments ? 'pending' : 'not_required',
        metadata: {
          ...inmersionData.metadata,
          operational_context: operationalContext?.context_type,
          company_type: operationalContext?.company_type,
          created_via: 'contextual_flow'
        }
      };

      console.log('Contextual immersion data:', contextualData);

      // Usar el método base para crear la inmersión
      return await baseHook.createInmersion(contextualData);

    } catch (error: any) {
      console.error('Error creating contextual immersion:', error);
      
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la inmersión con validación contextual",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const createDirectImmersion = async (inmersionData: any) => {
    try {
      console.log('Creating direct immersion...');
      
      // Validar inmersión directa
      const validation = await validateInmersionCreation();
      
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(', ');
        throw new Error(`No se puede crear inmersión directa: ${errorMessage}`);
      }

      // Datos para inmersión directa
      const directData = {
        ...inmersionData,
        operacion_id: null, // Sin operación asociada
        context_type: 'direct',
        requires_validation: false,
        validation_status: 'not_required',
        metadata: {
          ...inmersionData.metadata,
          operational_context: 'direct',
          company_type: operationalContext?.company_type,
          created_via: 'direct_flow'
        }
      };

      // Mostrar advertencias si las hay
      if (validation.warnings.length > 0) {
        const warningMessage = validation.warnings.join(', ');
        toast({
          title: "Inmersión Directa",
          description: warningMessage,
          variant: "default",
        });
      }

      console.log('Direct immersion data:', directData);
      return await baseHook.createInmersion(directData);

    } catch (error: any) {
      console.error('Error creating direct immersion:', error);
      
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la inmersión directa",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    ...baseHook,
    
    // Métodos contextuales
    createInmersion: createInmersionWithContext,
    createDirectImmersion,
    
    // Mantener método original como alternativa
    createInmersionDirect: baseHook.createInmersion,
    
    // Información contextual
    operationalContext,
    canCreateDirectImmersion: operationalContext?.allows_direct_operations || false,
    requiresPlanning: operationalContext?.requires_planning || false,
    requiresDocuments: operationalContext?.requires_documents || false,
  };
};
