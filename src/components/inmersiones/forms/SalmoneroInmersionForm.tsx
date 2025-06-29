
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Building, Calendar, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { EnhancedCuadrillaSelector } from '@/components/cuadrillas/EnhancedCuadrillaSelector';
import { useInmersionFormLogic } from '@/hooks/inmersiones/useInmersionFormLogic';
import { OperacionSelector } from './components/OperacionSelector';
import { CentroSelector } from './components/CentroSelector';
import { InmersionBasicFields } from './components/InmersionBasicFields';
import type { InmersionFormProps } from '@/types/inmersionForms';

export const SalmoneroInmersionForm = ({ onSubmit, onCancel, initialData }: InmersionFormProps) => {
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
    loadEnterpriseModules,
    loadOperaciones,
    loadCentros,
    validateForm,
    buildInmersionData,
    profile
  } = useInmersionFormLogic(initialData);

  useEffect(() => {
    if (profile?.salmonera_id) {
      loadEnterpriseModules(profile.salmonera_id, 'salmonera');
      loadCentros(profile.salmonera_id, 'salmonera');
    }
  }, [profile?.salmonera_id]);

  useEffect(() => {
    if (formValidationState.canShowPlanningToggle && formValidationState.isPlanned && profile?.salmonera_id) {
      loadOperaciones(profile.salmonera_id, 'salmonera');
    }
  }, [formValidationState.canShowPlanningToggle, formValidationState.isPlanned, profile?.salmonera_id]);

  useEffect(() => {
    if (formValidationState.isPlanned && formData.operacion_id) {
      const selectedOperacion = operaciones.find(op => op.id === formData.operacion_id);
      if (selectedOperacion?.centro_id) {
        setFormData(prev => ({ ...prev, centro_id: selectedOperacion.centro_id || '' }));
      }
    }
  }, [formValidationState.isPlanned, formData.operacion_id, operaciones]);

  const handleFormDataChange = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const enterpriseContext = {
        salmonera_id: profile?.salmonera_id,
        context_metadata: {
          selection_mode: 'salmonera_admin',
          empresa_origen_tipo: 'salmonera'
        }
      };

      const inmersionData = buildInmersionData(profile?.salmonera_id || '', enterpriseContext);
      await onSubmit(inmersionData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    } finally {
      setLoading(false);
    }
  };

  const enterpriseContext = {
    salmonera_id: profile?.salmonera_id,
    context_metadata: {
      selection_mode: 'salmonera_admin',
      empresa_origen_tipo: 'salmonera'
    }
  };

  return (
    <div className="space-y-6">
      {/* Info contextual */}
      <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Building className="w-4 h-4 text-blue-600" />
        <span>Gestión de Inmersiones</span>
        {formValidationState.canShowPlanningToggle && (
          <Badge variant="outline" className="ml-auto">
            <CheckCircle className="w-3 h-3 mr-1" />
            Planning Activo
          </Badge>
        )}
        {!formValidationState.canShowPlanningToggle && (
          <Badge variant="outline" className="ml-auto text-amber-600 border-amber-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Solo Independientes
          </Badge>
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
              onCuadrillaCreated={(cuadrilla) => setSelectedCuadrillaId(cuadrilla.id)}
              enterpriseContext={enterpriseContext}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
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
