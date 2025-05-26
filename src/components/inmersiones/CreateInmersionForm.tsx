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
import { Waves, X } from "lucide-react";
import { useInmersiones, CreateInmersionData } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";

const formSchema = z.object({
  operacion_id: z.string().min(1, "Debe seleccionar una operación"),
  fecha_inmersion: z.string().min(1, "La fecha es requerida"),
  hora_inicio: z.string().min(1, "La hora de inicio es requerida"),
  hora_fin: z.string().optional(),
  profundidad_maxima: z.number().min(0, "La profundidad debe ser positiva").optional(),
  buzo_principal: z.string().min(1, "El buzo principal es requerido"),
  buzo_asistente: z.string().optional(),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  objetivo: z.string().min(10, "Debe describir el objetivo de la inmersión"),
  temperatura_agua: z.number().min(0, "La temperatura debe ser positiva"),
  visibilidad: z.number().min(0, "La visibilidad debe ser positiva"),
  corriente: z.string().min(1, "Debe describir las condiciones de corriente"),
  observaciones: z.string().optional(),
});

interface CreateInmersionFormProps {
  onSubmit: (data: CreateInmersionData) => Promise<void>;
  onCancel: () => void;
}

export const CreateInmersionForm = ({ onSubmit, onCancel }: CreateInmersionFormProps) => {
  const [loading, setLoading] = useState(false);
  const { operaciones } = useOperaciones();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error creating inmersion:', error);
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
              <Waves className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nueva Inmersión</CardTitle>
              <p className="text-sm text-zinc-500">Planificar una nueva inmersión</p>
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
              <Label htmlFor="fecha_inmersion">Fecha de Inmersión</Label>
              <Input
                id="fecha_inmersion"
                type="date"
                {...register('fecha_inmersion')}
              />
              {errors.fecha_inmersion && (
                <p className="text-sm text-red-600">{errors.fecha_inmersion.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora de Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                {...register('hora_inicio')}
              />
              {errors.hora_inicio && (
                <p className="text-sm text-red-600">{errors.hora_inicio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_fin">Hora de Fin (Opcional)</Label>
              <Input
                id="hora_fin"
                type="time"
                {...register('hora_fin')}
              />
              {errors.hora_fin && (
                <p className="text-sm text-red-600">{errors.hora_fin.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (metros)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                step="0.1"
                {...register('profundidad_maxima', { valueAsNumber: true })}
                placeholder="0.0"
              />
              {errors.profundidad_maxima && (
                <p className="text-sm text-red-600">{errors.profundidad_maxima.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura_agua">Temperatura del Agua (°C)</Label>
              <Input
                id="temperatura_agua"
                type="number"
                step="0.1"
                {...register('temperatura_agua', { valueAsNumber: true })}
                placeholder="0.0"
              />
              {errors.temperatura_agua && (
                <p className="text-sm text-red-600">{errors.temperatura_agua.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="visibilidad">Visibilidad (metros)</Label>
              <Input
                id="visibilidad"
                type="number"
                step="0.1"
                {...register('visibilidad', { valueAsNumber: true })}
                placeholder="0.0"
              />
              {errors.visibilidad && (
                <p className="text-sm text-red-600">{errors.visibilidad.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="corriente">Corriente</Label>
              <Input
                id="corriente"
                {...register('corriente')}
                placeholder="Condiciones de corriente..."
              />
              {errors.corriente && (
                <p className="text-sm text-red-600">{errors.corriente.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buzo_principal">Buzo Principal</Label>
              <Input
                id="buzo_principal"
                {...register('buzo_principal')}
                placeholder="Nombre del buzo principal"
              />
              {errors.buzo_principal && (
                <p className="text-sm text-red-600">{errors.buzo_principal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buzo_asistente">Buzo Asistente (Opcional)</Label>
              <Input
                id="buzo_asistente"
                {...register('buzo_asistente')}
                placeholder="Nombre del buzo asistente"
              />
              {errors.buzo_asistente && (
                <p className="text-sm text-red-600">{errors.buzo_asistente.message}</p>
              )}
            </div>
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
            <Label htmlFor="objetivo">Objetivo de la Inmersión</Label>
            <Textarea
              id="objetivo"
              {...register('objetivo')}
              placeholder="Describa el objetivo de la inmersión..."
              className="min-h-[100px]"
            />
            {errors.objetivo && (
              <p className="text-sm text-red-600">{errors.objetivo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
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
                "Crear Inmersión"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
