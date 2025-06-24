
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
  perfil_completado?: boolean;
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
  };
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
          salmonera:salmoneras!salmonera_id(nombre, rut),
          contratista:contratistas!servicio_id(nombre, rut)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching usuarios:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        });
        return;
      }

      setUsuarios(data || []);
    } catch (error) {
      console.error('Error in fetchUsuarios:', error);
      toast({
        title: "Error",
        description: "Error inesperado al cargar usuarios",
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
    } catch (error: any) {
      console.error('Error updating usuario:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario",
        variant: "destructive",
      });
      throw error;
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
    } catch (error: any) {
      console.error('Error deleting usuario:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    fetchUsuarios,
    updateUsuario,
    deleteUsuario,
  };
};
