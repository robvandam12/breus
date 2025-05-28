
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export interface UserSearchSelectProps {
  onUserSelect: (user: any) => void;
  selectedUser?: any;
  placeholder?: string;
}

export const UserSearchSelect: React.FC<UserSearchSelectProps> = ({
  onUserSelect,
  selectedUser,
  placeholder = "Buscar usuario..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('usuario')
          .select('*')
          .or(`nombre.ilike.%${searchTerm}%,apellido.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
          .limit(10);

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      {users.length > 0 && (
        <Select onValueChange={(value) => {
          const user = users.find(u => u.usuario_id === value);
          if (user) onUserSelect(user);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar usuario encontrado" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.usuario_id} value={user.usuario_id}>
                <div className="flex flex-col">
                  <span className="font-medium">{user.nombre} {user.apellido}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {searchTerm.length >= 2 && users.length === 0 && !isLoading && (
        <div className="p-3 border border-dashed border-gray-200 rounded-lg text-center">
          <UserPlus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No se encontraron usuarios</p>
          <p className="text-xs text-gray-500">Puedes invitar a este usuario por email</p>
        </div>
      )}
    </div>
  );
};
