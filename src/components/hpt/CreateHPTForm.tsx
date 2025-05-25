
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
import { FileText, X } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

const formSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  operacion_id: z.string().min(1, "Debe seleccionar una operación"),
  plan_trabajo: z.string().min(10, "El plan de trabajo debe tener al menos 10 caracteres"),
  fecha_programada: z.string().optional(),
  hora_inicio: z.string().optional(),
  hora_fin: z.string().optional(),
  descripcion_trabajo: z.string().optional(),
  profundidad_maxima: z.number().min(0).optional(),
  temperatura: z.number().optional(),
  observaciones: z.string().optional()
});

export interface HPTFormData {
  codigo: string;
  supervisor: string;
  operacion_id: string;
  plan_trabajo: string;
  fecha_programada?: string;
  hora_inicio?: string;
  hora_fin?: string;
  descripcion_trabajo?: string;
  profundidad_maxima?: number;
  temperatura?: number;
  observaciones?: string;
}

interface CreateHPTFormProps {
  onSubmit: (data: HPTFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateHPTForm = ({ onSubmit, onCancel }: CreateHPTFormProps) => {
  const [loading, setLoading] = useState(false);
  const { operaciones } = useOperaciones();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: HPTFormData = {
        codigo: data.codigo,
        supervisor: data.supervisor,
        operacion_id: data.operacion_id,
        plan_trabajo: data.plan_trabajo,
        fecha_programada: data.fecha_programada,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        descripcion_trabajo: data.descripcion_trabajo,
        profundidad_maxima: data.profundidad_maxima,
        temperatura: data.temperatura,
        observaciones: data.observaciones
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating HPT:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nueva HPT</CardTitle>
              <p className="text-sm text-zinc-500">Hoja de Planificación de Tarea</p>
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
              <Label htmlFor="codigo">Código HPT</Label>
              <Input
                id="codigo"
                {...register('codigo')}
                placeholder="Ej: HPT-2024-001"
              />
              {errors.codigo && (
                <p className="text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                {...register('supervisor')}
                placeholder="Nombre del supervisor"
              />
              {errors.supervisor && (
                <p className="text-sm text-red-600">{errors.supervisor.message}</p>
              )}
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="fecha_programada">Fecha Programada</Label>
              <Input
                id="fecha_programada"
                type="date"
                {...register('fecha_programada')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                {...register('hora_inicio')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fin">Hora Fin</Label>
              <Input
                id="hora_fin"
                type="time"
                {...register('hora_fin')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                step="0.1"
                {...register('profundidad_maxima', { valueAsNumber: true })}
                placeholder="Ej: 40.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                {...register('temperatura', { valueAsNumber: true })}
                placeholder="Ej: 15.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan_trabajo">Plan de Trabajo</Label>
            <Textarea
              id="plan_trabajo"
              {...register('plan_trabajo')}
              placeholder="Describa detalladamente el plan de trabajo a realizar..."
              className="min-h-[120px]"
            />
            {errors.plan_trabajo && (
              <p className="text-sm text-red-600">{errors.plan_trabajo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion_trabajo">Descripción del Trabajo</Label>
            <Textarea
              id="descripcion_trabajo"
              {...register('descripcion_trabajo')}
              placeholder="Descripción adicional del trabajo..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register('observaciones')}
              placeholder="Observaciones adicionales..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creando...
                </>
              ) : (
                "Crear HPT"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
