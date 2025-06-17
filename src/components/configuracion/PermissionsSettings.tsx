
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  Settings, 
  FileText, 
  UserCheck,
  AlertTriangle,
  Plus
} from "lucide-react";

interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
  roles: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  color: string;
}

export const PermissionsSettings = () => {
  const [selectedRole, setSelectedRole] = useState<string>('admin');

  const roles: Role[] = [
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acceso completo al sistema',
      users: 3,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'supervisor',
      name: 'Supervisor',
      description: 'Gestión de operaciones y equipos',
      users: 8,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'buzo',
      name: 'Buzo',
      description: 'Acceso a bitácoras y operaciones asignadas',
      users: 45,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'contratista',
      name: 'Contratista',
      description: 'Gestión de personal y equipos propios',
      users: 12,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const permissions: Permission[] = [
    {
      id: 'operaciones_create',
      module: 'Operaciones',
      action: 'Crear',
      description: 'Crear nuevas operaciones de buceo',
      roles: ['admin', 'supervisor']
    },
    {
      id: 'operaciones_read',
      module: 'Operaciones',
      action: 'Ver',
      description: 'Ver detalles de operaciones',
      roles: ['admin', 'supervisor', 'buzo', 'contratista']
    },
    {
      id: 'operaciones_update',
      module: 'Operaciones',
      action: 'Editar',
      description: 'Modificar operaciones existentes',
      roles: ['admin', 'supervisor']
    },
    {
      id: 'operaciones_delete',
      module: 'Operaciones',
      action: 'Eliminar',
      description: 'Eliminar operaciones',
      roles: ['admin']
    },
    {
      id: 'bitacoras_create',
      module: 'Bitácoras',
      action: 'Crear',
      description: 'Crear bitácoras de buceo',
      roles: ['admin', 'supervisor', 'buzo']
    },
    {
      id: 'bitacoras_sign',
      module: 'Bitácoras',
      action: 'Firmar',
      description: 'Firmar bitácoras digitalmente',
      roles: ['admin', 'supervisor', 'buzo']
    },
    {
      id: 'personal_manage',
      module: 'Personal',
      action: 'Gestionar',
      description: 'Administrar personal y roles',
      roles: ['admin', 'contratista']
    },
    {
      id: 'reportes_access',
      module: 'Reportes',
      action: 'Acceder',
      description: 'Ver reportes y análisis',
      roles: ['admin', 'supervisor', 'contratista']
    },
    {
      id: 'config_access',
      module: 'Configuración',
      action: 'Configurar',
      description: 'Acceso a configuración del sistema',
      roles: ['admin']
    }
  ];

  const getPermissionIcon = (action: string) => {
    switch (action) {
      case 'Ver': return <Eye className="w-4 h-4" />;
      case 'Crear': return <Plus className="w-4 h-4" />;
      case 'Editar': return <Edit className="w-4 h-4" />;
      case 'Eliminar': return <Trash2 className="w-4 h-4" />;
      case 'Firmar': return <UserCheck className="w-4 h-4" />;
      case 'Gestionar': return <Users className="w-4 h-4" />;
      case 'Acceder': return <FileText className="w-4 h-4" />;
      case 'Configurar': return <Settings className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const hasPermission = (permission: Permission, roleId: string) => {
    return permission.roles.includes(roleId);
  };

  return (
    <div className="space-y-6">
      {/* Roles Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestión de Roles y Permisos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedRole === role.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{role.name}</h3>
                  <Badge className={role.color}>
                    {role.users} usuarios
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Matriz de Permisos
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="role-filter">Rol seleccionado:</Label>
              <Badge className={roles.find(r => r.id === selectedRole)?.color}>
                {roles.find(r => r.id === selectedRole)?.name}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Operaciones', 'Bitácoras', 'Personal', 'Reportes', 'Configuración'].map((module) => {
              const modulePermissions = permissions.filter(p => p.module === module);
              
              return (
                <div key={module} className="border rounded-lg p-4">
                  <h4 className="font-medium text-lg mb-3 flex items-center gap-2">
                    {module === 'Operaciones' && <FileText className="w-5 h-5" />}
                    {module === 'Bitácoras' && <Edit className="w-5 h-5" />}
                    {module === 'Personal' && <Users className="w-5 h-5" />}
                    {module === 'Reportes' && <FileText className="w-5 h-5" />}
                    {module === 'Configuración' && <Settings className="w-5 h-5" />}
                    {module}
                  </h4>
                  
                  <div className="grid gap-3">
                    {modulePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          {getPermissionIcon(permission.action)}
                          <div>
                            <p className="font-medium text-sm">{permission.action}</p>
                            <p className="text-xs text-gray-600">{permission.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={hasPermission(permission, selectedRole)}
                            disabled
                            className={hasPermission(permission, selectedRole) ? 'data-[state=checked]:bg-green-600' : ''}
                          />
                          {hasPermission(permission, selectedRole) ? (
                            <Badge className="bg-green-100 text-green-800">
                              Permitido
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              Denegado
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Warnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            Alertas de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Atención:</strong> Los cambios en permisos requieren que los usuarios vuelvan a iniciar sesión.
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Auditoría:</strong> Todos los cambios de permisos son registrados en el log de seguridad.
              </p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>RLS Activo:</strong> Row Level Security está habilitado en todas las tablas sensibles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
