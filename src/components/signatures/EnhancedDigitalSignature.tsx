
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignatureCapture } from './SignatureCapture';
import { CheckCircle, FileText } from 'lucide-react';

interface EnhancedDigitalSignatureProps {
  title: string;
  role: string;
  signerName?: string;
  isSigned: boolean;
  onSign: (signatureData: { signature: string; signerName: string; timestamp: string }) => void;
  onReset: () => void;
  iconColor?: string;
  requireSignerName?: boolean;
}

export const EnhancedDigitalSignature: React.FC<EnhancedDigitalSignatureProps> = ({
  title,
  role,
  signerName = '',
  isSigned,
  onSign,
  onReset,
  iconColor = 'text-blue-600',
  requireSignerName = true
}) => {
  const [currentSignerName, setCurrentSignerName] = useState(signerName);
  const [showSignature, setShowSignature] = useState(false);

  const handleSignatureCapture = (signatureUrl: string) => {
    if (requireSignerName && !currentSignerName.trim()) {
      alert('Por favor ingrese el nombre del firmante');
      return;
    }

    const signatureData = {
      signature: signatureUrl,
      signerName: currentSignerName,
      timestamp: new Date().toISOString()
    };

    onSign(signatureData);
    setShowSignature(false);
  };

  if (isSigned) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            {title} - Firmado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              <strong>Firmante:</strong> {signerName}
            </p>
            <p className="text-sm text-green-700">
              <strong>Cargo:</strong> {role}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="mt-2"
            >
              Firmar Nuevamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className={`w-5 h-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showSignature ? (
          <div className="space-y-4">
            {requireSignerName && (
              <div>
                <Label htmlFor="signer-name">Nombre del Firmante</Label>
                <Input
                  id="signer-name"
                  value={currentSignerName}
                  onChange={(e) => setCurrentSignerName(e.target.value)}
                  placeholder={`Ingrese nombre del ${role.toLowerCase()}`}
                />
              </div>
            )}
            
            <p className="text-sm text-gray-600">
              <strong>Cargo:</strong> {role}
            </p>
            
            <Button
              onClick={() => setShowSignature(true)}
              disabled={requireSignerName && !currentSignerName.trim()}
              className="w-full"
            >
              Proceder a Firmar
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Firmante:</strong> {currentSignerName}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Cargo:</strong> {role}
              </p>
            </div>
            
            <SignatureCapture
              title="Dibuje su firma"
              onSignatureCapture={handleSignatureCapture}
              required={true}
            />
            
            <Button
              variant="outline"
              onClick={() => setShowSignature(false)}
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
