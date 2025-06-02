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
import { FileText, X } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { BitacoraSupervisorFormData } from "@/hooks/useBitacoras";

const formSchema = z.object({
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  desarrollo_inmersion: z.string().min(10, "Debe describir el desarrollo de la inmersión"),
  incidentes: z.string().optional().default(""),
  evaluacion_general: z.string().min(10, "La evaluación general es requerida"),
});

interface CreateBitacoraSupervisorFormProps {
  inmersionId: string;
  onSubmit: (data: BitacoraSupervisorFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraSupervisorForm = ({ inmersionId, onSubmit, onCancel }: CreateBitacoraSupervisorFormProps) => {
  const [loading, setLoading] = useState(false);
  const { inmersiones } = useInmersiones();

  // Encontrar la inmersión seleccionada
  const selectedInmersion = inmersiones.find(i => i.inmersion_id === inmersionId);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inmersion_id: inmersionId,
      supervisor: selectedInmersion?.supervisor || "",
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
        evaluacion_general: data.evaluacion_general,
        fecha: new Date().toISOString().split('T')[0],
        firmado: false,
        estado_aprobacion: 'pendiente',
        fecha_inicio_faena: '',
        hora_inicio_faena: '',
        hora_termino_faena: '',
        lugar_trabajo: '',
        supervisor_nombre_matricula: '',
        estado_mar: '',
        visibilidad_fondo: 0,
        inmersiones_buzos: [],
        equipos_utilizados: [],
        trabajo_a_realizar: '',
        descripcion_trabajo: '',
        embarcacion_apoyo: '',
        observaciones_generales_texto: '',
        validacion_contratista: false,
        comentarios_validacion: '',
        diving_records: []
      };

      console.log('Submitting bitácora supervisor:', formData);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nueva Bitácora de Supervisor</CardTitle>
              <p className="text-sm text-zinc-500">Registro de supervisión de inmersión</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {selectedInmersion && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">Inmersión Seleccionada</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Código:</strong> {selectedInmersion.codigo}</p>
                  <p><strong>Operación:</strong> {selectedInmersion.operacion_nombre || 'Sin nombre'}</p>
                  <p><strong>Fecha:</strong> {new Date(selectedInmersion.fecha_inmersion).toLocaleDateString('es-CL')}</p>
                </div>
                <div>
                  <p><strong>Buzo Principal:</strong> {selectedInmersion.buzo_principal}</p>
                  <p><strong>Supervisor:</strong> {selectedInmersion.supervisor}</p>
                  <p><strong>Profundidad Máx:</strong> {selectedInmersion.profundidad_max}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
            <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión</Label>
            <Textarea
              id="desarrollo_inmersion"
              {...register('desarrollo_inmersion')}
              placeholder="Describa cómo se desarrolló la inmersión..."
              className="min-h-[100px]"
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
              placeholder="Describa cualquier incidente ocurrido durante la inmersión..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluacion_general">Evaluación General</Label>
            <Textarea
              id="evaluacion_general"
              {...register('evaluacion_general')}
              placeholder="Evaluación general de la inmersión..."
              className="min-h-[100px]"
            />
            {errors.evaluacion_general && (
              <p className="text-sm text-red-600">{errors.evaluacion_general.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
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
  );
};
