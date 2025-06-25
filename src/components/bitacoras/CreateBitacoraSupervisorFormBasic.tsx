
import { useState, useEffect } from "react";
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
import { BitacoraSupervisorFormData } from "@/hooks/useBitacorasSupervisor";
import { useAuth } from "@/hooks/useAuth";
import { InmersionContextInfo } from "./InmersionContextInfo";

const formSchema = z.object({
  supervisor: z.string().min(1, "El supervisor es requerido"),
  desarrollo_inmersion: z.string().min(10, "Debe describir el desarrollo de la inmersión"),
  incidentes: z.string().optional().default(""),
  evaluacion_general: z.string().min(10, "La evaluación general es requerida"),
});

interface InmersionData {
  inmersion_id: string;
  codigo: string;
  fecha_inmersion: string;
  objetivo: string;
  supervisor: string;
  buzo_principal: string;
  hora_inicio: string;
  hora_fin?: string;
  operacion: any;
  equipo_buceo_id?: string;
}

interface CreateBitacoraSupervisorFormBasicProps {
  inmersionData: InmersionData;
  onSubmit: (data: BitacoraSupervisorFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraSupervisorFormBasic = ({ 
  inmersionData, 
  onSubmit, 
  onCancel 
}: CreateBitacoraSupervisorFormBasicProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      supervisor: inmersionData.supervisor || "",
      incidentes: ""
    }
  });

  useEffect(() => {
    if (inmersionData.supervisor) {
      setValue('supervisor', inmersionData.supervisor);
    }
  }, [inmersionData, setValue]);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: BitacoraSupervisorFormData = {
        codigo: `BIT-SUP-${Date.now()}`,
        inmersion_id: inmersionData.inmersion_id,
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes || "",
        evaluacion_general: data.evaluacion_general,
        fecha: new Date().toISOString().split('T')[0],
        firmado: false,
        estado_aprobacion: 'pendiente',
        supervisor: data.supervisor,
        // Campos opcionales con valores por defecto
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
        diving_records: [],
      };

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
        <InmersionContextInfo inmersionData={inmersionData} />

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

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
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
