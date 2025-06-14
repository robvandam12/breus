import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DigitalSignature } from '@/components/anexo-bravo/DigitalSignature';
import { PenTool, CheckCircle } from 'lucide-react';

interface BitacoraSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: string) => void;
  title: string;
  userName: string;
  role: string;
}

export const BitacoraSignatureModal = ({
  isOpen,
  onClose,
  onSign,
  title,
  userName,
  role
}: BitacoraSignatureModalProps) => {
  const [signatureCompleted, setSignatureCompleted] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');

  const handleSignature = (signature: string) => {
    setSignatureData(signature);
    setSignatureCompleted(true);
  };

  const handleConfirmSignature = () => {
    if (signatureData) {
      onSign(signatureData);
      onClose();
      setSignatureCompleted(false);
      setSignatureData('');
    }
  };

  const handleCancel = () => {
    onClose();
    setSignatureCompleted(false);
    setSignatureData('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-medium text-zinc-900">{userName}</p>
            <p className="text-sm text-zinc-500">{role}</p>
          </div>

          <DigitalSignature
            title="Firmar Bitácora"
            role={role}
            signerName={userName}
            isSigned={signatureCompleted}
            onSign={handleSignature}
            onReset={() => {
              setSignatureCompleted(false);
              setSignatureData('');
            }}
            iconColor="text-blue-600"
          />

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmSignature}
              disabled={!signatureCompleted}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmar Firma
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
