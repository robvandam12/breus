
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEnterpriseModuleAccess } from '@/hooks/useEnterpriseModuleAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { InmersionFormData, Operacion, Centro, FormValidationState } from '@/types/inmersionForms';

export const useInmersionFormLogic = (initialData?: any) => {
  const { profile } = useAuth();
  const { getModulesForCompany } = useEnterpriseModuleAccess();
  
  // Auto-detectar el contexto empresarial según el rol del usuario
  const selectedEnterprise = useMemo(() => {
    if (!profile) return null;
    
    if (profile.role === 'superuser') {
      return null; // Superuser necesita seleccionar empresa manualmente
    }
    
    if (profile.salmonera_id) {
      return {
        salmonera_id: profile.salmonera_id,
        context_metadata: {
          selection_mode: 'salmonera_admin',
          empresa_origen_tipo: 'salmonera'
        }
      };
    }
    
    if (profile.servicio_id) {
      return {
        contratista_id: profile.servicio_id,
        context_metadata: {
          selection_mode: 'contratista_admin',
          empresa_origen_tipo: 'contratista'
        }
      };
    }
    
    return null;
  }, [profile]);
  
  const [formValidationState, setFormValidationState] = useState<FormValidationState>({
    hasPlanning: false,
    canShowPlanningToggle: false,
    isPlanned: false,
    enterpriseModules: null
  });
  
  const [loading, setLoading] = useState(false);
  
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

  const loadEnterpriseModules = useCallback(async (companyId: string, companyType: 'salmonera' | 'contratista') => {
    try {
      const modules = await getModulesForCompany(companyId, companyType);
      const hasPlanning = Boolean(modules?.hasPlanning === true || String(modules?.hasPlanning) === 'true');
      
      setFormValidationState({
        hasPlanning,
        canShowPlanningToggle: hasPlanning,
        isPlanned: hasPlanning && Boolean(initialData?.operacion_id),
        enterpriseModules: modules
      });
    } catch (error) {
      console.error('Error loading enterprise modules:', error);
      setFormValidationState({
        hasPlanning: false,
        canShowPlanningToggle: false,
        isPlanned: false,
        enterpriseModules: null
      });
    }
  }, [getModulesForCompany, initialData]);

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

  const validateForm = useCallback((): boolean => {
    if (formValidationState.isPlanned && !formData.operacion_id) {
      toast({
        title: "Error", 
        description: "Debe seleccionar una operación para inmersiones planificadas",
        variant: "destructive",
      });
      return false;
    }

    if (!formValidationState.isPlanned && !formData.external_operation_code) {
      toast({
        title: "Error",
        description: "Debe ingresar un código de operación externa para inmersiones independientes", 
        variant: "destructive",
      });
      return false;
    }

    if (!formData.centro_id) {
      toast({
        title: "Error",
        description: "Debe seleccionar un centro para la inmersión",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.objetivo.trim()) {
      toast({
        title: "Error",
        description: "Debe especificar el objetivo de la inmersión",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.fecha_inmersion) {
      toast({
        title: "Error",
        description: "Debe seleccionar la fecha de inmersión",
        variant: "destructive",
      });
      return false;
    }

    if (!formValidationState.isPlanned && (!formData.profundidad_max || parseFloat(formData.profundidad_max) <= 0)) {
      toast({
        title: "Error",
        description: "Debe especificar una profundidad máxima válida para inmersiones independientes",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [formValidationState, formData]);

  const buildInmersionData = useCallback((companyId: string, enterpriseContext: any) => {
    const currentMetadata = initialData?.metadata ? 
      (typeof initialData.metadata === 'string' ? JSON.parse(initialData.metadata) : initialData.metadata) : 
      {};

    const baseData = {
      ...formData,
      profundidad_max: formData.profundidad_max ? parseFloat(formData.profundidad_max) : (formValidationState.isPlanned ? null : 0),
      is_independent: !formValidationState.isPlanned,
      estado: initialData?.estado || 'planificada',
      company_id: companyId,
      requiere_validacion_previa: formValidationState.isPlanned,
      anexo_bravo_validado: Boolean(!formValidationState.isPlanned),
      hpt_validado: Boolean(!formValidationState.isPlanned),
      centro_id: formData.centro_id,
      codigo: formData.codigo,
      contexto_operativo: formValidationState.isPlanned ? 'planificada' : 'independiente',
      temperatura_agua: null,
      visibilidad: null,
      corriente: null,
      buzo_principal: null,
      supervisor: null,
      hora_inicio: null,
      metadata: {
        ...currentMetadata,
        cuadrilla_id: selectedCuadrillaId,
        enterprise_context: enterpriseContext
      }
    };

    if (formValidationState.isPlanned && formData.operacion_id) {
      return {
        ...baseData,
        operacion_id: formData.operacion_id,
        external_operation_code: null
      };
    }

    return {
      ...baseData,
      external_operation_code: formData.external_operation_code
    };
  }, [formData, formValidationState, selectedCuadrillaId, initialData]);

  // Auto-cargar datos cuando el contexto empresarial esté disponible
  useEffect(() => {
    if (selectedEnterprise) {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      
      loadEnterpriseModules(companyId, companyType);
      loadCentros(companyId, companyType);
    }
  }, [selectedEnterprise, loadEnterpriseModules, loadCentros]);

  // Cargar operaciones cuando sea necesario
  useEffect(() => {
    if (formValidationState.canShowPlanningToggle && formValidationState.isPlanned && selectedEnterprise) {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      loadOperaciones(companyId, companyType);
    }
  }, [formValidationState.canShowPlanningToggle, formValidationState.isPlanned, selectedEnterprise, loadOperaciones]);

  return {
    formValidationState,
    setFormValidationState,
    loading,
    setLoading,
    selectedCuadrillaId,
    setSelectedCuadrillaId,
    formData,
    setFormData,
    operaciones,
    centros,
    selectedEnterprise,
    validateForm,
    buildInmersionData,
    profile
  };
};
