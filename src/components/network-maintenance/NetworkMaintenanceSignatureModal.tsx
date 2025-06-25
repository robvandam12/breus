
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnhancedDigitalSignature } from "@/components/signatures/EnhancedDigitalSignature";
import { FileSignature, CheckCircle2, AlertCircle } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface NetworkMaintenanceSignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any; // Datos del formulario desde la base de datos
  onSignaturesComplete: (signatures: any) => Promise<void>;
  loading?: boolean;
}

export const NetworkMaintenanceSignatureModal = ({
  open,
  onOpenChange,
  formData,
  onSignaturesComplete,
  loading = false
}: NetworkMaintenanceSignatureModalProps) => {
  const [localSignatures, setLocalSignatures] = useState({
    supervisor_nombre: formData?.multix_data?.firmas?.supervisor_nombre || '',
    supervisor_firma: formData?.multix_data?.firmas?.supervisor_firma || '',
    jefe_centro_nombre: formData?.multix_data?.firmas?.jefe_centro_nombre || '',
    jefe_centro_firma: formData?.multix_data?.firmas?.jefe_centro_firma || '',
    fecha_firma: formData?.multix_data?.firmas?.fecha_firma || '',
    codigo_verificacion: formData?.multix_data?.firmas?.codigo_verificacion || ''
  });

  const handleSupervisorSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    setLocalSignatures(prev => ({
      ...prev,
      supervisor_nombre: signatureData.signerName,
      supervisor_firma: signatureData.signature,
      fecha_firma: signatureData.timestamp,
      codigo_verificacion: `SUP-${Date.now().toString().slice(-6)}`
    }));
  };

  const handleJefeCentroSign = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    setLocalSignatures(prev => ({
      ...prev,
      jefe_centro_nombre: signatureData.signerName,
      jefe_centro_firma: signatureData.signature,
      fecha_firma: prev.fecha_firma || signatureData.timestamp
    }));
  };

  const handleSupervisorReset = () => {
    setLocalSignatures(prev => ({
      ...prev,
      supervisor_nombre: '',
      supervisor_firma: ''
    }));
  };

  const handleJefeCentroReset = () => {
    setLocalSignatures(prev => ({
      ...prev,
      jefe_centro_nombre: '',
      jefe_centro_firma: ''
    }));
  };

  const handleSaveSignatures = async () => {
    await onSignaturesComplete(localSignatures);
    onOpenChange(false);
  };

  const isFormComplete = () => {
    const multixData = formData?.multix_data;
    return !!(
      multixData?.lugar_trabajo &&
      multixData?.fecha &&
      (multixData?.dotacion?.length > 0 || multixData?.faenas_mantencion?.length > 0)
    );
  };

  const supervisorSigned = !!(localSignatures.supervisor_firma && localSignatures.supervisor_nombre);
  const jefeCentroSigned = !!(localSignatures.jefe_centro_firma && localSignatures.jefe_centro_nombre);
  const allSigned = supervisorSigned && jefeCentroSigned;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Firmar Formulario de Mantención - {formData?.codigo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado del formulario */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
            {isFormComplete() ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            )}
            <div>
              <p className="font-medium text-blue-900">
                {isFormComplete() ? 'Formulario completo' : 'Formulario incompleto'}
              </p>
              <p className="text-sm text-blue-700">
                {isFormComplete() 
                  ? 'El formulario está listo para ser firmado'
                  : 'Complete el formulario antes de firmar'
                }
              </p>
            </div>
          </div>

          {/* Información del formulario */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="font-medium">Lugar de trabajo:</span>
              <p>{formData?.lugar_trabajo || 'No especificado'}</p>
            </div>
            <div>
              <span className="font-medium">Fecha:</span>
              <p>{formData?.fecha || 'No especificada'}</p>
            </div>
          </div>

          {/* Firmas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EnhancedDigitalSignature
              title="Firma del Supervisor de Buceo"
              role="Supervisor de Buceo"
              signerName={localSignatures.supervisor_nombre}
              isSigned={supervisorSigned}
              onSign={handleSupervisorSign}
              onReset={handleSupervisorReset}
              iconColor="text-blue-600"
              disabled={!isFormComplete() || loading}
            />

            <EnhancedDigitalSignature
              title="Firma del Jefe de Centro"
              role="Jefe de Centro"
              signerName={localSignatures.jefe_centro_nombre}
              isSigned={jefeCentroSigned}
              onSign={handleJefeCentroSign}
              onReset={handleJefeCentroReset}
              iconColor="text-green-600"
              disabled={!isFormComplete() || loading}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveSignatures}
              disabled={!allSigned || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Guardando...' : 'Guardar Firmas'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
