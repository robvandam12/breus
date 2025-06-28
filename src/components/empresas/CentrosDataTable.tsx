
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MapPin, Building, Eye, Edit, Users } from "lucide-react";
import { useCentros } from "@/hooks/useCentros";

export const CentrosDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { centros, isLoading } = useCentros();

  const filteredCentros = centros.filter(centro =>
    centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Centros</p>
                <p className="text-2xl font-bold">{centros.length}</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold">
                  {centros.filter(c => c.estado === 'activo').length}
                </p>
              </div>
              <Building className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Capacidad Total</p>
                <p className="text-2xl font-bold">
                  {centros.reduce((acc, c) => acc + (c.capacidad_jaulas || 0), 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prof. Promedio</p>
                <p className="text-2xl font-bold">
                  {centros.length > 0 
                    ? Math.round(centros.reduce((acc, c) => acc + (c.profundidad_maxima || 0), 0) / centros.length)
                    : 0
                  }m
                </p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Centros Registrados
            </CardTitle>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Centro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, código o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centro</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Profundidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCentros.map((centro) => (
                <TableRow key={centro.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{centro.nombre}</div>
                      <div className="text-sm text-gray-500">{centro.region}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{centro.codigo}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{centro.ubicacion}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{centro.capacidad_jaulas || 0} jaulas</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{centro.profundidad_maxima || 0}m</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        centro.estado === 'activo' 
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }
                    >
                      {centro.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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

          {filteredCentros.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron centros que coincidan con la búsqueda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
