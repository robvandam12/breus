
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

  // Override the default form submission
  const handleFormSubmit = async (formData: any) => {
    try {
      const newOperacion = await createOperacion(formData);
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
      onSuccess(newOperacion.id);
      onClose();
    } catch (error) {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación.",
        variant: "destructive",
      });
    }
  };

  // Create a modified CreateOperacionForm that handles our custom submission
  const FormWrapper = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Operación</h2>
          <p className="mt-2 text-gray-600">
            Complete la información básica de la operación
          </p>
        </div>
        <CreateOperacionForm 
          onClose={onClose}
          onFormSubmit={handleFormSubmit}
        />
      </div>
    );
  };

  return <FormWrapper />;
};
