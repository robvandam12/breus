
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
import { BitacoraInmersionSelector } from "./BitacoraInmersionSelector";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoras";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
  folio: z.string().optional(),
  codigo_verificacion: z.string().optional(),
  empresa_nombre: z.string().min(1, "El nombre de la empresa es requerido"),
  centro_nombre: z.string().min(1, "El nombre del centro es requerido"),
  buzo: z.string().min(1, "El nombre del buzo es requerido"),
  buzo_rut: z.string().optional(),
  supervisor_nombre: z.string().optional(),
  supervisor_rut: z.string().optional(),
  supervisor_correo: z.string().email("Email inválido").optional().or(z.literal("")),
  jefe_centro_correo: z.string().email("Email inválido").optional().or(z.literal("")),
  contratista_nombre: z.string().optional(),
  contratista_rut: z.string().optional(),
  // Condiciones ambientales
  condamb_estado_puerto: z.string().optional(),
  condamb_estado_mar: z.string().optional(),
  condamb_temp_aire_c: z.number().optional(),
  condamb_temp_agua_c: z.number().optional(),
  condamb_visibilidad_fondo_mts: z.number().optional(),
  condamb_corriente_fondo_nudos: z.number().optional(),
  // Datos técnicos
  datostec_equipo_usado: z.string().min(1, "El equipo usado es requerido"),
  datostec_traje: z.string().optional(),
  datostec_hora_dejo_superficie: z.string().optional(),
  datostec_hora_llegada_fondo: z.string().optional(),
  datostec_hora_salida_fondo: z.string().optional(),
  datostec_hora_llegada_superficie: z.string().optional(),
  // Tiempos
  tiempos_total_fondo: z.string().optional(),
  tiempos_total_descompresion: z.string().optional(),
  tiempos_total_buceo: z.string().optional(),
  tiempos_tabulacion_usada: z.string().optional(),
  tiempos_intervalo_superficie: z.string().optional(),
  tiempos_nitrogeno_residual: z.string().optional(),
  tiempos_grupo_repetitivo_anterior: z.string().optional(),
  tiempos_nuevo_grupo_repetitivo: z.string().optional(),
  // Objetivo
  objetivo_proposito: z.string().min(1, "El propósito es requerido"),
  objetivo_tipo_area: z.string().optional(),
  objetivo_caracteristicas_dimensiones: z.string().optional(),
  // Trabajo realizado
  trabajos_realizados: z.string().min(10, "Debe describir los trabajos realizados"),
  observaciones_tecnicas: z.string().optional(),
  estado_fisico_post: z.string().min(1, "El estado físico post buceo es requerido"),
  profundidad_maxima: z.number().min(0, "La profundidad debe ser mayor a 0"),
  // Condiciones y certificaciones
  condcert_buceo_altitud: z.boolean().optional(),
  condcert_certificados_equipos_usados: z.boolean().optional(),
  condcert_buceo_areas_confinadas: z.boolean().optional(),
  condcert_observaciones: z.string().optional(),
  validador_nombre: z.string().optional(),
});

interface CreateBitacoraBuzoFormCompleteProps {
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraBuzoFormComplete = ({ 
  onSubmit, 
  onCancel 
}: CreateBitacoraBuzoFormCompleteProps) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>('');
  const totalSteps = 6;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresa_nombre: "",
      centro_nombre: "",
      buzo: "",
      datostec_equipo_usado: "",
      objetivo_proposito: "",
      trabajos_realizados: "",
      estado_fisico_post: "",
      profundidad_maxima: 0,
      condcert_buceo_altitud: false,
      condcert_certificados_equipos_usados: false,
      condcert_buceo_areas_confinadas: false
    }
  });

  const handleInmersionSelected = (inmersionId: string) => {
    setSelectedInmersionId(inmersionId);
    setValue('inmersion_id', inmersionId);
    setCurrentStep(2);
  };

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: BitacoraBuzoFormData = {
        codigo: `BIT-BUZ-${Date.now()}`,
        inmersion_id: data.inmersion_id,
        buzo: data.buzo,
        fecha: new Date().toISOString().split('T')[0],
        trabajos_realizados: data.trabajos_realizados,
        observaciones_tecnicas: data.observaciones_tecnicas,
        estado_fisico_post: data.estado_fisico_post,
        profundidad_maxima: data.profundidad_maxima,
        firmado: false,
        estado_aprobacion: 'pendiente',
        // Campos completos
        folio: data.folio,
        codigo_verificacion: data.codigo_verificacion,
        empresa_nombre: data.empresa_nombre,
        centro_nombre: data.centro_nombre,
        buzo_rut: data.buzo_rut,
        supervisor_nombre: data.supervisor_nombre,
        supervisor_rut: data.supervisor_rut,
        supervisor_correo: data.supervisor_correo,
        jefe_centro_correo: data.jefe_centro_correo,
        contratista_nombre: data.contratista_nombre,
        contratista_rut: data.contratista_rut,
        // Condiciones ambientales
        condamb_estado_puerto: data.condamb_estado_puerto,
        condamb_estado_mar: data.condamb_estado_mar,
        condamb_temp_aire_c: data.condamb_temp_aire_c,
        condamb_temp_agua_c: data.condamb_temp_agua_c,
        condamb_visibilidad_fondo_mts: data.condamb_visibilidad_fondo_mts,
        condamb_corriente_fondo_nudos: data.condamb_corriente_fondo_nudos,
        // Datos técnicos del buceo
        datostec_equipo_usado: data.datostec_equipo_usado,
        datostec_traje: data.datostec_traje,
        datostec_hora_dejo_superficie: data.datostec_hora_dejo_superficie,
        datostec_hora_llegada_fondo: data.datostec_hora_llegada_fondo,
        datostec_hora_salida_fondo: data.datostec_hora_salida_fondo,
        datostec_hora_llegada_superficie: data.datostec_hora_llegada_superficie,
        // Tiempos y tabulación
        tiempos_total_fondo: data.tiempos_total_fondo,
        tiempos_total_descompresion: data.tiempos_total_descompresion,
        tiempos_total_buceo: data.tiempos_total_buceo,
        tiempos_tabulacion_usada: data.tiempos_tabulacion_usada,
        tiempos_intervalo_superficie: data.tiempos_intervalo_superficie,
        tiempos_nitrogeno_residual: data.tiempos_nitrogeno_residual,
        tiempos_grupo_repetitivo_anterior: data.tiempos_grupo_repetitivo_anterior,
        tiempos_nuevo_grupo_repetitivo: data.tiempos_nuevo_grupo_repetitivo,
        // Objetivo del buceo
        objetivo_proposito: data.objetivo_proposito,
        objetivo_tipo_area: data.objetivo_tipo_area,
        objetivo_caracteristicas_dimensiones: data.objetivo_caracteristicas_dimensiones,
        // Condiciones y certificaciones
        condcert_buceo_altitud: data.condcert_buceo_altitud,
        condcert_certificados_equipos_usados: data.condcert_certificados_equipos_usados,
        condcert_buceo_areas_confinadas: data.condcert_buceo_areas_confinadas,
        condcert_observaciones: data.condcert_observaciones,
        // Validador final
        validador_nombre: data.validador_nombre
      };

      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
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

  if (currentStep === 1) {
    return (
      <div className="max-w-5xl mx-auto">
        <BitacoraInmersionSelector 
          onInmersionSelected={handleInmersionSelected}
          selectedInmersionId={selectedInmersionId}
        />
      </div>
    );
  }

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Información del Personal</h3>
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
            <Label htmlFor="buzo">Buzo *</Label>
            <Input
              id="buzo"
              {...register('buzo')}
              placeholder="Nombre del buzo"
            />
            {errors.buzo && (
              <p className="text-sm text-red-600">{errors.buzo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="buzo_rut">RUT del Buzo</Label>
            <Input
              id="buzo_rut"
              {...register('buzo_rut')}
              placeholder="RUT del buzo"
            />
          </div>
          <div>
            <Label htmlFor="supervisor_nombre">Supervisor</Label>
            <Input
              id="supervisor_nombre"
              {...register('supervisor_nombre')}
              placeholder="Nombre del supervisor"
            />
          </div>
          <div>
            <Label htmlFor="supervisor_rut">RUT Supervisor</Label>
            <Input
              id="supervisor_rut"
              {...register('supervisor_rut')}
              placeholder="RUT del supervisor"
            />
          </div>
          <div>
            <Label htmlFor="supervisor_correo">Email Supervisor</Label>
            <Input
              id="supervisor_correo"
              type="email"
              {...register('supervisor_correo')}
              placeholder="Email del supervisor"
            />
            {errors.supervisor_correo && (
              <p className="text-sm text-red-600">{errors.supervisor_correo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="jefe_centro_correo">Email Jefe Centro</Label>
            <Input
              id="jefe_centro_correo"
              type="email"
              {...register('jefe_centro_correo')}
              placeholder="Email del jefe de centro"
            />
            {errors.jefe_centro_correo && (
              <p className="text-sm text-red-600">{errors.jefe_centro_correo.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="contratista_nombre">Contratista</Label>
            <Input
              id="contratista_nombre"
              {...register('contratista_nombre')}
              placeholder="Nombre del contratista"
            />
          </div>
          <div>
            <Label htmlFor="contratista_rut">RUT Contratista</Label>
            <Input
              id="contratista_rut"
              {...register('contratista_rut')}
              placeholder="RUT del contratista"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Condiciones Ambientales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condamb_estado_puerto">Estado del Puerto</Label>
            <Select onValueChange={(value) => setValue('condamb_estado_puerto', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="malo">Malo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="condamb_estado_mar">Estado del Mar</Label>
            <Select onValueChange={(value) => setValue('condamb_estado_mar', value)}>
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
            <Label htmlFor="condamb_temp_aire_c">Temperatura Aire (°C)</Label>
            <Input
              id="condamb_temp_aire_c"
              type="number"
              {...register('condamb_temp_aire_c', { valueAsNumber: true })}
              placeholder="Temperatura del aire"
            />
          </div>
          <div>
            <Label htmlFor="condamb_temp_agua_c">Temperatura Agua (°C)</Label>
            <Input
              id="condamb_temp_agua_c"
              type="number"
              {...register('condamb_temp_agua_c', { valueAsNumber: true })}
              placeholder="Temperatura del agua"
            />
          </div>
          <div>
            <Label htmlFor="condamb_visibilidad_fondo_mts">Visibilidad Fondo (m)</Label>
            <Input
              id="condamb_visibilidad_fondo_mts"
              type="number"
              {...register('condamb_visibilidad_fondo_mts', { valueAsNumber: true })}
              placeholder="Visibilidad en metros"
            />
          </div>
          <div>
            <Label htmlFor="condamb_corriente_fondo_nudos">Corriente Fondo (nudos)</Label>
            <Input
              id="condamb_corriente_fondo_nudos"
              type="number"
              step="0.1"
              {...register('condamb_corriente_fondo_nudos', { valueAsNumber: true })}
              placeholder="Corriente en nudos"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Datos Técnicos del Buceo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="datostec_equipo_usado">Equipo Usado *</Label>
            <Input
              id="datostec_equipo_usado"
              {...register('datostec_equipo_usado')}
              placeholder="Equipo de buceo utilizado"
            />
            {errors.datostec_equipo_usado && (
              <p className="text-sm text-red-600">{errors.datostec_equipo_usado.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="datostec_traje">Tipo de Traje</Label>
            <Input
              id="datostec_traje"
              {...register('datostec_traje')}
              placeholder="Tipo de traje utilizado"
            />
          </div>
          <div>
            <Label htmlFor="profundidad_maxima">Profundidad Máxima (m) *</Label>
            <Input
              id="profundidad_maxima"
              type="number"
              {...register('profundidad_maxima', { valueAsNumber: true })}
              placeholder="Profundidad máxima alcanzada"
            />
            {errors.profundidad_maxima && (
              <p className="text-sm text-red-600">{errors.profundidad_maxima.message}</p>
            )}
          </div>
          <div></div>
          <div>
            <Label htmlFor="datostec_hora_dejo_superficie">Hora Dejó Superficie</Label>
            <Input
              id="datostec_hora_dejo_superficie"
              type="time"
              {...register('datostec_hora_dejo_superficie')}
            />
          </div>
          <div>
            <Label htmlFor="datostec_hora_llegada_fondo">Hora Llegada Fondo</Label>
            <Input
              id="datostec_hora_llegada_fondo"
              type="time"
              {...register('datostec_hora_llegada_fondo')}
            />
          </div>
          <div>
            <Label htmlFor="datostec_hora_salida_fondo">Hora Salida Fondo</Label>
            <Input
              id="datostec_hora_salida_fondo"
              type="time"
              {...register('datostec_hora_salida_fondo')}
            />
          </div>
          <div>
            <Label htmlFor="datostec_hora_llegada_superficie">Hora Llegada Superficie</Label>
            <Input
              id="datostec_hora_llegada_superficie"
              type="time"
              {...register('datostec_hora_llegada_superficie')}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Tiempos y Objetivo del Buceo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="tiempos_total_fondo">Tiempo Total Fondo</Label>
            <Input
              id="tiempos_total_fondo"
              {...register('tiempos_total_fondo')}
              placeholder="ej: 45 min"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_total_descompresion">Tiempo Total Descompresión</Label>
            <Input
              id="tiempos_total_descompresion"
              {...register('tiempos_total_descompresion')}
              placeholder="ej: 10 min"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_total_buceo">Tiempo Total Buceo</Label>
            <Input
              id="tiempos_total_buceo"
              {...register('tiempos_total_buceo')}
              placeholder="ej: 55 min"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_tabulacion_usada">Tabulación Usada</Label>
            <Input
              id="tiempos_tabulacion_usada"
              {...register('tiempos_tabulacion_usada')}
              placeholder="Tipo de tabla utilizada"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_intervalo_superficie">Intervalo Superficie</Label>
            <Input
              id="tiempos_intervalo_superficie"
              {...register('tiempos_intervalo_superficie')}
              placeholder="ej: 2 horas"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_nitrogeno_residual">Nitrógeno Residual</Label>
            <Input
              id="tiempos_nitrogeno_residual"
              {...register('tiempos_nitrogeno_residual')}
              placeholder="Valor de nitrógeno residual"
            />
          </div>
          <div>
            <Label htmlFor="tiempos_grupo_repetitivo_anterior">Grupo Repetitivo Anterior</Label>
            <Input
              id="tiempos_grupo_repetitivo_anterior"
              {...register('tiempos_grupo_repetitivo_anterior')}
              placeholder="ej: A, B, C..."
            />
          </div>
          <div>
            <Label htmlFor="tiempos_nuevo_grupo_repetitivo">Nuevo Grupo Repetitivo</Label>
            <Input
              id="tiempos_nuevo_grupo_repetitivo"
              {...register('tiempos_nuevo_grupo_repetitivo')}
              placeholder="ej: A, B, C..."
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h4 className="font-medium">Objetivo del Buceo</h4>
          <div>
            <Label htmlFor="objetivo_proposito">Propósito *</Label>
            <Textarea
              id="objetivo_proposito"
              {...register('objetivo_proposito')}
              placeholder="Describa el propósito de la inmersión..."
              className="min-h-[80px]"
            />
            {errors.objetivo_proposito && (
              <p className="text-sm text-red-600">{errors.objetivo_proposito.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="objetivo_tipo_area">Tipo de Área</Label>
            <Input
              id="objetivo_tipo_area"
              {...register('objetivo_tipo_area')}
              placeholder="ej: Jaulas, Fondeo, Estructuras..."
            />
          </div>
          <div>
            <Label htmlFor="objetivo_caracteristicas_dimensiones">Características y Dimensiones</Label>
            <Textarea
              id="objetivo_caracteristicas_dimensiones"
              {...register('objetivo_caracteristicas_dimensiones')}
              placeholder="Describa características y dimensiones del área de trabajo..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Trabajo Realizado y Certificaciones</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="trabajos_realizados">Trabajos Realizados *</Label>
            <Textarea
              id="trabajos_realizados"
              {...register('trabajos_realizados')}
              placeholder="Describa detalladamente los trabajos realizados durante la inmersión..."
              className="min-h-[120px]"
            />
            {errors.trabajos_realizados && (
              <p className="text-sm text-red-600">{errors.trabajos_realizados.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="observaciones_tecnicas">Observaciones Técnicas</Label>
            <Textarea
              id="observaciones_tecnicas"
              {...register('observaciones_tecnicas')}
              placeholder="Observaciones técnicas adicionales..."
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="estado_fisico_post">Estado Físico Post Buceo *</Label>
            <Select onValueChange={(value) => setValue('estado_fisico_post', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado físico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excelente">Excelente</SelectItem>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="cansado">Cansado</SelectItem>
                <SelectItem value="con_molestias">Con Molestias</SelectItem>
              </SelectContent>
            </Select>
            {errors.estado_fisico_post && (
              <p className="text-sm text-red-600">{errors.estado_fisico_post.message}</p>
            )}
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Condiciones y Certificaciones</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condcert_buceo_altitud"
                  checked={watch('condcert_buceo_altitud')}
                  onCheckedChange={(checked) => setValue('condcert_buceo_altitud', checked as boolean)}
                />
                <Label htmlFor="condcert_buceo_altitud">Buceo en Altitud</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condcert_certificados_equipos_usados"
                  checked={watch('condcert_certificados_equipos_usados')}
                  onCheckedChange={(checked) => setValue('condcert_certificados_equipos_usados', checked as boolean)}
                />
                <Label htmlFor="condcert_certificados_equipos_usados">Equipos Certificados</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condcert_buceo_areas_confinadas"
                  checked={watch('condcert_buceo_areas_confinadas')}
                  onCheckedChange={(checked) => setValue('condcert_buceo_areas_confinadas', checked as boolean)}
                />
                <Label htmlFor="condcert_buceo_areas_confinadas">Buceo en Áreas Confinadas</Label>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="condcert_observaciones">Observaciones sobre Condiciones/Certificaciones</Label>
              <Textarea
                id="condcert_observaciones"
                {...register('condcert_observaciones')}
                placeholder="Observaciones adicionales sobre condiciones y certificaciones..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="validador_nombre">Nombre del Validador</Label>
            <Input
              id="validador_nombre"
              {...register('validador_nombre')}
              placeholder="Nombre de quien valida esta bitácora"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nueva Bitácora de Buzo Completa</CardTitle>
              <p className="text-sm text-zinc-500">
                Paso {currentStep} de {totalSteps} - Registro completo de inmersión de buzo
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
            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}

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
                <Button type="button" onClick={nextStep} className="bg-teal-600 hover:bg-teal-700">
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
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
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
