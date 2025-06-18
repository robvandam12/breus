
import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, Search, Eye, Edit, Trash2, Workflow, Play } from "lucide-react";
import type { OperacionConRelaciones } from "@/hooks/useOperaciones";

interface OperacionesTableProps {
  operaciones: OperacionConRelaciones[];
  onViewDetail: (operacion: OperacionConRelaciones) => void;
  onEdit: (operacion: OperacionConRelaciones) => void;
  onDelete: (operacionId: string) => void;
  onStartWizard?: (operacionId?: string) => void;
  onCreateInmersion?: (operacionId: string) => void;
}

export const OperacionesTable = ({ 
  operaciones, 
  onViewDetail, 
  onEdit, 
  onDelete, 
  onStartWizard,
  onCreateInmersion 
}: OperacionesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof OperacionConRelaciones>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filtrar y ordenar operaciones
  const filteredAndSortedOperaciones = useMemo(() => {
    let filtered = operaciones.filter(op => 
      op.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.salmoneras?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.sitios?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [operaciones, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof OperacionConRelaciones) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activa': 'default',
      'pausada': 'secondary',
      'completada': 'outline',
      'cancelada': 'destructive'
    } as const;
    
    return variants[estado as keyof typeof variants] || 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Operaciones</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar operaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSort('codigo')}
                    className="font-medium"
                  >
                    Código
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSort('nombre')}
                    className="font-medium"
                  >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Salmonera</TableHead>
                <TableHead>Sitio</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSort('estado')}
                    className="font-medium"
                  >
                    Estado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSort('fecha_inicio')}
                    className="font-medium"
                  >
                    Fecha Inicio
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedOperaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron operaciones
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedOperaciones.map((operacion) => (
                  <TableRow key={operacion.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {operacion.codigo}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{operacion.nombre}</div>
                        {operacion.tareas && (
                          <div className="text-sm text-muted-foreground truncate max-w-48">
                            {operacion.tareas}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {operacion.salmoneras?.nombre || 'No asignada'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {operacion.sitios?.nombre || 'No asignado'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadge(operacion.estado)}>
                        {operacion.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => onViewDetail(operacion)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(operacion)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          {onStartWizard && (
                            <DropdownMenuItem onClick={() => onStartWizard(operacion.id)}>
                              <Workflow className="mr-2 h-4 w-4" />
                              Wizard
                            </DropdownMenuItem>
                          )}
                          {onCreateInmersion && (
                            <DropdownMenuItem onClick={() => onCreateInmersion(operacion.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              Crear inmersión
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => onDelete(operacion.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
