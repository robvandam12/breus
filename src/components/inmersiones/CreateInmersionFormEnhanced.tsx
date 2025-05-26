
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
import { Anchor, X, Users, MapPin, Clock } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { usePoolPersonal } from "@/hooks/usePoolPersonal";

const formSchema = z.object({
  operacion_id: z.string().min(1, "Debe seleccionar una operación"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  buzo_principal: z.string().min(1, "El buzo principal es requerido"),
  buzo_asistente: z.string().optional(),
  fecha_inmersion: z.string().min(1, "La fecha es requerida"),
  hora_inicio: z.string().min(1, "La hora de inicio es requerida"),
  hora_fin: z.string().optional(),
  profundidad_max: z.number().min(0.1, "La profundidad debe ser mayor a 0"),
  temperatura_agua: z.number().min(0, "La temperatura debe ser válida"),
  visibilidad: z.number().min(0, "La visibilidad debe ser válida"),
  corriente: z.string().min(1, "Las condiciones de corriente son requeridas"),
  objetivo: z.string().min(10, "Debe describir el objetivo de la inmersión"),
  observaciones: z.string().optional(),
});

interface CreateInmersionFormEnhancedProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateInmersionFormEnhanced = ({ onSubmit, onCancel }: CreateInmersionFormEnhancedProps) => {
  const [loading, setLoading] = useState(false);
  const { operaciones } = useOperaciones();
  const { personal } = usePoolPersonal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha_inmersion: new Date().toISOString().split('T')[0],
      hora_inicio: new Date().toTimeString().slice(0, 5),
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await onSubmit({
        ...data,
        estado: 'planificada'
      });
    } catch (error) {
      console.error('Error creating inmersion:', error);
    } finally {
      setLoading(false);
    }
  };

  const operacionesActivas = operaciones.filter(op => op.estado === 'activa');
  const buzos = personal.filter(p => p.rol === 'buzo');
  const supervisores = personal.filter(p => p.rol === 'supervisor');

  const corrienteOptions = [
    "Nula",
    "Ligera (0-1 nudos)",
    "Moderada (1-2 nudos)",
    "Fuerte (2-3 nudos)",
    "Muy fuerte (>3 nudos)"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-xl border-0">
        <CardHeader className="pb-4 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Anchor className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-teal-900">Nueva Inmersión</CardTitle>
                <p className="text-sm text-teal-600 mt-1">Planificar nueva inmersión de buceo</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* 1. Información General */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                1. Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="operacion_id">Operación</Label>
                  <Select onValueChange={(value) => setValue('operacion_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar operación..." />
                    </SelectTrigger>
                    <SelectContent>
                      {operacionesActivas.map((operacion) => (
                        <SelectItem key={operacion.id} value={operacion.id}>
                          {operacion.nombre} - {operacion.codigo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.operacion_id && <p className="text-sm text-red-600 mt-1">{errors.operacion_id.message}</p>}
                </div>
                <div>
                  <Label htmlFor="objetivo">Objetivo de la Inmersión</Label>
                  <Textarea 
                    id="objetivo" 
                    {...register('objetivo')} 
                    placeholder="Describe el objetivo y actividades a realizar..."
                    className="min-h-[80px]"
                  />
                  {errors.objetivo && <p className="text-sm text-red-600 mt-1">{errors.objetivo.message}</p>}
                </div>
              </div>
            </div>

            {/* 2. Equipo de Buceo */}
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                2. Equipo de Buceo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Select onValueChange={(value) => {
                    const supervisor = supervisores.find(s => s.usuario_id === value);
                    if (supervisor) {
                      setValue('supervisor', `${supervisor.nombre} ${supervisor.apellido}`);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar supervisor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisores.map((supervisor) => (
                        <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                          {supervisor.nombre} {supervisor.apellido}
                          {supervisor.matricula && (
                            <span className="text-sm text-gray-500 ml-2">
                              (Mat: {supervisor.matricula})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supervisor && <p className="text-sm text-red-600 mt-1">{errors.supervisor.message}</p>}
                </div>
                <div>
                  <Label htmlFor="buzo_principal">Buzo Principal</Label>
                  <Select onValueChange={(value) => {
                    const buzo = buzos.find(b => b.usuario_id === value);
                    if (buzo) {
                      setValue('buzo_principal', `${buzo.nombre} ${buzo.apellido}`);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar buzo principal..." />
                    </SelectTrigger>
                    <SelectContent>
                      {buzos.map((buzo) => (
                        <SelectItem key={buzo.usuario_id} value={buzo.usuario_id}>
                          {buzo.nombre} {buzo.apellido}
                          {buzo.matricula && (
                            <span className="text-sm text-gray-500 ml-2">
                              (Mat: {buzo.matricula})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.buzo_principal && <p className="text-sm text-red-600 mt-1">{errors.buzo_principal.message}</p>}
                </div>
                <div>
                  <Label htmlFor="buzo_asistente">Buzo Asistente (Opcional)</Label>
                  <Select onValueChange={(value) => {
                    const asistente = buzos.find(b => b.usuario_id === value);
                    if (asistente) {
                      setValue('buzo_asistente', `${asistente.nombre} ${asistente.apellido}`);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar buzo asistente..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asistente</SelectItem>
                      {buzos.map((buzo) => (
                        <SelectItem key={buzo.usuario_id} value={buzo.usuario_id}>
                          {buzo.nombre} {buzo.apellido}
                          {buzo.matricula && (
                            <span className="text-sm text-gray-500 ml-2">
                              (Mat: {buzo.matricula})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 3. Programación */}
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                3. Programación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fecha_inmersion">Fecha</Label>
                  <Input type="date" id="fecha_inmersion" {...register('fecha_inmersion')} />
                  {errors.fecha_inmersion && <p className="text-sm text-red-600 mt-1">{errors.fecha_inmersion.message}</p>}
                </div>
                <div>
                  <Label htmlFor="hora_inicio">Hora de Inicio</Label>
                  <Input type="time" id="hora_inicio" {...register('hora_inicio')} />
                  {errors.hora_inicio && <p className="text-sm text-red-600 mt-1">{errors.hora_inicio.message}</p>}
                </div>
                <div>
                  <Label htmlFor="hora_fin">Hora de Fin Estimada (Opcional)</Label>
                  <Input type="time" id="hora_fin" {...register('hora_fin')} />
                </div>
              </div>
            </div>

            {/* 4. Condiciones de Buceo */}
            <div className="bg-orange-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">4. Condiciones de Buceo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    id="profundidad_max" 
                    {...register('profundidad_max', { valueAsNumber: true })} 
                    placeholder="ej: 25.5"
                  />
                  {errors.profundidad_max && <p className="text-sm text-red-600 mt-1">{errors.profundidad_max.message}</p>}
                </div>
                <div>
                  <Label htmlFor="temperatura_agua">Temperatura del Agua (°C)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    id="temperatura_agua" 
                    {...register('temperatura_agua', { valueAsNumber: true })} 
                    placeholder="ej: 12.5"
                  />
                  {errors.temperatura_agua && <p className="text-sm text-red-600 mt-1">{errors.temperatura_agua.message}</p>}
                </div>
                <div>
                  <Label htmlFor="visibilidad">Visibilidad (m)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    id="visibilidad" 
                    {...register('visibilidad', { valueAsNumber: true })} 
                    placeholder="ej: 8.0"
                  />
                  {errors.visibilidad && <p className="text-sm text-red-600 mt-1">{errors.visibilidad.message}</p>}
                </div>
                <div>
                  <Label htmlFor="corriente">Corriente</Label>
                  <Select onValueChange={(value) => setValue('corriente', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {corrienteOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.corriente && <p className="text-sm text-red-600 mt-1">{errors.corriente.message}</p>}
                </div>
              </div>
            </div>

            {/* 5. Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
              <Textarea 
                id="observaciones" 
                {...register('observaciones')} 
                placeholder="Observaciones adicionales, consideraciones especiales, equipamiento requerido..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
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
                  "Crear Inmersión"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
