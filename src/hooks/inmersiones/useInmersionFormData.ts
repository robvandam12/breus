
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { InmersionFormData, Operacion, Centro } from '@/types/inmersionForms';

export const useInmersionFormData = (initialData?: any) => {
  const getInitialCuadrillaId = useCallback(() => {
    if (!initialData?.metadata) return null;
    try {
      const metadata = typeof initialData.metadata === 'string' 
        ? JSON.parse(initialData.metadata) 
        : initialData.metadata;
      return metadata?.cuadrilla_id || null;
    } catch {
      return null;
    }
  }, [initialData]);

  const [selectedCuadrillaId, setSelectedCuadrillaId] = useState<string | null>(getInitialCuadrillaId());
  
  const [formData, setFormData] = useState<InmersionFormData>({
    operacion_id: initialData?.operacion_id || '',
    external_operation_code: initialData?.external_operation_code || '',
    objetivo: initialData?.objetivo || '',
    fecha_inmersion: initialData?.fecha_inmersion || '',
    profundidad_max: initialData?.profundidad_max?.toString() || '',
    observaciones: initialData?.observaciones || '',
    centro_id: initialData?.centro_id || '',
    codigo: initialData?.codigo || ''
  });

  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [centros, setCentros] = useState<Centro[]>([]);

  const loadOperaciones = useCallback(async (companyId: string, companyType: 'salmonera' | 'contratista') => {
    try {
      const companyTypeField = companyType === 'salmonera' ? 'salmonera_id' : 'contratista_id';

      const { data } = await supabase
        .from('operacion')
        .select(`
          id, 
          codigo, 
          nombre, 
          fecha_inicio,
          centro_id,
          centros:centro_id(nombre)
        `)
        .eq(companyTypeField, companyId)
        .eq('estado', 'activa')
        .order('fecha_inicio', { ascending: true });

      setOperaciones(data || []);
    } catch (error) {
      console.error('Error loading operaciones:', error);
      setOperaciones([]);
    }
  }, []);

  const loadCentros = useCallback(async (companyId: string, companyType: 'salmonera' | 'contratista') => {
    try {
      if (companyType === 'salmonera') {
        const { data } = await supabase
          .from('centros')
          .select('id, nombre, salmonera_id')
          .eq('salmonera_id', companyId)
          .eq('estado', 'activo')
          .order('nombre');

        setCentros(data || []);
      } else {
        const { data } = await supabase
          .from('centros')
          .select('id, nombre, salmonera_id')
          .eq('estado', 'activo')
          .order('nombre');

        setCentros(data || []);
      }
    } catch (error) {
      console.error('Error loading centros:', error);
      setCentros([]);
    }
  }, []);

  return {
    selectedCuadrillaId,
    setSelectedCuadrillaId,
    formData,
    setFormData,
    operaciones,
    centros,
    loadOperaciones,
    loadCentros
  };
};
