
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, MapPin } from "lucide-react";
import type { Centro } from "@/hooks/useCentros";

interface CentroTableViewProps {
  centros: Centro[];
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export const CentroTableView = ({ centros, onEdit, onDelete }: CentroTableViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Centros Registrados
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            {centros.map((centro) => (
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
                    <Button variant="ghost" size="sm" onClick={() => onEdit(centro.id, centro)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(centro.id)}
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
  );
};
