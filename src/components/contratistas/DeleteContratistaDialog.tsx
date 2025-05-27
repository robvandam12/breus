
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteContratistaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  contratistaNombre: string;
  isDeleting?: boolean;
}

export const DeleteContratistaDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  contratistaNombre,
  isDeleting = false 
}: DeleteContratistaDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error deleting contratista:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            Eliminar Contratista
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el contratista y 
              toda la información asociada.
            </AlertDescription>
          </Alert>
          
          <p className="text-zinc-700">
            ¿Está seguro de que desea eliminar el contratista <strong>"{contratistaNombre}"</strong>?
          </p>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isProcessing || isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isProcessing || isDeleting}
          >
            {isProcessing || isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
