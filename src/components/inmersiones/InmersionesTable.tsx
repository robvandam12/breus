
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Trash2 } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { type Inmersion } from "@/hooks/useInmersiones";
import { useAuth } from "@/hooks/useAuth";

interface InmersionesTableProps {
  inmersiones: Inmersion[];
  onEdit: (inmersion: Inmersion) => void;
  onView: (inmersion: Inmersion) => void;
  onDelete: (inmersion: Inmersion) => void;
}

export const InmersionesTable = ({ inmersiones, onEdit, onView, onDelete }: InmersionesTableProps) => {
  const { profile } = useAuth();

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'planificada': return 'bg-blue-100 text-blue-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canEdit = (inmersion: Inmersion) => {
    return profile?.role === 'superuser' || 
           profile?.role === 'admin_salmonera' || 
           profile?.role === 'admin_servicio' ||
           inmersion.supervisor_id === profile?.usuario_id;
  };

  const canDelete = (inmersion: Inmersion) => {
    return profile?.role === 'superuser' || 
           profile?.role === 'admin_salmonera' || 
           profile?.role === 'admin_servicio';
  };

  // Función segura para acceder a propiedades de operación
  const getOperationDisplay = (inmersion: Inmersion) => {
    if (inmersion.is_independent) {
      return 'Inmersión Independiente';
    }
    
    // Acceso seguro a las propiedades de la operación
    const operacionNombre = inmersion.operacion_nombre || 
                           inmersion.operacion?.nombre || 
                           'Sin operación';
    
    const operacionCodigo = inmersion.operacion?.codigo;
    
    if (operacionCodigo) {
      return `${operacionCodigo} - ${operacionNombre}`;
    }
    
    return operacionNombre;
  };

  const getCompanyDisplay = (inmersion: Inmersion) => {
    if (inmersion.operacion?.salmoneras?.nombre) {
      return inmersion.operacion.salmoneras.nombre;
    }
    
    if (inmersion.operacion?.contratistas?.nombre) {
      return inmersion.operacion.contratistas.nombre;
    }
    
    if (inmersion.operacion?.centros?.nombre) {
      return inmersion.operacion.centros.nombre;
    }
    
    return 'No especificado';
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inmersiones.map((inmersion) => (
                <TableRow key={inmersion.inmersion_id}>
                  <TableCell className="font-medium">
                    {inmersion.codigo}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-48 truncate">
                      {getOperationDisplay(inmersion)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(inmersion.fecha_inmersion), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-40 truncate">
                      {inmersion.objetivo}
                    </div>
                  </TableCell>
                  <TableCell>
                    {inmersion.supervisor || 'No asignado'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(inmersion.estado)}>
                      {inmersion.estado.charAt(0).toUpperCase() + inmersion.estado.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-32 truncate text-sm text-gray-600">
                      {getCompanyDisplay(inmersion)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(inmersion)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canEdit(inmersion) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(inmersion)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete(inmersion) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(inmersion)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
