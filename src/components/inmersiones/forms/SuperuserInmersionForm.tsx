
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { EnhancedCuadrillaSelector } from '@/components/cuadrillas/EnhancedCuadrillaSelector';
import { useInmersionFormLogic } from '@/hooks/inmersiones/useInmersionFormLogic';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useCuadrillaAvailability } from '@/hooks/useCuadrillaAvailability';
import { toast } from '@/hooks/use-toast';
import { EnterpriseFormSection } from './components/EnterpriseFormSection';
import { InmersionFormSection } from './components/InmersionFormSection';
import type { InmersionFormProps } from '@/types/inmersionForms';

export const SuperuserInmersionForm = ({ onSubmit, onCancel, initialData }: InmersionFormProps) => {
  const [externalSelectedEnterprise, setExternalSelectedEnterprise] = useState<any>(null);
  const { generateInmersionCode } = useInmersiones();
  
  const {
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
  } = useInmersionFormLogic(initialData);

  const effectiveEnterprise = profile?.role === 'superuser' ? externalSelectedEnterprise : selectedEnterprise;

  const { data: cuadrillaAvailability } = useCuadrillaAvailability(
    selectedCuadrillaId || undefined,
    formData.fecha_inmersion || undefined,
    initialData?.inmersion_id
  );

  useEffect(() => {
    if (!formData.codigo && !initialData) {
      const newCode = generateInmersionCode('IMM');
      setFormData(prev => ({ ...prev, codigo: newCode }));
    }
  }, [formData.codigo, initialData, generateInmersionCode]);

  const handleEnterpriseChange = useCallback((result: any) => {
    setExternalSelectedEnterprise(result);
    setFormData({
      operacion_id: '',
      external_operation_code: '',
      objetivo: '',
      fecha_inmersion: '',
      profundidad_max: '',
      observaciones: '',
      centro_id: '',
      codigo: generateInmersionCode('IMM')
    });
    setSelectedCuadrillaId(null);
  }, [generateInmersionCode, setFormData, setSelectedCuadrillaId]);

  const handleFormDataChange = useCallback((newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, [setFormData]);

  const validateCuadrillaAvailability = useCallback((): boolean => {
    if (!selectedCuadrillaId || !formData.fecha_inmersion) {
      return true;
    }

    if (cuadrillaAvailability && !cuadrillaAvailability.is_available) {
      toast({
        title: "Cuadrilla no disponible",
        description: `La cuadrilla seleccionada ya tiene asignada la inmersión ${cuadrillaAvailability.conflicting_inmersion_codigo} para esta fecha.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [selectedCuadrillaId, formData.fecha_inmersion, cuadrillaAvailability]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!effectiveEnterprise) {
      toast({
        title: "Error",
        description: "Debe seleccionar una empresa para crear la inmersión",
        variant: "destructive",
      });
      return;
    }

    if (!formData.codigo) {
      const newCode = generateInmersionCode('IMM');
      setFormData(prev => ({ ...prev, codigo: newCode }));
      handleFormDataChange({ codigo: newCode });
    }

    if (!validateForm()) return;
    if (selectedCuadrillaId && !validateCuadrillaAvailability()) return;

    setLoading(true);

    try {
      const companyId = effectiveEnterprise.salmonera_id || effectiveEnterprise.contratista_id;
      const companyType = effectiveEnterprise.salmonera_id ? 'salmonera' : 'contratista';

      const enterpriseContext = {
        ...effectiveEnterprise,
        context_metadata: {
          selection_mode: 'superuser_admin',
          empresa_origen_tipo: companyType
        }
      };

      const inmersionData = buildInmersionData(companyId, enterpriseContext);
      
      if (!inmersionData.codigo) {
        inmersionData.codigo = generateInmersionCode('IMM');
      }
      
      await onSubmit(inmersionData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [effectiveEnterprise, formData, selectedCuadrillaId, validateForm, validateCuadrillaAvailability, setLoading, buildInmersionData, onSubmit, generateInmersionCode, handleFormDataChange]);

  const enterpriseContext = useMemo(() => ({
    ...effectiveEnterprise,
    context_metadata: {
      selection_mode: 'superuser_admin',
      empresa_origen_tipo: effectiveEnterprise?.salmonera_id ? 'salmonera' : 'contratista'
    }
  }), [effectiveEnterprise]);

  const canSubmit = !loading && 
    (cuadrillaAvailability?.is_available !== false || !selectedCuadrillaId) &&
    effectiveEnterprise;

  return (
    <div className="space-y-6">
      <EnterpriseFormSection
        effectiveEnterprise={effectiveEnterprise}
        formValidationState={formValidationState}
        onEnterpriseChange={handleEnterpriseChange}
        onChangeEnterprise={() => setExternalSelectedEnterprise(null)}
        showEnterpriseSelector={!effectiveEnterprise}
        isSupeuser={profile?.role === 'superuser'}
      />

      {effectiveEnterprise && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <InmersionFormSection
            formValidationState={formValidationState}
            setFormValidationState={setFormValidationState}
            formData={formData}
            handleFormDataChange={handleFormDataChange}
            operaciones={operaciones}
            centros={centros}
            initialData={initialData}
          />

          <EnhancedCuadrillaSelector
            selectedCuadrillaId={selectedCuadrillaId}
            onCuadrillaChange={setSelectedCuadrillaId}
            fechaInmersion={formData.fecha_inmersion}
            centroId={formData.centro_id}
            enterpriseContext={enterpriseContext}
          />

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!canSubmit} 
              className="flex-1"
            >
              {loading ? (initialData ? 'Actualizando...' : 'Creando...') : (initialData ? 'Actualizar Inmersión' : 'Crear Inmersión')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
