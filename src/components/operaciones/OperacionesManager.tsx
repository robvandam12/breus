import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, FileText, PlusCircle, CheckCircle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

interface OperacionesManagerProps {
  onCreateHPT: (operacionId: string) => void;
  onCreateAnexoBravo: (operacionId: string) => void;
}

export const OperacionesManager = ({ onCreateHPT, onCreateAnexoBravo }: OperacionesManagerProps) => {
  const { operaciones, isLoading } = useOperaciones();

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activa': 'bg-green-100 text-green-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700',
      'planificada': 'bg-yellow-100 text-yellow-700'
    };
    return variants[estado as keyof typeof variants] || 'bg-gray-100 text-gray-700';
  };

  const hasHPT = (operacionId: string) => {
    // TODO: Check if HPT exists for this operation
    return Math.random() > 0.5; // Placeholder
  };

  const hasAnexoBravo = (operacionId: string) => {
    // TODO: Check if Anexo Bravo exists for this operation
    return Math.random() > 0.5; // Placeholder
  };

  if (isLoading) {
    return <div>Cargando operaciones...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Operación</TableHead>
          <TableHead>Fechas</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Documentos</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operaciones.map((operacion) => (
          <TableRow key={operacion.id}>
            <TableCell>
              <div>
                <div className="font-medium">{operacion.nombre}</div>
                <div className="text-sm text-zinc-500">{operacion.codigo}</div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                <div>Inicio: {new Date(operacion.fecha_inicio).toLocaleDateString()}</div>
                {operacion.fecha_fin && (
                  <div className="text-zinc-500">
                    Fin: {new Date(operacion.fecha_fin).toLocaleDateString()}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getEstadoBadge(operacion.estado)}>
                {operacion.estado}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {hasHPT(operacion.id) ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    HPT
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCreateHPT(operacion.id)}
                    className="h-6 px-2 text-xs"
                  >
                    <PlusCircle className="w-3 h-3 mr-1" />
                    HPT
                  </Button>
                )}
                
                {hasAnexoBravo(operacion.id) ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Anexo
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCreateAnexoBravo(operacion.id)}
                    className="h-6 px-2 text-xs"
                  >
                    <PlusCircle className="w-3 h-3 mr-1" />
                    Anexo
                  </Button>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
