
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Zap } from "lucide-react";
import { OperacionSelector } from './OperacionSelector';
import { CentroSelector } from './CentroSelector';
import { InmersionBasicFields } from './InmersionBasicFields';

interface InmersionFormSectionProps {
  formValidationState: any;
  setFormValidationState: (state: any) => void;
  formData: any;
  handleFormDataChange: (data: any) => void;
  operaciones: any[];
  centros: any[];
  initialData?: any;
}

export const InmersionFormSection = ({
  formValidationState,
  setFormValidationState,
  formData,
  handleFormDataChange,
  operaciones,
  centros,
  initialData
}: InmersionFormSectionProps) => {
  return (
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

      <CardContent className="space-y-6">
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
      </CardContent>
    </Card>
  );
};
