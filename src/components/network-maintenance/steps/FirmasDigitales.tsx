
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedDigitalSignature } from "@/components/signatures/EnhancedDigitalSignature";
import { FileSignature } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface FirmasDigitalesProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const FirmasDigitales = ({ formData, updateFormData, readOnly = false }: FirmasDigitalesProps) => {
  const handleSupervisorSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        supervisor_nombre: signatureData.signerName,
        supervisor_firma: signatureData.signature,
        fecha_firma: signatureData.timestamp,
        codigo_verificacion: `SUP-${Date.now().toString().slice(-6)}`
      }
    });
  };

  const handleJefeCentroSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        jefe_centro_nombre: signatureData.signerName,
        jefe_centro_firma: signatureData.signature,
        fecha_firma: formData.firmas?.fecha_firma || signatureData.timestamp,
        codigo_verificacion: formData.firmas?.codigo_verificacion || `JEF-${Date.now().toString().slice(-6)}`
      }
    });
  };

  const handleSupervisorReset = () => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        supervisor_nombre: '',
        supervisor_firma: ''
      }
    });
  };

  const handleJefeCentroReset = () => {
    updateFormData({
      firmas: {
        ...formData.firmas,
        jefe_centro_nombre: '',
        jefe_centro_firma: ''
      }
    });
  };

  const isFormComplete = () => {
    return !!(
      formData.lugar_trabajo &&
      formData.fecha &&
      formData.dotacion.length > 0 &&
      formData.faenas_mantencion.length > 0
    );
  };

  const supervisorSigned = !!(formData.firmas?.supervisor_firma && formData.firmas?.supervisor_nombre);
  const jefeCentroSigned = !!(formData.firmas?.jefe_centro_firma && formData.firmas?.jefe_centro_nombre);

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
            Para completar el formulario de mantención de redes, se requieren las firmas 
            del supervisor de buceo y del jefe de centro.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EnhancedDigitalSignature
          title="Firma del Supervisor de Buceo"
          role="Supervisor de Buceo"
          signerName={formData.firmas?.supervisor_nombre || ''}
          isSigned={supervisorSigned}
          onSign={handleSupervisorSign}
          onReset={handleSupervisorReset}
          iconColor="text-blue-600"
          disabled={readOnly || !isFormComplete()}
        />

        <EnhancedDigitalSignature
          title="Firma del Jefe de Centro"
          role="Jefe de Centro"
          signerName={formData.firmas?.jefe_centro_nombre || ''}
          isSigned={jefeCentroSigned}
          onSign={handleJefeCentroSign}
          onReset={handleJefeCentroReset}
          iconColor="text-green-600"
          disabled={readOnly || !isFormComplete()}
        />
      </div>

      {!isFormComplete() && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <FileSignature className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Formulario Incompleto</p>
              <p className="text-sm text-yellow-700">
                Complete toda la información requerida antes de firmar el formulario.
              </p>
            </div>
          </div>
        </div>
      )}

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
