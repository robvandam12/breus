
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignatureCapture } from '@/components/signatures/SignatureCapture';
import { FileText, AlertCircle } from 'lucide-react';
import { HPTWizardData } from '@/hooks/useHPTWizard';

interface HPTWizardStep5Props {
  data: HPTWizardData;
  updateData: (updates: Partial<HPTWizardData>) => void;
}

export const HPTWizardStep5: React.FC<HPTWizardStep5Props> = ({ data, updateData }) => {
  const handleSupervisorSign = (signatureUrl: string) => {
    updateData({
      hpt_firmas: {
        ...data.hpt_firmas,
        supervisor_servicio_url: signatureUrl
      }
    });
  };

  const handleMandanteSign = (signatureUrl: string) => {
    updateData({
      hpt_firmas: {
        ...data.hpt_firmas,
        supervisor_mandante_url: signatureUrl
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Firmas Digitales</h2>
        <p className="mt-2 text-gray-600">
          Autorización final mediante firmas digitales de los responsables
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignatureCapture
          title="Firma del Supervisor de Servicios"
          onSignatureCapture={handleSupervisorSign}
          required={true}
          existingSignature={data.hpt_firmas.supervisor_servicio_url}
        />

        <SignatureCapture
          title="Firma del Supervisor Mandante"
          onSignatureCapture={handleMandanteSign}
          required={true}
          existingSignature={data.hpt_firmas.supervisor_mandante_url}
        />
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-sm text-amber-800">
              <strong>Importante:</strong> Una vez firmada por ambas partes, esta HPT queda oficialmente aprobada para ejecución. 
              Las firmas digitales incluyen timestamp y trazabilidad completa para auditoría.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm text-green-800">
              <strong>Estado:</strong> {
                data.hpt_firmas.supervisor_servicio_url && data.hpt_firmas.supervisor_mandante_url
                  ? 'HPT lista para finalizar - Ambas firmas completadas'
                  : `Pendiente ${!data.hpt_firmas.supervisor_servicio_url ? 'firma supervisor servicios' : ''} ${!data.hpt_firmas.supervisor_mandante_url ? 'firma supervisor mandante' : ''}`
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
