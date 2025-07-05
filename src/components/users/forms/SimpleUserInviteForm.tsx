import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Mail, AlertCircle } from "lucide-react";

interface SimpleUserInviteFormProps {
  onSubmit: (data: { email: string; rol: string }) => Promise<void>;
  onCancel: () => void;
}

export const SimpleUserInviteForm = ({ onSubmit, onCancel }: SimpleUserInviteFormProps) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
      </div>

      {/* Información importante */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Invitación por correo:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>El usuario recibirá un correo con un enlace de invitación</li>
              <li>Deberá completar su registro y perfil al hacer clic en el enlace</li>
              <li>La invitación expira en 7 días</li>
            </ul>
          </div>
        </div>
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