
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InmersionWizardProps {
  operationId?: string;
  onComplete?: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  initialData?: any;
  readOnly?: boolean;
  showOperationSelector?: boolean;
}

export const InmersionWizard: React.FC<InmersionWizardProps> = ({ 
  operationId,
  onComplete,
  onCancel,
  initialData,
  readOnly = false,
  showOperationSelector = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wizard de Inmersión</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Wizard para crear inmersión {operationId ? `para operación ${operationId}` : ''}</p>
        {readOnly && <p className="text-sm text-gray-500 mt-2">Modo solo lectura</p>}
        {showOperationSelector && <p className="text-sm text-blue-500 mt-2">Selector de operación disponible</p>}
        {initialData && <p className="text-sm text-green-500 mt-2">Datos iniciales cargados</p>}
      </CardContent>
    </Card>
  );
};
