
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompanySelector, parseCompanySelection } from "@/components/common/CompanySelector";

interface CreatePersonalFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreatePersonalForm = ({ onSubmit, onCancel }: CreatePersonalFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'buzo',
    empresa_selection: '',
    matricula: '',
    certificaciones: '',
    telefono: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.empresa_selection) {
      return;
    }

    // Parsear información de la empresa
    const companyInfo = parseCompanySelection(formData.empresa_selection);
    if (!companyInfo) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        rol: formData.rol,
        matricula: formData.matricula || null,
        certificaciones: formData.certificaciones ? formData.certificaciones.split(',').map(c => c.trim()) : [],
        telefono: formData.telefono || null,
        // Asignar empresa según el tipo
        salmonera_id: companyInfo.tipo === 'salmonera' ? companyInfo.id : null,
        servicio_id: companyInfo.tipo === 'contratista' ? companyInfo.id : null,
      };

      await onSubmit(submitData);
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
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="apellido">Apellido *</Label>
          <Input
            id="apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
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
          required
        />
      </div>

      <div>
        <Label>Rol</Label>
        <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buzo">Buzo</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
            <SelectItem value="admin_salmonera">Admin Salmonera</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CompanySelector
        value={formData.empresa_selection}
        onValueChange={(value) => setFormData({ ...formData, empresa_selection: value })}
        label="Empresa"
        required
        placeholder="Seleccionar empresa"
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="matricula">Matrícula</Label>
          <Input
            id="matricula"
            value={formData.matricula}
            onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
            placeholder="Número de matrícula"
          />
        </div>
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="certificaciones">Certificaciones</Label>
        <Input
          id="certificaciones"
          value={formData.certificaciones}
          onChange={(e) => setFormData({ ...formData, certificaciones: e.target.value })}
          placeholder="Separar con comas: PADI, NAUI, etc."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.nombre || !formData.apellido || !formData.email || !formData.empresa_selection}
        >
          {isSubmitting ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
};
