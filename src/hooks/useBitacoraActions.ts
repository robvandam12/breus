
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useBitacoraActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signBitacoraSupervisor = async (bitacoraId: string) => {
    setLoading(true);
    try {
      const timestamp = new Date().toLocaleString();
      const firma = `Firmado digitalmente el ${timestamp}`;

      const { error } = await supabase
        .from('bitacora_supervisor')
        .update({
          supervisor_firma: firma,
          firmado: true,
          updated_at: new Date().toISOString()
        })
        .eq('bitacora_id', bitacoraId);

      if (error) throw error;

      toast({
        title: "Bitácora Firmada",
        description: "La bitácora de supervisor ha sido firmada exitosamente",
      });

      return true;
    } catch (err) {
      console.error('Error signing bitácora supervisor:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al firmar la bitácora';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signBitacoraBuzo = async (bitacoraId: string) => {
    setLoading(true);
    try {
      const timestamp = new Date().toLocaleString();
      const firma = `Firmado digitalmente el ${timestamp}`;

      const { error } = await supabase
        .from('bitacora_buzo')
        .update({
          buzo_firma: firma,
          firmado: true,
          updated_at: new Date().toISOString()
        })
        .eq('bitacora_id', bitacoraId);

      if (error) throw error;

      toast({
        title: "Bitácora Firmada",
        description: "La bitácora de buzo ha sido firmada exitosamente",
      });

      return true;
    } catch (err) {
      console.error('Error signing bitácora buzo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al firmar la bitácora';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signBitacoraSupervisor,
    signBitacoraBuzo,
  };
};
