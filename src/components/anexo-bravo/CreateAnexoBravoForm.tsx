
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileCheck, X } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

const formSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  jefe_centro: z.string().min(1, "El jefe de centro es requerido"),
  operacion_id: z.string().min(1, "Debe seleccionar una operación"),
  fecha_verificacion: z.string().min(1, "La fecha de verificación es requerida"),
  observaciones_generales: z.string().optional()
});

export interface AnexoBravoFormData {
  codigo: string;
  supervisor: string;
  jefe_centro: string;
  operacion_id: string;
  fecha_verificacion: string;
  observaciones_generales?: string;
}

interface CreateAnexoBravoFormProps {
  onSubmit: (data: AnexoBravoFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateAnexoBravoForm = ({ onSubmit, onCancel }: CreateAnexoBravoFormProps) => {
  const [loading, setLoading] = useState(false);
  const { operaciones } = useOperaciones();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: AnexoBravoFormData = {
        codigo: data.codigo,
        supervisor: data.supervisor,
        jefe_centro: data.jefe_centro,
        operacion_id: data.operacion_id,
        fecha_verificacion: data.fecha_verificacion,
        observaciones_generales: data.observaciones_generales
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nuevo Anexo Bravo</CardTitle>
              <p className="text-sm text-zinc-500">Formulario de Verificación de Equipos de Buceo</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código Anexo Bravo</Label>
              <Input
                id="codigo"
                {...register('codigo')}
                placeholder="Ej: AB-2024-001"
              />
              {errors.codigo && (
                <p className="text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_verificacion">Fecha de Verificación</Label>
              <Input
                id="fecha_verificacion"
                type="date"
                {...register('fecha_verificacion')}
              />
              {errors.fecha_verificacion && (
                <p className="text-sm text-red-600">{errors.fecha_verificacion.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor de Servicios</Label>
              <Input
                id="supervisor"
                {...register('supervisor')}
                placeholder="Nombre del supervisor de servicios"
              />
              {errors.supervisor && (
                <p className="text-sm text-red-600">{errors.supervisor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jefe_centro">Jefe de Centro</Label>
              <Input
                id="jefe_centro"
                {...register('jefe_centro')}
                placeholder="Nombre del jefe de centro"
              />
              {errors.jefe_centro && (
                <p className="text-sm text-red-600">{errors.jefe_centro.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="operacion_id">Operación</Label>
              <Select onValueChange={(value) => setValue('operacion_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar operación..." />
                </SelectTrigger>
                <SelectContent>
                  {operaciones.map((operacion) => (
                    <SelectItem key={operacion.id} value={operacion.id}>
                      {operacion.codigo} - {operacion.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.operacion_id && (
                <p className="text-sm text-red-600">{errors.operacion_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
            <Textarea
              id="observaciones_generales"
              {...register('observaciones_generales')}
              placeholder="Observaciones adicionales sobre la verificación..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creando...
                </>
              ) : (
                "Crear Anexo Bravo"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
