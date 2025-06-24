
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash2, Search, Users } from "lucide-react";
import type { Usuario } from '@/types/usuario';

interface PersonalPoolTableProps {
  usuarios: Usuario[];
  isLoading: boolean;
  onEditUser: (usuario: Usuario) => void;
  onViewUser: (usuario: Usuario) => void;
  onDeleteUser: (usuarioId: string) => void;
}

export const PersonalPoolTable = ({ 
  usuarios, 
  isLoading, 
  onEditUser, 
  onViewUser, 
  onDeleteUser 
}: PersonalPoolTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('all');

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || usuario.rol === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactivo':
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
      case 'suspendido':
        return <Badge className="bg-red-100 text-red-800">Suspendido</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Cargando personal...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Pool de Personal ({usuarios.length})
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Buscar por nombre, apellido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="min-w-[200px]">
            <Label htmlFor="role-filter">Filtrar por Rol</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger id="role-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="buzo">Buzo</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="jefe_faena">Jefe de Faena</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredUsuarios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || roleFilter !== 'all' 
              ? 'No se encontraron usuarios con los filtros aplicados'
              : 'No hay personal registrado'
            }
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsuarios.map((usuario) => (
              <div key={usuario.usuario_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {usuario.nombre} {usuario.apellido}
                    </h3>
                    {getStatusBadge(usuario.estado_buzo)}
                    <Badge variant="outline" className="capitalize">
                      {usuario.rol}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{usuario.email}</p>
                  {usuario.perfil_completado && (
                    <p className="text-xs text-green-600 mt-1">Perfil Completado</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onViewUser(usuario)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEditUser(usuario)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDeleteUser(usuario.usuario_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
