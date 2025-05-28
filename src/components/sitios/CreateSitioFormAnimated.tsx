
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowLeft } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useAuth } from "@/hooks/useAuth";
import { MapPicker } from "@/components/ui/map-picker";

interface CreateSitioFormAnimatedProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  salmoneraId?: string;
}

export const CreateSitioFormAnimated = ({ onSubmit, onCancel, salmoneraId }: CreateSitioFormAnimatedProps) => {
  const { salmoneras } = useSalmoneras();
  const { profile } = useAuth();
  
  // Pre-fill salmonera_id if user is admin_salmonera or if passed as prop
  const defaultSalmoneraId = salmoneraId || 
    (profile?.role === 'admin_salmonera' && profile?.salmonera_id ? profile.salmonera_id : '');

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    salmonera_id: defaultSalmoneraId,
    ubicacion: '',
    profundidad_maxima: '',
    coordenadas_lat: '',
    coordenadas_lng: '',
    estado: 'activo' as 'activo' | 'inactivo' | 'mantenimiento',
    capacidad_jaulas: '',
    observaciones: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        profundidad_maxima: formData.profundidad_maxima ? parseFloat(formData.profundidad_maxima) : undefined,
        coordenadas_lat: formData.coordenadas_lat ? parseFloat(formData.coordenadas_lat) : undefined,
        coordenadas_lng: formData.coordenadas_lng ? parseFloat(formData.coordenadas_lng) : undefined,
        capacidad_jaulas: formData.capacidad_jaulas ? parseInt(formData.capacidad_jaulas) : undefined,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error creating sitio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapChange = (coordinates: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      coordenadas_lat: coordinates.lat.toString(),
      coordenadas_lng: coordinates.lng.toString()
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Sitio</h1>
          <p className="text-gray-600">Complete la información del sitio de trabajo</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Información del Sitio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Label htmlFor="salmonera">Salmonera *</Label>
                <EnhancedSelect
                  options={salmoneraOptions}
                  value={formData.salmonera_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, salmonera_id: value }))}
                  placeholder="Seleccione una salmonera"
                  className="w-full"
                  disabled={profile?.role === 'admin_salmonera'}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
                  placeholder="Ubicación geográfica del sitio"
                  required
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                  <Input
                    id="profundidad_maxima"
                    type="number"
                    step="0.1"
                    value={formData.profundidad_maxima}
                    onChange={(e) => setFormData(prev => ({ ...prev, profundidad_maxima: e.target.value }))}
                    placeholder="50.0"
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <Label>Ubicación en Mapa</Label>
                <MapPicker
                  value={
                    formData.coordenadas_lat && formData.coordenadas_lng
                      ? { 
                          lat: parseFloat(formData.coordenadas_lat), 
                          lng: parseFloat(formData.coordenadas_lng) 
                        }
                      : undefined
                  }
                  onChange={handleMapChange}
                  className="mt-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Observaciones adicionales del sitio..."
                  rows={3}
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="flex gap-3 pt-4"
              >
                <Button 
                  type="submit" 
                  disabled={!formData.nombre.trim() || !formData.codigo.trim() || !formData.salmonera_id || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Sitio'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
