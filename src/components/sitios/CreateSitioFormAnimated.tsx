
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface CreateSitioFormAnimatedProps {
  onSubmit: (data: {
    nombre: string;
    codigo: string;
    ubicacion: string;
    observaciones: string;
    coordenadas_lat?: number;
    coordenadas_lng?: number;
    profundidad_maxima?: number;
    capacidad_jaulas?: number;
  }) => Promise<void>;
  onCancel: () => void;
  salmoneraId: string;
}

export const CreateSitioFormAnimated = ({ onSubmit, onCancel, salmoneraId }: CreateSitioFormAnimatedProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    ubicacion: '',
    observaciones: '',
    coordenadas_lat: '',
    coordenadas_lng: '',
    profundidad_maxima: '',
    capacidad_jaulas: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        nombre: formData.nombre,
        codigo: formData.codigo,
        ubicacion: formData.ubicacion,
        observaciones: formData.observaciones,
        coordenadas_lat: formData.coordenadas_lat ? parseFloat(formData.coordenadas_lat) : undefined,
        coordenadas_lng: formData.coordenadas_lng ? parseFloat(formData.coordenadas_lng) : undefined,
        profundidad_maxima: formData.profundidad_maxima ? parseFloat(formData.profundidad_maxima) : undefined,
        capacidad_jaulas: formData.capacidad_jaulas ? parseInt(formData.capacidad_jaulas) : undefined
      });
    } catch (error) {
      console.error('Error creating sitio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Crear Nuevo Sitio
        </DialogTitle>
      </DialogHeader>
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Label htmlFor="nombre">Nombre del Sitio *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre del sitio"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Label htmlFor="codigo">Código *</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
              placeholder="Código único del sitio"
              required
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Label htmlFor="ubicacion">Ubicación *</Label>
          <Input
            id="ubicacion"
            value={formData.ubicacion}
            onChange={(e) => setFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
            placeholder="Ubicación del sitio"
            required
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Label htmlFor="coordenadas_lat">Latitud</Label>
            <Input
              id="coordenadas_lat"
              type="number"
              step="any"
              value={formData.coordenadas_lat}
              onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lat: e.target.value }))}
              placeholder="-33.4569"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Label htmlFor="coordenadas_lng">Longitud</Label>
            <Input
              id="coordenadas_lng"
              type="number"
              step="any"
              value={formData.coordenadas_lng}
              onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_lng: e.target.value }))}
              placeholder="-70.6483"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
            <Input
              id="profundidad_maxima"
              type="number"
              step="0.1"
              value={formData.profundidad_maxima}
              onChange={(e) => setFormData(prev => ({ ...prev, profundidad_maxima: e.target.value }))}
              placeholder="0.0"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
            <Input
              id="capacidad_jaulas"
              type="number"
              value={formData.capacidad_jaulas}
              onChange={(e) => setFormData(prev => ({ ...prev, capacidad_jaulas: e.target.value }))}
              placeholder="0"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
            placeholder="Observaciones del sitio..."
            rows={3}
          />
        </motion.div>

        <motion.div 
          className="flex gap-3 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.3 }}
        >
          <Button 
            type="submit" 
            disabled={!formData.nombre.trim() || !formData.codigo.trim() || !formData.ubicacion.trim() || isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Creando...' : 'Crear Sitio'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};
