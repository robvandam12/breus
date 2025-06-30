
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateOperacionFormEnhanced } from './CreateOperacionFormEnhanced';
import { useOperacionesQuery } from '@/hooks/useOperacionesQuery';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CreateOperacionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  enterpriseContext?: any;
}

export const CreateOperacionDialog = ({ 
  isOpen, 
  onClose, 
  enterpriseContext 
}: CreateOperacionDialogProps) => {
  const { refetch } = useOperacionesQuery();

  const handleSubmit = async (data: any) => {
    try {
      console.log('Creating operacion with data:', data);
      
      const { error } = await supabase
        .from('operacion')
        .insert([data]);

      if (error) {
        console.error('Error creating operacion:', error);
        throw error;
      }

      toast({
        title: "Operación creada",
        description: `La operación "${data.nombre}" ha sido creada exitosamente.`,
      });

      // Refrescar la lista de operaciones
      refetch();
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Operación de Buceo</DialogTitle>
        </DialogHeader>
        <CreateOperacionFormEnhanced
          onSubmit={handleSubmit}
          onCancel={onClose}
          enterpriseContext={enterpriseContext}
        />
      </DialogContent>
    </Dialog>
  );
};
