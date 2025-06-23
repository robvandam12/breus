
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Building2, 
  Eye, 
  Edit, 
  MapPin,
  Users,
  Phone,
  Mail,
  Calendar
} from "lucide-react";

// Mock data para salmoneras
const mockSalmoneras = [
  {
    id: "sal-001",
    nombre: "AquaChile S.A.",
    rut: "96.888.120-3",
    direccion: "Av. El Bosque Norte 0177, Las Condes",
    telefono: "+56 2 2430 3000",
    email: "contacto@aquachile.cl",
    region: "Región de Los Lagos",
    sitios_activos: 15,
    operaciones_activas: 8,
    estado: "activa",
    created_at: "2020-01-15T10:00:00Z",
    updated_at: "2024-01-15T16:30:00Z"
  },
  {
    id: "sal-002",
    nombre: "Salmones Camanchaca S.A.",
    rut: "76.536.353-9",
    direccion: "Nueva Tajamar 481, Las Condes",
    telefono: "+56 2 2430 4000",
    email: "info@camanchaca.cl",
    region: "Región de Aysén",
    sitios_activos: 12,
    operaciones_activas: 5,
    estado: "activa",
    created_at: "2019-03-20T14:30:00Z",
    updated_at: "2024-01-10T09:15:00Z"
  },
  {
    id: "sal-003",
    nombre: "Multiexport Foods S.A.",
    rut: "96.929.960-0",
    direccion: "Isidora Goyenechea 2800, Las Condes",
    telefono: "+56 2 2476 6000",
    email: "contacto@multiexport.cl",
    region: "Región de Los Lagos",
    sitios_activos: 18,
    operaciones_activas: 12,
    estado: "activa",
    created_at: "2018-07-10T11:20:00Z",
    updated_at: "2024-01-12T14:45:00Z"
  },
  {
    id: "sal-004",
    nombre: "Cermaq Chile S.A.",
    rut: "96.645.830-8",
    direccion: "Rosario Norte 615, Las Condes",
    telefono: "+56 2 2757 7000",
    email: "chile@cermaq.com",
    region: "Región de Aysén",
    sitios_activos: 9,
    operaciones_activas: 3,
    estado: "activa",
    created_at: "2017-11-05T16:00:00Z",
    updated_at: "2024-01-08T10:30:00Z"
  },
  {
    id: "sal-005",
    nombre: "Nova Austral S.A.",
    rut: "76.063.946-0",
    direccion: "Teatinos 280, Santiago Centro",
    telefono: "+56 2 2367 2000",
    email: "info@novaustral.cl",
    region: "Región de Magallanes",
    sitios_activos: 6,
    operaciones_activas: 2,
    estado: "inactiva",
    created_at: "2021-02-18T09:45:00Z",
    updated_at: "2024-01-05T13:20:00Z"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'activa':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Activa</Badge>;
    case 'inactiva':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactiva</Badge>;
    case 'suspendida':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Suspendida</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const SalmoneasDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  const filteredData = mockSalmoneras.filter(salmonera => {
    const matchesSearch = salmonera.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salmonera.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salmonera.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || salmonera.estado === statusFilter;
    const matchesRegion = regionFilter === 'all' || salmonera.region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Salmoneras</p>
                <p className="text-2xl font-bold">{mockSalmoneras.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold">
                  {mockSalmoneras.filter(s => s.estado === 'activa').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sitios</p>
                <p className="text-2xl font-bold">
                  {mockSalmoneras.reduce((acc, s) => acc + s.sitios_activos, 0)}
                </p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Operaciones Activas</p>
                <p className="text-2xl font-bold">
                  {mockSalmoneras.reduce((acc, s) => acc + s.operaciones_activas, 0)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y acciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Salmoneras Registradas
            </CardTitle>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nueva Salmonera
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, RUT o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
                <SelectItem value="suspendida">Suspendida</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                <SelectItem value="Región de Los Lagos">Los Lagos</SelectItem>
                <SelectItem value="Región de Aysén">Aysén</SelectItem>
                <SelectItem value="Región de Magallanes">Magallanes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla usando el componente Table estándar */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Sitios</TableHead>
                  <TableHead>Operaciones</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((salmonera) => (
                  <TableRow key={salmonera.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{salmonera.nombre}</div>
                        <div className="text-sm text-gray-500">RUT: {salmonera.rut}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {salmonera.telefono}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {salmonera.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{salmonera.region}</div>
                        <div className="text-sm text-gray-500 max-w-48 truncate">
                          {salmonera.direccion}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {salmonera.sitios_activos}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {salmonera.operaciones_activas}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(salmonera.estado)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron salmoneras que coincidan con los filtros.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
