
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
import { X, Anchor } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";

const formSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  objetivo: z.string().min(1, "El objetivo es requerido"),
  fecha_inmersion: z.string().min(1, "La fecha es requerida"),
  hora_inicio: z.string().min(1, "La hora de inicio es requerida"),
  hora_fin: z.string().optional(),
  buzo_principal: z.string().min(1, "El buzo principal es requerido"),
  buzo_asistente: z.string().optional(),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  profundidad_max: z.number().min(1, "La profundidad máxima es requerida"),
  temperatura_agua: z.number().min(1, "La temperatura del agua es requerida"),
  visibilidad: z.number().min(1, "La visibilidad es requerida"),
  corriente: z.string().min(1, "La información de corriente es requerida"),
  observaciones: z.string().optional(),
});

interface CreateInmersionFormProps {
  operacionId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreateInmersionForm = ({ operacionId, onSuccess, onCancel }: CreateInmersionFormProps) => {
  const [loading, setLoading] = useState(false);
  const { createInmersion } = useInmersiones();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: `INM-${Date.now()}`,
      fecha_inmersion: new Date().toISOString().split('T')[0],
      profundidad_max: 0,
      temperatura_agua: 0,
      visibilidad: 0,
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await createInmersion.mutateAsync({
        ...data,
        operacion_id: operacionId,
        estado: 'planificada',
        hpt_validado: false,
        anexo_bravo_validado: false,
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating inmersion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5" />
            Nueva Inmersión
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                {...register('codigo')}
                placeholder="Código de la inmersión"
              />
              {errors.codigo && (
                <p className="text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fecha_inmersion">Fecha de Inmersión *</Label>
              <Input
                id="fecha_inmersion"
                type="date"
                {...register('fecha_inmersion')}
              />
              {errors.fecha_inmersion && (
                <p className="text-sm text-red-600">{errors.fecha_inmersion.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                {...register('hora_inicio')}
              />
              {errors.hora_inicio && (
                <p className="text-sm text-red-600">{errors.hora_inicio.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hora_fin">Hora de Fin</Label>
              <Input
                id="hora_fin"
                type="time"
                {...register('hora_fin')}
              />
            </div>

            <div>
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <Input
                id="buzo_principal"
                {...register('buzo_principal')}
                placeholder="Nombre del buzo principal"
              />
              {errors.buzo_principal && (
                <p className="text-sm text-red-600">{errors.buzo_principal.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <Input
                id="buzo_asistente"
                {...register('buzo_asistente')}
                placeholder="Nombre del buzo asistente"
              />
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                {...register('supervisor')}
                placeholder="Nombre del supervisor"
              />
              {errors.supervisor && (
                <p className="text-sm text-red-600">{errors.supervisor.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="profundidad_max">Profundidad Máxima (m) *</Label>
              <Input
                id="profundidad_max"
                type="number"
                step="0.1"
                {...register('profundidad_max', { valueAsNumber: true })}
                placeholder="Profundidad en metros"
              />
              {errors.profundidad_max && (
                <p className="text-sm text-red-600">{errors.profundidad_max.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="temperatura_agua">Temperatura del Agua (°C) *</Label>
              <Input
                id="temperatura_agua"
                type="number"
                step="0.1"
                {...register('temperatura_agua', { valueAsNumber: true })}
                placeholder="Temperatura en grados Celsius"
              />
              {errors.temperatura_agua && (
                <p className="text-sm text-red-600">{errors.temperatura_agua.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="visibilidad">Visibilidad (m) *</Label>
              <Input
                id="visibilidad"
                type="number"
                step="0.1"
                {...register('visibilidad', { valueAsNumber: true })}
                placeholder="Visibilidad en metros"
              />
              {errors.visibilidad && (
                <p className="text-sm text-red-600">{errors.visibilidad.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="corriente">Corriente *</Label>
              <Input
                id="corriente"
                {...register('corriente')}
                placeholder="Descripción de la corriente"
              />
              {errors.corriente && (
                <p className="text-sm text-red-600">{errors.corriente.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="objetivo">Objetivo *</Label>
            <Textarea
              id="objetivo"
              {...register('objetivo')}
              placeholder="Objetivo de la inmersión"
              rows={3}
            />
            {errors.objetivo && (
              <p className="text-sm text-red-600">{errors.objetivo.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              {...register('observaciones')}
              placeholder="Observaciones adicionales"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
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
