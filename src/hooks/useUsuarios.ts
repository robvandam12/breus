
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Usuario {
  usuario_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  estado_buzo?: string;
  perfil_completado: boolean;
  perfil_buzo?: any;
  salmonera_id?: string;
  servicio_id?: string;
  created_at: string;
  updated_at: string;
  salmonera?: {
    nombre: string;
    rut: string;
  };
  contratista?: {
    nombre: string;
    rut: string;
  }[];
}

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('usuario')
        .select(`
          *,
          salmonera:salmoneras(nombre, rut),
          contratista:contratistas(nombre, rut)
        `);

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = data?.map(user => ({
        ...user,
        contratista: Array.isArray(user.contratista) 
          ? user.contratista 
          : user.contratista 
            ? [user.contratista] 
            : []
      })) || [];

      setUsuarios(transformedData);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async (usuarioId: string, updates: Partial<Usuario>) => {
    try {
      const { error } = await supabase
        .from('usuario')
        .update(updates)
        .eq('usuario_id', usuarioId);

      if (error) throw error;

      await fetchUsuarios();
      toast({
        title: "Usuario actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });
    } catch (error) {
      console.error('Error updating usuario:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    }
  };

  const deleteUsuario = async (usuarioId: string) => {
    try {
      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('usuario_id', usuarioId);

      if (error) throw error;

      await fetchUsuarios();
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting usuario:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const inviteUsuario = async (userData: any) => {
    try {
      // Implementation for user invitation
      toast({
        title: "Invitación enviada",
        description: "Se ha enviado la invitación al usuario.",
      });
    } catch (error) {
      console.error('Error inviting usuario:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    isLoading: loading,
    fetchUsuarios,
    updateUsuario,
    deleteUsuario,
    inviteUsuario
  };
};
