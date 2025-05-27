
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useAuth } from "@/hooks/useAuth";

interface CreateEquipoFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateEquipoForm = ({ onSubmit, onCancel }: CreateEquipoFormProps) => {
  const { profile } = useAuth();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    empresa_id: '',
    tipo_empresa: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-assign empresa based on user profile
    let finalData = { ...formData };
    
    if (profile?.salmonera_id) {
      finalData.empresa_id = profile.salmonera_id;
      finalData.tipo_empresa = 'salmonera';
    } else if (profile?.servicio_id) {
      finalData.empresa_id = profile.servicio_id;
      finalData.tipo_empresa = 'servicio';
    }
    
    onSubmit(finalData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const availableEmpresas = profile?.role === 'superuser' 
    ? [...salmoneras.map(s => ({ ...s, tipo: 'salmonera' })), ...contratistas.map(c => ({ ...c, tipo: 'servicio' }))]
    : profile?.salmonera_id 
      ? salmoneras.filter(s => s.id === profile.salmonera_id).map(s => ({ ...s, tipo: 'salmonera' }))
      : contratistas.filter(c => c.id === profile?.servicio_id).map(c => ({ ...c, tipo: 'servicio' }));

  return (
    <>
      <DialogHeader>
        <DialogTitle>Crear Nuevo Equipo de Buceo</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre del Equipo *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Equipo Centro Norte"
            required
          />
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Descripción del equipo..."
          />
        </div>

        {profile?.role === 'superuser' && (
          <div>
            <Label htmlFor="empresa">Empresa *</Label>
            <Select
              value={formData.empresa_id}
              onValueChange={(value) => {
                const empresa = availableEmpresas.find(e => e.id === value);
                handleChange('empresa_id', value);
                handleChange('tipo_empresa', empresa?.tipo || '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa..." />
              </SelectTrigger>
              <SelectContent>
                {availableEmpresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nombre} ({empresa.tipo === 'salmonera' ? 'Salmonera' : 'Servicio'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Crear Equipo
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
};
