
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Waves, User, Clock, Target, Thermometer, Eye, Wind } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useToast } from "@/hooks/use-toast";

interface CreateInmersionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateInmersionForm = ({ onSubmit, onCancel }: CreateInmersionFormProps) => {
  const { operaciones } = useInmersiones();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    operacion_id: "",
    fecha_inmersion: "",
    hora_inicio: "",
    hora_fin: "",
    buzo_principal: "",
    buzo_asistente: "",
    supervisor: "",
    objetivo: "",
    profundidad_max: "",
    temperatura_agua: "",
    visibilidad: "",
    corriente: "",
    observaciones: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.operacion_id || !formData.fecha_inmersion || !formData.hora_inicio || 
        !formData.buzo_principal || !formData.supervisor || !formData.objetivo) {
      toast({
        title: "Campos requeridos",
        description: "Complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        profundidad_max: parseFloat(formData.profundidad_max) || 0,
        temperatura_agua: parseFloat(formData.temperatura_agua) || 0,
        visibilidad: parseFloat(formData.visibilidad) || 0,
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            Nueva Inmersión de Buceo
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete la información para programar una nueva inmersión
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Operación */}
            <div className="space-y-2">
              <Label htmlFor="operacion">Operación *</Label>
              <Select 
                value={formData.operacion_id} 
                onValueChange={(value) => handleInputChange('operacion_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una operación activa" />
                </SelectTrigger>
                <SelectContent>
                  {operaciones.map((operacion) => (
                    <SelectItem key={operacion.id} value={operacion.id}>
                      {operacion.nombre} ({operacion.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_inmersion">Fecha de Inmersión *</Label>
                <Input
                  id="fecha_inmersion"
                  type="date"
                  value={formData.fecha_inmersion}
                  onChange={(e) => handleInputChange('fecha_inmersion', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_fin">Hora de Fin (Estimada)</Label>
                <Input
                  id="hora_fin"
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => handleInputChange('hora_fin', e.target.value)}
                />
              </div>
            </div>

            {/* Personal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buzo_principal">Buzo Principal *</Label>
                <Input
                  id="buzo_principal"
                  value={formData.buzo_principal}
                  onChange={(e) => handleInputChange('buzo_principal', e.target.value)}
                  placeholder="Nombre del buzo principal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
                <Input
                  id="buzo_asistente"
                  value={formData.buzo_asistente}
                  onChange={(e) => handleInputChange('buzo_asistente', e.target.value)}
                  placeholder="Nombre del asistente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor *</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                  placeholder="Nombre del supervisor"
                />
              </div>
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
              <Input
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => handleInputChange('objetivo', e.target.value)}
                placeholder="Descripción del objetivo de buceo"
              />
            </div>

            {/* Condiciones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profundidad_max">Profundidad Máx. (m) *</Label>
                <Input
                  id="profundidad_max"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.profundidad_max}
                  onChange={(e) => handleInputChange('profundidad_max', e.target.value)}
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperatura_agua">Temp. Agua (°C)</Label>
                <Input
                  id="temperatura_agua"
                  type="number"
                  step="0.1"
                  value={formData.temperatura_agua}
                  onChange={(e) => handleInputChange('temperatura_agua', e.target.value)}
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibilidad">Visibilidad (m)</Label>
                <Input
                  id="visibilidad"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.visibilidad}
                  onChange={(e) => handleInputChange('visibilidad', e.target.value)}
                  placeholder="0.0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="corriente">Corriente</Label>
                <Select 
                  value={formData.corriente} 
                  onValueChange={(value) => handleInputChange('corriente', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nula">Nula</SelectItem>
                    <SelectItem value="ligera">Ligera</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="fuerte">Fuerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales..."
                rows={3}
              />
            </div>

            {/* Warning sobre validación */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Waves className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-sm text-amber-800">
                  <strong>Validación Automática:</strong> El sistema verificará automáticamente que 
                  existan HPT y Anexo Bravo firmados para la operación seleccionada antes de 
                  permitir la creación de la inmersión.
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Creando...' : 'Crear Inmersión'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
