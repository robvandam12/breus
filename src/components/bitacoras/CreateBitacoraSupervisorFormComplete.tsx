import { useState, useEffect } from "react";
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
import { FileText, X, ChevronRight, ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { BitacoraSupervisorFormData } from "@/hooks/useBitacoraEnhanced";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

const formSchema = z.object({
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
  fecha_inicio_faena: z.string().min(1, "La fecha de inicio es requerida"),
  hora_inicio_faena: z.string().min(1, "La hora de inicio es requerida"),
  fecha_termino_faena: z.string().optional(),
  hora_termino_faena: z.string().optional(),
  lugar_trabajo: z.string().min(1, "El lugar de trabajo es requerido"),
  tipo_trabajo: z.string().min(1, "El tipo de trabajo es requerido"),
  supervisor_nombre_matricula: z.string().min(1, "La matrícula del supervisor es requerida"),
  condiciones_fisicas_previas: z.string().min(1, "Las condiciones físicas previas son requeridas"),
  incidentes_menores: z.string().optional(),
  embarcacion_nombre: z.string().optional(),
  embarcacion_matricula: z.string().optional(),
  tiempo_total_buceo: z.string().min(1, "El tiempo total de buceo es requerido"),
  incluye_descompresion: z.boolean(),
  contratista_nombre: z.string().min(1, "El nombre del contratista es requerido"),
  buzo_apellido_paterno: z.string().min(1, "El apellido paterno del buzo es requerido"),
  buzo_apellido_materno: z.string().min(1, "El apellido materno del buzo es requerido"),
  buzo_nombres: z.string().min(1, "Los nombres del buzo son requeridos"),
  buzo_run: z.string().min(1, "El RUN del buzo es requerido"),
  profundidad_trabajo: z.number().min(0, "La profundidad de trabajo debe ser mayor a 0"),
  profundidad_maxima: z.number().min(0, "La profundidad máxima debe ser mayor a 0"),
  camara_hiperbarica_requerida: z.boolean(),
  evaluacion_riesgos_actualizada: z.boolean(),
  procedimientos_escritos_disponibles: z.boolean(),
  capacitacion_previa_realizada: z.boolean(),
  identificacion_peligros_realizada: z.boolean(),
  registro_incidentes_reportados: z.boolean(),
  medidas_correctivas: z.string().min(1, "Las medidas correctivas son requeridas"),
  observaciones_generales: z.string().min(1, "Las observaciones generales son requeridas"),
  desarrollo_inmersion: z.string().min(10, "Debe describir el desarrollo de la inmersión"),
  incidentes: z.string().optional(),
  evaluacion_general: z.string().min(10, "La evaluación general es requerida"),
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
  const totalSteps = 6;
  const { inmersiones } = useInmersiones();
  const { equipos: equiposBuceo } = useEquiposBuceoEnhanced();

  const selectedInmersion = inmersiones.find(i => i.inmersion_id === inmersionId);
  const equipoBuceo = equiposBuceo.find(e => e.id === selectedInmersion?.operacion_id);

  const [buzosAsistentes, setBuzosAsistentes] = useState([
    { nombre: '', matricula: '', cargo: '', numero_serie_profundimetro: '', color_profundimetro: '' }
  ]);

  const [equiposUtilizados, setEquiposUtilizados] = useState([
    { equipo_usado: '', numero_registro: '' }
  ]);

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
      incluye_descompresion: false,
      camara_hiperbarica_requerida: false,
      evaluacion_riesgos_actualizada: false,
      procedimientos_escritos_disponibles: false,
      capacitacion_previa_realizada: false,
      identificacion_peligros_realizada: false,
      registro_incidentes_reportados: false,
    }
  });

  // Auto-poblar datos cuando se selecciona la inmersión
  useEffect(() => {
    if (selectedInmersion) {
      setValue('fecha_inicio_faena', selectedInmersion.fecha_inmersion);
      setValue('hora_inicio_faena', selectedInmersion.hora_inicio);
      setValue('hora_termino_faena', selectedInmersion.hora_fin || '');
      setValue('lugar_trabajo', 'Sitio de trabajo');
      setValue('tipo_trabajo', selectedInmersion.objetivo);
      setValue('supervisor_nombre_matricula', selectedInmersion.supervisor);
      setValue('profundidad_trabajo', selectedInmersion.profundidad_max);
      setValue('profundidad_maxima', selectedInmersion.profundidad_max);
      setValue('contratista_nombre', 'Contratista');
      setValue('buzo_nombres', selectedInmersion.buzo_principal);
      
      // Auto-poblar datos del equipo de buceo si existe
      if (equipoBuceo?.miembros && equipoBuceo.miembros.length > 0) {
        const miembrosData = equipoBuceo.miembros.map(miembro => {
          // Acceso seguro a las propiedades del usuario
          const nombreCompleto = miembro.usuario ? 
            `${miembro.usuario.nombre || ''} ${miembro.usuario.apellido || ''}`.trim() : '';
          
          return {
            nombre: nombreCompleto,
            matricula: '',
            cargo: miembro.rol_equipo || '',
            numero_serie_profundimetro: '',
            color_profundimetro: ''
          };
        });
        setBuzosAsistentes(miembrosData.length > 0 ? miembrosData : buzosAsistentes);
      }

      // Marcar cámara hiperbárica si profundidad > 40m
      if (selectedInmersion.profundidad_max > 40) {
        setValue('camara_hiperbarica_requerida', true);
      }
    }
  }, [selectedInmersion, equipoBuceo, setValue]);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const formData: BitacoraSupervisorFormData = {
        codigo: `BIT-SUP-${Date.now()}`,
        inmersion_id: data.inmersion_id,
        supervisor: selectedInmersion?.supervisor || '',
        supervisor_id: profile?.id || '',
        fecha: new Date().toISOString().split('T')[0],
        
        // 1. Identificación de la Faena
        fecha_inicio_faena: data.fecha_inicio_faena,
        hora_inicio_faena: data.hora_inicio_faena,
        fecha_termino_faena: data.fecha_termino_faena,
        hora_termino_faena: data.hora_termino_faena,
        lugar_trabajo: data.lugar_trabajo,
        tipo_trabajo: data.tipo_trabajo,
        supervisor_nombre_matricula: data.supervisor_nombre_matricula,
        
        // 2. Buzos y Asistentes
        buzos_asistentes: buzosAsistentes,
        
        // 3. Equipos Usados
        equipos_utilizados: equiposUtilizados,
        
        // 4. Observaciones
        condiciones_fisicas_previas: data.condiciones_fisicas_previas,
        incidentes_menores: data.incidentes_menores || '',
        
        // 5. Embarcación de Apoyo
        embarcacion_nombre: data.embarcacion_nombre || '',
        embarcacion_matricula: data.embarcacion_matricula || '',
        
        // 6. Tiempo de Buceo
        tiempo_total_buceo: data.tiempo_total_buceo,
        incluye_descompresion: data.incluye_descompresion,
        
        // 7. Contratista de Buceo
        contratista_nombre: data.contratista_nombre,
        
        // 8. Datos del Buzo Principal
        buzo_apellido_paterno: data.buzo_apellido_paterno,
        buzo_apellido_materno: data.buzo_apellido_materno,
        buzo_nombres: data.buzo_nombres,
        buzo_run: data.buzo_run,
        
        // 9. Profundidades
        profundidad_trabajo: data.profundidad_trabajo,
        profundidad_maxima: data.profundidad_maxima,
        camara_hiperbarica_requerida: data.camara_hiperbarica_requerida,
        
        // 10. Gestión Preventiva
        evaluacion_riesgos_actualizada: data.evaluacion_riesgos_actualizada,
        procedimientos_escritos_disponibles: data.procedimientos_escritos_disponibles,
        capacitacion_previa_realizada: data.capacitacion_previa_realizada,
        identificacion_peligros_realizada: data.identificacion_peligros_realizada,
        registro_incidentes_reportados: data.registro_incidentes_reportados,
        
        // 11. Medidas Correctivas
        medidas_correctivas: data.medidas_correctivas,
        
        // 12. Observaciones Generales
        observaciones_generales: data.observaciones_generales,
        
        // Campos de compatibilidad
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes || '',
        evaluacion_general: data.evaluacion_general,
        firmado: false,
        estado_aprobacion: 'pendiente' as const,
        
        // Campos opcionales
        empresa_nombre: 'Empresa',
        centro_nombre: 'Centro'
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

  const addBuzoAsistente = () => {
    if (buzosAsistentes.length < 6) {
      setBuzosAsistentes([...buzosAsistentes, { 
        nombre: '', matricula: '', cargo: '', numero_serie_profundimetro: '', color_profundimetro: '' 
      }]);
    }
  };

  const removeBuzoAsistente = (index: number) => {
    if (buzosAsistentes.length > 1) {
      setBuzosAsistentes(buzosAsistentes.filter((_, i) => i !== index));
    }
  };

  const addEquipo = () => {
    if (equiposUtilizados.length < 3) {
      setEquiposUtilizados([...equiposUtilizados, { equipo_usado: '', numero_registro: '' }]);
    }
  };

  const removeEquipo = (index: number) => {
    if (equiposUtilizados.length > 1) {
      setEquiposUtilizados(equiposUtilizados.filter((_, i) => i !== index));
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">1. Identificación de la Faena</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fecha_inicio_faena">Fecha Inicio *</Label>
          <Input
            id="fecha_inicio_faena"
            type="date"
            {...register('fecha_inicio_faena')}
            className="bg-gray-100"
            readOnly
          />
          {errors.fecha_inicio_faena && (
            <p className="text-sm text-red-600">{errors.fecha_inicio_faena.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="hora_inicio_faena">Hora Inicio *</Label>
          <Input
            id="hora_inicio_faena"
            type="time"
            {...register('hora_inicio_faena')}
            className="bg-gray-100"
            readOnly
          />
          {errors.hora_inicio_faena && (
            <p className="text-sm text-red-600">{errors.hora_inicio_faena.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="fecha_termino_faena">Fecha Término</Label>
          <Input
            id="fecha_termino_faena"
            type="date"
            {...register('fecha_termino_faena')}
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
          <Label htmlFor="lugar_trabajo">Lugar de Trabajo *</Label>
          <Input
            id="lugar_trabajo"
            {...register('lugar_trabajo')}
            placeholder="Lugar específico de trabajo"
            className="bg-gray-100"
            readOnly
          />
          {errors.lugar_trabajo && (
            <p className="text-sm text-red-600">{errors.lugar_trabajo.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="tipo_trabajo">Tipo de Trabajo *</Label>
          <Input
            id="tipo_trabajo"
            {...register('tipo_trabajo')}
            placeholder="Tipo de trabajo a realizar"
            className="bg-gray-100"
            readOnly
          />
          {errors.tipo_trabajo && (
            <p className="text-sm text-red-600">{errors.tipo_trabajo.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="supervisor_nombre_matricula">Nombre y N° de matrícula del supervisor de buceo *</Label>
          <Input
            id="supervisor_nombre_matricula"
            {...register('supervisor_nombre_matricula')}
            placeholder="Nombre completo y matrícula del supervisor"
          />
          {errors.supervisor_nombre_matricula && (
            <p className="text-sm text-red-600">{errors.supervisor_nombre_matricula.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">2. Buzos y Asistentes (máximo 6 personas)</h3>
        <Button 
          type="button" 
          onClick={addBuzoAsistente} 
          disabled={buzosAsistentes.length >= 6}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>
      {buzosAsistentes.map((buzo, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Buzo/Asistente {index + 1}</h4>
            {buzosAsistentes.length > 1 && (
              <Button 
                type="button" 
                onClick={() => removeBuzoAsistente(index)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nombre</Label>
              <Input
                value={buzo.nombre}
                onChange={(e) => {
                  const newBuzos = [...buzosAsistentes];
                  newBuzos[index].nombre = e.target.value;
                  setBuzosAsistentes(newBuzos);
                }}
                placeholder="Nombre completo"
                className={index === 0 ? "bg-gray-100" : ""}
                readOnly={index === 0}
              />
            </div>
            <div>
              <Label>Matrícula y Cargo</Label>
              <Input
                value={buzo.matricula}
                onChange={(e) => {
                  const newBuzos = [...buzosAsistentes];
                  newBuzos[index].matricula = e.target.value;
                  setBuzosAsistentes(newBuzos);
                }}
                placeholder="Matrícula y cargo"
              />
            </div>
            <div>
              <Label>N° de Serie Profundímetro</Label>
              <Input
                value={buzo.numero_serie_profundimetro}
                onChange={(e) => {
                  const newBuzos = [...buzosAsistentes];
                  newBuzos[index].numero_serie_profundimetro = e.target.value;
                  setBuzosAsistentes(newBuzos);
                }}
                placeholder="Número de serie"
              />
            </div>
            <div>
              <Label>Color Profundímetro</Label>
              <Input
                value={buzo.color_profundimetro}
                onChange={(e) => {
                  const newBuzos = [...buzosAsistentes];
                  newBuzos[index].color_profundimetro = e.target.value;
                  setBuzosAsistentes(newBuzos);
                }}
                placeholder="Color del profundímetro"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">3. Equipos Usados (máximo 3 equipos)</h3>
        <Button 
          type="button" 
          onClick={addEquipo} 
          disabled={equiposUtilizados.length >= 3}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </div>
      {equiposUtilizados.map((equipo, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Equipo {index + 1}</h4>
            {equiposUtilizados.length > 1 && (
              <Button 
                type="button" 
                onClick={() => removeEquipo(index)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Equipo Usado</Label>
              <Input
                value={equipo.equipo_usado}
                onChange={(e) => {
                  const newEquipos = [...equiposUtilizados];
                  newEquipos[index].equipo_usado = e.target.value;
                  setEquiposUtilizados(newEquipos);
                }}
                placeholder="Nombre del equipo"
              />
            </div>
            <div>
              <Label>Número de Registro</Label>
              <Input
                value={equipo.numero_registro}
                onChange={(e) => {
                  const newEquipos = [...equiposUtilizados];
                  newEquipos[index].numero_registro = e.target.value;
                  setEquiposUtilizados(newEquipos);
                }}
                placeholder="Número de registro"
              />
            </div>
          </div>
        </Card>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <Label htmlFor="embarcacion_nombre">5. Embarcación de Apoyo - Nombre</Label>
          <Input
            id="embarcacion_nombre"
            {...register('embarcacion_nombre')}
            placeholder="Nombre de la embarcación"
          />
        </div>
        <div>
          <Label htmlFor="embarcacion_matricula">Matrícula de la Embarcación</Label>
          <Input
            id="embarcacion_matricula"
            {...register('embarcacion_matricula')}
            placeholder="Matrícula de la embarcación"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">4. Observaciones y Datos del Trabajo</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="condiciones_fisicas_previas">Condiciones físicas del buzo previas a la inmersión *</Label>
          <Textarea
            id="condiciones_fisicas_previas"
            {...register('condiciones_fisicas_previas')}
            placeholder="Describa las condiciones físicas del buzo antes de la inmersión..."
            className="min-h-[100px]"
          />
          {errors.condiciones_fisicas_previas && (
            <p className="text-sm text-red-600">{errors.condiciones_fisicas_previas.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="incidentes_menores">Incidentes menores, etc.</Label>
          <Textarea
            id="incidentes_menores"
            {...register('incidentes_menores')}
            placeholder="Describa cualquier incidente menor ocurrido..."
            className="min-h-[80px]"
          />
        </div>
        <div>
          <Label htmlFor="tiempo_total_buceo">6. Tiempo Total de Buceo *</Label>
          <Input
            id="tiempo_total_buceo"
            {...register('tiempo_total_buceo')}
            placeholder="Ej: 45 minutos"
          />
          {errors.tiempo_total_buceo && (
            <p className="text-sm text-red-600">{errors.tiempo_total_buceo.message}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="incluye_descompresion"
            checked={watch('incluye_descompresion')}
            onCheckedChange={(checked) => setValue('incluye_descompresion', checked as boolean)}
          />
          <Label htmlFor="incluye_descompresion">Incluye descompresión (se debe adjuntar programa)</Label>
        </div>
        <div>
          <Label htmlFor="contratista_nombre">7. Contratista de Buceo *</Label>
          <Input
            id="contratista_nombre"
            {...register('contratista_nombre')}
            placeholder="Nombre del contratista"
            className="bg-gray-100"
            readOnly
          />
          {errors.contratista_nombre && (
            <p className="text-sm text-red-600">{errors.contratista_nombre.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">8. Datos del Buzo y 9. Profundidades</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buzo_apellido_paterno">Apellido Paterno *</Label>
          <Input
            id="buzo_apellido_paterno"
            {...register('buzo_apellido_paterno')}
            placeholder="Apellido paterno del buzo"
          />
          {errors.buzo_apellido_paterno && (
            <p className="text-sm text-red-600">{errors.buzo_apellido_paterno.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="buzo_apellido_materno">Apellido Materno *</Label>
          <Input
            id="buzo_apellido_materno"
            {...register('buzo_apellido_materno')}
            placeholder="Apellido materno del buzo"
          />
          {errors.buzo_apellido_materno && (
            <p className="text-sm text-red-600">{errors.buzo_apellido_materno.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="buzo_nombres">Nombres *</Label>
          <Input
            id="buzo_nombres"
            {...register('buzo_nombres')}
            placeholder="Nombres del buzo"
            className="bg-gray-100"
            readOnly
          />
          {errors.buzo_nombres && (
            <p className="text-sm text-red-600">{errors.buzo_nombres.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="buzo_run">RUN *</Label>
          <Input
            id="buzo_run"
            {...register('buzo_run')}
            placeholder="RUN del buzo"
          />
          {errors.buzo_run && (
            <p className="text-sm text-red-600">{errors.buzo_run.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="profundidad_trabajo">Profundidad de Trabajo (mts) *</Label>
          <Input
            id="profundidad_trabajo"
            type="number"
            {...register('profundidad_trabajo', { valueAsNumber: true })}
            placeholder="Profundidad de trabajo"
            className="bg-gray-100"
            readOnly
          />
          {errors.profundidad_trabajo && (
            <p className="text-sm text-red-600">{errors.profundidad_trabajo.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="profundidad_maxima">Profundidad Máxima (mts) *</Label>
          <Input
            id="profundidad_maxima"
            type="number"
            {...register('profundidad_maxima', { valueAsNumber: true })}
            placeholder="Profundidad máxima"
            className="bg-gray-100"
            readOnly
          />
          {errors.profundidad_maxima && (
            <p className="text-sm text-red-600">{errors.profundidad_maxima.message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="camara_hiperbarica_requerida"
          checked={watch('camara_hiperbarica_requerida')}
          onCheckedChange={(checked) => setValue('camara_hiperbarica_requerida', checked as boolean)}
        />
        <Label htmlFor="camara_hiperbarica_requerida">
          Cámara hiperbárica requerida (sobre 40 metros - adjuntar documentos)
        </Label>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">10. Gestión Preventiva Según Decreto N°44</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="evaluacion_riesgos_actualizada"
            checked={watch('evaluacion_riesgos_actualizada')}
            onCheckedChange={(checked) => setValue('evaluacion_riesgos_actualizada', checked as boolean)}
          />
          <Label htmlFor="evaluacion_riesgos_actualizada">Evaluación de riesgos específica del buceo actualizada</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="procedimientos_escritos_disponibles"
            checked={watch('procedimientos_escritos_disponibles')}
            onCheckedChange={(checked) => setValue('procedimientos_escritos_disponibles', checked as boolean)}
          />
          <Label htmlFor="procedimientos_escritos_disponibles">Procedimientos escritos disponibles y conocidos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="capacitacion_previa_realizada"
            checked={watch('capacitacion_previa_realizada')}
            onCheckedChange={(checked) => setValue('capacitacion_previa_realizada', checked as boolean)}
          />
          <Label htmlFor="capacitacion_previa_realizada">Capacitación previa al buceo realizada</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="identificacion_peligros_realizada"
            checked={watch('identificacion_peligros_realizada')}
            onCheckedChange={(checked) => setValue('identificacion_peligros_realizada', checked as boolean)}
          />
          <Label htmlFor="identificacion_peligros_realizada">Identificación de peligros y control de riesgos del entorno subacuático realizados</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="registro_incidentes_reportados"
            checked={watch('registro_incidentes_reportados')}
            onCheckedChange={(checked) => setValue('registro_incidentes_reportados', checked as boolean)}
          />
          <Label htmlFor="registro_incidentes_reportados">Registro de incidentes, cuasi accidentes o condiciones inseguras reportadas</Label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="medidas_correctivas">11. Medidas Correctivas Implementadas *</Label>
          <Textarea
            id="medidas_correctivas"
            {...register('medidas_correctivas')}
            placeholder="Describa las medidas correctivas implementadas..."
            className="min-h-[100px]"
          />
          {errors.medidas_correctivas && (
            <p className="text-sm text-red-600">{errors.medidas_correctivas.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="observaciones_generales">12. Observaciones Generales *</Label>
          <Textarea
            id="observaciones_generales"
            {...register('observaciones_generales')}
            placeholder="Observaciones generales..."
            className="min-h-[100px]"
          />
          {errors.observaciones_generales && (
            <p className="text-sm text-red-600">{errors.observaciones_generales.message}</p>
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
            className="min-h-[80px]"
          />
        </div>
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
                Paso {currentStep} de {totalSteps} - Registro completo según normativa
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
                  <p><strong>Operación:</strong> Sin nombre</p>
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
