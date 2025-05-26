
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Building2, Plus, Trash2, Link } from "lucide-react";
import { useSalmoneraContratista } from "@/hooks/useSalmoneraContratista";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { format } from "date-fns";

interface AsociacionSalmonerasProps {
  contratistaId: string;
  contratistaName: string;
}

export const AsociacionSalmoneras = ({ contratistaId, contratistaName }: AsociacionSalmonerasProps) => {
  const { asociaciones, isLoading, createAsociacion, removeAsociacion } = useSalmoneraContratista();
  const { salmoneras } = useSalmoneras();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSalmonera, setSelectedSalmonera] = useState('');

  const contratistaAsociaciones = asociaciones.filter(a => a.contratista_id === contratistaId);

  const availableSalmoneras = salmoneras.filter(s => 
    !contratistaAsociaciones.some(a => a.salmonera_id === s.id)
  );

  const salmoneraOptions = availableSalmoneras.map(s => ({
    value: s.id,
    label: `${s.nombre} (${s.rut})`,
  }));

  const handleCreateAsociacion = () => {
    if (selectedSalmonera) {
      createAsociacion({
        salmonera_id: selectedSalmonera,
        contratista_id: contratistaId,
      });
      setSelectedSalmonera('');
      setIsDialogOpen(false);
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    const colorMap: Record<string, string> = {
      activa: 'bg-green-100 text-green-700',
      inactiva: 'bg-gray-100 text-gray-700',
      suspendida: 'bg-red-100 text-red-700',
    };
    return colorMap[estado] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Salmoneras Asociadas
            <Badge variant="outline" className="ml-2">
              {contratistaAsociaciones.length} asociaciones
            </Badge>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Asociar Salmonera
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Asociar Salmonera
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-zinc-600">
                  Asociar una salmonera a <strong>{contratistaName}</strong>
                </p>
                
                <div>
                  <Label htmlFor="salmonera">Salmonera *</Label>
                  <EnhancedSelect
                    value={selectedSalmonera}
                    onValueChange={setSelectedSalmonera}
                    options={salmoneraOptions}
                    placeholder="Seleccionar salmonera..."
                    emptyMessage="No hay salmoneras disponibles para asociar"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCreateAsociacion} 
                    disabled={!selectedSalmonera}
                    className="flex-1"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Crear Asociación
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {contratistaAsociaciones.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay salmoneras asociadas</h3>
            <p className="text-zinc-500 mb-4">Comience asociando la primera salmonera a este contratista</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Asociar Salmonera
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salmonera</TableHead>
                <TableHead>RUT</TableHead>
                <TableHead>Fecha Asociación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contratistaAsociaciones.map((asociacion) => (
                <TableRow key={asociacion.id}>
                  <TableCell>
                    <div className="font-medium">{asociacion.salmonera?.nombre}</div>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {asociacion.salmonera?.rut}
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {format(new Date(asociacion.fecha_asociacion), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getEstadoBadgeColor(asociacion.estado)}>
                      {asociacion.estado.charAt(0).toUpperCase() + asociacion.estado.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeAsociacion(asociacion.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
