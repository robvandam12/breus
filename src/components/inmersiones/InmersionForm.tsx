
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Waves, Thermometer, Eye, Wind, Clock, Target } from "lucide-react";

interface InmersionFormData {
  operacion_id: string;
  fecha_inmersion: string;
  hora_inicio: string;
  profundidad_max: number;
  temperatura_agua: number;
  visibilidad: number;
  corriente: string;
  supervisor: string;
  buzo_principal: string;
  buzo_asistente?: string;
  objetivo: string;
  observaciones: string;
}

interface InmersionFormProps {
  onSubmit: (data: InmersionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<InmersionFormData>;
}

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
}

export const InmersionForm = ({ onSubmit, onCancel, initialData }: InmersionFormProps) => {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [loadingOperaciones, setLoadingOperaciones] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      operacion_id: initialData?.operacion_id || "",
      fecha_inmersion: initialData?.fecha_inmersion || new Date().toISOString().split('T')[0],
      hora_inicio: initialData?.hora_inicio || "",
      profundidad_max: initialData?.profundidad_max || 0,
      temperatura_agua: initialData?.temperatura_agua || 0,
      visibilidad: initialData?.visibilidad || 0,
      corriente: initialData?.corriente || "nula",
      supervisor: initialData?.supervisor || "",
      buzo_principal: initialData?.buzo_principal || "",
      buzo_asistente: initialData?.buzo_asistente || "",
      objetivo: initialData?.objetivo || "",
      observaciones: initialData?.observaciones || "",
    }
  });

  useEffect(() => {
    loadOperaciones();
  }, []);

  const loadOperaciones = async () => {
    setLoadingOperaciones(true);
    try {
      const { data, error } = await supabase
        .from('operacion')
        .select('id, codigo, nombre')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedOperaciones: Operacion[] = (data || []).map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre
      }));
      
      setOperaciones(formattedOperaciones);
    } catch (err) {
      console.error('Error loading operaciones:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar las operaciones",
        variant: "destructive",
      });
    } finally {
      setLoadingOperaciones(false);
    }
  };

  const handleSubmit = (data: InmersionFormData) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Waves className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>Nueva Inmersión</CardTitle>
              <p className="text-sm text-zinc-500">
                Registro de actividad subacuática
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="operacion_id"
                  rules={{ required: "Operación es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operación *</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingOperaciones ? "Cargando..." : "Seleccionar operación"} />
                          </SelectTrigger>
                          <SelectContent>
                            {operaciones.map((operacion) => (
                              <SelectItem key={operacion.id} value={operacion.id}>
                                {operacion.codigo} - {operacion.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fecha_inmersion"
                  rules={{ required: "Fecha es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Inmersión *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hora_inicio"
                  rules={{ required: "Hora de inicio es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Hora de Inicio *
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objetivo"
                  rules={{ required: "Objetivo es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Objetivo de la Inmersión *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Inspección de redes, mantenimiento estructuras..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Condiciones Ambientales */}
          <Card>
            <CardHeader>
              <CardTitle>Condiciones Ambientales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="profundidad_max"
                  rules={{ required: "Profundidad es requerida", min: { value: 0, message: "Debe ser mayor a 0" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Waves className="w-4 h-4" />
                        Profundidad Máxima (m) *
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temperatura_agua"
                  rules={{ required: "Temperatura es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />
                        Temperatura del Agua (°C) *
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visibilidad"
                  rules={{ required: "Visibilidad es requerida", min: { value: 0, message: "Debe ser mayor a 0" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Visibilidad (m) *
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="corriente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Wind className="w-4 h-4" />
                        Corriente
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar condición" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nula">Nula</SelectItem>
                            <SelectItem value="leve">Leve</SelectItem>
                            <SelectItem value="moderada">Moderada</SelectItem>
                            <SelectItem value="fuerte">Fuerte</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Personal */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Asignado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supervisor"
                  rules={{ required: "Supervisor es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del supervisor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buzo_principal"
                  rules={{ required: "Buzo principal es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buzo Principal *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del buzo principal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buzo_asistente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buzo Asistente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del buzo asistente (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones Adicionales</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalles adicionales sobre la inmersión..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-between items-center">
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Waves className="w-4 h-4 mr-2" />
              Crear Inmersión
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
