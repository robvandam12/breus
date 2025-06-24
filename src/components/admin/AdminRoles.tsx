
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, Lock, Save, RotateCcw } from "lucide-react";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { toast } from "@/hooks/use-toast";

export const AdminRoles = () => {
  const { 
    roles, 
    permissions, 
    isLoading, 
    updateRolePermissions, 
    getPermissionsByCategory,
    hasPermission 
  } = useRoleManagement();
  
  const [selectedRole, setSelectedRole] = useState(roles[0]?.id || '');
  const [localPermissions, setLocalPermissions] = useState<{ [key: string]: string[] }>({});
  const [hasChanges, setHasChanges] = useState(false);

  const selectedRoleData = roles.find(r => r.id === selectedRole);
  const currentPermissions = localPermissions[selectedRole] || selectedRoleData?.permissions || [];
  const categorizedPermissions = getPermissionsByCategory();

  const handlePermissionToggle = (permissionId: string) => {
    const newPermissions = currentPermissions.includes(permissionId)
      ? currentPermissions.filter(p => p !== permissionId)
      : [...currentPermissions, permissionId];
    
    setLocalPermissions(prev => ({
      ...prev,
      [selectedRole]: newPermissions
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedRole || !hasChanges) return;
    
    try {
      await updateRolePermissions(selectedRole, currentPermissions);
      setLocalPermissions(prev => {
        const updated = { ...prev };
        delete updated[selectedRole];
        return updated;
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  };

  const handleResetChanges = () => {
    setLocalPermissions(prev => {
      const updated = { ...prev };
      delete updated[selectedRole];
      return updated;
    });
    setHasChanges(false);
  };

  const getRoleBadgeColor = (roleId: string) => {
    const colors = {
      'superuser': 'bg-red-100 text-red-800 border-red-200',
      'admin_salmonera': 'bg-blue-100 text-blue-800 border-blue-200',
      'admin_servicio': 'bg-green-100 text-green-800 border-green-200',
      'supervisor': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'buzo': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[roleId as keyof typeof colors] || colors.buzo;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Gestión de Roles y Permisos
          </h1>
          <p className="text-gray-600 mt-1">
            Configure los permisos para cada rol del sistema
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetChanges}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Descartar
            </Button>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de Roles */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {roles.map((role) => (
                <Button
                  key={role.id}
                  variant={selectedRole === role.id ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => {
                    setSelectedRole(role.id);
                    setHasChanges(false);
                  }}
                >
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleBadgeColor(role.id)}>
                        {role.name}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 text-left">
                      {role.description}
                    </p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Matriz de Permisos */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Permisos para {selectedRoleData?.name}
                </CardTitle>
                <Badge className={getRoleBadgeColor(selectedRole)}>
                  {currentPermissions.length} permisos activos
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(categorizedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg capitalize">
                      {category.replace('_', ' ')}
                    </h3>
                    <Badge variant="outline">
                      {categoryPermissions.filter(p => currentPermissions.includes(p.id)).length}/{categoryPermissions.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryPermissions.map((permission) => {
                      const isActive = currentPermissions.includes(permission.id);
                      const isChanged = localPermissions[selectedRole]?.includes(permission.id) !== 
                                       selectedRoleData?.permissions.includes(permission.id);
                      
                      return (
                        <div 
                          key={permission.id} 
                          className={`p-3 border rounded-lg transition-colors ${
                            isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                          } ${isChanged ? 'ring-2 ring-blue-200' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">
                                  {permission.name}
                                </h4>
                                {isChanged && (
                                  <Badge variant="outline" className="text-xs">
                                    Modificado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {permission.description}
                              </p>
                            </div>
                            <Switch
                              checked={isActive}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {category !== Object.keys(categorizedPermissions)[Object.keys(categorizedPermissions).length - 1] && (
                    <Separator />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
