
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Plus, Users, Settings, Save } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useRolesAndPermissions } from "@/hooks/useRolesAndPermissions";

const AdminRoles = () => {
  const [selectedRole, setSelectedRole] = useState('superuser');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  const {
    roles,
    permissions,
    rolePermissions,
    loading,
    createCustomRole,
    updateRolePermission,
    savePermissionChanges
  } = useRolesAndPermissions();

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    
    try {
      await createCustomRole(newRoleName, newRoleDescription);
      setNewRoleName('');
      setNewRoleDescription('');
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const selectedRoleObj = roles.find(role => role.id === selectedRole);

  const headerActions = (
    <div className="flex gap-2">
      <Button onClick={savePermissionChanges} className="bg-green-600 hover:bg-green-700">
        <Save className="w-4 h-4 mr-2" />
        Guardar Cambios
      </Button>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Rol
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roleName">Nombre del Rol</Label>
              <Input
                id="roleName"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Ej: Auditor Salmonera"
              />
            </div>
            <div>
              <Label htmlFor="roleDescription">Descripción</Label>
              <Input
                id="roleDescription"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Descripción del rol..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>
              Crear Rol
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (loading) {
    return (
      <MainLayout
        title="Gestión de Roles y Permisos"
        subtitle="Administrar roles del sistema y permisos granulares"
        icon={Shield}
        headerChildren={headerActions}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="ml-2 text-sm text-gray-500">Cargando roles y permisos...</p>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Gestión de Roles y Permisos"
      subtitle="Administrar roles del sistema y permisos granulares"
      icon={Shield}
      headerChildren={headerActions}
    >
      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Gestión de Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permisos por Rol</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Roles del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rol</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Usuarios</TableHead>
                    <TableHead>Permisos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <Badge variant={role.predefined ? "secondary" : "default"}>
                          {role.predefined ? "Predefinido" : "Personalizado"}
                        </Badge>
                      </TableCell>
                      <TableCell>{role.userCount} usuarios</TableCell>
                      <TableCell>{role.permissions.length} permisos</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRole(role.id);
                            // Cambiar a la pestaña de permisos
                            const permissionsTab = document.querySelector('[value="permissions"]') as HTMLElement;
                            if (permissionsTab) permissionsTab.click();
                          }}
                        >
                          Configurar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <div className="space-y-6">
            {/* Selector de rol */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configurar Permisos
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="role-selector">Rol seleccionado:</Label>
                    <select
                      id="role-selector"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md"
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRoleObj && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900">{selectedRoleObj.name}</h4>
                    <p className="text-sm text-blue-700">{selectedRoleObj.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-blue-600">
                      <span>{selectedRoleObj.userCount} usuarios</span>
                      <span>{selectedRoleObj.permissions.length} permisos activos</span>
                      <Badge variant={selectedRoleObj.predefined ? "secondary" : "default"}>
                        {selectedRoleObj.predefined ? "Predefinido" : "Personalizado"}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Matriz de permisos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Matriz de Permisos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                    <div key={module} className="space-y-3">
                      <h3 className="font-semibold text-lg border-b pb-2 text-blue-900">{module}</h3>
                      <div className="grid gap-3">
                        {modulePermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <p className="font-medium">{permission.name}</p>
                              <p className="text-sm text-gray-600">{permission.description}</p>
                              <p className="text-xs text-gray-500">ID: {permission.id}</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={Boolean(rolePermissions[`${selectedRole}_${permission.id}`])}
                                onCheckedChange={(checked) => updateRolePermission(selectedRole, permission.id, checked)}
                                disabled={selectedRoleObj?.predefined && selectedRoleObj.id === 'superuser'}
                              />
                              {rolePermissions[`${selectedRole}_${permission.id}`] ? (
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default AdminRoles;
