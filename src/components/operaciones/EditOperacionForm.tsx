
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useOperaciones, OperacionFormData } from "@/hooks/useOperaciones";
import { useToast } from "@/hooks/use-toast";

interface EditOperacionFormProps {
  operacion: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditOperacionForm = ({ operacion, onSubmit, onCancel }: EditOperacionFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OperacionFormData>({
    codigo: operacion.codigo || '',
    nombre: operacion.nombre || '',
    sitio_id: operacion.sitio_id || '',
    servicio_id: operacion.servicio_id || '',
    salmonera_id: operacion.salmonera_id || '',
    contratista_id: operacion.contratista_id || '',
    fecha_inicio: operacion.fecha_inicio || '',
    fecha_fin: operacion.fecha_fin || '',
    tareas: operacion.tareas || '',
    estado: operacion.estado || 'activa'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error updating operation:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la operación.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof OperacionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="ios-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Operación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                className="ios-input"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange('estado', value as any)}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="ios-input"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                className="ios-input"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin || ''}
                onChange={(e) => handleChange('fecha_fin', e.target.value)}
                className="ios-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Descripción de Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas || ''}
              onChange={(e) => handleChange('tareas', e.target.value)}
              className="ios-input min-h-[100px]"
              placeholder="Describa las tareas a realizar..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="ios-button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="ios-button bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Operación'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
