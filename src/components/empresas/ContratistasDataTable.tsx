
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Building, Users, Phone, Mail, Edit, Eye } from "lucide-react";
import { useContratistas } from "@/hooks/useContratistas";

export const ContratistasDataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { contratistas, isLoading } = useContratistas();

  const filteredContratistas = contratistas.filter(contratista =>
    contratista.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contratista.rut.toLowerCase().includes(searchTerm.toLowerCase())
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
                <p className="text-sm text-gray-600">Total Contratistas</p>
                <p className="text-2xl font-bold">{contratistas.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold">
                  {contratistas.filter(c => c.estado === 'activo').length}
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
                <p className="text-sm text-gray-600">Con Certificaciones</p>
                <p className="text-2xl font-bold">
                  {contratistas.filter(c => c.certificaciones && c.certificaciones.length > 0).length}
                </p>
              </div>
              <Badge className="w-8 h-8 bg-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Especialidades</p>
                <p className="text-2xl font-bold">
                  {contratistas.reduce((acc, c) => acc + (c.especialidades?.length || 0), 0)}
                </p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Contratistas Registrados
            </CardTitle>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Contratista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o RUT..."
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
                <TableHead>Empresa</TableHead>
                <TableHead>RUT</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Certificaciones</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratistas.map((contratista) => (
                <TableRow key={contratista.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contratista.nombre}</div>
                      <div className="text-sm text-gray-500">{contratista.direccion}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{contratista.rut}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {contratista.telefono && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {contratista.telefono}
                        </div>
                      )}
                      {contratista.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {contratista.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contratista.especialidades?.slice(0, 2).map((esp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {esp}
                        </Badge>
                      ))}
                      {(contratista.especialidades?.length || 0) > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(contratista.especialidades?.length || 0) - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {contratista.certificaciones?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        contratista.estado === 'activo' 
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }
                    >
                      {contratista.estado}
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

          {filteredContratistas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron contratistas que coincidan con la búsqueda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
