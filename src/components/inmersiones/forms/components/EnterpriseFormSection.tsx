
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { EnterpriseSelector } from '@/components/common/EnterpriseSelector';

interface EnterpriseFormSectionProps {
  effectiveEnterprise: any;
  formValidationState: any;
  onEnterpriseChange: (result: any) => void;
  onChangeEnterprise: () => void;
  showEnterpriseSelector?: boolean;
  isSupeuser?: boolean;
}

export const EnterpriseFormSection = ({
  effectiveEnterprise,
  formValidationState,
  onEnterpriseChange,
  onChangeEnterprise,
  showEnterpriseSelector = false,
  isSupeuser = false
}: EnterpriseFormSectionProps) => {
  if (showEnterpriseSelector) {
    return (
      <div className="space-y-4">
        <EnterpriseSelector
          onSelectionChange={onEnterpriseChange}
          showCard={false}
          title="Seleccionar Empresa para Inmersión"
          description="Seleccione la empresa que gestionará esta inmersión"
          autoSubmit={true}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          {effectiveEnterprise?.salmonera_id ? 'Salmonera' : 'Contratista'}
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
      {isSupeuser && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onChangeEnterprise}
          className="text-blue-600 hover:text-blue-800 h-auto p-1"
        >
          Cambiar
        </Button>
      )}
    </div>
  );
};
