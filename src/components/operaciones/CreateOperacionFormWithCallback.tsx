
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useOperaciones } from '@/hooks/useOperaciones';
import { toast } from '@/hooks/use-toast';

interface CreateOperacionFormWithCallbackProps {
  onClose: () => void;
  onSuccess: (operacionId: string) => void;
  initialData?: any;
  onDataChange?: (data: any) => void;
}

export const CreateOperacionFormWithCallback = ({ 
  onClose, 
  onSuccess, 
  initialData = {},
  onDataChange 
}: CreateOperacionFormWithCallbackProps) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    codigo: initialData.codigo || '',
    tareas: initialData.tareas || '',
    fecha_inicio: initialData.fecha_inicio || '',
    fecha_fin: initialData.fecha_fin || '',
    estado: initialData.estado || 'activa',
    ...initialData
  });

  const { createOperacion, isCreating } = useOperaciones();

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.codigo || !formData.fecha_inicio) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      const newOperacion = await createOperacion(formData);
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
      onSuccess(newOperacion.id);
    } catch (error) {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nueva Operación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Código *</label>
              <Input
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="Ej: OP-2024-001"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select 
                value={formData.estado} 
                onValueChange={(value) => handleInputChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue />
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de la Operación *</label>
            <Input
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Nombre descriptivo de la operación"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tareas</label>
            <Textarea
              value={formData.tareas}
              onChange={(e) => handleInputChange('tareas', e.target.value)}
              placeholder="Descripción de las tareas a realizar..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Inicio *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.fecha_inicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fecha_inicio ? format(new Date(formData.fecha_inicio), "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fecha_inicio ? new Date(formData.fecha_inicio) : undefined}
                    onSelect={(date) => handleInputChange('fecha_inicio', date ? format(date, 'yyyy-MM-dd') : '')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de Fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.fecha_fin && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fecha_fin ? format(new Date(formData.fecha_fin), "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fecha_fin ? new Date(formData.fecha_fin) : undefined}
                    onSelect={(date) => handleInputChange('fecha_fin', date ? format(date, 'yyyy-MM-dd') : '')}
                    initialFocus
                    disabled={(date) =>
                      formData.fecha_inicio ? date < new Date(formData.fecha_inicio) : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? 'Creando...' : 'Crear Operación'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
