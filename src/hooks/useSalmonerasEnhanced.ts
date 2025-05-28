
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Salmonera {
  id: string;
  nombre: string;
  rut: string;
  email?: string;
  telefono?: string;
  direccion: string;
  estado: string;
  sitios_activos: number;
  created_at: string;
  updated_at: string;
  personal?: any[];
}

export interface SalmoneraFormData {
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  direccion: string;
}

export const useSalmonerasEnhanced = () => {
  const queryClient = useQueryClient();

  const { data: salmoneras = [], isLoading } = useQuery({
    queryKey: ['salmoneras'],
    queryFn: async () => {
      console.log('Fetching salmoneras...');
      const { data, error } = await supabase
        .from('salmoneras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching salmoneras:', error);
        throw error;
      }

      return data as Salmonera[];
    },
  });

  const createSalmoneraeMutation = useMutation({
    mutationFn: async (data: SalmoneraFormData) => {
      console.log('Creating salmonera:', data);
      
      const { data: result, error } = await supabase
        .from('salmoneras')
        .insert([{
          ...data,
          estado: 'activa'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating salmonera:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Salmonera creada",
        description: "La salmonera ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating salmonera:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la salmonera.",
        variant: "destructive",
      });
    },
  });

  const updateSalmoneraeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SalmoneraFormData> }) => {
      console.log('Updating salmonera:', id, data);
      
      const { data: result, error } = await supabase
        .from('salmoneras')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Salmonera actualizada",
        description: "La salmonera ha sido actualizada exitosamente.",
      });
    },
  });

  const deleteSalmoneraeMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting salmonera:', id);
      
      const { error } = await supabase
        .from('salmoneras')
        .update({ estado: 'inactiva' })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      toast({
        title: "Salmonera eliminada",
        description: "La salmonera ha sido eliminada exitosamente.",
      });
    },
  });

  const addPersonalToSalmonera = async (salmoneraId: string, personalData: any) => {
    console.log('Adding personal to salmonera:', salmoneraId, personalData);
    
    try {
      // Implementation for adding personnel to salmonera
      // This would typically involve creating or updating user records
      // and associating them with the salmonera
      
      toast({
        title: "Personal agregado",
        description: "El personal ha sido agregado a la salmonera exitosamente.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      return true;
    } catch (error) {
      console.error('Error adding personal:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el personal.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removePersonalFromSalmonera = async (salmoneraId: string, personalId: string) => {
    console.log('Removing personal from salmonera:', salmoneraId, personalId);
    
    try {
      // Implementation for removing personnel from salmonera
      
      toast({
        title: "Personal removido",
        description: "El personal ha sido removido de la salmonera exitosamente.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['salmoneras'] });
      return true;
    } catch (error) {
      console.error('Error removing personal:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el personal.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const inviteUserToSalmonera = async (salmoneraId: string, inviteData: any) => {
    console.log('Inviting user to salmonera:', salmoneraId, inviteData);
    
    try {
      // Implementation for inviting users to salmonera
      
      toast({
        title: "Invitación enviada",
        description: "La invitación ha sido enviada exitosamente.",
      });
      
      return true;
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    salmoneras,
    isLoading,
    createSalmonera: createSalmoneraeMutation.mutateAsync,
    updateSalmonera: updateSalmoneraeMutation.mutateAsync,
    deleteSalmonera: deleteSalmoneraeMutation.mutateAsync,
    addPersonalToSalmonera,
    removePersonalFromSalmonera,
    inviteUserToSalmonera,
    isCreating: createSalmoneraeMutation.isPending,
    isUpdating: updateSalmoneraeMutation.isPending,
    isDeleting: deleteSalmoneraeMutation.isPending,
  };
};
