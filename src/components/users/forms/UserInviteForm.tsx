
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { Mail } from "lucide-react";

interface UserInviteFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const UserInviteForm = ({ onSubmit, onCancel }: UserInviteFormProps) => {
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'buzo',
    empresa_id: '',
    tipo_empresa: '' as 'salmonera' | 'contratista' | '',
  });

  const roleOptions = [
    { value: 'superuser', label: 'Super Usuario' },
    { value: 'admin_salmonera', label: 'Admin Salmonera' },
    { value: 'admin_servicio', label: 'Admin Servicio' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'buzo', label: 'Buzo' },
  ];

  const salmoneraOptions = salmoneras.map(s => ({
    value: s.id,
    label: `${s.nombre} (${s.rut})`,
  }));

  const contratistaOptions = contratistas.map(c => ({
    value: c.id,
    label: `${c.nombre} (${c.rut})`,
  }));

  const tipoEmpresaOptions = [
    { value: 'salmonera', label: 'Salmonera' },
    { value: 'contratista', label: 'Contratista' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      email: formData.email,
      nombre: formData.nombre,
      apellido: formData.apellido,
      rol: formData.rol,
      ...(formData.empresa_id && { empresa_id: formData.empresa_id }),
      ...(formData.tipo_empresa && { tipo_empresa: formData.tipo_empresa }),
    };
    
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Juan"
            required
          />
        </div>
        <div>
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            placeholder="Pérez"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="juan.perez@empresa.cl"
          required
        />
      </div>

      <div>
        <Label htmlFor="rol">Rol *</Label>
        <EnhancedSelect
          value={formData.rol}
          onValueChange={(value) => setFormData({ ...formData, rol: value })}
          options={roleOptions}
          placeholder="Seleccionar rol..."
        />
      </div>

      <div>
        <Label htmlFor="tipo_empresa">Tipo de Empresa</Label>
        <EnhancedSelect
          value={formData.tipo_empresa}
          onValueChange={(value) => setFormData({ ...formData, tipo_empresa: value as 'salmonera' | 'contratista' | '' })}
          options={tipoEmpresaOptions}
          placeholder="Seleccionar tipo..."
        />
      </div>

      {formData.tipo_empresa === 'salmonera' && (
        <div>
          <Label htmlFor="empresa_id">Salmonera</Label>
          <EnhancedSelect
            value={formData.empresa_id}
            onValueChange={(value) => setFormData({ ...formData, empresa_id: value })}
            options={salmoneraOptions}
            placeholder="Seleccionar salmonera..."
          />
        </div>
      )}

      {formData.tipo_empresa === 'contratista' && (
        <div>
          <Label htmlFor="empresa_id">Contratista</Label>
          <EnhancedSelect
            value={formData.empresa_id}
            onValueChange={(value) => setFormData({ ...formData, empresa_id: value })}
            options={contratistaOptions}
            placeholder="Seleccionar contratista..."
          />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit"
          disabled={!formData.nombre || !formData.apellido || !formData.email}
          className="flex-1"
        >
          <Mail className="w-4 h-4 mr-2" />
          Enviar Invitación
        </Button>
        <Button 
          type="button"
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};
