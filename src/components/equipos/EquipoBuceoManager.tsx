
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, UserPlus, Mail } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useSalmoneras } from "@/hooks/useSalmoneras";

interface EquipoBuceoManagerProps {
  salmoneraId?: string;
}

export const EquipoBuceoManager = ({ salmoneraId }: EquipoBuceoManagerProps) => {
  const { equipos, isLoading, createEquipo, addMiembro, inviteMember } = useEquiposBuceoEnhanced();
  const { usuarios } = useUsuarios();
  const { salmoneras } = useSalmoneras();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<string>('');
  const [newEquipo, setNewEquipo] = useState({
    nombre: '',
    descripcion: '',
    salmonera_id: salmoneraId || ''
  });
  const [newMember, setNewMember] = useState({
    tipo: 'existing', // 'existing' or 'invite'
    usuario_id: '',
    nombre_completo: '',
    email: '',
    matricula: '',
    telefono: '',
    rol_equipo: ''
  });

  const filteredEquipos = salmoneraId 
    ? equipos.filter(e => e.salmonera_id === salmoneraId)
    : equipos;

  const availableUsers = usuarios.filter(u => 
    u.rol === 'supervisor' || u.rol === 'buzo'
  );

  const handleCreateEquipo = () => {
    if (newEquipo.nombre && newEquipo.salmonera_id) {
      createEquipo(newEquipo);
      setNewEquipo({ nombre: '', descripcion: '', salmonera_id: salmoneraId || '' });
      setIsCreateDialogOpen(false);
    }
  };

  const handleAddMember = () => {
    if (!selectedEquipo) return;

    if (newMember.tipo === 'existing' && newMember.usuario_id) {
      const usuario = usuarios.find(u => u.usuario_id === newMember.usuario_id);
      if (usuario) {
        addMiembro({
          equipo_id: selectedEquipo,
          usuario_id: usuario.usuario_id,
          rol_equipo: newMember.rol_equipo,
          nombre_completo: `${usuario.nombre} ${usuario.apellido}`,
          email: usuario.email,
          invitado: false
        });
      }
    } else if (newMember.tipo === 'invite' && newMember.email && newMember.nombre_completo) {
      inviteMember({
        equipo_id: selectedEquipo,
        email: newMember.email,
        nombre_completo: newMember.nombre_completo,
        rol_equipo: newMember.rol_equipo
      });
    }

    setNewMember({
      tipo: 'existing',
      usuario_id: '',
      nombre_completo: '',
      email: '',
      matricula: '',
      telefono: '',
      rol_equipo: ''
    });
    setIsAddMemberDialogOpen(false);
  };

  const getRolBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      supervisor: 'bg-blue-100 text-blue-700',
      buzo_principal: 'bg-green-100 text-green-700',
      buzo_asistente: 'bg-yellow-100 text-yellow-700',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return <div>Cargando equipos de buceo...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Equipos de Buceo</h2>
            <p className="text-zinc-500">Gestión de equipos de trabajo</p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Equipo de Buceo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Equipo *</Label>
                <Input
                  id="nombre"
                  value={newEquipo.nombre}
                  onChange={(e) => setNewEquipo(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Equipo Centro Norte"
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={newEquipo.descripcion}
                  onChange={(e) => setNewEquipo(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descripción del equipo..."
                />
              </div>
              {!salmoneraId && (
                <div>
                  <Label htmlFor="salmonera">Salmonera *</Label>
                  <Select
                    value={newEquipo.salmonera_id}
                    onValueChange={(value) => setNewEquipo(prev => ({ ...prev, salmonera_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar salmonera..." />
                    </SelectTrigger>
                    <SelectContent>
                      {salmoneras.map((salmonera) => (
                        <SelectItem key={salmonera.id} value={salmonera.id}>
                          {salmonera.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateEquipo} className="flex-1">
                  Crear Equipo
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {filteredEquipos.map((equipo) => (
          <Card key={equipo.id} className="ios-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {equipo.nombre}
                  <Badge variant="outline">
                    {equipo.miembros?.length || 0} miembros
                  </Badge>
                </CardTitle>
                <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedEquipo(equipo.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar Miembro
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Tipo de Miembro</Label>
                        <Select
                          value={newMember.tipo}
                          onValueChange={(value) => setNewMember(prev => ({ ...prev, tipo: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="existing">Usuario Existente</SelectItem>
                            <SelectItem value="invite">Invitar por Email</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Rol en el Equipo *</Label>
                        <Select
                          value={newMember.rol_equipo}
                          onValueChange={(value) => setNewMember(prev => ({ ...prev, rol_equipo: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar rol..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                            <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newMember.tipo === 'existing' ? (
                        <div>
                          <Label>Usuario *</Label>
                          <Select
                            value={newMember.usuario_id}
                            onValueChange={(value) => setNewMember(prev => ({ ...prev, usuario_id: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar usuario..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableUsers.map((usuario) => (
                                <SelectItem key={usuario.usuario_id} value={usuario.usuario_id}>
                                  {usuario.nombre} {usuario.apellido} - {usuario.rol}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <>
                          <div>
                            <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                            <Input
                              id="nombre_completo"
                              value={newMember.nombre_completo}
                              onChange={(e) => setNewMember(prev => ({ ...prev, nombre_completo: e.target.value }))}
                              placeholder="Nombre completo del invitado"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newMember.email}
                              onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="email@ejemplo.com"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleAddMember} className="flex-1">
                          {newMember.tipo === 'existing' ? 'Agregar Miembro' : 'Enviar Invitación'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {equipo.descripcion && (
                <p className="text-sm text-zinc-600">{equipo.descripcion}</p>
              )}
            </CardHeader>
            <CardContent>
              {equipo.miembros && equipo.miembros.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Miembro</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Contacto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipo.miembros.map((miembro) => (
                      <TableRow key={miembro.id}>
                        <TableCell>
                          <div className="font-medium">{miembro.nombre_completo}</div>
                          {miembro.matricula && (
                            <div className="text-sm text-zinc-500">Matrícula: {miembro.matricula}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRolBadgeColor(miembro.rol)}>
                            {miembro.rol.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            miembro.invitado 
                              ? miembro.estado_invitacion === 'pendiente' 
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                              : 'bg-green-100 text-green-700'
                          }>
                            {miembro.invitado 
                              ? miembro.estado_invitacion === 'pendiente' ? 'Invitado' : 'Activo'
                              : 'Activo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {miembro.email && (
                            <div className="flex items-center gap-1 text-sm text-zinc-600">
                              <Mail className="w-3 h-3" />
                              {miembro.email}
                            </div>
                          )}
                          {miembro.telefono && (
                            <div className="text-sm text-zinc-600">{miembro.telefono}</div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  No hay miembros en este equipo
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
