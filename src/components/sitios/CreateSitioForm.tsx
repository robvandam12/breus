
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building } from "lucide-react";
import { MapLocationPicker } from "@/components/ui/map-location-picker";

interface CreateSitioFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  salmoneraId?: string;
}

export const CreateSitioForm = ({ onSubmit, onCancel, salmoneraId }: CreateSitioFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion_lat: -41.4693,
    ubicacion_lng: -72.9424,
    direccion: '',
    region: '',
    comuna: '',
    estado: 'activo',
    salmonera_id: salmoneraId || ''
  });

  const handleLocationChange = (lat: number, lng: number, address?: string) => {
    setFormData(prev => ({
      ...prev,
      ubicacion_lat: lat,
      ubicacion_lng: lng,
      direccion: address || prev.direccion
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const regiones = [
    'Región de Los Lagos',
    'Región de Aysén',
    'Región de Magallanes',
    'Región de Los Ríos',
    'Región del Biobío'
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Crear Nuevo Sitio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Sitio *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Centro San Rafael"
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción del sitio..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Región *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar región..." />
                </SelectTrigger>
                <SelectContent>
                  {regiones.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comuna">Comuna *</Label>
              <Input
                id="comuna"
                value={formData.comuna}
                onChange={(e) => setFormData(prev => ({ ...prev, comuna: e.target.value }))}
                placeholder="Comuna"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
              placeholder="Dirección completa"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Ubicación en el Mapa
            </Label>
            <div className="border rounded-lg overflow-hidden">
              <MapLocationPicker
                initialLat={formData.ubicacion_lat}
                initialLng={formData.ubicacion_lng}
                onLocationChange={handleLocationChange}
                height="300px"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Haz clic en el mapa para seleccionar la ubicación exacta del sitio
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Crear Sitio
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
