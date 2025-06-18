
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { toast } from "@/hooks/use-toast";

export interface CreateOperacionFormProps {
  onClose: () => void;
  onSubmitOverride?: (formData: any) => Promise<any>;
}

export const CreateOperacionForm = ({ onClose, onSubmitOverride }: CreateOperacionFormProps) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tareas: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activa' as const,
    salmonera_id: '',
    contratista_id: '',
    servicio_id: ''
  });

  const { createOperacion } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();

  // Mock servicios data for now
  const servicios = [
    { id: '1', nombre: 'Mantenimiento de Redes' },
    { id: '2', nombre: 'Inspección de Cascos' },
    { id: '3', nombre: 'Limpieza de Fondos' },
    { id: '4', nombre: 'Soldadura Subacuática' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (onSubmitOverride) {
        await onSubmitOverride(formData);
      } else {
        await createOperacion(formData);
        toast({
          title: "Operación creada",
          description: "La operación ha sido creada exitosamente.",
        });
      }
      onClose();
    } catch (error) {
      console.error('Error creating operacion:', error);
      if (!onSubmitOverride) {
        toast({
          title: "Error",
          description: "No se pudo crear la operación.",
          variant: "destructive",
        });
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="Código de la operación"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Nombre de la operación"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tareas">Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas}
              onChange={(e) => handleChange('tareas', e.target.value)}
              placeholder="Descripción de las tareas a realizar"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => handleChange('fecha_fin', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Salmonera</Label>
              <Select value={formData.salmonera_id} onValueChange={(value) => handleChange('salmonera_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera" />
                </SelectTrigger>
                <SelectContent>
                  {salmoneras?.map((salmonera) => (
                    <SelectItem key={salmonera.id} value={salmonera.id}>
                      {salmonera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contratista</Label>
              <Select value={formData.contratista_id} onValueChange={(value) => handleChange('contratista_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista" />
                </SelectTrigger>
                <SelectContent>
                  {contratistas?.map((contratista) => (
                    <SelectItem key={contratista.id} value={contratista.id}>
                      {contratista.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Servicio</Label>
              <Select value={formData.servicio_id} onValueChange={(value) => handleChange('servicio_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {servicios?.map((servicio) => (
                    <SelectItem key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Operación
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
