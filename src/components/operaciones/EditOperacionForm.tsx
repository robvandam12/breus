
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Save } from "lucide-react";
import { useOperaciones, Operacion } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";

interface EditOperacionFormProps {
  operacion: Operacion;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditOperacionForm = ({ operacion, onSubmit, onCancel }: EditOperacionFormProps) => {
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    codigo: operacion.codigo,
    nombre: operacion.nombre,
    sitio_id: operacion.sitio_id,
    salmonera_id: operacion.salmonera_id,
    contratista_id: operacion.contratista_id || '',
    fecha_inicio: operacion.fecha_inicio,
    fecha_fin: operacion.fecha_fin || '',
    tareas: operacion.tareas || '',
    estado: operacion.estado
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error updating operacion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          Editar Operación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value as any }))}
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

          <div>
            <Label htmlFor="nombre">Nombre de la Operación *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salmonera">Salmonera *</Label>
              <Select
                value={formData.salmonera_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, salmonera_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera..." />
                </SelectTrigger>
                <SelectContent>
                  {salmoneras.map((salmonera) => (
                    <SelectItem key={salmonera.id} value={salmonera.id}>
                      {salmonera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sitio">Sitio *</Label>
              <Select
                value={formData.sitio_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sitio_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sitio..." />
                </SelectTrigger>
                <SelectContent>
                  {sitios
                    .filter(sitio => sitio.salmonera_id === formData.salmonera_id)
                    .map((sitio) => (
                      <SelectItem key={sitio.id} value={sitio.id}>
                        {sitio.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="contratista">Contratista</Label>
            <Select
              value={formData.contratista_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, contratista_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar contratista..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin contratista</SelectItem>
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
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Descripción de Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas}
              onChange={(e) => setFormData(prev => ({ ...prev, tareas: e.target.value }))}
              placeholder="Descripción detallada de las tareas a realizar..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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
