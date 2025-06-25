
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Mail } from "lucide-react";

interface UserInviteFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const UserInviteForm = ({ onSubmit, onCancel }: UserInviteFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    rol: 'buzo',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions = [
    { value: 'admin_salmonera', label: 'Admin Salmonera' },
    { value: 'admin_servicio', label: 'Admin Servicio' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'buzo', label: 'Buzo' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.rol) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        email: formData.email,
        rol: formData.rol,
      });
      
      // Reset form
      setFormData({
        email: '',
        rol: 'buzo',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="usuario@empresa.cl"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <Label htmlFor="rol">Rol *</Label>
        <EnhancedSelect
          value={formData.rol}
          onValueChange={(value) => setFormData({ ...formData, rol: value })}
          options={roleOptions}
          placeholder="Seleccionar rol..."
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit"
          disabled={!formData.email || !formData.rol || isSubmitting}
          className="flex-1"
        >
          <Mail className="w-4 h-4 mr-2" />
          {isSubmitting ? "Enviando..." : "Enviar Invitación"}
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
  );
};
