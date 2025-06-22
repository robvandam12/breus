
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface OperacionContext {
  id: string;
  operacion_id: string;
  tipo_contexto: 'planificada' | 'operativa_directa';
  empresa_origen_id: string;
  empresa_origen_tipo: 'salmonera' | 'contratista';
  empresa_destino_id?: string;
  empresa_destino_tipo?: 'salmonera' | 'contratista';
  requiere_documentos: boolean;
  requiere_hpt: boolean;
  requiere_anexo_bravo: boolean;
  estado_planificacion?: string;
  metadatos: Record<string, any>;
}

export interface ContextualValidationResult {
  isValid: boolean;
  contexto: OperacionContext | null;
  requiere_documentos: boolean;
  requiere_hpt: boolean;
  requiere_anexo_bravo: boolean;
  es_operativa_directa: boolean;
  es_legacy: boolean;
  warnings: string[];
  errors: string[];
}

// Interfaz para el resultado de la función RPC
interface OperacionFullContextResult {
  operacion: any;
  contexto: any;
  tiene_contexto: boolean;
  es_legacy: boolean;
}

// Tipo para el contexto de operación
type TipoContexto = 'planificada' | 'operativa_directa';

export const useContextualOperations = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Obtener contexto completo de una operación
  const getOperacionContext = async (operacionId: string): Promise<ContextualValidationResult> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_operacion_full_context', {
        p_operacion_id: operacionId
      });

      if (error) throw error;

      const warnings: string[] = [];
      const errors: string[] = [];

      // Convertir a unknown primero, luego a nuestro tipo esperado
      const result = data as unknown as OperacionFullContextResult;

      // Si es operación legacy (sin contexto)
      if (result.es_legacy) {
        warnings.push('Operación legacy: requiere validación HPT y Anexo Bravo tradicional');
        return {
          isValid: true,
          contexto: null,
          requiere_documentos: true,
          requiere_hpt: true,
          requiere_anexo_bravo: true,
          es_operativa_directa: false,
          es_legacy: true,
          warnings,
          errors
        };
      }

      const contexto = result.contexto as OperacionContext;
      const esOperativaDirecta = contexto?.tipo_contexto === 'operativa_directa';

      if (esOperativaDirecta) {
        warnings.push('Operación directa: validación documental no requerida');
      }

      return {
        isValid: true,
        contexto,
        requiere_documentos: contexto?.requiere_documentos || false,
        requiere_hpt: contexto?.requiere_hpt || false,
        requiere_anexo_bravo: contexto?.requiere_anexo_bravo || false,
        es_operativa_directa: esOperativaDirecta,
        es_legacy: false,
        warnings,
        errors
      };

    } catch (error: any) {
      console.error('Error getting operation context:', error);
      return {
        isValid: false,
        contexto: null,
        requiere_documentos: true,
        requiere_hpt: true,
        requiere_anexo_bravo: true,
        es_operativa_directa: false,
        es_legacy: true,
        warnings: [],
        errors: [error.message || 'Error al obtener contexto de operación']
      };
    } finally {
      setLoading(false);
    }
  };

  // Crear operación con contexto específico
  const createOperacionWithContext = async (
    operacionData: any,
    tipoContexto: TipoContexto = 'planificada'
  ) => {
    setLoading(true);
    try {
      // Crear operación (el trigger creará el contexto automáticamente)
      const { data: operacion, error: operacionError } = await supabase
        .from('operacion')
        .insert([operacionData])
        .select()
        .single();

      if (operacionError) throw operacionError;

      // Si se requiere un contexto específico diferente al por defecto, actualizarlo
      const defaultTipo: TipoContexto = 'planificada';
      if (tipoContexto !== defaultTipo) {
        // Calcular si es planificada antes del bloque condicional
        const esPlanificada = tipoContexto === 'planificada';
        
        const contextUpdate: Partial<{
          tipo_contexto: TipoContexto;
          requiere_documentos: boolean;
          requiere_hpt: boolean;
          requiere_anexo_bravo: boolean;
        }> = {
          tipo_contexto: tipoContexto,
          requiere_documentos: esPlanificada,
          requiere_hpt: esPlanificada,
          requiere_anexo_bravo: esPlanificada
        };

        const { error: contextError } = await supabase
          .from('operacion_context')
          .update(contextUpdate)
          .eq('operacion_id', operacion.id);

        if (contextError) {
          console.warn('Error updating context:', contextError);
          // No es crítico, continuar
        }
      }

      toast({
        title: "Operación creada",
        description: `Operación ${tipoContexto} creada exitosamente`,
      });

      return operacion;

    } catch (error: any) {
      console.error('Error creating contextual operation:', error);
      toast({
        title: "Error",
        description: `No se pudo crear la operación: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contexto de operación
  const updateOperacionContext = async (
    operacionId: string,
    contextUpdates: Partial<OperacionContext>
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('operacion_context')
        .update(contextUpdates)
        .eq('operacion_id', operacionId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Contexto actualizado",
        description: "El contexto de la operación ha sido actualizado",
      });

      return data;

    } catch (error: any) {
      console.error('Error updating operation context:', error);
      toast({
        title: "Error",
        description: `No se pudo actualizar el contexto: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Validar si se puede crear inmersión según contexto
  const validateInmersionCreation = async (operacionId: string): Promise<ContextualValidationResult> => {
    const result = await getOperacionContext(operacionId);
    
    if (!result.isValid) {
      return result;
    }

    // Validaciones adicionales específicas para inmersiones
    const needsValidation = result.es_legacy || (result.contexto && result.contexto.tipo_contexto === 'planificada');
    
    if (needsValidation) {
      // Para operaciones planificadas o legacy, verificar documentos si son requeridos
      if (result.requiere_hpt) {
        const { data: hptData } = await supabase
          .from('hpt')
          .select('id')
          .eq('operacion_id', operacionId)
          .eq('firmado', true)
          .maybeSingle();

        if (!hptData) {
          result.errors.push('HPT firmado requerido para esta operación');
          result.isValid = false;
        }
      }

      if (result.requiere_anexo_bravo) {
        const { data: anexoData } = await supabase
          .from('anexo_bravo')
          .select('id')
          .eq('operacion_id', operacionId)
          .eq('firmado', true)
          .maybeSingle();

        if (!anexoData) {
          result.errors.push('Anexo Bravo firmado requerido para esta operación');
          result.isValid = false;
        }
      }
    }

    return result;
  };

  return {
    loading,
    getOperacionContext,
    createOperacionWithContext,
    updateOperacionContext,
    validateInmersionCreation,
  };
};
