
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanySelector, parseCompanySelection } from "@/components/common/CompanySelector";
import { useAuth } from "@/hooks/useAuth";

interface InviteUserFormProps {
  onSubmit: (data: {
    email: string;
    rol: string;
    nombre?: string;
    apellido?: string;
    empresa_selection: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export const InviteUserForm = ({ onSubmit, onCancel }: InviteUserFormProps) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: '',
    empresa_selection: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableRoles = [
    { value: 'admin_salmonera', label: 'Administrador Salmonera' },
    { value: 'admin_servicio', label: 'Administrador Servicio' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'buzo', label: 'Buzo' }
  ];

  // Determinar qué tipos de empresa puede invitar según el rol del usuario
  const getIncludeTypes = (): ('salmonera' | 'contratista')[] => {
    if (profile?.role === 'superuser') {
      return ['salmonera', 'contratista'];
    }
    if (profile?.role === 'admin_salmonera') {
      return ['salmonera'];
    }
    if (profile?.role === 'admin_servicio') {
      return ['contratista'];
    }
    return ['salmonera', 'contratista'];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.rol || !formData.empresa_selection) {
      return;
    }

    // Validar que la empresa seleccionada sea válida
    const companyInfo = parseCompanySelection(formData.empresa_selection);
    if (!companyInfo) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre del usuario"
          />
        </div>
        <div>
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            placeholder="Apellido del usuario"
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
          placeholder="email@ejemplo.com"
          required
        />
      </div>

      <div>
        <Label>Rol *</Label>
        <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CompanySelector
        value={formData.empresa_selection}
        onChange={(value) => setFormData({ ...formData, empresa_selection: value })}
        label="Empresa"
        required
        includeTypes={getIncludeTypes()}
        placeholder="Seleccionar empresa de destino"
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.email || !formData.rol || !formData.empresa_selection}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Invitación'}
        </Button>
      </div>
    </form>
  );
};
