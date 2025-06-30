
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Building, Calendar, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from 'date-fns';
import { EnterpriseSelector } from '@/components/common/EnterpriseSelector';
import { EnhancedCuadrillaSelector } from '@/components/cuadrillas/EnhancedCuadrillaSelector';
import { useInmersionFormLogic } from '@/hooks/inmersiones/useInmersionFormLogic';
import { OperacionSelector } from './components/OperacionSelector';
import { CentroSelector } from './components/CentroSelector';
import { InmersionBasicFields } from './components/InmersionBasicFields';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useCuadrillaAvailability } from '@/hooks/useCuadrillaAvailability';
import { toast } from '@/hooks/use-toast';
import type { InmersionFormProps } from '@/types/inmersionForms';

export const UnifiedInmersionForm = ({ onSubmit, onCancel, initialData }: InmersionFormProps) => {
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

  // Para superuser, usar la empresa seleccionada externamente
  const effectiveEnterprise = profile?.role === 'superuser' ? externalSelectedEnterprise : selectedEnterprise;

  // Verificar disponibilidad de cuadrilla con debounce
  const { data: cuadrillaAvailability } = useCuadrillaAvailability(
    selectedCuadrillaId || undefined,
    formData.fecha_inmersion || undefined,
    initialData?.inmersion_id
  );

  // Generar código automáticamente si no hay uno
  useEffect(() => {
    if (!formData.codigo && !initialData) {
      const newCode = generateInmersionCode(profile?.role === 'superuser' ? 'IMM' : 'SAL');
      setFormData(prev => ({ ...prev, codigo: newCode }));
    }
  }, [formData.codigo, initialData, generateInmersionCode, profile?.role]);

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
      const newCode = generateInmersionCode(profile?.role === 'superuser' ? 'IMM' : 'SAL');
      setFormData(prev => ({ ...prev, codigo: newCode }));
      handleFormDataChange({ codigo: newCode });
    }

    if (!validateForm()) {
      return;
    }

    if (selectedCuadrillaId && !validateCuadrillaAvailability()) {
      return;
    }

    setLoading(true);
    
    try {
      const companyId = effectiveEnterprise.salmonera_id || effectiveEnterprise.contratista_id;
      const companyType = effectiveEnterprise.salmonera_id ? 'salmonera' : 'contratista';

      const enterpriseContext = {
        ...effectiveEnterprise,
        context_metadata: {
          selection_mode: profile?.role === 'superuser' ? 'superuser_admin' : `${companyType}_admin`,
          empresa_origen_tipo: companyType
        }
      };

      const inmersionData = buildInmersionData(companyId, enterpriseContext);
      
      if (!inmersionData.codigo) {
        inmersionData.codigo = generateInmersionCode(profile?.role === 'superuser' ? 'IMM' : 'SAL');
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
  }, [effectiveEnterprise, formData, selectedCuadrillaId, profile, validateForm, validateCuadrillaAvailability, setLoading, buildInmersionData, onSubmit, generateInmersionCode, handleFormDataChange]);

  // Memoizar el contexto empresarial para evitar re-renders
  const enterpriseContext = useMemo(() => ({
    ...effectiveEnterprise,
    context_metadata: {
      selection_mode: profile?.role === 'superuser' ? 'superuser_admin' : 'empresa_admin',
      empresa_origen_tipo: effectiveEnterprise?.salmonera_id ? 'salmonera' : 'contratista'
    }
  }), [effectiveEnterprise, profile?.role]);

  const canSubmit = !loading && 
    (cuadrillaAvailability?.is_available !== false || !selectedCuadrillaId) &&
    effectiveEnterprise;

  // Para superuser, mostrar selector de empresa si no hay una seleccionada
  if (profile?.role === 'superuser' && !effectiveEnterprise) {
    return (
      <div className="space-y-4">
        <EnterpriseSelector
          onSelectionChange={handleEnterpriseChange}
          showCard={false}
          title="Seleccionar Empresa para Inmersión"
          description="Seleccione la empresa que gestionará esta inmersión"
          autoSubmit={true}
        />
      </div>
    );
  }

  // Si no hay empresa disponible, mostrar error
  if (!effectiveEnterprise) {
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
      {/* Info contextual */}
      <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {effectiveEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'}
          </Badge>
          <span>Formulario de Inmersión</span>
          {formValidationState.canShowPlanningToggle && (
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Planning Activo
            </Badge>
          )}
          {!formValidationState.canShowPlanningToggle && (
            <Badge variant="outline" className="text-amber-600 border-amber-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Solo Independientes
            </Badge>
          )}
        </div>
        {profile?.role === 'superuser' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExternalSelectedEnterprise(null)}
            className="text-blue-600 hover:text-blue-800 h-auto p-1"
          >
            Cambiar
          </Button>
        )}
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? 'Editar Inmersión' : 'Nueva Inmersión'}</span>
            {formValidationState.canShowPlanningToggle && !initialData && (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <Switch
                  checked={formValidationState.isPlanned}
                  onCheckedChange={(checked) => 
                    setFormValidationState(prev => ({ ...prev, isPlanned: checked }))
                  }
                  id="inmersion-type"
                />
                <Calendar className="w-4 h-4" />
              </div>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={!formValidationState.isPlanned ? "default" : "secondary"}>
              {!formValidationState.isPlanned ? "Independiente" : "Planificada"}
            </Badge>
            {formValidationState.isPlanned && (
              <Badge variant="outline">
                Asociada a Operación
              </Badge>
            )}
            {formData.codigo && (
              <Badge variant="outline" className="text-blue-600">
                {formData.codigo}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <OperacionSelector
              operaciones={operaciones}
              value={formData.operacion_id}
              onValueChange={(value) => handleFormDataChange({ operacion_id: value })}
              canShowPlanning={formValidationState.canShowPlanningToggle}
              isPlanned={formValidationState.isPlanned}
            />

            <InmersionBasicFields
              formData={formData}
              onFormDataChange={handleFormDataChange}
              showExternalCode={!formValidationState.canShowPlanningToggle || !formValidationState.isPlanned}
            />

            <CentroSelector
              centros={centros}
              value={formData.centro_id}
              onValueChange={(value) => handleFormDataChange({ centro_id: value })}
              isPlanned={formValidationState.isPlanned}
              operacionId={formData.operacion_id}
              operaciones={operaciones}
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
        </CardContent>
      </Card>
    </div>
  );
};
