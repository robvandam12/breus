
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';
import { Sitio } from '@/hooks/useSitios';
import { useSalmoneras } from '@/hooks/useSalmoneras';

interface EditSitioFormProps {
  sitio: Sitio;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditSitioForm = ({ sitio, onSubmit, onCancel }: EditSitioFormProps) => {
  const { salmoneras } = useSalmoneras();
  const [formData, setFormData] = useState({
    nombre: sitio.nombre,
    codigo: sitio.codigo,
    salmonera_id: sitio.salmonera_id,
    ubicacion: sitio.ubicacion,
    profundidad_maxima: sitio.profundidad_maxima || 0,
    coordenadas_lat: sitio.coordenadas_lat || 0,
    coordenadas_lng: sitio.coordenadas_lng || 0,
    estado: sitio.estado,
    capacidad_jaulas: sitio.capacidad_jaulas || 0,
    observaciones: sitio.observaciones || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.codigo.trim()) return;

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
          <MapPin className="w-5 h-5 text-blue-600" />
          Editar Sitio
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
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
              placeholder="Código único"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="salmonera_id">Salmonera</Label>
          <Select value={formData.salmonera_id} onValueChange={(value) => setFormData(prev => ({ ...prev, salmonera_id: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar salmonera" />
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
            placeholder="Ubicación del sitio"
            required
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
              onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lat: parseFloat(e.target.value) || 0 }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lng: parseFloat(e.target.value) || 0 }))}
              placeholder="-70.6693"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
            <Input
              id="profundidad_maxima"
              type="number"
              value={formData.profundidad_maxima}
              onChange={(e) => setFormData(prev => ({ ...prev, profundidad_maxima: parseFloat(e.target.value) || 0 }))}
              placeholder="50"
            />
          </div>

          <div>
            <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
            <Input
              id="capacidad_jaulas"
              type="number"
              value={formData.capacidad_jaulas}
              onChange={(e) => setFormData(prev => ({ ...prev, capacidad_jaulas: parseInt(e.target.value) || 0 }))}
              placeholder="12"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="estado">Estado</Label>
          <Select value={formData.estado} onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value as any }))}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
            placeholder="Observaciones adicionales..."
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={!formData.nombre.trim() || !formData.codigo.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Sitio'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
};
