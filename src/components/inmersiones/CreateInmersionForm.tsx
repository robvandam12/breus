
import { useState } from "react";
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
import { Anchor, X } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useUsuarios } from "@/hooks/useUsuarios";

const formSchema = z.object({
  operacion_id: z.string().min(1, "La operación es requerida"),
  supervisor_id: z.string().min(1, "El supervisor es requerido"),
  buzo_principal_id: z.string().min(1, "El buzo principal es requerido"),
  buzo_asistente_id: z.string().optional(),
  fecha_inmersion: z.string().min(1, "La fecha es requerida"),
  hora_inicio: z.string().min(1, "La hora de inicio es requerida"),
  hora_fin: z.string().optional(),
  profundidad_max: z.number().min(1, "La profundidad máxima es requerida"),
  temperatura_agua: z.number().min(1, "La temperatura del agua es requerida"),
  visibilidad: z.number().min(0, "La visibilidad debe ser mayor o igual a 0"),
  corriente: z.string().min(1, "El estado de la corriente es requerido"),
  objetivo: z.string().min(1, "El objetivo es requerido"),
  observaciones: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface CreateInmersionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateInmersionForm = ({ onSubmit, onCancel }: CreateInmersionFormProps) => {
  const [loading, setLoading] = useState(false);
  const { operaciones, isLoading: loadingOperaciones } = useOperaciones();
  const { usuarios, isLoading: loadingUsuarios } = useUsuarios();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operacion_id: "",
      supervisor_id: "",
      buzo_principal_id: "",
      buzo_asistente_id: "",
      fecha_inmersion: new Date().toISOString().split('T')[0],
      hora_inicio: "",
      hora_fin: "",
      profundidad_max: 0,
      temperatura_agua: 12,
      visibilidad: 0,
      corriente: "",
      objetivo: "",
      observaciones: "",
    }
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  const handleFormSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const selectedSupervisor = usuarios.find(u => u.usuario_id === data.supervisor_id);
      const selectedBuzoPrincipal = usuarios.find(u => u.usuario_id === data.buzo_principal_id);
      const selectedBuzoAsistente = data.buzo_asistente_id ? usuarios.find(u => u.usuario_id === data.buzo_asistente_id) : null;

      const inmersionData = {
        ...data,
        codigo: `IMM-${Date.now()}`,
        supervisor: `${selectedSupervisor?.nombre} ${selectedSupervisor?.apellido}`,
        buzo_principal: `${selectedBuzoPrincipal?.nombre} ${selectedBuzoPrincipal?.apellido}`,
        buzo_asistente: selectedBuzoAsistente ? `${selectedBuzoAsistente.nombre} ${selectedBuzoAsistente.apellido}` : null,
        estado: 'planificada',
        hpt_validado: false,
        anexo_bravo_validado: false,
      };
      await onSubmit(inmersionData);
    } catch (error) {
      console.error('Error submitting inmersion form:', error);
    } finally {
      setLoading(false);
    }
  };

  const operacionOptions = operaciones.map(op => ({
    value: op.id,
    label: `${op.codigo} - ${op.nombre}`,
  }));

  const supervisorOptions = usuarios
    .filter(u => u.rol === 'supervisor' || u.rol === 'admin_servicio')
    .map(u => ({
      value: u.usuario_id,
      label: `${u.nombre} ${u.apellido} (${u.rol})`,
    }));

  const buzoOptions = usuarios
    .filter(u => u.rol === 'buzo')
    .map(u => ({
      value: u.usuario_id,
      label: `${u.nombre} ${u.apellido}`,
    }));

  const corrienteOptions = [
    { value: 'nula', label: 'Nula' },
    { value: 'leve', label: 'Leve' },
    { value: 'moderada', label: 'Moderada' },
    { value: 'fuerte', label: 'Fuerte' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Anchor className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Nueva Inmersión</CardTitle>
                <p className="text-sm text-zinc-500">
                  Programar una nueva inmersión de buceo
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="touch-target">
              <X className="w-4 h-4" />
            </Button>
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
                <Label htmlFor="supervisor_id">Supervisor *</Label>
                {loadingUsuarios ? (
                  <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
                ) : (
                  <EnhancedSelect
                    value={watch('supervisor_id')}
                    onValueChange={(value) => setValue('supervisor_id', value)}
                    placeholder="Seleccionar supervisor..."
                    options={supervisorOptions}
                    emptyMessage="No hay supervisores disponibles"
                  />
                )}
                {errors.supervisor_id && (
                  <p className="text-sm text-red-600">{errors.supervisor_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buzo_principal_id">Buzo Principal *</Label>
                {loadingUsuarios ? (
                  <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
                ) : (
                  <EnhancedSelect
                    value={watch('buzo_principal_id')}
                    onValueChange={(value) => setValue('buzo_principal_id', value)}
                    placeholder="Seleccionar buzo principal..."
                    options={buzoOptions}
                    emptyMessage="No hay buzos disponibles"
                  />
                )}
                {errors.buzo_principal_id && (
                  <p className="text-sm text-red-600">{errors.buzo_principal_id.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buzo_asistente_id">Buzo Asistente</Label>
              {loadingUsuarios ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
              ) : (
                <EnhancedSelect
                  value={watch('buzo_asistente_id') || ''}
                  onValueChange={(value) => setValue('buzo_asistente_id', value)}
                  placeholder="Seleccionar buzo asistente (opcional)..."
                  options={buzoOptions}
                  emptyMessage="No hay buzos disponibles"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fecha_inmersion">Fecha *</Label>
                <Input
                  id="fecha_inmersion"
                  type="date"
                  {...register('fecha_inmersion')}
                  className="touch-target"
                />
                {errors.fecha_inmersion && (
                  <p className="text-sm text-red-600">{errors.fecha_inmersion.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  {...register('hora_inicio')}
                  className="touch-target"
                />
                {errors.hora_inicio && (
                  <p className="text-sm text-red-600">{errors.hora_inicio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_fin">Hora Fin</Label>
                <Input
                  id="hora_fin"
                  type="time"
                  {...register('hora_fin')}
                  className="touch-target"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="profundidad_max">Profundidad Máxima (m) *</Label>
                <Input
                  id="profundidad_max"
                  type="number"
                  step="0.1"
                  {...register('profundidad_max', { valueAsNumber: true })}
                  className="touch-target"
                />
                {errors.profundidad_max && (
                  <p className="text-sm text-red-600">{errors.profundidad_max.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperatura_agua">Temperatura Agua (°C) *</Label>
                <Input
                  id="temperatura_agua"
                  type="number"
                  step="0.1"
                  {...register('temperatura_agua', { valueAsNumber: true })}
                  className="touch-target"
                />
                {errors.temperatura_agua && (
                  <p className="text-sm text-red-600">{errors.temperatura_agua.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibilidad">Visibilidad (m) *</Label>
                <Input
                  id="visibilidad"
                  type="number"
                  step="0.1"
                  {...register('visibilidad', { valueAsNumber: true })}
                  className="touch-target"
                />
                {errors.visibilidad && (
                  <p className="text-sm text-red-600">{errors.visibilidad.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="corriente">Estado de la Corriente *</Label>
              <EnhancedSelect
                value={watch('corriente')}
                onValueChange={(value) => setValue('corriente', value)}
                placeholder="Seleccionar estado de corriente..."
                options={corrienteOptions}
              />
              {errors.corriente && (
                <p className="text-sm text-red-600">{errors.corriente.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
              <Input
                id="objetivo"
                {...register('objetivo')}
                placeholder="Ej: Inspección de redes, mantenimiento de estructura..."
                className="touch-target"
              />
              {errors.objetivo && (
                <p className="text-sm text-red-600">{errors.objetivo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                {...register('observaciones')}
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
                  'Crear Inmersión'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
