
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Building, Calendar, Zap, CheckCircle, AlertTriangle } from "lucide-react";
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

export const SuperuserInmersionForm = ({ onSubmit, onCancel, initialData }: InmersionFormProps) => {
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null);
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
    loadEnterpriseModules,
    loadOperaciones,
    loadCentros,
    validateForm,
    buildInmersionData
  } = useInmersionFormLogic(initialData, selectedEnterprise);

  // Verificar disponibilidad de cuadrilla
  const { data: cuadrillaAvailability } = useCuadrillaAvailability(
    selectedCuadrillaId || undefined,
    formData.fecha_inmersion || undefined,
    initialData?.inmersion_id
  );

  useEffect(() => {
    if (selectedEnterprise) {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      
      loadEnterpriseModules(companyId, companyType);
      loadCentros(companyId, companyType);
    }
  }, [selectedEnterprise]);

  useEffect(() => {
    if (formValidationState.canShowPlanningToggle && formValidationState.isPlanned && selectedEnterprise) {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      loadOperaciones(companyId, companyType);
    }
  }, [formValidationState.canShowPlanningToggle, formValidationState.isPlanned, selectedEnterprise]);

  useEffect(() => {
    if (formValidationState.isPlanned && formData.operacion_id) {
      const selectedOperacion = operaciones.find(op => op.id === formData.operacion_id);
      if (selectedOperacion?.centro_id) {
        setFormData(prev => ({ ...prev, centro_id: selectedOperacion.centro_id || '' }));
      }
    }
  }, [formValidationState.isPlanned, formData.operacion_id, operaciones]);

  // Generar código automáticamente si no hay uno
  useEffect(() => {
    if (!formData.codigo && !initialData) {
      const newCode = generateInmersionCode('IMM');
      setFormData(prev => ({ ...prev, codigo: newCode }));
    }
  }, [formData.codigo, initialData, generateInmersionCode]);

  const handleEnterpriseChange = (result: any) => {
    setSelectedEnterprise(result);
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
  };

  const handleFormDataChange = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const validateCuadrillaAvailability = (): boolean => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEnterprise) {
      return;
    }

    if (!formData.codigo) {
      const newCode = generateInmersionCode('IMM');
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
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';

      const enterpriseContext = {
        ...selectedEnterprise,
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
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !loading && 
    (cuadrillaAvailability?.is_available !== false || !selectedCuadrillaId);

  if (!selectedEnterprise) {
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

  return (
    <div className="space-y-6">
      {/* Info contextual con opción de cambiar empresa */}
      <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          <span>
            Empresa: {selectedEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'}
          </span>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedEnterprise(null)}
          className="text-blue-600 hover:text-blue-800 h-auto p-1"
        >
          Cambiar
        </Button>
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

            {/* Selector de Cuadrilla - Corregido sin prop onCuadrillaCreated */}
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
        </CardContent>
      </Card>
    </div>
  );
};
