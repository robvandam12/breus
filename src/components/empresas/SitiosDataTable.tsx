
import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building, Eye, Edit, Trash2, Search, Plus } from "lucide-react";
import { useCentros } from "@/hooks/useCentros";

export const SitiosDataTable = () => {
  const { centros, isLoading, createCentro, updateCentro, deleteCentro } = useCentros();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCentros = useMemo(() => {
    return centros.filter(centro =>
      centro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centro.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centro.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [centros, searchTerm]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando centros...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Gestión de Centros
            </CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Centro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar centros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centro</TableHead>
                <TableHead>Salmonera</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Características</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCentros.map((centro) => (
                <TableRow key={centro.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{centro.nombre}</div>
                      <div className="text-sm text-gray-500">Código: {centro.codigo}</div>
                    </div>
                  </TableCell>
                   <TableCell>
                     {centro.salmoneras?.[0]?.nombre || 'Sin asignar'}
                   </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate max-w-32">{centro.ubicacion}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={centro.estado === 'activo' ? 'default' : 'secondary'}>
                      {centro.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {centro.profundidad_maxima && (
                        <div>Prof. máx: {centro.profundidad_maxima}m</div>
                      )}
                      {centro.capacidad_jaulas && (
                        <div>Jaulas: {centro.capacidad_jaulas}</div>
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
        </CardContent>
      </Card>
    </div>
  );
};
