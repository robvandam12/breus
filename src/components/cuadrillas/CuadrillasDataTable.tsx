
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Settings, MapPin, Building2 } from "lucide-react";
import { Cuadrilla } from '@/hooks/useCuadrillas';

interface CuadrillasDataTableProps {
  cuadrillas: Cuadrilla[];
  onManageCuadrilla: (cuadrillaId: string) => void;
  showCompanyInfo?: boolean;
}

export const CuadrillasDataTable = ({ 
  cuadrillas, 
  onManageCuadrilla, 
  showCompanyInfo = false 
}: CuadrillasDataTableProps) => {
  
  const getEstadoBadge = (estado: string) => {
    const colors = {
      'disponible': 'bg-green-100 text-green-700 border-green-200',
      'ocupada': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'mantenimiento': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getTipoEmpresaBadge = (tipo: string) => {
    return tipo === 'salmonera' 
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : 'bg-purple-100 text-purple-700 border-purple-200';
  };

  if (cuadrillas.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay cuadrillas</h3>
          <p className="text-gray-500 text-center">
            No se encontraron cuadrillas que coincidan con los filtros seleccionados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cuadrilla</TableHead>
              {showCompanyInfo && <TableHead>Empresa</TableHead>}
              <TableHead>Miembros</TableHead>
              <TableHead>Centro</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cuadrillas.map((cuadrilla) => (
              <TableRow key={cuadrilla.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{cuadrilla.nombre}</div>
                    {cuadrilla.descripcion && (
                      <div className="text-sm text-gray-500">{cuadrilla.descripcion}</div>
                    )}
                  </div>
                </TableCell>
                
                {showCompanyInfo && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">{cuadrilla.empresa_nombre || 'N/A'}</div>
                        <Badge variant="outline" className={getTipoEmpresaBadge(cuadrilla.tipo_empresa)}>
                          {cuadrilla.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                )}

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{cuadrilla.miembros?.length || 0}</span>
                    <span className="text-gray-500">miembros</span>
                  </div>
                  {cuadrilla.miembros && cuadrilla.miembros.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {cuadrilla.miembros.slice(0, 2).map((miembro, index) => (
                        <span key={miembro.id}>
                          {miembro.nombre} {miembro.apellido}
                          {index < Math.min(cuadrilla.miembros!.length - 1, 1) && ', '}
                        </span>
                      ))}
                      {cuadrilla.miembros.length > 2 && (
                        <span> y {cuadrilla.miembros.length - 2} más</span>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {cuadrilla.centro_nombre ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{cuadrilla.centro_nombre}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Sin asignar</span>
                  )}
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className={getEstadoBadge(cuadrilla.estado)}>
                    {cuadrilla.estado.charAt(0).toUpperCase() + cuadrilla.estado.slice(1)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onManageCuadrilla(cuadrilla.id)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Gestionar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
