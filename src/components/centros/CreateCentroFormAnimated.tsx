
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building, Save, X } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import type { CentroFormData } from "@/hooks/useCentros";

interface CreateCentroFormAnimatedProps {
  onSubmit: (data: CentroFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateCentroFormAnimated = ({ onSubmit, onCancel }: CreateCentroFormAnimatedProps) => {
  const { salmoneras } = useSalmoneras();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CentroFormData>({
    nombre: '',
    codigo: '',
    salmonera_id: '',
    ubicacion: '',
    region: '',
    estado: 'activo',
    profundidad_maxima: undefined,
    coordenadas_lat: undefined,
    coordenadas_lng: undefined,
    capacidad_jaulas: undefined,
    observaciones: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CentroFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Crear Nuevo Centro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre del Centro *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => updateFormData('nombre', e.target.value)}
                  placeholder="Ej: Centro Norte"
                  required
                />
              </div>

              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => updateFormData('codigo', e.target.value)}
                  placeholder="Ej: CN-001"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="salmonera_id">Salmonera *</Label>
                <Select value={formData.salmonera_id} onValueChange={(value) => updateFormData('salmonera_id', value)}>
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
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => updateFormData('ubicacion', e.target.value)}
                  placeholder="Ej: Puerto Montt, Los Lagos"
                  required
                />
              </div>

              <div>
                <Label htmlFor="region">Región</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => updateFormData('region', e.target.value)}
                  placeholder="Se determina automáticamente"
                />
              </div>
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coordenadas_lat">Latitud</Label>
                <Input
                  id="coordenadas_lat"
                  type="number"
                  step="any"
                  value={formData.coordenadas_lat || ''}
                  onChange={(e) => updateFormData('coordenadas_lat', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Ej: -41.4693"
                />
              </div>

              <div>
                <Label htmlFor="coordenadas_lng">Longitud</Label>
                <Input
                  id="coordenadas_lng"
                  type="number"
                  step="any"
                  value={formData.coordenadas_lng || ''}
                  onChange={(e) => updateFormData('coordenadas_lng', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Ej: -72.9344"
                />
              </div>
            </div>

            {/* Características Técnicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                <Input
                  id="profundidad_maxima"
                  type="number"
                  value={formData.profundidad_maxima || ''}
                  onChange={(e) => updateFormData('profundidad_maxima', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Ej: 30"
                />
              </div>

              <div>
                <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
                <Input
                  id="capacidad_jaulas"
                  type="number"
                  value={formData.capacidad_jaulas || ''}
                  onChange={(e) => updateFormData('capacidad_jaulas', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Ej: 12"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value: any) => updateFormData('estado', value)}>
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
            </div>

            {/* Observaciones */}
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => updateFormData('observaciones', e.target.value)}
                placeholder="Observaciones adicionales sobre el centro..."
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Guardando...' : 'Crear Centro'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
