
import React, { useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { EnhancedCuadrillaSelector } from '@/components/cuadrillas/EnhancedCuadrillaSelector';
import { useInmersionFormLogic } from '@/hooks/inmersiones/useInmersionFormLogic';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useCuadrillaAvailability } from '@/hooks/useCuadrillaAvailability';
import { toast } from '@/hooks/use-toast';
import { EnterpriseFormSection } from './components/EnterpriseFormSection';
import { InmersionFormSection } from './components/InmersionFormSection';
import type { InmersionFormProps } from '@/types/inmersionForms';

export const SalmoneraInmersionForm = ({ onSubmit, onCancel, initialData }: InmersionFormProps) => {
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

  const { data: cuadrillaAvailability } = useCuadrillaAvailability(
    selectedCuadrillaId || undefined,
    formData.fecha_inmersion || undefined,
    initialData?.inmersion_id
  );

  // Generar código solo cuando sea necesario
  const generatedCode = useMemo(() => {
    if (formData.codigo || initialData?.codigo) {
      return formData.codigo || initialData?.codigo;
    }
    return generateInmersionCode('SAL');
  }, [formData.codigo, initialData?.codigo, generateInmersionCode]);

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
    
    if (!selectedEnterprise) {
      toast({
        title: "Error",
        description: "No se pudo determinar la empresa para crear la inmersión",
        variant: "destructive",
      });
      return;
    }

    // Asegurar que hay código
    const finalCode = formData.codigo || generatedCode;
    if (!finalCode) {
      const newCode = generateInmersionCode('SAL');
      handleFormDataChange({ codigo: newCode });
    }

    if (!validateForm()) return;
    if (selectedCuadrillaId && !validateCuadrillaAvailability()) return;

    setLoading(true);

    try {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';

      const enterpriseContext = {
        ...selectedEnterprise,
        context_metadata: {
          selection_mode: 'salmonera_admin',
          empresa_origen_tipo: companyType
        }
      };

      const inmersionData = buildInmersionData(companyId, enterpriseContext);
      
      if (!inmersionData.codigo) {
        inmersionData.codigo = finalCode || generateInmersionCode('SAL');
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
  }, [
    selectedEnterprise, 
    formData, 
    generatedCode,
    selectedCuadrillaId, 
    validateForm, 
    validateCuadrillaAvailability, 
    setLoading, 
    buildInmersionData, 
    onSubmit, 
    generateInmersionCode, 
    handleFormDataChange
  ]);

  const canSubmit = !loading && 
    (cuadrillaAvailability?.is_available !== false || !selectedCuadrillaId) &&
    selectedEnterprise;

  if (!selectedEnterprise) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">
          No se pudo determinar la empresa para crear la inmersión.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Por favor, contacte al administrador del sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EnterpriseFormSection
        effectiveEnterprise={selectedEnterprise}
        formValidationState={formValidationState}
        onEnterpriseChange={() => {}}
        onChangeEnterprise={() => {}}
        showEnterpriseSelector={false}
        isSupeuser={false}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <InmersionFormSection
          formValidationState={formValidationState}
          setFormValidationState={setFormValidationState}
          formData={{ ...formData, codigo: formData.codigo || generatedCode }}
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
          enterpriseContext={selectedEnterprise}
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
    </div>
  );
};
