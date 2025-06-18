
import React from 'react';
import { CreateOperacionForm } from './CreateOperacionForm';
import { useOperaciones } from '@/hooks/useOperaciones';
import { toast } from '@/hooks/use-toast';

interface CreateOperacionFormWithCallbackProps {
  onClose: () => void;
  onSuccess: (operacionId: string) => void;
}

export const CreateOperacionFormWithCallback = ({ 
  onClose, 
  onSuccess 
}: CreateOperacionFormWithCallbackProps) => {
  const { createOperacion } = useOperaciones();

  const handleSubmit = async (formData: any) => {
    try {
      const result = await createOperacion(formData);
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
      onSuccess(result.id);
      return result;
    } catch (error) {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <CreateOperacionForm
      onClose={onClose}
      onSubmitOverride={handleSubmit}
    />
  );
};
