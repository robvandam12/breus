
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Mail, UserCheck, Clock, Edit, Trash2 } from "lucide-react";
import { usePoolPersonal } from "@/hooks/usePoolPersonal";
import { useToast } from "@/hooks/use-toast";

export const PoolPersonalManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteType, setInviteType] = useState<'existing' | 'new'>('new');
  const [inviteData, setInviteData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'buzo' as 'supervisor' | 'buzo',
    matricula: '',
    especialidades: [] as string[],
    certificaciones: [] as string[]
  });

  const { personal, isLoading, addPersonal, invitePersonal, updateDisponibilidad } = usePoolPersonal();
  const { toast } = useToast();

  const filteredPersonal = personal.filter(person => 
    person.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.matricula?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const supervisores = filteredPersonal.filter(p => p.rol === 'supervisor');
  const buzos = filteredPersonal.filter(p => p.rol === 'buzo');

  const handleInvite = async () => {
    try {
      if (inviteType === 'new') {
        await invitePersonal({
          ...inviteData,
          tipo_empresa: 'salmonera',
          empresa_id: 'salmonera-id' // This should come from the current user's context
        });
      } else {
        await addPersonal({
          ...inviteData,
          tipo_empresa: 'salmonera',
          empresa_id: 'salmonera-id'
        });
      }
      
      setIsInviteDialogOpen(false);
      setInviteData({
        email: '',
        nombre: '',
        apellido: '',
        rol: 'buzo',
        matricula: '',
        especialidades: [],
        certificaciones: []
      });
    } catch (error) {
      console.error('Error inviting personal:', error);
    }
  };

  const handleToggleDisponibilidad = async (personalId: string, disponible: boolean) => {
    try {
      await updateDisponibilidad(personalId, disponible);
      toast({
        title: "Disponibilidad actualizada",
        description: `La disponibilidad ha sido ${disponible ? 'activada' : 'desactivada'}.`,
      });
    } catch (error) {
      console.error('Error updating disponibilidad:', error);
    }
  };

  const getRoleBadge = (rol: string) => {
    return rol === 'supervisor' ? 
      <Badge className="bg-purple-100 text-purple-700">Supervisor</Badge> :
      <Badge className="bg-teal-100 text-teal-700">Buzo</Badge>;
  };

  const getStatusBadge = (disponible: boolean, invitado?: boolean) => {
    if (invitado) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3 mr-1" />
        Invitación pendiente
      </Badge>;
    }
    
    return disponible ? 
      <Badge className="bg-green-100 text-green-700">
        <UserCheck className="w-3 h-3 mr-1" />
        Disponible
      </Badge> :
      <Badge variant="outline" className="bg-red-100 text-red-700">
        Ocupado
      </Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando pool de personal...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Pool de Personal</h2>
          <p className="text-zinc-500">Gestiona supervisores y buzos de tu salmonera</p>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Personal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar al Pool de Personal</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Tipo de Invitación</Label>
                <Select value={inviteType} onValueChange={(value: 'existing' | 'new') => setInviteType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Invitar nuevo usuario por email</SelectItem>
                    <SelectItem value="existing">Agregar usuario existente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={inviteData.nombre}
                    onChange={(e) => setInviteData({...inviteData, nombre: e.target.value})}
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={inviteData.apellido}
                    onChange={(e) => setInviteData({...inviteData, apellido: e.target.value})}
                    placeholder="Pérez"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  placeholder="juan.perez@empresa.cl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rol</Label>
                  <Select value={inviteData.rol} onValueChange={(value: 'supervisor' | 'buzo') => setInviteData({...inviteData, rol: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="buzo">Buzo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={inviteData.matricula}
                    onChange={(e) => setInviteData({...inviteData, matricula: e.target.value})}
                    placeholder="BZ-12345"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleInvite}>
                  <Mail className="w-4 h-4 mr-2" />
                  {inviteType === 'new' ? 'Enviar Invitación' : 'Agregar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nombre, email o matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todos">Todos ({personal.length})</TabsTrigger>
          <TabsTrigger value="supervisores">Supervisores ({supervisores.length})</TabsTrigger>
          <TabsTrigger value="buzos">Buzos ({buzos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Personal</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonal.map((person) => (
                  <TableRow key={person.usuario_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{person.nombre} {person.apellido}</div>
                          <div className="text-sm text-zinc-500">{person.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(person.rol)}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{person.matricula || 'N/A'}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(person.disponible || false, person.invitado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleDisponibilidad(person.usuario_id, !person.disponible)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="supervisores">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supervisores.map((person) => (
                  <TableRow key={person.usuario_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">{person.nombre} {person.apellido}</div>
                          <div className="text-sm text-zinc-500">{person.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{person.matricula || 'N/A'}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(person.disponible || false, person.invitado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleDisponibilidad(person.usuario_id, !person.disponible)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="buzos">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buzo</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buzos.map((person) => (
                  <TableRow key={person.usuario_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-teal-600" />
                        </div>
                        <div>
                          <div className="font-medium">{person.nombre} {person.apellido}</div>
                          <div className="text-sm text-zinc-500">{person.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{person.matricula || 'N/A'}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(person.disponible || false, person.invitado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleDisponibilidad(person.usuario_id, !person.disponible)}
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
