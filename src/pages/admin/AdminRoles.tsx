
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Plus, Users, Settings, AlertTriangle } from "lucide-react";

const defaultRoles = [
  { id: 'superuser', name: 'Superuser', description: 'Acceso total al sistema', predefined: true, userCount: 1 },
  { id: 'admin_salmonera', name: 'Admin Salmonera', description: 'Administrador de empresa salmonera', predefined: true, userCount: 5 },
  { id: 'admin_servicio', name: 'Admin Servicio', description: 'Administrador de empresa de servicios', predefined: true, userCount: 3 },
  { id: 'supervisor', name: 'Supervisor', description: 'Supervisor de operaciones de buceo', predefined: true, userCount: 8 },
  { id: 'buzo', name: 'Buzo', description: 'Buzo profesional', predefined: true, userCount: 24 }
];

const permissions = [
  { id: 'dashboard_view', name: 'Ver Dashboard', module: 'Dashboard' },
  { id: 'empresas_view', name: 'Ver Empresas', module: 'Empresas' },
  { id: 'empresas_create', name: 'Crear Empresas', module: 'Empresas' },
  { id: 'empresas_edit', name: 'Editar Empresas', module: 'Empresas' },
  { id: 'empresas_delete', name: 'Eliminar Empresas', module: 'Empresas' },
  { id: 'operaciones_view', name: 'Ver Operaciones', module: 'Operaciones' },
  { id: 'operaciones_create', name: 'Crear Operaciones', module: 'Operaciones' },
  { id: 'operaciones_edit', name: 'Editar Operaciones', module: 'Operaciones' },
  { id: 'hpt_view', name: 'Ver HPT', module: 'Formularios' },
  { id: 'hpt_create', name: 'Crear HPT', module: 'Formularios' },
  { id: 'hpt_sign', name: 'Firmar HPT', module: 'Formularios' },
  { id: 'anexo_view', name: 'Ver Anexo Bravo', module: 'Formularios' },
  { id: 'anexo_create', name: 'Crear Anexo Bravo', module: 'Formularios' },
  { id: 'anexo_sign', name: 'Firmar Anexo Bravo', module: 'Formularios' },
  { id: 'inmersiones_view', name: 'Ver Inmersiones', module: 'Inmersiones' },
  { id: 'inmersiones_create', name: 'Crear Inmersiones', module: 'Inmersiones' },
  { id: 'bitacoras_view', name: 'Ver Bitácoras', module: 'Bitácoras' },
  { id: 'bitacoras_create', name: 'Crear Bitácoras', module: 'Bitácoras' },
  { id: 'bitacoras_sign', name: 'Firmar Bitácoras', module: 'Bitácoras' },
  { id: 'reportes_view', name: 'Ver Reportes', module: 'Reportes' },
  { id: 'reportes_export', name: 'Exportar Reportes', module: 'Reportes' },
  { id: 'config_view', name: 'Ver Configuración', module: 'Configuración' },
  { id: 'config_edit', name: 'Editar Configuración', module: 'Configuración' },
  { id: 'admin_view', name: 'Ver Admin', module: 'Admin' },
  { id: 'admin_roles', name: 'Gestionar Roles', module: 'Admin' }
];

const AdminRoles = () => {
  const [roles, setRoles] = useState(defaultRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [rolePermissions, setRolePermissions] = useState<Record<string, boolean>>({});

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;

    const newRole = {
      id: `custom_${Date.now()}`,
      name: newRoleName,
      description: newRoleDescription,
      predefined: false,
      userCount: 0
    };

    setRoles([...roles, newRole]);
    setNewRoleName('');
    setNewRoleDescription('');
    setIsCreateDialogOpen(false);
  };

  const groupedPermissions = permissions.reduce((acc: Record<string, typeof permissions>, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {});

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Gestión de Roles y Permisos</h1>
                  <p className="text-sm text-zinc-500">Administrar roles del sistema y permisos granulares</p>
                </div>
              </div>
              <div className="flex-1" />
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
                    <div className="flex gap-2">
                      <Button onClick={handleCreateRole} className="flex-1">
                        Crear Rol
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
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
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRole(role)}
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Matriz de Permisos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                          <div key={module} className="space-y-3">
                            <h3 className="font-semibold text-lg border-b pb-2">{module}</h3>
                            <div className="grid gap-3">
                              {modulePermissions.map((permission) => (
                                <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium">{permission.name}</p>
                                    <p className="text-sm text-gray-500">{permission.id}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    {roles.map((role) => (
                                      <div key={role.id} className="flex flex-col items-center gap-1">
                                        <span className="text-xs font-medium">{role.name}</span>
                                        <Switch
                                          checked={rolePermissions[`${role.id}_${permission.id}`] || false}
                                          onCheckedChange={(checked) => {
                                            setRolePermissions(prev => ({
                                              ...prev,
                                              [`${role.id}_${permission.id}`]: checked
                                            }));
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminRoles;
