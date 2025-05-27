
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteContratistaDialog } from "./DeleteContratistaDialog";
import { Edit, Trash2, Eye } from "lucide-react";

interface Contratista {
  id: string;
  nombre: string;
  rut: string;
  email?: string;
  telefono?: string;
  direccion: string;
  estado: string;
  especialidades?: string[];
  certificaciones?: string[];
  created_at: string;
  updated_at: string;
}

interface ContratistaTableViewProps {
  contratistas: Contratista[];
  onEdit: (contratista: Contratista) => void;
  onDelete: (id: string) => Promise<void>;
  onSelect: (contratista: Contratista) => void;
}

export const ContratistaTableView = ({ contratistas, onEdit, onDelete, onSelect }: ContratistaTableViewProps) => {
  const getEstadoBadge = (estado: string) => {
    const colors = {
      'activo': 'bg-green-100 text-green-700',
      'inactivo': 'bg-gray-100 text-gray-700',
      'suspendido': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Especialidades</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratistas.map((contratista) => (
            <TableRow key={contratista.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{contratista.nombre}</div>
                  <div className="text-sm text-gray-500">{contratista.direccion}</div>
                </div>
              </TableCell>
              <TableCell>{contratista.rut}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {contratista.email && <div>{contratista.email}</div>}
                  {contratista.telefono && <div>{contratista.telefono}</div>}
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
                <Badge className={getEstadoBadge(contratista.estado)}>
                  {contratista.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(contratista)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(contratista)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contratista.id)}
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
    </>
  );
};
