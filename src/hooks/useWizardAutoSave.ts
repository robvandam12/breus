
import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useWizardAutoSave = (wizardOperacionId?: string) => {
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const queryClient = useQueryClient();

  const performAutoSave = useCallback(async (data: any) => {
    if (!wizardOperacionId || !data || isAutoSaving) return;

    try {
      setIsAutoSaving(true);
      console.log('Starting auto-save for operation:', wizardOperacionId, data);
      
      // Filtrar valores vacíos y especiales
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined && value !== '__empty__') {
          acc[key] = value === '__empty__' ? null : value;
        }
        return acc;
      }, {} as any);

      if (Object.keys(cleanData).length === 0) {
        console.log('No data to save');
        return;
      }

      const { error } = await supabase
        .from('operacion')
        .update(cleanData)
        .eq('id', wizardOperacionId);

      if (error) {
        console.error('Auto-save error:', error);
        throw error;
      }

      setLastSaveTime(new Date());
      console.log('Auto-save successful:', cleanData);
      
      // Actualizar cache
      queryClient.invalidateQueries({ queryKey: ['operacion-wizard', wizardOperacionId] });
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      
    } catch (error) {
      console.error('Error en auto-guardado:', error);
      toast({
        title: "Error de guardado",
        description: "No se pudo guardar automáticamente los cambios",
        variant: "destructive",
      });
    } finally {
      setIsAutoSaving(false);
    }
  }, [wizardOperacionId, isAutoSaving, queryClient]);

  const triggerAutoSave = useCallback((data: any) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      performAutoSave(data);
    }, 2000);

    setAutoSaveTimer(timer);
  }, [performAutoSave, autoSaveTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  return {
    isAutoSaving,
    lastSaveTime,
    triggerAutoSave
  };
};
