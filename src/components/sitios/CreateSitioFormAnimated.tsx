
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { MapPin, Building, Anchor, ChevronLeft, ChevronRight } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useCentros } from "@/hooks/useCentros";
import { useToast } from "@/hooks/use-toast";

interface CreateSitioFormAnimatedProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const steps = [
  { id: 1, title: "Información Básica", icon: Building },
  { id: 2, title: "Ubicación", icon: MapPin },
  { id: 3, title: "Características", icon: Anchor }
];

export const CreateSitioFormAnimated = ({ onSubmit, onCancel }: CreateSitioFormAnimatedProps) => {
  const { toast } = useToast();
  const { salmoneras } = useSalmoneras();
  const { createCentro } = useCentros();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    salmonera_id: '',
    ubicacion: '',
    coordenadas_lat: '',
    coordenadas_lng: '',
    region: '',
    profundidad_maxima: '',
    capacidad_jaulas: '',
    observaciones: '',
    estado: 'activo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.codigo || !formData.ubicacion) {
      toast({
        title: "Campos requeridos",
        description: "Nombre, código y ubicación son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        salmonera_id: formData.salmonera_id || null,
        coordenadas_lat: formData.coordenadas_lat ? parseFloat(formData.coordenadas_lat) : null,
        coordenadas_lng: formData.coordenadas_lng ? parseFloat(formData.coordenadas_lng) : null,
        profundidad_maxima: formData.profundidad_maxima ? parseFloat(formData.profundidad_maxima) : null,
        capacidad_jaulas: formData.capacidad_jaulas ? parseInt(formData.capacidad_jaulas) : null,
        observaciones: formData.observaciones || null,
      };

      await createCentro(dataToSubmit);
      toast({
        title: "Centro creado",
        description: "El centro ha sido creado exitosamente.",
      });
      onCancel(); // Close form after success
    } catch (error) {
      console.error('Error creating centro:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el centro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="nombre">Nombre del Centro *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Ej: Centro Norte"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="Ej: CN001"
                required
              />
            </div>

            <div>
              <Label htmlFor="salmonera_id">Salmonera</Label>
              <Select
                value={formData.salmonera_id || "empty"}
                onValueChange={(value) => handleChange('salmonera_id', value === 'empty' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">Sin asignar</SelectItem>
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
                onValueChange={(value) => handleChange('estado', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => handleChange('ubicacion', e.target.value)}
                placeholder="Ej: Bahía Norte, Puerto Montt"
                required
              />
            </div>

            <div>
              <Label htmlFor="region">Región</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => handleChange('region', e.target.value)}
                placeholder="Ej: Los Lagos"
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
                  onChange={(e) => handleChange('coordenadas_lat', e.target.value)}
                  placeholder="-41.4693"
                />
              </div>
              
              <div>
                <Label htmlFor="coordenadas_lng">Longitud</Label>
                <Input
                  id="coordenadas_lng"
                  type="number"
                  step="any"
                  value={formData.coordenadas_lng}
                  onChange={(e) => handleChange('coordenadas_lng', e.target.value)}
                  placeholder="-72.9424"
                />
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                <Input
                  id="profundidad_maxima"
                  type="number"
                  step="0.1"
                  value={formData.profundidad_maxima}
                  onChange={(e) => handleChange('profundidad_maxima', e.target.value)}
                  placeholder="25.5"
                />
              </div>
              
              <div>
                <Label htmlFor="capacidad_jaulas">Capacidad de Jaulas</Label>
                <Input
                  id="capacidad_jaulas"
                  type="number"
                  value={formData.capacidad_jaulas}
                  onChange={(e) => handleChange('capacidad_jaulas', e.target.value)}
                  placeholder="12"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales sobre el centro..."
                rows={4}
              />
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Nuevo Centro de Acuicultura
        </CardTitle>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Paso {currentStep} de {steps.length}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id === currentStep ? 'text-primary' : 
                  step.id < currentStep ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                <div className={`rounded-full p-2 ${
                  step.id === currentStep ? 'bg-primary/10' : 
                  step.id < currentStep ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs mt-1 text-center">{step.title}</span>
              </div>
            );
          })}
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
          
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              
              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creando...' : 'Crear Centro'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
