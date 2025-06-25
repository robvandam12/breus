
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InmersionWizardProps {
  operationId?: string;
}

export const InmersionWizard: React.FC<InmersionWizardProps> = ({ operationId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wizard de Inmersión</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Wizard para crear inmersión {operationId ? `para operación ${operationId}` : ''}</p>
      </CardContent>
    </Card>
  );
};
