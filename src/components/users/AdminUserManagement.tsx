
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus,
  Shield,
  Building,
  FileText,
  Calendar,
  Mail,
  Phone
} from "lucide-react";

// Mock data para usuarios completos
const mockUsers = [
  {
    id: "usr-001",
    usuario_id: "usr-001",
    email: "juan.perez@aquachile.cl",
    nombre: "Juan Carlos",
    apellido: "Pérez Morales",
    rol: "supervisor",
    estado: "activo",
    empresa_nombre: "AquaChile S.A.",
    empresa_tipo: "salmonera",
    telefono: "+56 9 8765 4321",
    rut: "12.345.678-9",
    fecha_registro: "2023-01-15T10:00:00Z",
    ultimo_acceso: "2024-01-15T14:30:00Z",
    documentos_creados: {
      hpt: 15,
      anexo_bravo: 12,
      bitacoras: 28,
      inmersiones: 45
    },
    operaciones_supervisadas: 23,
    centro_trabajo: "Centro 15",
    created_at: "2023-01-15T10:00:00Z"
  },
  {
    id: "usr-002",
    usuario_id: "usr-002",
    email: "maria.gonzalez@camanchaca.cl",
    nombre: "María Elena",
    apellido: "González Ruiz",
    rol: "admin_salmonera",
    estado: "activo",
    empresa_nombre: "Salmones Camanchaca S.A.",
    empresa_tipo: "salmonera",
    telefono: "+56 9 7654 3210",
    rut: "11.222.333-4",
    fecha_registro: "2023-02-20T14:15:00Z",
    ultimo_acceso: "2024-01-14T16:45:00Z",
    documentos_creados: {
      hpt: 8,
      anexo_bravo: 6,
      bitacoras: 15,
      inmersiones: 22
    },
    operaciones_supervisadas: 18,
    centro_trabajo: "Centro 8",
    created_at: "2023-02-20T14:15:00Z"
  },
  {
    id: "usr-003",
    usuario_id: "usr-003",
    email: "carlos.rodriguez@multixbuceo.cl",
    nombre: "Carlos Alberto",
    apellido: "Rodríguez Silva",
    rol: "buzo",
    estado: "activo",
    empresa_nombre: "Multix Buceo Ltda.",
    empresa_tipo: "contratista",
    telefono: "+56 9 6543 2109",
    rut: "15.678.901-2",
    fecha_registro: "2023-03-10T09:30:00Z",
    ultimo_acceso: "2024-01-15T08:20:00Z",
    documentos_creados: {
      hpt: 3,
      anexo_bravo: 2,
      bitacoras: 67,
      inmersiones: 89
    },
    operaciones_supervisadas: 0,
    centro_trabajo: "Múltiples centros",
    created_at: "2023-03-10T09:30:00Z"
  },
  {
    id: "usr-004",
    usuario_id: "usr-004",
    email: "ana.henriquez@novaustral.cl",
    nombre: "Ana Patricia",
    apellido: "Henríquez Torres",
    rol: "supervisor",
    estado: "activo",
    empresa_nombre: "Nova Austral S.A.",
    empresa_tipo: "salmonera",
    telefono: "+56 9 5432 1098",
    rut: "14.567.890-1",
    fecha_registro: "2023-04-05T11:20:00Z",
    ultimo_acceso: "2024-01-12T13:15:00Z",
    documentos_creados: {
      hpt: 12,
      anexo_bravo: 10,
      bitacoras: 34,
      inmersiones: 52
    },
    operaciones_supervisadas: 19,
    centro_trabajo: "Centro 12",
    created_at: "2023-04-05T11:20:00Z"
  },
  {
    id: "usr-005",
    usuario_id: "usr-005",
    email: "roberto.moreno@buceoextremo.cl",
    nombre: "Roberto Andrés",
    apellido: "Moreno Vega",
    rol: "admin_servicio",
    estado: "activo",
    empresa_nombre: "Buceo Extremo S.A.",
    empresa_tipo: "contratista",
    telefono: "+56 9 4321 0987",
    rut: "16.789.012-3",
    fecha_registro: "2023-05-12T15:45:00Z",
    ultimo_acceso: "2024-01-13T10:30:00Z",
    documentos_creados: {
      hpt: 7,
      anexo_bravo: 5,
      bitacoras: 41,
      inmersiones: 38
    },
    operaciones_supervisadas: 14,
    centro_trabajo: "Región de Aysén",
    created_at: "2023-05-12T15:45:00Z"
  },
  {
    id: "usr-006",
    usuario_id: "usr-006",
    email: "luis.torres@buceomarin.cl",
    nombre: "Luis Fernando",
    apellido: "Torres Sánchez",
    rol: "buzo",
    estado: "inactivo",
    empresa_nombre: "Buceo Marín Ltda.",
    empresa_tipo: "contratista",
    telefono: "+56 9 3210 9876",
    rut: "17.890.123-4",
    fecha_registro: "2023-06-18T08:10:00Z",
    ultimo_acceso: "2023-12-20T16:45:00Z",
    documentos_creados: {
      hpt: 1,
      anexo_bravo: 1,
      bitacoras: 23,
      inmersiones: 31
    },
    operaciones_supervisadas: 0,
    centro_trabajo: "Múltiples centros",
    created_at: "2023-06-18T08:10:00Z"
  }
];

const getRoleBadge = (rol: string) => {
  const roleConfig = {
    superuser: { label: 'Superuser', className: 'bg-red-100 text-red-800 border-red-200' },
    admin_salmonera: { label: 'Admin Salmonera', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    admin_servicio: { label: 'Admin Servicio', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    supervisor: { label: 'Supervisor', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    buzo: { label: 'Buzo', className: 'bg-green-100 text-green-800 border-green-200' }
  };
  
  const config = roleConfig[rol as keyof typeof roleConfig] || { label: rol, className: 'bg-gray-100 text-gray-800' };
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case 'activo':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>;
    case 'inactivo':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactivo</Badge>;
    case 'suspendido':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Suspendido</Badge>;
    default:
      return <Badge variant="secondary">{estado}</Badge>;
  }
};

export const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.empresa_nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.rol === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.estado === statusFilter;
    const matchesCompany = companyFilter === 'all' || user.empresa_tipo === companyFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesCompany;
  });

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold">
                  {mockUsers.filter(u => u.estado === 'activo').length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Salmoneras</p>
                <p className="text-2xl font-bold">
                  {mockUsers.filter(u => u.empresa_tipo === 'salmonera').length}
                </p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documentos Creados</p>
                <p className="text-2xl font-bold">
                  {mockUsers.reduce((acc, u) => 
                    acc + u.documentos_creados.hpt + u.documentos_creados.anexo_bravo + 
                    u.documentos_creados.bitacoras + u.documentos_creados.inmersiones, 0
                  )}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Usuarios
            </CardTitle>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Nuevo Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, email o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="superuser">Superuser</SelectItem>
                <SelectItem value="admin_salmonera">Admin Salmonera</SelectItem>
                <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="buzo">Buzo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las empresas</SelectItem>
                <SelectItem value="salmonera">Salmoneras</SelectItem>
                <SelectItem value="contratista">Contratistas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla usando el componente Table estándar */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Documentos</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.nombre} {user.apellido}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            RUT: {user.rut}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{user.empresa_nombre}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {user.empresa_tipo}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.centro_trabajo}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.rol)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>HPT: {user.documentos_creados.hpt}</div>
                        <div>Anexos: {user.documentos_creados.anexo_bravo}</div>
                        <div>Bitácoras: {user.documentos_creados.bitacoras}</div>
                        <div>Inmersiones: {user.documentos_creados.inmersiones}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.ultimo_acceso).toLocaleDateString('es-CL')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(user.ultimo_acceso).toLocaleTimeString('es-CL')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getEstadoBadge(user.estado)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron usuarios que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalle de usuario */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalle de Usuario: {selectedUser?.nombre} {selectedUser?.apellido}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información Personal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                      <p className="text-sm">{selectedUser.nombre} {selectedUser.apellido}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-sm">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Teléfono</label>
                      <p className="text-sm">{selectedUser.telefono}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">RUT</label>
                      <p className="text-sm">{selectedUser.rut}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Rol</label>
                      <div className="mt-1">{getRoleBadge(selectedUser.rol)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <div className="mt-1">{getEstadoBadge(selectedUser.estado)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Información de Empresa */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información de Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Empresa</label>
                      <p className="text-sm">{selectedUser.empresa_nombre}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tipo</label>
                      <p className="text-sm capitalize">{selectedUser.empresa_tipo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Centro de Trabajo</label>
                      <p className="text-sm">{selectedUser.centro_trabajo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                      <p className="text-sm">{new Date(selectedUser.fecha_registro).toLocaleDateString('es-CL')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Último Acceso</label>
                      <p className="text-sm">{new Date(selectedUser.ultimo_acceso).toLocaleString('es-CL')}</p>
                    </div>
                    {selectedUser.operaciones_supervisadas > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Operaciones Supervisadas</label>
                        <p className="text-sm">{selectedUser.operaciones_supervisadas}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Estadísticas de Documentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documentos Creados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedUser.documentos_creados.hpt}
                      </div>
                      <div className="text-sm text-gray-600">HPT</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedUser.documentos_creados.anexo_bravo}
                      </div>
                      <div className="text-sm text-gray-600">Anexo Bravo</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedUser.documentos_creados.bitacoras}
                      </div>
                      <div className="text-sm text-gray-600">Bitácoras</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedUser.documentos_creados.inmersiones}
                      </div>
                      <div className="text-sm text-gray-600">Inmersiones</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
