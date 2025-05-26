
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin } from "lucide-react";
import { SimpleMapPicker } from "./SimpleMapPicker";

interface CreateSitioFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const CreateSitioForm = ({ onSubmit, onCancel, initialData }: CreateSitioFormProps) => {
  const [formData, setFormData] = useState({
    codigo: initialData?.codigo || '',
    nombre: initialData?.nombre || '',
    ubicacion: initialData?.ubicacion || '',
    coordenadas_lat: initialData?.coordenadas_lat || -33.4489,
    coordenadas_lng: initialData?.coordenadas_lng || -70.6693,
    observaciones: initialData?.observaciones || '',
    estado: initialData?.estado || 'activo'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      coordenadas_lat: lat,
      coordenadas_lng: lng
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{initialData ? 'Editar Sitio' : 'Nuevo Sitio'}</h1>
            <p className="text-zinc-500">Complete la información del sitio</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                    placeholder="ST-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="nombre">Nombre del Sitio</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Centro de Cultivo Norte"
                  required
                />
              </div>

              <div>
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                  placeholder="Región de Los Lagos, Chile"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat">Latitud</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.coordenadas_lat}
                    onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lat: parseFloat(e.target.value) }))}
                    placeholder="-33.4489"
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Longitud</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.coordenadas_lng}
                    onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lng: parseFloat(e.target.value) }))}
                    placeholder="-70.6693"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Información adicional sobre el sitio..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ubicación en Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleMapPicker
                onLocationSelect={handleLocationSelect}
                initialLat={formData.coordenadas_lat}
                initialLng={formData.coordenadas_lng}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {initialData ? 'Actualizar Sitio' : 'Crear Sitio'}
          </Button>
        </div>
      </form>
    </div>
  );
};
