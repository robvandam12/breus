
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOperaciones } from "@/hooks/useOperaciones";
import { InmersionFormData } from "@/hooks/useInmersiones";
import { Waves, AlertTriangle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CreateInmersionFormProps {
  onSubmit: (data: InmersionFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateInmersionForm = ({ onSubmit, onCancel }: CreateInmersionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { operaciones, loading: loadingOperaciones } = useOperaciones();

  const form = useForm<InmersionFormData>({
    defaultValues: {
      operacion_id: "",
      fecha_inmersion: "",
      hora_inicio: "",
      hora_fin: "",
      buzo_principal: "",
      buzo_asistente: "",
      supervisor: "",
      objetivo: "",
      profundidad_max: 0,
      temperatura_agua: 15,
      visibilidad: 0,
      corriente: "",
      observaciones: "",
    }
  });

  const handleSubmit = async (data: InmersionFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting inmersion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock data - en producción vendría de la base de datos
  const buzos = [
    "Miguel Torres", "Carlos Ruiz", "Diego Silva", "Roberto López",
    "Ana Martínez", "Pedro González", "Luis Morales", "José Rivera"
  ];

  const supervisores = [
    "Diego Martínez", "Carlos Rojas", "Ana López", "Roberto Silva"
  ];

  const tiposCorriente = [
    "Nula", "Débil", "Moderada", "Fuerte", "Muy Fuerte"
  ];

  if (loadingOperaciones) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner text="Cargando formulario..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Waves className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Nueva Inmersión</CardTitle>
              <p className="text-sm text-zinc-500">
                Registre los detalles de la inmersión planificada
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="operacion_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operación *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una operación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {operaciones.map((op) => (
                            <SelectItem key={op.id} value={op.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {op.codigo}
                                </Badge>
                                {op.nombre}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_inmersion"
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Inicio *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hora_fin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Término (Estimada)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buzo_principal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buzo Principal *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione buzo principal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {buzos.map((buzo) => (
                            <SelectItem key={buzo} value={buzo}>
                              {buzo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione buzo asistente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {buzos.map((buzo) => (
                            <SelectItem key={buzo} value={buzo}>
                              {buzo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supervisor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione supervisor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {supervisores.map((supervisor) => (
                            <SelectItem key={supervisor} value={supervisor}>
                              {supervisor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profundidad_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profundidad Máxima (m) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperatura_agua"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperatura del Agua (°C) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibilidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibilidad (m) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
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
                      <FormLabel>Corriente *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione tipo de corriente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposCorriente.map((corriente) => (
                            <SelectItem key={corriente} value={corriente}>
                              {corriente}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="objetivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo de la Inmersión *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describa el objetivo y actividades de la inmersión..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observaciones adicionales, condiciones especiales, etc..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Importante</span>
                </div>
                <p className="text-sm text-amber-600">
                  Asegúrese de que la HPT correspondiente esté aprobada y firmada antes de proceder con la inmersión.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
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
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
