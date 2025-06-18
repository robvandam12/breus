
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useOperaciones, OperacionFormData } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";
import { useToast } from "@/hooks/use-toast";

interface EditOperacionFormProps {
  operacion: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditOperacionForm = ({ operacion, onSubmit, onCancel }: EditOperacionFormProps) => {
  const { toast } = useToast();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<OperacionFormData>({
    codigo: operacion?.codigo || '',
    nombre: operacion?.nombre || '',
    sitio_id: operacion?.sitio_id || '',
    servicio_id: operacion?.servicio_id || '',
    salmonera_id: operacion?.salmonera_id || '',
    contratista_id: operacion?.contratista_id || '',
    fecha_inicio: operacion?.fecha_inicio || '',
    fecha_fin: operacion?.fecha_fin || '',
    tareas: operacion?.tareas || '',
    estado: operacion?.estado || 'activa'
  });

  console.log('Editing operacion:', operacion);
  console.log('Form data:', formData);

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
      // Preparar datos limpios para la actualización
      const dataToSubmit = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        sitio_id: formData.sitio_id || null,
        servicio_id: formData.servicio_id || null,
        salmonera_id: formData.salmonera_id || null,
        contratista_id: formData.contratista_id || null,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin || null,
        tareas: formData.tareas || null,
        estado: formData.estado
      };

      console.log('Submitting operacion update with data:', dataToSubmit);
      
      await onSubmit(dataToSubmit);
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

  // Validar que tenemos los datos necesarios
  if (!operacion) {
    return (
      <Card className="ios-card max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No se encontraron datos de la operación
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <Label htmlFor="salmonera_id">Salmonera</Label>
              <Select
                value={formData.salmonera_id || 'none'}
                onValueChange={(value) => handleChange('salmonera_id', value === 'none' ? '' : value)}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Seleccionar salmonera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin salmonera</SelectItem>
                  {salmoneras
                    .filter(salmonera => salmonera && salmonera.id && salmonera.id.trim() !== '')
                    .map((salmonera) => (
                    <SelectItem key={salmonera.id} value={salmonera.id}>
                      {salmonera.nombre || 'Sin nombre'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contratista_id">Contratista</Label>
              <Select
                value={formData.contratista_id || 'none'}
                onValueChange={(value) => handleChange('contratista_id', value === 'none' ? '' : value)}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Seleccionar contratista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin contratista</SelectItem>
                  {contratistas
                    .filter(contratista => contratista && contratista.id && contratista.id.trim() !== '')
                    .map((contratista) => (
                    <SelectItem key={contratista.id} value={contratista.id}>
                      {contratista.nombre || 'Sin nombre'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="sitio_id">Sitio</Label>
            <Select
              value={formData.sitio_id || 'none'}
              onValueChange={(value) => handleChange('sitio_id', value === 'none' ? '' : value)}
            >
              <SelectTrigger className="ios-input">
                <SelectValue placeholder="Seleccionar sitio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin sitio</SelectItem>
                {sitios
                  .filter(sitio => sitio && sitio.id && sitio.id.trim() !== '' && (!formData.salmonera_id || sitio.salmonera_id === formData.salmonera_id))
                  .map((sitio) => (
                    <SelectItem key={sitio.id} value={sitio.id}>
                      {sitio.nombre || 'Sin nombre'}
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
