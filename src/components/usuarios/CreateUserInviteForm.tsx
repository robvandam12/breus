
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, User } from 'lucide-react';

interface CreateUserInviteFormProps {
  onSubmit: (data: {
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  }) => Promise<void>;
  onCancel: () => void;
  empresaType: 'salmonera' | 'contratista';
}

export const CreateUserInviteForm = ({ onSubmit, onCancel, empresaType }: CreateUserInviteFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableRoles = empresaType === 'salmonera' 
    ? [
        { value: 'admin_salmonera', label: 'Administrador Salmonera' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'buzo', label: 'Buzo' }
      ]
    : [
        { value: 'admin_servicio', label: 'Administrador Servicio' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'buzo', label: 'Buzo' }
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.nombre || !formData.apellido || !formData.rol) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error inviting user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Nombre"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
            placeholder="Apellido"
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
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="usuario@ejemplo.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="rol">Rol *</Label>
        <Select value={formData.rol} onValueChange={(value) => setFormData(prev => ({ ...prev, rol: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol..." />
          </SelectTrigger>
          <SelectContent>
            {availableRoles
              .filter(role => role.value && role.value.trim() !== '')
              .map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Invitación por Email</p>
            <p className="text-sm text-blue-700">
              Se enviará una invitación al email proporcionado con instrucciones para acceder al sistema.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={!formData.email || !formData.nombre || !formData.apellido || !formData.rol || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Invitación'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
