
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanySelector, parseCompanySelection } from "@/components/common/CompanySelector";
import { useAuth } from "@/hooks/useAuth";
import { Mail, User, Building, AlertCircle } from "lucide-react";
import { InviteUserOptions } from "@/hooks/useUsuarios";

interface EnhancedUserInviteFormProps {
  onSubmit: (data: InviteUserOptions) => Promise<void>;
  onCancel: () => void;
  allowedRoles?: string[];
}

export const EnhancedUserInviteForm = ({ 
  onSubmit, 
  onCancel, 
  allowedRoles 
}: EnhancedUserInviteFormProps) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: '',
    empresa_selection: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Roles disponibles según el perfil del usuario
  const getAllRoleOptions = () => {
    const allRoles = [
      { value: 'admin_salmonera', label: 'Administrador Salmonera', description: 'Acceso completo a la salmonera' },
      { value: 'admin_servicio', label: 'Administrador Servicio', description: 'Acceso completo al servicio/contratista' },
      { value: 'supervisor', label: 'Supervisor', description: 'Supervisión de operaciones y equipos' },
      { value: 'buzo', label: 'Buzo', description: 'Operaciones de buceo y bitácoras' },
    ];

    // Filtrar por roles permitidos si se especifican
    if (allowedRoles && allowedRoles.length > 0) {
      return allRoles.filter(role => allowedRoles.includes(role.value));
    }

    return allRoles;
  };

  const roleOptions = getAllRoleOptions();

  // Determinar tipos de empresa que puede invitar
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
      await onSubmit({
        email: formData.email,
        rol: formData.rol,
        nombre: formData.nombre,
        apellido: formData.apellido,
        empresa_selection: formData.empresa_selection,
        overwriteExisting: false,
        cancelPrevious: true
      });
      
      // Reset form
      setFormData({
        email: '',
        nombre: '',
        apellido: '',
        rol: '',
        empresa_selection: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRole = roleOptions.find(role => role.value === formData.rol);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          Invitar Nuevo Usuario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <User className="w-4 h-4 text-gray-600" />
              <h3 className="font-medium text-gray-900">Información Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre del usuario"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Apellido del usuario"
                  disabled={isSubmitting}
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
                placeholder="usuario@empresa.cl"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Rol y Permisos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Building className="w-4 h-4 text-gray-600" />
              <h3 className="font-medium text-gray-900">Rol y Empresa</h3>
            </div>

            <div>
              <Label htmlFor="rol">Rol *</Label>
              <EnhancedSelect
                value={formData.rol}
                onValueChange={(value) => setFormData({ ...formData, rol: value })}
                options={roleOptions.map(role => ({
                  value: role.value,
                  label: role.label,
                  description: role.description
                }))}
                placeholder="Seleccionar rol..."
                disabled={isSubmitting}
              />
              
              {selectedRole && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{selectedRole.label}:</strong> {selectedRole.description}
                  </p>
                </div>
              )}
            </div>

            {/* Selector de empresa - solo para superusers */}
            {profile?.role === 'superuser' && (
              <div>
                <Label>Empresa *</Label>
                <div className="mt-2">
                  <CompanySelector
                    value={formData.empresa_selection}
                    onChange={(value) => setFormData({ ...formData, empresa_selection: value })}
                    includeTypes={getIncludeTypes()}
                    placeholder="Seleccionar empresa..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Información importante */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Se enviará una invitación por correo electrónico</li>
                  <li>El usuario deberá completar su registro desde el email</li>
                  <li>La invitación expira en 7 días</li>
                  <li>El usuario tendrá acceso según el rol asignado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button 
              type="submit"
              disabled={!formData.email || !formData.rol || isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
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
      </CardContent>
    </Card>
  );
};
