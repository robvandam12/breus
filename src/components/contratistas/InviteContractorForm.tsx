
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Building2, Mail, X, UserPlus } from "lucide-react";
import { MapPicker } from "@/components/ui/map-picker";

const rutRegex = /^[0-9]+-[0-9kK]{1}$/;

const formSchema = z.object({
  empresa_nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  empresa_rut: z.string().regex(rutRegex, "Formato de RUT inválido (ej: 12345678-9)"),
  admin_nombre: z.string().min(2, "El nombre del administrador es requerido"),
  admin_email: z.string().email("Email inválido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  telefono: z.string().optional(),
  especialidades: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface InviteContractorFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const InviteContractorForm = ({ onSubmit, onCancel, isLoading }: InviteContractorFormProps) => {
  const [coordinates, setCoordinates] = useState({ lat: -41.4693, lng: -72.9424 });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresa_nombre: "",
      empresa_rut: "",
      admin_nombre: "",
      admin_email: "",
      direccion: "",
      telefono: "",
      especialidades: "",
    }
  });

  const handleFormSubmit = async (data: FormSchema) => {
    const formData = {
      ...data,
      especialidades: data.especialidades 
        ? data.especialidades.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      coordenadas: coordinates
    };
    
    await onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Invitar Empresa de Servicio</CardTitle>
                <p className="text-sm text-zinc-500">
                  Registra una nueva empresa de servicio e invita a su administrador
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="touch-target">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Datos de la Empresa */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                <Building2 className="w-4 h-4 text-zinc-600" />
                <h3 className="font-semibold text-zinc-900">Datos de la Empresa</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="empresa_nombre">Nombre de la Empresa *</Label>
                  <Input
                    id="empresa_nombre"
                    {...form.register('empresa_nombre')}
                    placeholder="Ej: Servicios Submarinos S.A."
                  />
                  {form.formState.errors.empresa_nombre && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.empresa_nombre.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="empresa_rut">RUT Empresa *</Label>
                  <Input
                    id="empresa_rut"
                    {...form.register('empresa_rut')}
                    placeholder="Ej: 76.123.456-7"
                  />
                  {form.formState.errors.empresa_rut && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.empresa_rut.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  {...form.register('direccion')}
                  placeholder="Ej: Puerto Montt, Región de Los Lagos"
                />
                {form.formState.errors.direccion && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.direccion.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    {...form.register('telefono')}
                    placeholder="Ej: +56 65 2270000"
                  />
                </div>

                <div>
                  <Label htmlFor="especialidades">Especialidades</Label>
                  <Input
                    id="especialidades"
                    {...form.register('especialidades')}
                    placeholder="Ej: Soldadura submarina, Inspección"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Separa las especialidades con comas
                  </p>
                </div>
              </div>
            </div>

            {/* Datos del Administrador */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                <Mail className="w-4 h-4 text-zinc-600" />
                <h3 className="font-semibold text-zinc-900">Administrador de la Empresa</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin_nombre">Nombre Completo *</Label>
                  <Input
                    id="admin_nombre"
                    {...form.register('admin_nombre')}
                    placeholder="Ej: Juan Carlos Pérez"
                  />
                  {form.formState.errors.admin_nombre && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.admin_nombre.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="admin_email">Email *</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    {...form.register('admin_email')}
                    placeholder="Ej: admin@empresa.cl"
                  />
                  {form.formState.errors.admin_email && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.admin_email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Se enviará una invitación por correo al administrador para que cree su cuenta y active la empresa.
                </p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
                <Building2 className="w-4 h-4 text-zinc-600" />
                <h3 className="font-semibold text-zinc-900">Ubicación (Opcional)</h3>
              </div>
              
              <MapPicker
                value={coordinates}
                onChange={setCoordinates}
                center={{ lat: -41.4693, lng: -72.9424 }}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Enviando Invitación...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Invitación
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
