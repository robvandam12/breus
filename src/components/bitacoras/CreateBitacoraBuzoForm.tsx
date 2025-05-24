
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
import { useInmersiones } from "@/hooks/useInmersiones";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoras";

const formSchema = z.object({
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
  buzo: z.string().min(1, "El buzo es requerido"),
  profundidad_maxima: z.number().min(0, "La profundidad debe ser positiva"),
  trabajos_realizados: z.string().min(10, "Debe describir los trabajos realizados"),
  observaciones_tecnicas: z.string().optional().default(""),
  estado_fisico_post: z.string().min(1, "El estado físico post-inmersión es requerido"),
});

interface CreateBitacoraBuzoFormProps {
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraBuzoForm = ({ onSubmit, onCancel }: CreateBitacoraBuzoFormProps) => {
  const [loading, setLoading] = useState(false);
  const { inmersiones } = useInmersiones();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observaciones_tecnicas: ""
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: BitacoraBuzoFormData = {
        inmersion_id: data.inmersion_id,
        buzo: data.buzo,
        profundidad_maxima: data.profundidad_maxima,
        trabajos_realizados: data.trabajos_realizados,
        observaciones_tecnicas: data.observaciones_tecnicas || "",
        estado_fisico_post: data.estado_fisico_post
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar inmersiones completadas
  const inmersionesCompletadas = inmersiones.filter(i => i.estado === 'completada');

  const estadosFisicos = [
    "Excelente - Sin molestias",
    "Bueno - Ligero cansancio",
    "Regular - Algo de fatiga",
    "Malo - Fatiga considerable",
    "Muy malo - Requiere atención médica"
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nueva Bitácora de Buzo</CardTitle>
              <p className="text-sm text-zinc-500">Registro personal de inmersión</p>
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
              <Label htmlFor="inmersion_id">Inmersión</Label>
              <Select onValueChange={(value) => setValue('inmersion_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar inmersión..." />
                </SelectTrigger>
                <SelectContent>
                  {inmersionesCompletadas.map((inmersion) => (
                    <SelectItem key={inmersion.id} value={inmersion.id}>
                      {inmersion.codigo} - {inmersion.operacion_nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.inmersion_id && (
                <p className="text-sm text-red-600">{errors.inmersion_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="buzo">Buzo</Label>
              <Input
                id="buzo"
                {...register('buzo')}
                placeholder="Nombre del buzo"
              />
              {errors.buzo && (
                <p className="text-sm text-red-600">{errors.buzo.message}</p>
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
              <Label htmlFor="estado_fisico_post">Estado Físico Post-Inmersión</Label>
              <Select onValueChange={(value) => setValue('estado_fisico_post', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado..." />
                </SelectTrigger>
                <SelectContent>
                  {estadosFisicos.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.estado_fisico_post && (
                <p className="text-sm text-red-600">{errors.estado_fisico_post.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trabajos_realizados">Trabajos Realizados</Label>
            <Textarea
              id="trabajos_realizados"
              {...register('trabajos_realizados')}
              placeholder="Describa los trabajos realizados durante la inmersión..."
              className="min-h-[100px]"
            />
            {errors.trabajos_realizados && (
              <p className="text-sm text-red-600">{errors.trabajos_realizados.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones_tecnicas">Observaciones Técnicas (Opcional)</Label>
            <Textarea
              id="observaciones_tecnicas"
              {...register('observaciones_tecnicas')}
              placeholder="Observaciones técnicas adicionales..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creando...
                </>
              ) : (
                "Crear Bitácora"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
