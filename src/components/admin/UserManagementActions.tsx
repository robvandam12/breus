
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, UserPlus, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import type { Usuario } from "@/types/usuario";

interface UserManagementActionsProps {
  usuario: Usuario;
}

export const UserManagementActions = ({ usuario }: UserManagementActionsProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email || '',
    rol: usuario.rol,
    estado_buzo: usuario.estado_buzo,
    salmonera_id: usuario.salmonera_id || '',
    servicio_id: usuario.servicio_id || ''
  });

  const { updateUsuario, deleteUsuario } = useUsuarios();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();

  const handleSaveEdit = async () => {
    try {
      await updateUsuario(usuario.usuario_id, {
        nombre: editForm.nombre,
        apellido: editForm.apellido,
        email: editForm.email || null,
        rol: editForm.rol as Usuario['rol'],
        estado_buzo: editForm.estado_buzo as Usuario['estado_buzo'],
        salmonera_id: editForm.salmonera_id || null,
        servicio_id: editForm.servicio_id || null
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUsuario(usuario.usuario_id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'superuser': return 'bg-red-100 text-red-800 border-red-200';
      case 'admin_salmonera': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'admin_servicio': return 'bg-green-100 text-green-800 border-green-200';
      case 'supervisor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'buzo': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'superuser': return 'Super Usuario';
      case 'admin_salmonera': return 'Admin Salmonera';
      case 'admin_servicio': return 'Admin Servicio';
      case 'supervisor': return 'Supervisor';
      case 'buzo': return 'Buzo';
      default: return rol;
    }
  };

  return (
    <div className="flex gap-2">
      {/* Ver detalles */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Nombre Completo</Label>
                <p className="mt-1 text-sm">{usuario.nombre} {usuario.apellido}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Email</Label>
                <p className="mt-1 text-sm">{usuario.email || 'No especificado'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Rol</Label>
                <div className="mt-1">
                  <Badge className={getRoleBadgeColor(usuario.rol)}>
                    {getRoleLabel(usuario.rol)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Estado</Label>
                <div className="mt-1">
                  <Badge variant={usuario.estado_buzo === 'activo' ? 'default' : 'secondary'}>
                    {usuario.estado_buzo}
                  </Badge>
                </div>
              </div>
              {usuario.salmonera && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Salmonera</Label>
                  <p className="mt-1 text-sm">{usuario.salmonera.nombre}</p>
                  <p className="text-xs text-gray-500">{usuario.salmonera.rut}</p>
                </div>
              )}
              {usuario.contratista && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Contratista</Label>
                  <p className="mt-1 text-sm">{usuario.contratista.nombre}</p>
                  <p className="text-xs text-gray-500">{usuario.contratista.rut}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-gray-500">Perfil Completado</Label>
                <div className="mt-1">
                  <Badge variant={usuario.perfil_completado ? 'default' : 'secondary'}>
                    {usuario.perfil_completado ? 'Completado' : 'Pendiente'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Fecha de Registro</Label>
                <p className="mt-1 text-sm">{new Date(usuario.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Editar usuario */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={editForm.apellido}
                  onChange={(e) => setEditForm(prev => ({ ...prev, apellido: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="rol">Rol</Label>
                <Select value={editForm.rol} onValueChange={(value) => setEditForm(prev => ({ ...prev, rol: value as Usuario['rol'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superuser">Super Usuario</SelectItem>
                    <SelectItem value="admin_salmonera">Admin Salmonera</SelectItem>
                    <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="buzo">Buzo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select value={editForm.estado_buzo} onValueChange={(value) => setEditForm(prev => ({ ...prev, estado_buzo: value as Usuario['estado_buzo'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="suspendido">Suspendido</SelectItem>
                    <SelectItem value="disponible">Disponible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salmonera">Salmonera</Label>
                <Select value={editForm.salmonera_id} onValueChange={(value) => setEditForm(prev => ({ ...prev, salmonera_id: value, servicio_id: '' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar salmonera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin asignar</SelectItem>
                    {salmoneras.map(salmonera => (
                      <SelectItem key={salmonera.id} value={salmonera.id}>
                        {salmonera.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contratista">Contratista</Label>
                <Select value={editForm.servicio_id} onValueChange={(value) => setEditForm(prev => ({ ...prev, servicio_id: value, salmonera_id: '' }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contratista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin asignar</SelectItem>
                    {contratistas.map(contratista => (
                      <SelectItem key={contratista.id} value={contratista.id}>
                        {contratista.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Eliminar usuario */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario 
              <strong> {usuario.nombre} {usuario.apellido}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
