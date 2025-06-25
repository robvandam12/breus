
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { BaseUser } from "./BaseUserManagement";

interface EditUserFormProps {
  initialData: BaseUser;
  onSubmit: (userData: any) => Promise<void>;
  onCancel: () => void;
}

export const EditUserForm = ({ initialData, onSubmit, onCancel }: EditUserFormProps) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    email: initialData.email || '',
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    rol: initialData.rol || 'buzo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAvailableRoles = () => {
    switch (profile?.role) {
      case 'superuser':
        return [
          { value: 'superuser', label: 'Super Usuario' },
          { value: 'admin_salmonera', label: 'Admin Salmonera' },
          { value: 'admin_servicio', label: 'Admin Servicio' },
          { value: 'supervisor', label: 'Supervisor' },
          { value: 'buzo', label: 'Buzo' }
        ];
      case 'admin_salmonera':
        return [
          { value: 'admin_salmonera', label: 'Admin Salmonera' },
          { value: 'supervisor', label: 'Supervisor' },
          { value: 'buzo', label: 'Buzo' }
        ];
      case 'admin_servicio':
        return [
          { value: 'admin_servicio', label: 'Admin Servicio' },
          { value: 'supervisor', label: 'Supervisor' },
          { value: 'buzo', label: 'Buzo' }
        ];
      default:
        return [{ value: 'buzo', label: 'Buzo' }];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onCancel();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          value={formData.apellido}
          onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rol">Rol</Label>
        <Select value={formData.rol} onValueChange={(value) => setFormData(prev => ({ ...prev, rol: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getAvailableRoles().map(role => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Actualizando...' : 'Actualizar Usuario'}
        </Button>
      </div>
    </form>
  );
};
