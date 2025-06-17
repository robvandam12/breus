
import React from 'react';
import { CreateOperacionForm } from '@/components/operaciones/CreateOperacionForm';
import { useOperaciones } from '@/hooks/useOperaciones';
import { toast } from '@/hooks/use-toast';

interface CreateOperacionFormWithCallbackProps {
  onClose: () => void;
  onSuccess: (operacionId: string) => void;
}

export const CreateOperacionFormWithCallback = ({ onClose, onSuccess }: CreateOperacionFormWithCallbackProps) => {
  const { createOperacion } = useOperaciones();

  const handleSubmit = async (data: any) => {
    try {
      const newOperacion = await createOperacion(data);
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
      onSuccess(newOperacion.id);
    } catch (error) {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación.",
        variant: "destructive",
      });
    }
  };

  return <CreateOperacionForm onClose={onClose} onSubmit={handleSubmit} />;
};
