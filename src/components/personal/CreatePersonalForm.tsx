
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { PersonalFormData } from "@/hooks/usePersonalPool";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CreatePersonalFormProps {
  onSubmit: (data: PersonalFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export const CreatePersonalForm = ({ onSubmit, onCancel, initialData, isEditing }: CreatePersonalFormProps) => {
  const [formData, setFormData] = useState<PersonalFormData>({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'buzo',
    empresa_id: '',
    tipo_empresa: 'salmonera',
    matricula: '',
    especialidades: [],
    certificaciones: []
  });
  
  const [newEspecialidad, setNewEspecialidad] = useState('');
  const [newCertificacion, setNewCertificacion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch salmoneras and contratistas
  const { data: salmoneras = [] } = useQuery({
    queryKey: ['salmoneras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: contratistas = [] } = useQuery({
    queryKey: ['contratistas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contratistas')
        .select('id, nombre')
        .eq('estado', 'activo');
      if (error) throw error;
      return data || [];
    }
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        email: initialData.email || '',
        rol: initialData.rol || 'buzo',
        empresa_id: initialData.empresa_id || '',
        tipo_empresa: initialData.tipo_empresa || 'salmonera',
        matricula: initialData.matricula || '',
        especialidades: initialData.especialidades || [],
        certificaciones: initialData.certificaciones || []
      });
    }
  }, [initialData, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEspecialidad = () => {
    if (newEspecialidad.trim() && !formData.especialidades?.includes(newEspecialidad.trim())) {
      setFormData(prev => ({
        ...prev,
        especialidades: [...(prev.especialidades || []), newEspecialidad.trim()]
      }));
      setNewEspecialidad('');
    }
  };

  const removeEspecialidad = (especialidad: string) => {
    setFormData(prev => ({
      ...prev,
      especialidades: prev.especialidades?.filter(e => e !== especialidad) || []
    }));
  };

  const addCertificacion = () => {
    if (newCertificacion.trim() && !formData.certificaciones?.includes(newCertificacion.trim())) {
      setFormData(prev => ({
        ...prev,
        certificaciones: [...(prev.certificaciones || []), newCertificacion.trim()]
      }));
      setNewCertificacion('');
    }
  };

  const removeCertificacion = (certificacion: string) => {
    setFormData(prev => ({
      ...prev,
      certificaciones: prev.certificaciones?.filter(c => c !== certificacion) || []
    }));
  };

  const empresas = formData.tipo_empresa === 'salmonera' ? salmoneras : contratistas;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Personal' : 'Agregar Nuevo Personal'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">Rol *</Label>
            <Select
              value={formData.rol}
              onValueChange={(value: 'supervisor' | 'buzo') => 
                setFormData(prev => ({ ...prev, rol: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="buzo">Buzo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_empresa">Tipo de Empresa</Label>
              <Select
                value={formData.tipo_empresa}
                onValueChange={(value: 'salmonera' | 'contratista') => 
                  setFormData(prev => ({ ...prev, tipo_empresa: value, empresa_id: '' }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salmonera">Salmonera</SelectItem>
                  <SelectItem value="contratista">Contratista</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Select
                value={formData.empresa_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, empresa_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              id="matricula"
              value={formData.matricula}
              onChange={(e) => setFormData(prev => ({ ...prev, matricula: e.target.value }))}
              placeholder="Número de matrícula profesional"
            />
          </div>

          <div className="space-y-2">
            <Label>Especialidades</Label>
            <div className="flex gap-2">
              <Input
                value={newEspecialidad}
                onChange={(e) => setNewEspecialidad(e.target.value)}
                placeholder="Agregar especialidad"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEspecialidad())}
              />
              <Button type="button" onClick={addEspecialidad} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.especialidades && formData.especialidades.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.especialidades.map((especialidad, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {especialidad}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeEspecialidad(especialidad)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Certificaciones</Label>
            <div className="flex gap-2">
              <Input
                value={newCertificacion}
                onChange={(e) => setNewCertificacion(e.target.value)}
                placeholder="Agregar certificación"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertificacion())}
              />
              <Button type="button" onClick={addCertificacion} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.certificaciones && formData.certificaciones.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.certificaciones.map((certificacion, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {certificacion}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeCertificacion(certificacion)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
