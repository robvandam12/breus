
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { HardHat, ArrowLeft, Plus, X } from "lucide-react";
import { ContratistaFormData, Contratista } from "@/hooks/useContratistas";

interface CreateContratistaFormProps {
  onSubmit: (data: ContratistaFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Contratista;
  isEditing?: boolean;
}

export const CreateContratistaForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false 
}: CreateContratistaFormProps) => {
  const [formData, setFormData] = useState<ContratistaFormData>({
    nombre: initialData?.nombre || '',
    rut: initialData?.rut || '',
    direccion: initialData?.direccion || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    especialidades: initialData?.especialidades || [],
    certificaciones: initialData?.certificaciones || [],
    estado: initialData?.estado || 'activo'
  });

  const [newEspecialidad, setNewEspecialidad] = useState('');
  const [newCertificacion, setNewCertificacion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof ContratistaFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEspecialidad = () => {
    if (newEspecialidad.trim()) {
      setFormData(prev => ({
        ...prev,
        especialidades: [...(prev.especialidades || []), newEspecialidad.trim()]
      }));
      setNewEspecialidad('');
    }
  };

  const removeEspecialidad = (index: number) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades?.filter((_, i) => i !== index) || []
    }));
  };

  const addCertificacion = () => {
    if (newCertificacion.trim()) {
      setFormData(prev => ({
        ...prev,
        certificaciones: [...(prev.certificaciones || []), newCertificacion.trim()]
      }));
      setNewCertificacion('');
    }
  };

  const removeCertificacion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certificaciones: prev.certificaciones?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="flex items-center gap-2">
              <HardHat className="w-6 h-6 text-orange-600" />
              {isEditing ? 'Editar Contratista' : 'Nuevo Contratista'}
            </CardTitle>
            <p className="text-sm text-zinc-500">
              {isEditing ? 'Modificar información del contratista' : 'Registrar nueva empresa de servicios de buceo'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información Básica</h3>
            
            <div>
              <Label htmlFor="nombre">Nombre de la Empresa *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => updateFormData('nombre', e.target.value)}
                placeholder="Servicios de Buceo Ltda."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rut">RUT *</Label>
                <Input
                  id="rut"
                  value={formData.rut}
                  onChange={(e) => updateFormData('rut', e.target.value)}
                  placeholder="12.345.678-9"
                  required
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
                    <SelectItem value="suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => updateFormData('direccion', e.target.value)}
                placeholder="Av. Los Leones 123, Las Condes, Santiago"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => updateFormData('telefono', e.target.value)}
                  placeholder="+56 2 2345 6789"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="contacto@empresa.cl"
                />
              </div>
            </div>
          </div>

          {/* Especialidades */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Especialidades</h3>
            
            <div className="flex gap-2">
              <Input
                value={newEspecialidad}
                onChange={(e) => setNewEspecialidad(e.target.value)}
                placeholder="Agregar especialidad..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEspecialidad())}
              />
              <Button type="button" onClick={addEspecialidad} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.especialidades && formData.especialidades.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.especialidades.map((especialidad, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {especialidad}
                    <button
                      type="button"
                      onClick={() => removeEspecialidad(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Certificaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Certificaciones</h3>
            
            <div className="flex gap-2">
              <Input
                value={newCertificacion}
                onChange={(e) => setNewCertificacion(e.target.value)}
                placeholder="Agregar certificación..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertificacion())}
              />
              <Button type="button" onClick={addCertificacion} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.certificaciones && formData.certificaciones.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.certificaciones.map((certificacion, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {certificacion}
                    <button
                      type="button"
                      onClick={() => removeCertificacion(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.nombre || !formData.rut || !formData.direccion}
              className="flex-1"
            >
              {isSubmitting ? "Guardando..." : (isEditing ? "Actualizar" : "Crear Contratista")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
