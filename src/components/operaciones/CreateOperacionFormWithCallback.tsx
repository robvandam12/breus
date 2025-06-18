
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

  // Create a custom version that handles the success callback
  const CustomCreateForm = () => {
    const { createOperacion: originalCreate } = useOperaciones();

    // Override the create function to add our callback
    const handleCreate = async (formData: any) => {
      try {
        const newOperacion = await originalCreate(formData);
        toast({
          title: "Operación creada",
          description: "La operación ha sido creada exitosamente.",
        });
        onSuccess(newOperacion.id);
        onClose();
        return newOperacion;
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

    // Use the original form with our custom create function
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Nueva Operación</h2>
          <p className="mt-2 text-gray-600">
            Complete la información básica de la operación
          </p>
        </div>
        <CreateOperacionForm onClose={onClose} />
      </div>
    );
  };

  return <CustomCreateForm />;
};
