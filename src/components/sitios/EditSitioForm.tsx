
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import type { Centro } from "@/hooks/useCentros";

interface EditSitioFormProps {
  sitio: Centro;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditSitioForm = ({ sitio, onSubmit, onCancel }: EditSitioFormProps) => {
  const { salmoneras } = useSalmoneras();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: sitio.nombre || '',
    codigo: sitio.codigo || '',
    salmonera_id: sitio.salmonera_id || '',
    ubicacion: sitio.ubicacion || '',
    coordenadas_lat: sitio.coordenadas_lat?.toString() || '',
    coordenadas_lng: sitio.coordenadas_lng?.toString() || '',
    region: sitio.region || '',
    profundidad_maxima: sitio.profundidad_maxima?.toString() || '',
    capacidad_jaulas: sitio.capacidad_jaulas?.toString() || '',
    observaciones: sitio.observaciones || '',
    estado: sitio.estado || 'activo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        salmonera_id: formData.salmonera_id || null,
        coordenadas_lat: formData.coordenadas_lat ? parseFloat(formData.coordenadas_lat) : null,
        coordenadas_lng: formData.coordenadas_lng ? parseFloat(formData.coordenadas_lng) : null,
        profundidad_maxima: formData.profundidad_maxima ? parseFloat(formData.profundidad_maxima) : null,
        capacidad_jaulas: formData.capacidad_jaulas ? parseInt(formData.capacidad_jaulas) : null,
        observaciones: formData.observaciones || null,
        region: formData.region || null,
      };

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error updating centro:', error);
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
        <CardTitle>Editar Centro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre del Centro *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              value={formData.ubicacion}
              onChange={(e) => handleChange('ubicacion', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="region">Región</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coordenadas_lat">Latitud</Label>
              <Input
                id="coordenadas_lat"
                type="number"
                step="any"
                value={formData.coordenadas_lat}
                onChange={(e) => handleChange('coordenadas_lat', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="coordenadas_lng">Longitud</Label>
              <Input
                id="coordenadas_lng"
                type="number"
                step="any"
                value={formData.coordenadas_lng}
                onChange={(e) => handleChange('coordenadas_lng', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                step="0.1"
                value={formData.profundidad_maxima}
                onChange={(e) => handleChange('profundidad_maxima', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
              <Input
                id="capacidad_jaulas"
                type="number"
                value={formData.capacidad_jaulas}
                onChange={(e) => handleChange('capacidad_jaulas', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleChange('observaciones', e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Actualizando...' : 'Actualizar Centro'}
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
