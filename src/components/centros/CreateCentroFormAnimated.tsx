
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building, Save, X } from "lucide-react";
import { SitioMapSelector } from '@/components/sitios/SitioMapSelector';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { CentroFormData } from '@/hooks/useCentros';

interface CreateCentroFormAnimatedProps {
  onSubmit: (data: CentroFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CentroFormData>;
}

export const CreateCentroFormAnimated = ({
  onSubmit,
  onCancel,
  initialData
}: CreateCentroFormAnimatedProps) => {
  const { salmoneras, isLoading: loadingSalmoneras } = useSalmoneras();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState<CentroFormData>({
    nombre: '',
    codigo: '',
    salmonera_id: '',
    ubicacion: '',
    region: '',
    estado: 'activo',
    coordenadas_lat: undefined,
    coordenadas_lng: undefined,
    profundidad_maxima: undefined,
    capacidad_jaulas: undefined,
    observaciones: '',
    ...initialData
  });

  // Auto-generar código basado en nombre
  useEffect(() => {
    if (formData.nombre && !initialData?.codigo) {
      const codigo = formData.nombre
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 8);
      setFormData(prev => ({ ...prev, codigo }));
    }
  }, [formData.nombre, initialData?.codigo]);

  // Auto-determinar región basada en ubicación
  const determinarRegion = (ubicacion: string): string => {
    const ubicacionLower = ubicacion.toLowerCase();
    
    if (ubicacionLower.includes('valparaíso') || ubicacionLower.includes('valparaiso')) return 'Valparaíso';
    if (ubicacionLower.includes('los lagos') || ubicacionLower.includes('puerto montt') || ubicacionLower.includes('osorno')) return 'Los Lagos';
    if (ubicacionLower.includes('aysén') || ubicacionLower.includes('aysen') || ubicacionLower.includes('coyhaique')) return 'Aysén';
    if (ubicacionLower.includes('magallanes') || ubicacionLower.includes('punta arenas')) return 'Magallanes';
    if (ubicacionLower.includes('antofagasta')) return 'Antofagasta';
    if (ubicacionLower.includes('atacama')) return 'Atacama';
    if (ubicacionLower.includes('coquimbo')) return 'Coquimbo';
    if (ubicacionLower.includes('metropolitana') || ubicacionLower.includes('santiago')) return 'Metropolitana';
    if (ubicacionLower.includes('ohiggins') || ubicacionLower.includes('rancagua')) return 'O´Higgins';
    if (ubicacionLower.includes('maule') || ubicacionLower.includes('talca')) return 'Maule';
    if (ubicacionLower.includes('ñuble') || ubicacionLower.includes('chillán')) return 'Ñuble';
    if (ubicacionLower.includes('biobío') || ubicacionLower.includes('biobio') || ubicacionLower.includes('concepción')) return 'Biobío';
    if (ubicacionLower.includes('araucanía') || ubicacionLower.includes('araucania') || ubicacionLower.includes('temuco')) return 'Araucanía';
    if (ubicacionLower.includes('los ríos') || ubicacionLower.includes('los rios') || ubicacionLower.includes('valdivia')) return 'Los Ríos';
    
    return 'Los Lagos';
  };

  // Auto-actualizar región cuando cambia la ubicación
  useEffect(() => {
    if (formData.ubicacion) {
      const region = determinarRegion(formData.ubicacion);
      setFormData(prev => ({ ...prev, region }));
    }
  }, [formData.ubicacion]);

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      coordenadas_lat: lat,
      coordenadas_lng: lng
    }));
  };

  const handleAddressChange = (address: string) => {
    setFormData(prev => ({ ...prev, ubicacion: address }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      return;
    }

    if (!formData.salmonera_id) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onCancel(); // Cerrar formulario después del éxito
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Building className="w-6 h-6 text-blue-600" />
          {initialData ? 'Editar Centro' : 'Nuevo Centro de Acuicultura'}
        </h2>
        <p className="text-gray-600 mt-2">
          {initialData ? 'Modifique los datos del centro' : 'Complete la información del nuevo centro'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Centro *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Centro Norte, Bahía Sur..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Se genera automáticamente"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salmonera_id">Salmonera *</Label>
              <Select 
                value={formData.salmonera_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, salmonera_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera" />
                </SelectTrigger>
                <SelectContent>
                  {loadingSalmoneras ? (
                    <div className="p-4 text-center text-gray-500">Cargando salmoneras...</div>
                  ) : (
                    salmoneras.map((salmonera) => (
                      <SelectItem key={salmonera.id} value={salmonera.id}>
                        {salmonera.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select 
                value={formData.estado} 
                onValueChange={(value: 'activo' | 'inactivo' | 'mantenimiento') => 
                  setFormData(prev => ({ ...prev, estado: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación y Mapa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Dirección / Ubicación</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                  placeholder="Ej: Bahía Chuyaca, Puerto Montt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Región</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="Se determina automáticamente"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ubicación en Mapa</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
                </Button>
              </div>
              
              {showMap && (
                <div className="border rounded-lg overflow-hidden">
                  <SitioMapSelector
                    initialLat={formData.coordenadas_lat || -41.4693}
                    initialLng={formData.coordenadas_lng || -72.9424}
                    onLocationChange={handleLocationChange}
                    onAddressChange={handleAddressChange}
                    address={formData.ubicacion}
                    showAddressSearch={true}
                  />
                </div>
              )}
            </div>

            {formData.coordenadas_lat && formData.coordenadas_lng && (
              <div className="text-sm text-gray-600 p-2 bg-blue-50 rounded">
                <strong>Coordenadas:</strong> {formData.coordenadas_lat.toFixed(6)}, {formData.coordenadas_lng.toFixed(6)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Características técnicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Características Técnicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                <Input
                  id="profundidad_maxima"
                  type="number"
                  value={formData.profundidad_maxima || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    profundidad_maxima: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  placeholder="Ej: 35"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
                <Input
                  id="capacidad_jaulas"
                  type="number"
                  value={formData.capacidad_jaulas || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    capacidad_jaulas: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  placeholder="Ej: 12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Observaciones adicionales sobre el centro..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.nombre.trim() || !formData.salmonera_id}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {initialData ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {initialData ? 'Actualizar Centro' : 'Crear Centro'}
              </>
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
