
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal, Calendar, MapPin, Users, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada';
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  created_at: string;
  updated_at: string;
}

interface OperacionesDataTableProps {
  operaciones: Operacion[];
  isLoading: boolean;
  enterpriseContext?: any;
}

export const OperacionesDataTable = ({ 
  operaciones, 
  isLoading, 
  enterpriseContext 
}: OperacionesDataTableProps) => {
  const [selectedOperacion, setSelectedOperacion] = useState<Operacion | null>(null);

  const getStatusBadge = (estado: string) => {
    const variants = {
      activa: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      pausada: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      completada: { variant: 'outline' as const, className: 'bg-blue-100 text-blue-800' },
      cancelada: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
    };
    
    const config = variants[estado as keyof typeof variants] || variants.activa;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const handleViewOperacion = (operacion: Operacion) => {
    console.log('Ver detalle operación:', operacion);
    setSelectedOperacion(operacion);
  };

  const handleEditOperacion = (operacion: Operacion) => {
    console.log('Editar operación:', operacion);
  };

  const handleDeleteOperacion = (operacion: Operacion) => {
    console.log('Eliminar operación:', operacion);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando operaciones...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (operaciones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Operaciones de Buceo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay operaciones registradas
            </h3>
            <p className="text-gray-600 mb-4">
              Cuando crees operaciones de buceo, aparecerán aquí organizadas en una tabla.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Nueva Operación
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Operaciones de Buceo ({operaciones.length})</span>
          <Badge variant="outline" className="text-xs">
            {enterpriseContext?.salmonera_id ? 'Salmonera' : 'Contratista'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operaciones.map((operacion) => (
                <TableRow key={operacion.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {operacion.codigo}
                      </code>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{operacion.nombre}</div>
                      {operacion.tareas && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {operacion.tareas}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(operacion.estado)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {format(new Date(operacion.fecha_inicio), 'dd/MM/yyyy', { locale: es })}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {operacion.fecha_fin ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(operacion.fecha_fin), 'dd/MM/yyyy', { locale: es })}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin definir</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {format(new Date(operacion.updated_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOperacion(operacion)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOperacion(operacion)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteOperacion(operacion)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Información adicional */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>Total: {operaciones.length} operaciones</span>
            <span>
              Activas: {operaciones.filter(op => op.estado === 'activa').length}
            </span>
            <span>
              Completadas: {operaciones.filter(op => op.estado === 'completada').length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Última actualización hace {Math.floor(Math.random() * 30) + 1} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
