
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedDigitalSignature } from "@/components/signatures/EnhancedDigitalSignature";
import { FileSignature } from "lucide-react";
import type { NetworkInstallationData } from '@/types/fishing-networks';

interface NetworkInstallationStep7Props {
  formData: NetworkInstallationData;
  updateFormData: (updates: Partial<NetworkInstallationData>) => void;
  readOnly?: boolean;
}

export const NetworkInstallationStep7 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkInstallationStep7Props) => {
  const handleSupervisorSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        supervisor_buceo: {
          nombre: signatureData.signerName,
          firma: signatureData.signature,
        }
      }
    });
  };

  const handleJefeCentroSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        jefe_centro: {
          nombre: signatureData.signerName,
          firma: signatureData.signature,
        }
      }
    });
  };

  const handleSupervisorReset = () => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        supervisor_buceo: { nombre: '', firma: '' }
      }
    });
  };

  const handleJefeCentroReset = () => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        jefe_centro: { nombre: '', firma: '' }
      }
    });
  };

  const supervisorSigned = !!(formData.firmas.supervisor_buceo.firma && formData.firmas.supervisor_buceo.nombre);
  const jefeCentroSigned = !!(formData.firmas.jefe_centro.firma && formData.firmas.jefe_centro.nombre);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Firmas Digitales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">
            Para completar el formulario de instalación/cambio de redes, se requieren las firmas 
            del supervisor de buceo y del jefe de centro.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EnhancedDigitalSignature
          title="Firma del Supervisor de Buceo"
          role="Supervisor de Buceo"
          signerName={formData.firmas.supervisor_buceo.nombre}
          isSigned={supervisorSigned}
          onSign={handleSupervisorSign}
          onReset={handleSupervisorReset}
          iconColor="text-blue-600"
          disabled={readOnly}
        />

        <EnhancedDigitalSignature
          title="Firma del Jefe de Centro"
          role="Jefe de Centro"
          signerName={formData.firmas.jefe_centro.nombre}
          isSigned={jefeCentroSigned}
          onSign={handleJefeCentroSign}
          onReset={handleJefeCentroReset}
          iconColor="text-green-600"
          disabled={readOnly}
        />
      </div>

      {(supervisorSigned && jefeCentroSigned) && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ <strong>Formulario completo:</strong> Todas las firmas requeridas han sido completadas. 
            El formulario está listo para ser finalizado.
          </p>
        </div>
      )}
    </div>
  );
};

