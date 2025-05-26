
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
import { usePoolPersonal } from "@/hooks/usePoolPersonal";
import { BitacoraSupervisorFormData } from "@/hooks/useBitacoras";

const formSchema = z.object({
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  desarrollo_inmersion: z.string().min(10, "Debe describir el desarrollo de la inmersión"),
  incidentes: z.string().optional().default(""),
  evaluacion_general: z.string().min(10, "La evaluación general es requerida"),
});

interface BitacoraSupervisorFormEnhancedProps {
  onSubmit: (data: BitacoraSupervisorFormData) => Promise<void>;
  onCancel: () => void;
}

export const BitacoraSupervisorFormEnhanced = ({ onSubmit, onCancel }: BitacoraSupervisorFormEnhancedProps) => {
  const [loading, setLoading] = useState(false);
  const { inmersiones } = useInmersiones();
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
      incidentes: ""
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: BitacoraSupervisorFormData = {
        inmersion_id: data.inmersion_id,
        supervisor: data.supervisor,
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes || "",
        evaluacion_general: data.evaluacion_general
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar inmersiones completadas y supervisores disponibles
  const inmersionesCompletadas = inmersiones.filter(i => i.estado === 'completada');
  const supervisores = personal.filter(p => p.rol === 'supervisor');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-xl border-0">
        <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-purple-900">Nueva Bitácora de Supervisor</CardTitle>
                <p className="text-sm text-purple-600 mt-1">Registro de supervisión de inmersión</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
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
                      <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                        {inmersion.codigo} - {inmersion.objetivo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.inmersion_id && (
                  <p className="text-sm text-red-600">{errors.inmersion_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
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
                {errors.supervisor && (
                  <p className="text-sm text-red-600">{errors.supervisor.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión</Label>
              <Textarea
                id="desarrollo_inmersion"
                {...register('desarrollo_inmersion')}
                placeholder="Describa cómo se desarrolló la inmersión, condiciones encontradas, trabajo realizado..."
                className="min-h-[120px]"
              />
              {errors.desarrollo_inmersion && (
                <p className="text-sm text-red-600">{errors.desarrollo_inmersion.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentes">Incidentes (Opcional)</Label>
              <Textarea
                id="incidentes"
                {...register('incidentes')}
                placeholder="Describa cualquier incidente, problema o situación anómala ocurrida durante la inmersión..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500">
                Incluya detalles sobre cualquier desviación del plan original, problemas de equipo, condiciones adversas, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluacion_general">Evaluación General</Label>
              <Textarea
                id="evaluacion_general"
                {...register('evaluacion_general')}
                placeholder="Evaluación general de la inmersión: cumplimiento de objetivos, desempeño del equipo, recomendaciones..."
                className="min-h-[120px]"
              />
              {errors.evaluacion_general && (
                <p className="text-sm text-red-600">{errors.evaluacion_general.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
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
    </div>
  );
};
