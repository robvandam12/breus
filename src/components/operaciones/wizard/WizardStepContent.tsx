
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import { CreateOperacionForm } from '../CreateOperacionForm';
import { OperacionSitioAssignment } from '../OperacionSitioAssignment';
import { EnhancedOperacionEquipoAssignment } from '../EnhancedOperacionEquipoAssignment';
import { ValidationGateway } from '../ValidationGateway';
import { DocumentValidationStatus } from '../DocumentValidationStatus';
import { Button } from '@/components/ui/button';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  required: boolean;
}

interface WizardStepContentProps {
  currentStep: WizardStep | undefined;
  wizardOperacionId: string | undefined;
  operacion: any;
  onStepComplete: (stepId: string, data: any) => Promise<void>;
  onCancel: () => void;
  onFinish: () => void;
}

export const WizardStepContent = ({ 
  currentStep, 
  wizardOperacionId, 
  operacion, 
  onStepComplete, 
  onCancel,
  onFinish 
}: WizardStepContentProps) => {
  const getStepIcon = (step: WizardStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <Circle className="w-5 h-5 text-blue-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.id) {
      case 'operacion':
        return (
          <CreateOperacionForm
            onSubmitOverride={async (data) => {
              await onStepComplete('operacion', { operacionId: data.id });
            }}
            onClose={onCancel}
            hideButtons={true}
          />
        );
      case 'sitio':
        return (
          <OperacionSitioAssignment
            operacionId={wizardOperacionId!}
            currentSitioId={operacion?.sitio_id}
            onComplete={(data) => onStepComplete('sitio', data)}
          />
        );
      case 'equipo':
        return (
          <EnhancedOperacionEquipoAssignment
            operacionId={wizardOperacionId!}
            currentEquipoId={operacion?.equipo_buceo_id}
            currentSupervisorId={operacion?.supervisor_asignado_id}
            onComplete={(equipoId, supervisorId) => 
              onStepComplete('equipo', { 
                equipo_buceo_id: equipoId, 
                supervisor_asignado_id: supervisorId 
              })
            }
          />
        );
      case 'hpt':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Crear Documento HPT
              </h3>
              <p className="text-blue-700 mb-4">
                Abra el HPT en una nueva pestaña para completar el documento.
              </p>
              <Button
                onClick={() => window.open(`/hpt?operacion=${wizardOperacionId}`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Abrir HPT
              </Button>
            </div>
            <DocumentValidationStatus 
              operacionId={wizardOperacionId!}
              onDocumentCreate={(type) => {
                if (type === 'hpt') {
                  window.open(`/hpt?operacion=${wizardOperacionId}`, '_blank');
                }
              }}
            />
          </div>
        );
      case 'anexo-bravo':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Crear Anexo Bravo
              </h3>
              <p className="text-green-700 mb-4">
                Abra el Anexo Bravo en una nueva pestaña para completar el documento.
              </p>
              <Button
                onClick={() => window.open(`/anexo-bravo?operacion=${wizardOperacionId}`, '_blank')}
                className="bg-green-600 hover:bg-green-700"
              >
                Abrir Anexo Bravo
              </Button>
            </div>
            <DocumentValidationStatus 
              operacionId={wizardOperacionId!}
              onDocumentCreate={(type) => {
                if (type === 'anexo') {
                  window.open(`/anexo-bravo?operacion=${wizardOperacionId}`, '_blank');
                }
              }}
            />
          </div>
        );
      case 'validation':
        return (
          <ValidationGateway
            operacionId={wizardOperacionId!}
            onValidationComplete={onFinish}
          />
        );
      default:
        return <div>Paso no implementado</div>;
    }
  };

  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {currentStep && getStepIcon(currentStep)}
          {currentStep?.title}
        </CardTitle>
        <p className="text-sm text-gray-600">{currentStep?.description}</p>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};
