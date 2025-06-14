import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DigitalSignature } from '@/components/anexo-bravo/DigitalSignature';
import { CheckCircle, PenTool, User } from 'lucide-react';

interface BitacoraSignatureFormProps {
  bitacoraId: string;
  userRole: 'supervisor' | 'buzo';
  userName: string;
  isReadOnly?: boolean;
  signatures?: {
    supervisor_firmado?: boolean;
    buzo_firmado?: boolean;
    supervisor_firma?: string;
    buzo_firma?: string;
  };
  onSignatureComplete?: (signatureData: string, role: string) => void;
}

export const BitacoraSignatureForm = ({
  bitacoraId,
  userRole,
  userName,
  isReadOnly = false,
  signatures = {},
  onSignatureComplete
}: BitacoraSignatureFormProps) => {
  const [isSupervisorSigned, setIsSupervisorSigned] = useState(signatures.supervisor_firmado || false);
  const [isBuzoSigned, setIsBuzoSigned] = useState(signatures.buzo_firmado || false);

  const handleSignature = (signatureData: string, role: string) => {
    if (role === 'supervisor') {
      setIsSupervisorSigned(true);
    } else if (role === 'buzo') {
      setIsBuzoSigned(true);
    }
    
    onSignatureComplete?.(signatureData, role);
  };

  const resetSignature = (role: string) => {
    if (role === 'supervisor') {
      setIsSupervisorSigned(false);
    } else if (role === 'buzo') {
      setIsBuzoSigned(false);
    }
  };

  const canSignSupervisor = userRole === 'supervisor' && !isSupervisorSigned && !isReadOnly;
  const canSignBuzo = userRole === 'buzo' && !isBuzoSigned && !isReadOnly;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-600" />
            Firmas Digitales
            <Badge variant="outline" className="ml-auto">
              {(isSupervisorSigned ? 1 : 0) + (isBuzoSigned ? 1 : 0)} de 2 firmadas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Firma del Supervisor */}
          <div className="space-y-3">
            <h4 className="font-medium text-zinc-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Firma del Supervisor
            </h4>
            <DigitalSignature
              title="Supervisor de Buceo"
              role="Supervisor"
              signerName={userRole === 'supervisor' ? userName : 'Pendiente'}
              isSigned={isSupervisorSigned}
              onSign={(signatureData) => handleSignature(signatureData, 'supervisor')}
              onReset={() => resetSignature('supervisor')}
              disabled={!canSignSupervisor}
              iconColor="text-blue-600"
            />
          </div>

          {/* Firma del Buzo */}
          <div className="space-y-3">
            <h4 className="font-medium text-zinc-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Firma del Buzo
            </h4>
            <DigitalSignature
              title="Buzo Principal"
              role="Buzo"
              signerName={userRole === 'buzo' ? userName : 'Pendiente'}
              isSigned={isBuzoSigned}
              onSign={(signatureData) => handleSignature(signatureData, 'buzo')}
              onReset={() => resetSignature('buzo')}
              disabled={!canSignBuzo}
              iconColor="text-green-600"
            />
          </div>

          {/* Estado de completitud */}
          {isSupervisorSigned && isBuzoSigned && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Bitácora completamente firmada</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Todas las firmas requeridas han sido completadas
                </p>
              </CardContent>
            </Card>
          )}

          {/* Instrucciones para el usuario */}
          {!isReadOnly && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <p className="text-sm text-blue-800">
                  <strong>Instrucciones:</strong> 
                  {userRole === 'supervisor' && !isSupervisorSigned && ' Use su dedo o mouse para firmar como supervisor y validar la bitácora.'}
                  {userRole === 'buzo' && !isBuzoSigned && ' Use su dedo o mouse para firmar como buzo y confirmar la inmersión.'}
                  {((userRole === 'supervisor' && isSupervisorSigned) || (userRole === 'buzo' && isBuzoSigned)) && 
                   ' Su firma ha sido registrada. Esperando la firma del otro participante.'}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
