
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";

interface CreateSitioFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultSalmoneraId?: string;
}

export const CreateSitioForm = ({ onSubmit, onCancel, defaultSalmoneraId }: CreateSitioFormProps) => {
  const { salmoneras } = useSalmoneras();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    ubicacion: '',
    salmonera_id: defaultSalmoneraId || '',
    coordenadas_lat: '',
    coordenadas_lng: '',
    profundidad_maxima: '',
    capacidad_jaulas: '',
    observaciones: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        coordenadas_lat: formData.coordenadas_lat ? parseFloat(formData.coordenadas_lat) : null,
        coordenadas_lng: formData.coordenadas_lng ? parseFloat(formData.coordenadas_lng) : null,
        profundidad_maxima: formData.profundidad_maxima ? parseFloat(formData.profundidad_maxima) : null,
        capacidad_jaulas: formData.capacidad_jaulas ? parseInt(formData.capacidad_jaulas) : null,
      });
    } catch (error) {
      console.error('Error creating sitio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Nuevo Sitio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre del Sitio *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre del sitio"
                required
              />
            </div>

            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Código único del sitio"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="salmonera_id">Salmonera *</Label>
            <Select
              value={formData.salmonera_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, salmonera_id: value }))}
              disabled={!!defaultSalmoneraId}
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
            <Label htmlFor="ubicacion">Ubicación *</Label>
            <Input
              id="ubicacion"
              value={formData.ubicacion}
              onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
              placeholder="Descripción de la ubicación"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coordenadas_lat">Latitud</Label>
              <Input
                id="coordenadas_lat"
                type="number"
                step="any"
                value={formData.coordenadas_lat}
                onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lat: e.target.value }))}
                placeholder="-33.4489"
              />
            </div>

            <div>
              <Label htmlFor="coordenadas_lng">Longitud</Label>
              <Input
                id="coordenadas_lng"
                type="number"
                step="any"
                value={formData.coordenadas_lng}
                onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lng: e.target.value }))}
                placeholder="-70.6693"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                step="0.1"
                value={formData.profundidad_maxima}
                onChange={(e) => setFormData(prev => ({ ...prev, profundidad_maxima: e.target.value }))}
                placeholder="50.5"
              />
            </div>

            <div>
              <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
              <Input
                id="capacidad_jaulas"
                type="number"
                value={formData.capacidad_jaulas}
                onChange={(e) => setFormData(prev => ({ ...prev, capacidad_jaulas: e.target.value }))}
                placeholder="12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales del sitio..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!formData.nombre || !formData.codigo || !formData.ubicacion || !formData.salmonera_id || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creando...' : 'Crear Sitio'}
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
