
import { useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Mail, UserCheck, Filter, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserManagement } from "@/components/usuarios/UserManagement";

export default function PoolUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
        <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
          <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-zinc-600" />
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Equipos de Buceo</h1>
              <p className="text-sm text-zinc-500">Gestiona supervisores, buzos y personal técnico</p>
            </div>
          </div>
          <div className="flex-1" />
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Invitar Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <InviteUserForm onClose={() => setIsInviteDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Usuarios</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Supervisores</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Buzos</p>
                    <p className="text-2xl font-bold">16</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Invitaciones</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros y Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="supervisor">Supervisores</SelectItem>
                    <SelectItem value="buzo">Buzos</SelectItem>
                    <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="invited">Invitados</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* User Management Component */}
          <UserManagement />
        </div>
      </div>
    </>
  );
}

const InviteUserForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'buzo' as 'supervisor' | 'buzo' | 'admin_servicio'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar invitación
    console.log('Inviting user:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="usuario@ejemplo.com"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Nombre</label>
          <Input
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Apellido</label>
          <Input
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            placeholder="Apellido"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Rol</label>
        <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="buzo">Buzo</SelectItem>
            <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          <Mail className="w-4 h-4 mr-2" />
          Enviar Invitación
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
