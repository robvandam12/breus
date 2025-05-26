
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Plus, Edit, Shield, UserCheck, Mail } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useAuth } from "@/hooks/useAuth";

export const UserManagement = () => {
  const { profile } = useAuth();
  const { usuarios, isLoading, updateUsuario, inviteUsuario } = useUsuarios();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'buzo',
    empresa_id: '',
    tipo_empresa: '' as 'salmonera' | 'contratista' | '',
  });

  const handleInviteSubmit = () => {
    const formData = {
      email: inviteForm.email,
      nombre: inviteForm.nombre,
      apellido: inviteForm.apellido,
      rol: inviteForm.rol,
      ...(inviteForm.empresa_id && { empresa_id: inviteForm.empresa_id }),
      ...(inviteForm.tipo_empresa && { tipo_empresa: inviteForm.tipo_empresa as 'salmonera' | 'contratista' }),
    };
    
    inviteUsuario(formData);
    setInviteForm({
      email: '',
      nombre: '',
      apellido: '',
      rol: 'buzo',
      empresa_id: '',
      tipo_empresa: '',
    });
    setIsInviteDialogOpen(false);
  };

  const handleUpdateUser = (updates: any) => {
    if (selectedUser) {
      updateUsuario({ id: selectedUser.usuario_id, ...updates });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      superuser: 'bg-red-100 text-red-700',
      admin_salmonera: 'bg-blue-100 text-blue-700',
      admin_servicio: 'bg-purple-100 text-purple-700',
      supervisor: 'bg-orange-100 text-orange-700',
      buzo: 'bg-teal-100 text-teal-700',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  const roleOptions = [
    { value: 'superuser', label: 'Super Usuario' },
    { value: 'admin_salmonera', label: 'Admin Salmonera' },
    { value: 'admin_servicio', label: 'Admin Servicio' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'buzo', label: 'Buzo' },
  ];

  const salmoneraOptions = salmoneras.map(s => ({
    value: s.id,
    label: `${s.nombre} (${s.rut})`,
  }));

  const contratistaOptions = contratistas.map(c => ({
    value: c.id,
    label: `${c.nombre} (${c.rut})`,
  }));

  const tipoEmpresaOptions = [
    { value: 'salmonera', label: 'Salmonera' },
    { value: 'contratista', label: 'Contratista' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Gestión de Usuarios
            <Badge variant="outline" className="ml-2">
              {usuarios.length} usuarios
            </Badge>
          </CardTitle>
          {profile?.role === 'superuser' && (
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Invitar Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Invitar Nuevo Usuario
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={inviteForm.nombre}
                        onChange={(e) => setInviteForm({ ...inviteForm, nombre: e.target.value })}
                        placeholder="Juan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={inviteForm.apellido}
                        onChange={(e) => setInviteForm({ ...inviteForm, apellido: e.target.value })}
                        placeholder="Pérez"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                      placeholder="juan.perez@empresa.cl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rol">Rol *</Label>
                    <EnhancedSelect
                      value={inviteForm.rol}
                      onValueChange={(value) => setInviteForm({ ...inviteForm, rol: value })}
                      options={roleOptions}
                      placeholder="Seleccionar rol..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipo_empresa">Tipo de Empresa</Label>
                    <EnhancedSelect
                      value={inviteForm.tipo_empresa}
                      onValueChange={(value) => setInviteForm({ ...inviteForm, tipo_empresa: value as 'salmonera' | 'contratista' | '' })}
                      options={tipoEmpresaOptions}
                      placeholder="Seleccionar tipo..."
                    />
                  </div>

                  {inviteForm.tipo_empresa === 'salmonera' && (
                    <div>
                      <Label htmlFor="empresa_id">Salmonera</Label>
                      <EnhancedSelect
                        value={inviteForm.empresa_id}
                        onValueChange={(value) => setInviteForm({ ...inviteForm, empresa_id: value })}
                        options={salmoneraOptions}
                        placeholder="Seleccionar salmonera..."
                      />
                    </div>
                  )}

                  {inviteForm.tipo_empresa === 'contratista' && (
                    <div>
                      <Label htmlFor="empresa_id">Contratista</Label>
                      <EnhancedSelect
                        value={inviteForm.empresa_id}
                        onValueChange={(value) => setInviteForm({ ...inviteForm, empresa_id: value })}
                        options={contratistaOptions}
                        placeholder="Seleccionar contratista..."
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleInviteSubmit} 
                      disabled={!inviteForm.nombre || !inviteForm.apellido || !inviteForm.email}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Invitación
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsInviteDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.usuario_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{usuario.nombre} {usuario.apellido}</div>
                      <div className="text-xs text-zinc-500">ID: {usuario.usuario_id.slice(0, 8)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600">{usuario.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getRoleBadgeColor(usuario.rol)}>
                    {usuario.rol.replace('_', ' ').toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {usuario.salmonera?.nombre || usuario.servicio?.nombre || (
                    <span className="text-zinc-400">Sin asignar</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={usuario.perfil_completado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {usuario.perfil_completado ? 'Completo' : 'Pendiente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedUser(usuario);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
