
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useCentros } from "@/hooks/useCentros";
import { useContratistas } from "@/hooks/useContratistas";
import { useToast } from "@/hooks/use-toast";

interface CreateOperacionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateOperacionForm = ({ onSubmit, onCancel }: CreateOperacionFormProps) => {
  const { toast } = useToast();
  const { salmoneras } = useSalmoneras();
  const { centros } = useCentros();
  const { contratistas } = useContratistas();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    centro_id: '',
    salmonera_id: '',
    contratista_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    tareas: '',
    estado: 'activa'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nombre || !formData.fecha_inicio) {
      toast({
        title: "Campos requeridos",
        description: "Código, nombre y fecha de inicio son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        centro_id: formData.centro_id || null,
        salmonera_id: formData.salmonera_id || null,
        contratista_id: formData.contratista_id || null,
        fecha_fin: formData.fecha_fin || null,
        tareas: formData.tareas || null,
      };

      await onSubmit(dataToSubmit);
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating operation:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nueva Operación</CardTitle>
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
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange('estado', value)}
              >
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
          </div>

          <div>
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salmonera_id">Salmonera</Label>
              <Select
                value={formData.salmonera_id || "empty"}
                onValueChange={(value) => handleChange('salmonera_id', value === 'empty' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">Sin asignar</SelectItem>
                  {salmoneras.map((salmonera) => (
                    <SelectItem key={salmonera.id} value={salmonera.id}>
                      {salmonera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="centro_id">Centro</Label>
              <Select
                value={formData.centro_id || "empty"}
                onValueChange={(value) => handleChange('centro_id', value === 'empty' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar centro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">Sin asignar</SelectItem>
                  {centros.map((centro) => (
                    <SelectItem key={centro.id} value={centro.id}>
                      {centro.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="contratista_id">Contratista</Label>
            <Select
              value={formData.contratista_id || "empty"}
              onValueChange={(value) => handleChange('contratista_id', value === 'empty' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar contratista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empty">Sin asignar</SelectItem>
                {contratistas.map((contratista) => (
                  <SelectItem key={contratista.id} value={contratista.id}>
                    {contratista.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => handleChange('fecha_fin', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Descripción de Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas}
              onChange={(e) => handleChange('tareas', e.target.value)}
              placeholder="Descripción detallada de las tareas a realizar..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creando...' : 'Crear Operación'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
