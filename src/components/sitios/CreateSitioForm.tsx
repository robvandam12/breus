
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowLeft } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";

interface CreateSitioFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export const CreateSitioForm = ({ onSubmit, onCancel, initialData, isEditing = false }: CreateSitioFormProps) => {
  const { salmoneras } = useSalmoneras();
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    codigo: initialData?.codigo || '',
    salmonera_id: initialData?.salmonera_id || '',
    ubicacion: initialData?.ubicacion || '',
    coordenadas_lat: initialData?.coordenadas_lat || '',
    coordenadas_lng: initialData?.coordenadas_lng || '',
    estado: initialData?.estado || 'activo',
    observaciones: initialData?.observaciones || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.codigo || !formData.salmonera_id || !formData.ubicacion) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        coordenadas_lat: formData.coordenadas_lat ? parseFloat(formData.coordenadas_lat) : null,
        coordenadas_lng: formData.coordenadas_lng ? parseFloat(formData.coordenadas_lng) : null,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting sitio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      coordenadas_lat: lat.toString(),
      coordenadas_lng: lng.toString(),
      ubicacion: address || prev.ubicacion
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Editar Sitio' : 'Crear Nuevo Sitio'}
            </h1>
            <p className="text-zinc-500">Complete la información del sitio</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sitio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nombre">Nombre del Sitio *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Centro Norte 1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Ej: CN-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="salmonera">Salmonera *</Label>
                <Select
                  value={formData.salmonera_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, salmonera_id: value }))}
                  required
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
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                placeholder="Ej: Región de Los Lagos, Comuna de Castro"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="coordenadas_lat">Latitud</Label>
                <Input
                  id="coordenadas_lat"
                  type="number"
                  step="any"
                  value={formData.coordenadas_lat}
                  onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lat: e.target.value }))}
                  placeholder="Ej: -42.4833"
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
                  placeholder="Ej: -73.7667"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Observaciones adicionales sobre el sitio..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button 
                type="submit" 
                disabled={!formData.nombre || !formData.codigo || !formData.salmonera_id || !formData.ubicacion || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Sitio' : 'Crear Sitio')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
