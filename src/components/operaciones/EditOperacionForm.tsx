
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Save, X } from "lucide-react";

interface EditOperacionFormProps {
  operacion: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const EditOperacionForm = ({ operacion, onSubmit, onCancel }: EditOperacionFormProps) => {
  const [formData, setFormData] = useState({
    nombre: operacion.nombre || '',
    codigo: operacion.codigo || '',
    tareas: operacion.tareas || '',
    fecha_inicio: operacion.fecha_inicio || '',
    fecha_fin: operacion.fecha_fin || '',
    estado: operacion.estado || 'activa'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Editar Operación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre de la Operación</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Ingrese el nombre de la operación"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="Ingrese el código"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Descripción de Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas}
              onChange={(e) => handleChange('tareas', e.target.value)}
              placeholder="Describa las tareas a realizar"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin (Opcional)</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => handleChange('fecha_fin', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="estado">Estado de la Operación</Label>
            <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
              <SelectTrigger>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
