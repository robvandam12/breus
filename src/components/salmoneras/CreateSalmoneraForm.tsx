
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Building2, X } from "lucide-react";
import { SalmoneraFormData } from "@/hooks/useSalmoneras";
import { SalmoneraFormFields } from "./SalmoneraFormFields";

// Validación de RUT chileno simplificada
const rutRegex = /^[0-9]+-[0-9kK]{1}$/;

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre no puede exceder 100 caracteres"),
  rut: z.string().min(1, "El RUT es requerido").regex(rutRegex, "Formato de RUT inválido (ej: 12345678-9)"),
  direccion: z.string().min(1, "La dirección es requerida"),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  estado: z.enum(['activa', 'inactiva', 'suspendida']),
});

interface CreateSalmoneraFormProps {
  onSubmit: (data: SalmoneraFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<SalmoneraFormData>;
  isEditing?: boolean;
}

export const CreateSalmoneraForm = ({ 
  onSubmit, 
  onCancel, 
  initialData,
  isEditing = false 
}: CreateSalmoneraFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      rut: initialData?.rut || "",
      direccion: initialData?.direccion || "",
      telefono: initialData?.telefono || "",
      email: initialData?.email || "",
      estado: initialData?.estado || 'activa',
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: SalmoneraFormData = {
        nombre: data.nombre,
        rut: data.rut,
        direccion: data.direccion,
        telefono: data.telefono || undefined,
        email: data.email || undefined,
        estado: data.estado,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting salmonera form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {isEditing ? 'Editar Salmonera' : 'Nueva Salmonera'}
                </CardTitle>
                <p className="text-sm text-zinc-500">
                  {isEditing ? 'Modifica los datos de la salmonera' : 'Registra una nueva empresa salmonera'}
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
            <SalmoneraFormFields form={form} />
            
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="touch-target"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="bg-blue-600 hover:bg-blue-700 touch-target"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditing ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  isEditing ? 'Actualizar Salmonera' : 'Crear Salmonera'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
