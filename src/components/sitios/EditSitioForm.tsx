
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { Sitio, SitioFormData } from "@/hooks/useSitios";

interface EditSitioFormProps {
  sitio: Sitio;
  onSubmit: (data: SitioFormData) => Promise<void>;
  onCancel: () => void;
  salmoneras: Array<{ id: string; nombre: string }>;
}

export const EditSitioForm = ({ sitio, onSubmit, onCancel, salmoneras }: EditSitioFormProps) => {
  const [formData, setFormData] = useState<SitioFormData>({
    nombre: sitio.nombre,
    codigo: sitio.codigo,
    salmonera_id: sitio.salmonera_id,
    ubicacion: sitio.ubicacion,
    profundidad_maxima: sitio.profundidad_maxima || undefined,
    coordenadas_lat: sitio.coordenadas_lat || undefined,
    coordenadas_lng: sitio.coordenadas_lng || undefined,
    estado: sitio.estado,
    capacidad_jaulas: sitio.capacidad_jaulas || undefined,
    observaciones: sitio.observaciones || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error updating sitio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          Editar Sitio
        </DialogTitle>
      </DialogHeader>
      
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
          <Label htmlFor="salmonera">Salmonera *</Label>
          <Select value={formData.salmonera_id} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, salmonera_id: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una salmonera" />
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
            placeholder="Ubicación geográfica del sitio"
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
              value={formData.coordenadas_lat || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                coordenadas_lat: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              placeholder="-41.4693"
            />
          </div>

          <div>
            <Label htmlFor="coordenadas_lng">Longitud</Label>
            <Input
              id="coordenadas_lng"
              type="number"
              step="any"
              value={formData.coordenadas_lng || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                coordenadas_lng: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              placeholder="-72.9396"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
            <Input
              id="profundidad_maxima"
              type="number"
              step="0.1"
              value={formData.profundidad_maxima || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                profundidad_maxima: e.target.value ? parseFloat(e.target.value) : undefined 
              }))}
              placeholder="50.0"
            />
          </div>

          <div>
            <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
            <Input
              id="capacidad_jaulas"
              type="number"
              value={formData.capacidad_jaulas || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                capacidad_jaulas: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              placeholder="12"
            />
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select value={formData.estado} onValueChange={(value: 'activo' | 'inactivo' | 'mantenimiento') => 
              setFormData(prev => ({ ...prev, estado: value }))
            }>
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
            disabled={!formData.nombre.trim() || !formData.codigo.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
};
