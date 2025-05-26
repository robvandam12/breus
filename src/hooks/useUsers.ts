
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface User {
  usuario_id: string;
  email: string | null;
  nombre: string;
  apellido: string;
  rol: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id?: string | null;
  servicio_id?: string | null;
  perfil_completado?: boolean;
  perfil_buzo?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateUserFormData {
  nombre: string;
  apellido: string;
  email: string;
  rol: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id?: string | null;
  servicio_id?: string | null;
  telefono?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedUsers: User[] = (data || []).map(user => ({
        ...user,
        rol: user.rol as 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo'
      }));
      
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: CreateUserFormData) => {
    try {
      setIsCreating(true);
      
      // Primero crear el usuario en auth.users (simulado por ahora)
      const newUserId = crypto.randomUUID();
      
      const userToCreate = {
        usuario_id: newUserId,
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        rol: userData.rol,
        salmonera_id: userData.salmonera_id,
        servicio_id: userData.servicio_id
      };

      const { data, error } = await supabase
        .from('usuario')
        .insert([userToCreate])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Usuario Creado",
        description: "El usuario ha sido creado exitosamente"
      });

      await fetchUsers();
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('usuario')
        .update(userData)
        .eq('usuario_id', userId);

      if (error) throw error;

      toast({
        title: "Usuario Actualizado",
        description: "Los datos del usuario han sido actualizados"
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('usuario_id', userId);

      if (error) throw error;

      toast({
        title: "Usuario Eliminado",
        description: "El usuario ha sido eliminado del sistema"
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    users,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers
  };
};
