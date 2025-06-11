
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { Sitio, SitioFormData } from "@/hooks/useSitios";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { SitioMapSelector } from "./SitioMapSelector";

interface EditSitioFormProps {
  sitio: Sitio;
  onSubmit: (data: SitioFormData) => Promise<void>;
  onCancel: () => void;
}

export const EditSitioForm = ({ sitio, onSubmit, onCancel }: EditSitioFormProps) => {
  const { salmoneras } = useSalmoneras();
  const [formData, setFormData] = useState<SitioFormData>({
    nombre: sitio.nombre,
    codigo: sitio.codigo,
    salmonera_id: sitio.salmonera_id,
    ubicacion: sitio.ubicacion,
    region: sitio.region || 'Los Lagos',
    profundidad_maxima: sitio.profundidad_maxima || undefined,
    coordenadas_lat: sitio.coordenadas_lat || -41.4693,
    coordenadas_lng: sitio.coordenadas_lng || -72.9424,
    estado: sitio.estado as 'activo' | 'inactivo' | 'mantenimiento',
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

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      coordenadas_lat: lat,
      coordenadas_lng: lng
    }));
  };

  const handleAddressChange = (address: string) => {
    setFormData(prev => ({
      ...prev,
      ubicacion: address
    }));
  };

  const salmoneraOptions = salmoneras.map(salmonera => ({
    value: salmonera.id,
    label: salmonera.nombre
  }));

  const estadoOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'mantenimiento', label: 'Mantenimiento' }
  ];

  const regionOptions = [
    { value: 'Los Lagos', label: 'Los Lagos' },
    { value: 'Aysén', label: 'Aysén' },
    { value: 'Magallanes', label: 'Magallanes' },
    { value: 'Los Ríos', label: 'Los Ríos' },
    { value: 'Araucanía', label: 'Araucanía' },
    { value: 'Biobío', label: 'Biobío' },
    { value: 'Ñuble', label: 'Ñuble' },
    { value: 'Maule', label: 'Maule' },
    { value: 'O´Higgins', label: 'O´Higgins' },
    { value: 'Metropolitana', label: 'Metropolitana' },
    { value: 'Valparaíso', label: 'Valparaíso' },
    { value: 'Coquimbo', label: 'Coquimbo' },
    { value: 'Atacama', label: 'Atacama' },
    { value: 'Antofagasta', label: 'Antofagasta' }
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600" />
          Editar Sitio
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <EnhancedSelect
            options={salmoneraOptions}
            value={formData.salmonera_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, salmonera_id: value }))}
            placeholder="Seleccione una salmonera"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <Label htmlFor="region">Región</Label>
            <EnhancedSelect
              options={regionOptions}
              value={formData.region}
              onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
              placeholder="Seleccione una región"
              className="w-full"
            />
          </div>
        </div>

        <SitioMapSelector
          initialLat={formData.coordenadas_lat}
          initialLng={formData.coordenadas_lng}
          onLocationChange={handleLocationChange}
          onAddressChange={handleAddressChange}
          address={formData.ubicacion}
          showAddressSearch={true}
        />

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
            <EnhancedSelect
              options={estadoOptions}
              value={formData.estado}
              onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value as 'activo' | 'inactivo' | 'mantenimiento' }))}
              placeholder="Seleccione estado"
              className="w-full"
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
