
import { useInmersiones as useBaseInmersiones } from './useInmersiones';
import { useContextualOperations } from './useContextualOperations';
import { toast } from '@/hooks/use-toast';

export const useInmersionesContextual = (operacionId?: string) => {
  const baseHook = useBaseInmersiones(operacionId);
  const { validateInmersionCreation } = useContextualOperations();

  const createInmersionWithContext = async (inmersionData: any) => {
    try {
      // Validación contextual antes de crear
      if (inmersionData.operacion_id) {
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
            description: `Inmersión creada con advertencias: ${warningMessage}`,
          });
        }

        // Establecer contexto en los datos de inmersión
        inmersionData.contexto_operativo = validation.es_operativa_directa ? 'operativa_directa' : 'planificada';
        inmersionData.requiere_validacion_previa = validation.requiere_documentos;
      }

      // Usar el método base para crear la inmersión
      return await baseHook.createInmersion(inmersionData);

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

  return {
    ...baseHook,
    createInmersion: createInmersionWithContext,
    // Mantener método original como alternativa
    createInmersionDirect: baseHook.createInmersion,
  };
};
