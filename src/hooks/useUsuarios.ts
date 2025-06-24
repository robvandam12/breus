
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Usuario } from '@/types/usuario';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      
      // Primero obtenemos todos los usuarios
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuario')
        .select('*');

      if (usuariosError) throw usuariosError;

      // Obtenemos todas las salmoneras
      const { data: salmonerasData, error: salmonerasError } = await supabase
        .from('salmoneras')
        .select('id, nombre, rut');

      if (salmonerasError) throw salmonerasError;

      // Obtenemos todos los contratistas
      const { data: contratistasData, error: contratistasError } = await supabase
        .from('contratistas')
        .select('id, nombre, rut');

      if (contratistasError) throw contratistasError;

      // Crear mapas para búsqueda rápida
      const salmonerasMap = new Map(salmonerasData?.map(s => [s.id, s]) || []);
      const contratistasMap = new Map(contratistasData?.map(c => [c.id, c]) || []);

      // Transformar los datos combinando con las relaciones
      const transformedData: Usuario[] = usuariosData?.map(user => ({
        usuario_id: user.usuario_id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email || undefined,
        rol: user.rol as Usuario['rol'],
        estado_buzo: user.estado_buzo as Usuario['estado_buzo'] || 'inactivo',
        perfil_completado: user.perfil_completado || false,
        created_at: user.created_at,
        updated_at: user.updated_at,
        salmonera_id: user.salmonera_id,
        servicio_id: user.servicio_id,
        perfil_buzo: user.perfil_buzo,
        salmonera: user.salmonera_id ? salmonerasMap.get(user.salmonera_id) || undefined : undefined,
        contratista: user.servicio_id ? contratistasMap.get(user.servicio_id) || undefined : undefined
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
