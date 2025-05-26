
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, ArrowLeft, User, Mail, Phone, Building2, HardHat } from "lucide-react";
import { CreateUserFormData } from "@/hooks/useUsers";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";

interface CreateUserFormProps {
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  onCancel: () => void;
  restrictedRoles?: string[]; // Para restringir roles en ciertas pantallas
}

export const CreateUserForm = ({ onSubmit, onCancel, restrictedRoles }: CreateUserFormProps) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'buzo',
    salmonera_id: null,
    servicio_id: null,
    telefono: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CreateUserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const roles = [
    { value: 'superuser', label: 'Super Usuario', description: 'Acceso completo al sistema' },
    { value: 'admin_salmonera', label: 'Administrador Salmonera', description: 'Gestión de salmonera y operaciones' },
    { value: 'admin_servicio', label: 'Administrador Servicio', description: 'Gestión de empresa de servicios' },
    { value: 'supervisor', label: 'Supervisor de Buceo', description: 'Supervisión de operaciones de buceo' },
    { value: 'buzo', label: 'Buzo Profesional', description: 'Ejecución de inmersiones' }
  ].filter(role => !restrictedRoles || restrictedRoles.includes(role.value));

  const shouldShowEmpresaField = (rol: string) => {
    return rol === 'admin_salmonera' || rol === 'supervisor' || rol === 'buzo';
  };

  const shouldShowServicioField = (rol: string) => {
    return rol === 'admin_servicio' || rol === 'supervisor' || rol === 'buzo';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-600" />
              Crear Nuevo Usuario
            </CardTitle>
            <p className="text-sm text-zinc-500">
              Complete la información del nuevo usuario
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-zinc-600" />
              <h3 className="text-lg font-medium">Información Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => updateFormData('nombre', e.target.value)}
                  placeholder="Juan"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => updateFormData('apellido', e.target.value)}
                  placeholder="Pérez"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="juan.perez@empresa.cl"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => updateFormData('telefono', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Rol y Permisos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Rol y Permisos</h3>
            
            <div>
              <Label htmlFor="rol">Rol del Usuario *</Label>
              <Select value={formData.rol} onValueChange={(value: any) => updateFormData('rol', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-zinc-500">{role.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Asignación de Empresa */}
            {shouldShowEmpresaField(formData.rol) && (
              <div>
                <Label htmlFor="salmonera">Salmonera</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Select 
                    value={formData.salmonera_id || ''} 
                    onValueChange={(value) => updateFormData('salmonera_id', value || null)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Seleccionar salmonera (opcional)..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {salmoneras.map((salmonera) => (
                        <SelectItem key={salmonera.id} value={salmonera.id}>
                          {salmonera.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {shouldShowServicioField(formData.rol) && (
              <div>
                <Label htmlFor="servicio">Empresa de Servicio</Label>
                <div className="relative">
                  <HardHat className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Select 
                    value={formData.servicio_id || ''} 
                    onValueChange={(value) => updateFormData('servicio_id', value || null)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Seleccionar contratista (opcional)..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {contratistas.map((contratista) => (
                        <SelectItem key={contratista.id} value={contratista.id}>
                          {contratista.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.nombre || !formData.apellido || !formData.email}
              className="flex-1"
            >
              {isSubmitting ? "Creando..." : "Crear Usuario"}
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
