
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

const formSchema = z.object({
  operacion_id: z.string().min(1, "La operación es requerida"),
  empresa_nombre: z.string().min(1, "El nombre de la empresa es requerido"),
  lugar_faena: z.string().min(1, "El lugar de faena es requerido"),
  fecha: z.string().min(1, "La fecha es requerida"),
  jefe_centro_nombre: z.string().min(1, "El nombre del jefe de centro es requerido"),
  buzo_o_empresa_nombre: z.string().min(1, "El nombre del buzo o empresa es requerido"),
  buzo_matricula: z.string().optional(),
  autorizacion_armada: z.boolean().default(false),
  asistente_buzo_nombre: z.string().optional(),
  asistente_buzo_matricula: z.string().optional(),
  observaciones_generales: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface CreateAnexoBravoFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateAnexoBravoForm = ({ onSubmit, onCancel }: CreateAnexoBravoFormProps) => {
  const [loading, setLoading] = useState(false);
  const { operaciones, isLoading: loadingOperaciones } = useOperaciones();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operacion_id: "",
      empresa_nombre: "",
      lugar_faena: "",
      fecha: new Date().toISOString().split('T')[0],
      jefe_centro_nombre: "",
      buzo_o_empresa_nombre: "",
      buzo_matricula: "",
      autorizacion_armada: false,
      asistente_buzo_nombre: "",
      asistente_buzo_matricula: "",
      observaciones_generales: "",
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  const handleFormSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const anexoBravoData = {
        ...data,
        codigo: `AB-${Date.now()}`,
        fecha_verificacion: data.fecha,
        estado: 'borrador',
        progreso: 0,
        checklist_completo: false,
        firmado: false,
        fecha_creacion: new Date().toISOString().split('T')[0],
      };
      await onSubmit(anexoBravoData);
    } catch (error) {
      console.error('Error submitting anexo bravo form:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure operacionOptions is always a valid array
  const operacionOptions = React.useMemo(() => {
    if (!operaciones || !Array.isArray(operaciones)) {
      return [];
    }
    return operaciones.map(op => ({
      value: op.id,
      label: `${op.codigo} - ${op.nombre}`,
    }));
  }, [operaciones]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nuevo Anexo Bravo</CardTitle>
              <p className="text-sm text-zinc-500">
                Crear un nuevo formulario Anexo Bravo para operación de buceo
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="operacion_id">Operación *</Label>
              {loadingOperaciones ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
              ) : (
                <EnhancedSelect
                  value={watch('operacion_id')}
                  onValueChange={(value) => setValue('operacion_id', value)}
                  placeholder="Seleccionar operación..."
                  options={operacionOptions}
                  emptyMessage="No hay operaciones disponibles"
                />
              )}
              {errors.operacion_id && (
                <p className="text-sm text-red-600">{errors.operacion_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="empresa_nombre">Empresa *</Label>
                <Input
                  id="empresa_nombre"
                  {...register('empresa_nombre')}
                  placeholder="Nombre de la empresa"
                  className="touch-target"
                />
                {errors.empresa_nombre && (
                  <p className="text-sm text-red-600">{errors.empresa_nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lugar_faena">Lugar de Faena *</Label>
                <Input
                  id="lugar_faena"
                  {...register('lugar_faena')}
                  placeholder="Centro de trabajo"
                  className="touch-target"
                />
                {errors.lugar_faena && (
                  <p className="text-sm text-red-600">{errors.lugar_faena.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  {...register('fecha')}
                  className="touch-target"
                />
                {errors.fecha && (
                  <p className="text-sm text-red-600">{errors.fecha.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jefe_centro_nombre">Jefe de Centro *</Label>
                <Input
                  id="jefe_centro_nombre"
                  {...register('jefe_centro_nombre')}
                  placeholder="Nombre del jefe de centro"
                  className="touch-target"
                />
                {errors.jefe_centro_nombre && (
                  <p className="text-sm text-red-600">{errors.jefe_centro_nombre.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="buzo_o_empresa_nombre">Buzo o Empresa de Buceo *</Label>
                <Input
                  id="buzo_o_empresa_nombre"
                  {...register('buzo_o_empresa_nombre')}
                  placeholder="Nombre del buzo o empresa"
                  className="touch-target"
                />
                {errors.buzo_o_empresa_nombre && (
                  <p className="text-sm text-red-600">{errors.buzo_o_empresa_nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buzo_matricula">Matrícula del Buzo</Label>
                <Input
                  id="buzo_matricula"
                  {...register('buzo_matricula')}
                  placeholder="Matrícula"
                  className="touch-target"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="asistente_buzo_nombre">Asistente de Buzo</Label>
                <Input
                  id="asistente_buzo_nombre"
                  {...register('asistente_buzo_nombre')}
                  placeholder="Nombre del asistente"
                  className="touch-target"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asistente_buzo_matricula">Matrícula del Asistente</Label>
                <Input
                  id="asistente_buzo_matricula"
                  {...register('asistente_buzo_matricula')}
                  placeholder="Matrícula del asistente"
                  className="touch-target"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
              <Textarea
                id="observaciones_generales"
                {...register('observaciones_generales')}
                placeholder="Observaciones adicionales..."
                className="touch-target min-h-[100px]"
              />
            </div>
            
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
                    Creando...
                  </>
                ) : (
                  'Crear Anexo Bravo'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
