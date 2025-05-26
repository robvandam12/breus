
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Plus, Edit, Trash2, Map, Filter, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Sitio {
  id: string;
  codigo: string;
  nombre: string;
  ubicacion: string;
  coordenadas_lat?: number;
  coordenadas_lng?: number;
  profundidad_maxima?: number;
  capacidad_jaulas?: number;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
  salmonera_nombre: string;
  observaciones?: string;
  created_at: string;
}

export default function Sitios() {
  const [sitios, setSitios] = useState<Sitio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSalmonera, setSelectedSalmonera] = useState('all');
  const [selectedEstado, setSelectedEstado] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSitio, setEditingSitio] = useState<Sitio | null>(null);

  if (isLoading) {
    return <SitiosSkeleton />;
  }

  const filteredSitios = sitios.filter(sitio => {
    const matchesSearch = sitio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sitio.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSalmonera = selectedSalmonera === 'all' || sitio.salmonera_nombre === selectedSalmonera;
    const matchesEstado = selectedEstado === 'all' || sitio.estado === selectedEstado;
    
    return matchesSearch && matchesSalmonera && matchesEstado;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Sitios</h1>
          <p className="text-zinc-500">
            Administra centros y barcos de las salmoneras
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Sitio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Sitio</DialogTitle>
            </DialogHeader>
            <SitioForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Sitios</p>
                <p className="text-2xl font-bold">{sitios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold">{sitios.filter(s => s.estado === 'activo').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-600">Mantenimiento</p>
                <p className="text-2xl font-bold">{sitios.filter(s => s.estado === 'mantenimiento').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Con Coordenadas</p>
                <p className="text-2xl font-bold">{sitios.filter(s => s.coordenadas_lat && s.coordenadas_lng).length}</p>
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
                  placeholder="Buscar sitios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedSalmonera} onValueChange={setSelectedSalmonera}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por salmonera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las salmoneras</SelectItem>
                <SelectItem value="AquaChile">AquaChile</SelectItem>
                <SelectItem value="Blumar">Blumar</SelectItem>
                <SelectItem value="Cermaq">Cermaq</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedEstado} onValueChange={setSelectedEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sitios Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sitio</TableHead>
                <TableHead>Salmonera</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Profundidad Máx.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSitios.map((sitio) => (
                <TableRow key={sitio.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{sitio.nombre}</div>
                        <div className="text-xs text-gray-500">{sitio.codigo}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{sitio.salmonera_nombre}</TableCell>
                  <TableCell className="text-gray-600">{sitio.ubicacion}</TableCell>
                  <TableCell className="text-gray-600">
                    {sitio.profundidad_maxima ? `${sitio.profundidad_maxima}m` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={
                        sitio.estado === 'activo' ? 'bg-green-100 text-green-700' :
                        sitio.estado === 'mantenimiento' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {sitio.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSitio(sitio)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSitio} onOpenChange={() => setEditingSitio(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Sitio</DialogTitle>
          </DialogHeader>
          {editingSitio && (
            <SitioForm 
              initialData={editingSitio}
              onClose={() => setEditingSitio(null)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const SitioForm = ({ 
  initialData, 
  onClose, 
  isEditing = false 
}: { 
  initialData?: Sitio; 
  onClose: () => void; 
  isEditing?: boolean;
}) => {
  const [formData, setFormData] = useState({
    codigo: initialData?.codigo || '',
    nombre: initialData?.nombre || '',
    ubicacion: initialData?.ubicacion || '',
    coordenadas_lat: initialData?.coordenadas_lat || 0,
    coordenadas_lng: initialData?.coordenadas_lng || 0,
    profundidad_maxima: initialData?.profundidad_maxima || 0,
    capacidad_jaulas: initialData?.capacidad_jaulas || 0,
    estado: initialData?.estado || 'activo',
    observaciones: initialData?.observaciones || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving sitio:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="codigo">Código *</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
            placeholder="Ej: ST-001"
            required
          />
        </div>
        <div>
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre del sitio"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="ubicacion">Ubicación *</Label>
        <Input
          id="ubicacion"
          value={formData.ubicacion}
          onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
          placeholder="Descripción de la ubicación"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lat">Latitud</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            value={formData.coordenadas_lat}
            onChange={(e) => setFormData({ ...formData, coordenadas_lat: parseFloat(e.target.value) })}
            placeholder="-41.4693"
          />
        </div>
        <div>
          <Label htmlFor="lng">Longitud</Label>
          <Input
            id="lng"
            type="number"
            step="any"
            value={formData.coordenadas_lng}
            onChange={(e) => setFormData({ ...formData, coordenadas_lng: parseFloat(e.target.value) })}
            placeholder="-72.9424"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="profundidad">Profundidad Máxima (m)</Label>
          <Input
            id="profundidad"
            type="number"
            value={formData.profundidad_maxima}
            onChange={(e) => setFormData({ ...formData, profundidad_maxima: parseInt(e.target.value) })}
            placeholder="30"
          />
        </div>
        <div>
          <Label htmlFor="capacidad">Capacidad de Jaulas</Label>
          <Input
            id="capacidad"
            type="number"
            value={formData.capacidad_jaulas}
            onChange={(e) => setFormData({ ...formData, capacidad_jaulas: parseInt(e.target.value) })}
            placeholder="12"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="estado">Estado</Label>
        <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          placeholder="Observaciones adicionales..."
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {isEditing ? 'Actualizar' : 'Crear'} Sitio
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

const SitiosSkeleton = () => (
  <div className="container mx-auto py-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-0">
        <div className="space-y-2 p-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
