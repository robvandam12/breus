import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, X, ChevronRight, ChevronLeft } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { BitacoraSupervisorFormData } from "@/hooks/useBitacoras";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
  folio: z.string().optional(),
  codigo_verificacion: z.string().optional(),
  empresa_nombre: z.string().min(1, "El nombre de la empresa es requerido"),
  centro_nombre: z.string().min(1, "El nombre del centro es requerido"),
  supervisor: z.string().min(1, "El supervisor es requerido"),
  supervisor_nombre_matricula: z.string().optional(),
  fecha_inicio_faena: z.string().optional(),
  hora_inicio_faena: z.string().optional(),
  hora_termino_faena: z.string().optional(),
  lugar_trabajo: z.string().min(1, "El lugar de trabajo es requerido"),
  estado_mar: z.string().optional(),
  visibilidad_fondo: z.number().optional(),
  trabajo_a_realizar: z.string().min(1, "Debe describir el trabajo a realizar"),
  descripcion_trabajo: z.string().min(10, "Debe describir el desarrollo del trabajo"),
  desarrollo_inmersion: z.string().min(10, "Debe describir el desarrollo de la inmersión"),
  incidentes: z.string().optional(),
  evaluacion_general: z.string().min(10, "La evaluación general es requerida"),
  embarcacion_apoyo: z.string().optional(),
  observaciones_generales_texto: z.string().optional(),
  validacion_contratista: z.boolean().optional(),
  comentarios_validacion: z.string().optional(),
});

interface CreateBitacoraSupervisorFormCompleteProps {
  inmersionId: string;
  onSubmit: (data: BitacoraSupervisorFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraSupervisorFormComplete = ({ 
  inmersionId, 
  onSubmit, 
  onCancel 
}: CreateBitacoraSupervisorFormCompleteProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const { inmersiones } = useInmersiones();

  const selectedInmersion = inmersiones.find(i => i.inmersion_id === inmersionId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inmersion_id: inmersionId,
      supervisor: selectedInmersion?.supervisor || "",
      empresa_nombre: "",
      centro_nombre: "",
      lugar_trabajo: "",
      trabajo_a_realizar: "",
      descripcion_trabajo: "",
      desarrollo_inmersion: "",
      evaluacion_general: "",
      validacion_contratista: false
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: BitacoraSupervisorFormData = {
        codigo: `BIT-SUP-${Date.now()}`,
        inmersion_id: data.inmersion_id,
        supervisor: data.supervisor,
        supervisor_id: profile?.id || '',
        fecha: new Date().toISOString().split('T')[0],
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes || "",
        evaluacion_general: data.evaluacion_general,
        firmado: false,
        estado_aprobacion: 'pendiente',
        // Campos completos
        folio: data.folio,
        codigo_verificacion: data.codigo_verificacion,
        empresa_nombre: data.empresa_nombre,
        centro_nombre: data.centro_nombre,
        fecha_inicio_faena: data.fecha_inicio_faena,
        hora_inicio_faena: data.hora_inicio_faena,
        hora_termino_faena: data.hora_termino_faena,
        lugar_trabajo: data.lugar_trabajo,
        supervisor_nombre_matricula: data.supervisor_nombre_matricula,
        estado_mar: data.estado_mar,
        visibilidad_fondo: data.visibilidad_fondo,
        trabajo_a_realizar: data.trabajo_a_realizar,
        descripcion_trabajo: data.descripcion_trabajo,
        embarcacion_apoyo: data.embarcacion_apoyo,
        observaciones_generales_texto: data.observaciones_generales_texto,
        validacion_contratista: data.validacion_contratista || false,
        comentarios_validacion: data.comentarios_validacion,
        inmersiones_buzos: [],
        equipos_utilizados: [],
        diving_records: []
      };

      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="folio">Folio</Label>
            <Input
              id="folio"
              {...register('folio')}
              placeholder="Número de folio"
            />
          </div>
          <div>
            <Label htmlFor="codigo_verificacion">Código de Verificación</Label>
            <Input
              id="codigo_verificacion"
              {...register('codigo_verificacion')}
              placeholder="Código de verificación"
            />
          </div>
          <div>
            <Label htmlFor="empresa_nombre">Empresa *</Label>
            <Input
              id="empresa_nombre"
              {...register('empresa_nombre')}
              placeholder="Nombre de la empresa"
            />
            {errors.empresa_nombre && (
              <p className="text-sm text-red-600">{errors.empresa_nombre.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="centro_nombre">Centro de Trabajo *</Label>
            <Input
              id="centro_nombre"
              {...register('centro_nombre')}
              placeholder="Nombre del centro de trabajo"
            />
            {errors.centro_nombre && (
              <p className="text-sm text-red-600">{errors.centro_nombre.message}</p>
            )}
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
            <Label htmlFor="supervisor_nombre_matricula">Matrícula Supervisor</Label>
            <Input
              id="supervisor_nombre_matricula"
              {...register('supervisor_nombre_matricula')}
              placeholder="Matrícula del supervisor"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Detalles de la Faena</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fecha_inicio_faena">Fecha Inicio Faena</Label>
            <Input
              id="fecha_inicio_faena"
              type="date"
              {...register('fecha_inicio_faena')}
            />
          </div>
          <div>
            <Label htmlFor="lugar_trabajo">Lugar de Trabajo *</Label>
            <Input
              id="lugar_trabajo"
              {...register('lugar_trabajo')}
              placeholder="Lugar específico de trabajo"
            />
            {errors.lugar_trabajo && (
              <p className="text-sm text-red-600">{errors.lugar_trabajo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="hora_inicio_faena">Hora Inicio</Label>
            <Input
              id="hora_inicio_faena"
              type="time"
              {...register('hora_inicio_faena')}
            />
          </div>
          <div>
            <Label htmlFor="hora_termino_faena">Hora Término</Label>
            <Input
              id="hora_termino_faena"
              type="time"
              {...register('hora_termino_faena')}
            />
          </div>
          <div>
            <Label htmlFor="estado_mar">Estado del Mar</Label>
            <Select onValueChange={(value) => setValue('estado_mar', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado del mar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calmo">Calmo</SelectItem>
                <SelectItem value="ligero">Ligero</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="agitado">Agitado</SelectItem>
                <SelectItem value="muy_agitado">Muy Agitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="visibilidad_fondo">Visibilidad Fondo (m)</Label>
            <Input
              id="visibilidad_fondo"
              type="number"
              {...register('visibilidad_fondo', { valueAsNumber: true })}
              placeholder="Visibilidad en metros"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="embarcacion_apoyo">Embarcación de Apoyo</Label>
            <Input
              id="embarcacion_apoyo"
              {...register('embarcacion_apoyo')}
              placeholder="Nombre de la embarcación de apoyo"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Descripción del Trabajo</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="trabajo_a_realizar">Trabajo a Realizar *</Label>
            <Textarea
              id="trabajo_a_realizar"
              {...register('trabajo_a_realizar')}
              placeholder="Describa el trabajo que se va a realizar..."
              className="min-h-[100px]"
            />
            {errors.trabajo_a_realizar && (
              <p className="text-sm text-red-600">{errors.trabajo_a_realizar.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="descripcion_trabajo">Descripción del Trabajo *</Label>
            <Textarea
              id="descripcion_trabajo"
              {...register('descripcion_trabajo')}
              placeholder="Describa detalladamente cómo se desarrolló el trabajo..."
              className="min-h-[120px]"
            />
            {errors.descripcion_trabajo && (
              <p className="text-sm text-red-600">{errors.descripcion_trabajo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión *</Label>
            <Textarea
              id="desarrollo_inmersion"
              {...register('desarrollo_inmersion')}
              placeholder="Describa cómo se desarrolló la inmersión..."
              className="min-h-[120px]"
            />
            {errors.desarrollo_inmersion && (
              <p className="text-sm text-red-600">{errors.desarrollo_inmersion.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="incidentes">Incidentes (Opcional)</Label>
            <Textarea
              id="incidentes"
              {...register('incidentes')}
              placeholder="Describa cualquier incidente ocurrido durante la inmersión..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Evaluación y Validación</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="evaluacion_general">Evaluación General *</Label>
            <Textarea
              id="evaluacion_general"
              {...register('evaluacion_general')}
              placeholder="Evaluación general de la inmersión..."
              className="min-h-[120px]"
            />
            {errors.evaluacion_general && (
              <p className="text-sm text-red-600">{errors.evaluacion_general.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="observaciones_generales_texto">Observaciones Generales</Label>
            <Textarea
              id="observaciones_generales_texto"
              {...register('observaciones_generales_texto')}
              placeholder="Observaciones generales adicionales..."
              className="min-h-[100px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="validacion_contratista"
              checked={watch('validacion_contratista')}
              onCheckedChange={(checked) => setValue('validacion_contratista', checked as boolean)}
            />
            <Label htmlFor="validacion_contratista">Validación del Contratista</Label>
          </div>
          {watch('validacion_contratista') && (
            <div>
              <Label htmlFor="comentarios_validacion">Comentarios de Validación</Label>
              <Textarea
                id="comentarios_validacion"
                {...register('comentarios_validacion')}
                placeholder="Comentarios sobre la validación..."
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nueva Bitácora de Supervisor Completa</CardTitle>
              <p className="text-sm text-zinc-500">
                Paso {currentStep} de {totalSteps} - Registro completo de supervisión de inmersión
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
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

        <Separator />

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep} className="bg-purple-600 hover:bg-purple-700">
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
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
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
