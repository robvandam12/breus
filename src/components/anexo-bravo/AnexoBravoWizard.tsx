
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

const informacionGeneralSchema = z.object({
  operacion_id: z.string().min(1, "La operación es requerida"),
  empresa_nombre: z.string().min(1, "El nombre de la empresa es requerido"),
  lugar_faena: z.string().min(1, "El lugar de faena es requerido"),
  fecha: z.string().min(1, "La fecha es requerida"),
  jefe_centro_nombre: z.string().min(1, "El nombre del jefe de centro es requerido"),
});

const identificacionBuzoSchema = z.object({
  buzo_o_empresa_nombre: z.string().min(1, "El nombre del buzo o empresa es requerido"),
  buzo_matricula: z.string().optional(),
  autorizacion_armada: z.boolean().default(false),
  asistente_buzo_nombre: z.string().optional(),
  asistente_buzo_matricula: z.string().optional(),
});

const equiposSchema = z.object({
  compresor: z.boolean().default(false),
  compresor_obs: z.string().optional(),
  regulador_aire: z.boolean().default(false),
  regulador_aire_obs: z.string().optional(),
  traje_neopreno: z.boolean().default(false),
  traje_neopreno_obs: z.string().optional(),
  aletas: z.boolean().default(false),
  aletas_obs: z.string().optional(),
  cinturon_lastre: z.boolean().default(false),
  cinturon_lastre_obs: z.string().optional(),
  mascarilla: z.boolean().default(false),
  mascarilla_obs: z.string().optional(),
  punal_buceo: z.boolean().default(false),
  punal_buceo_obs: z.string().optional(),
  profundimetro: z.boolean().default(false),
  profundimetro_obs: z.string().optional(),
  salvavidas: z.boolean().default(false),
  salvavidas_obs: z.string().optional(),
  tablas_descompresion: z.boolean().default(false),
  tablas_descompresion_obs: z.string().optional(),
  botiquin: z.boolean().default(false),
  botiquin_obs: z.string().optional(),
  cabo_vida: z.boolean().default(false),
  cabo_vida_obs: z.string().optional(),
  cabo_descenso: z.boolean().default(false),
  cabo_descenso_obs: z.string().optional(),
  manguera_plastica: z.boolean().default(false),
  manguera_plastica_obs: z.string().optional(),
  equipo_comunicacion: z.boolean().default(false),
  equipo_comunicacion_obs: z.string().optional(),
});

const bitacoraSchema = z.object({
  hora_inicio: z.string().optional(),
  hora_termino: z.string().optional(),
  fecha_buceo: z.string().optional(),
  relator: z.string().optional(),
});

const trabajadoresSchema = z.object({
  trabajador1_nombre: z.string().optional(),
  trabajador1_rut: z.string().optional(),
  trabajador2_nombre: z.string().optional(),
  trabajador2_rut: z.string().optional(),
  trabajador3_nombre: z.string().optional(),
  trabajador3_rut: z.string().optional(),
  trabajador4_nombre: z.string().optional(),
  trabajador4_rut: z.string().optional(),
  trabajador5_nombre: z.string().optional(),
  trabajador5_rut: z.string().optional(),
  trabajador6_nombre: z.string().optional(),
  trabajador6_rut: z.string().optional(),
});

const firmasSchema = z.object({
  supervisor_servicio_nombre: z.string().optional(),
  supervisor_blumar_nombre: z.string().optional(),
  observaciones_generales: z.string().optional(),
});

interface AnexoBravoWizardProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const AnexoBravoWizard = ({ onSubmit, onCancel }: AnexoBravoWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { operaciones, isLoading: loadingOperaciones } = useOperaciones();

  const [formData, setFormData] = useState({
    informacionGeneral: {},
    identificacionBuzo: {},
    equipos: {},
    bitacora: {},
    trabajadores: {},
    firmas: {}
  });

  const informacionForm = useForm({
    resolver: zodResolver(informacionGeneralSchema),
    defaultValues: {
      operacion_id: "",
      empresa_nombre: "",
      lugar_faena: "",
      fecha: new Date().toISOString().split('T')[0],
      jefe_centro_nombre: "",
    }
  });

  const identificacionForm = useForm({
    resolver: zodResolver(identificacionBuzoSchema),
    defaultValues: {
      buzo_o_empresa_nombre: "",
      buzo_matricula: "",
      autorizacion_armada: false,
      asistente_buzo_nombre: "",
      asistente_buzo_matricula: "",
    }
  });

  const equiposForm = useForm({
    resolver: zodResolver(equiposSchema)
  });

  const bitacoraForm = useForm({
    resolver: zodResolver(bitacoraSchema)
  });

  const trabajadoresForm = useForm({
    resolver: zodResolver(trabajadoresSchema)
  });

  const firmasForm = useForm({
    resolver: zodResolver(firmasSchema)
  });

  const operacionOptions = React.useMemo(() => {
    if (!operaciones || !Array.isArray(operaciones)) {
      return [];
    }
    return operaciones.map(op => ({
      value: op.id,
      label: `${op.codigo} - ${op.nombre}`,
    }));
  }, [operaciones]);

  const steps = [
    { number: 1, title: "Información General", form: informacionForm },
    { number: 2, title: "Identificación del Buzo", form: identificacionForm },
    { number: 3, title: "Chequeo de Equipos", form: equiposForm },
    { number: 4, title: "Bitácora de Buceo", form: bitacoraForm },
    { number: 5, title: "Trabajadores", form: trabajadoresForm },
    { number: 6, title: "Firmas", form: firmasForm }
  ];

  const handleNext = async () => {
    const currentForm = steps[currentStep - 1].form;
    const isValid = await currentForm.trigger();
    
    if (isValid) {
      const data = currentForm.getValues();
      setFormData(prev => ({
        ...prev,
        [getCurrentStepKey()]: data
      }));
      
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentStepKey = () => {
    const keys = ['informacionGeneral', 'identificacionBuzo', 'equipos', 'bitacora', 'trabajadores', 'firmas'];
    return keys[currentStep - 1];
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const allData = {
        ...formData.informacionGeneral,
        ...formData.identificacionBuzo,
        ...formData.equipos,
        ...formData.bitacora,
        ...formData.trabajadores,
        ...formData.firmas,
        codigo: `AB-${Date.now()}`,
        fecha_verificacion: formData.informacionGeneral.fecha,
        estado: 'borrador',
        progreso: 100,
        checklist_completo: true,
        firmado: false,
        fecha_creacion: new Date().toISOString().split('T')[0],
      };
      await onSubmit(allData);
    } catch (error) {
      console.error('Error submitting anexo bravo:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="operacion_id">Operación *</Label>
              {loadingOperaciones ? (
                <div className="h-10 bg-gray-100 animate-pulse rounded-md"></div>
              ) : (
                <EnhancedSelect
                  value={informacionForm.watch('operacion_id')}
                  onValueChange={(value) => informacionForm.setValue('operacion_id', value)}
                  placeholder="Seleccionar operación..."
                  options={operacionOptions}
                  emptyMessage="No hay operaciones disponibles"
                />
              )}
              {informacionForm.formState.errors.operacion_id && (
                <p className="text-sm text-red-600">{informacionForm.formState.errors.operacion_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresa_nombre">Empresa *</Label>
                <Input
                  id="empresa_nombre"
                  {...informacionForm.register('empresa_nombre')}
                  placeholder="Nombre de la empresa"
                />
                {informacionForm.formState.errors.empresa_nombre && (
                  <p className="text-sm text-red-600">{informacionForm.formState.errors.empresa_nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lugar_faena">Lugar de Faena *</Label>
                <Input
                  id="lugar_faena"
                  {...informacionForm.register('lugar_faena')}
                  placeholder="Centro de trabajo"
                />
                {informacionForm.formState.errors.lugar_faena && (
                  <p className="text-sm text-red-600">{informacionForm.formState.errors.lugar_faena.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  {...informacionForm.register('fecha')}
                />
                {informacionForm.formState.errors.fecha && (
                  <p className="text-sm text-red-600">{informacionForm.formState.errors.fecha.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jefe_centro_nombre">Jefe de Centro *</Label>
                <Input
                  id="jefe_centro_nombre"
                  {...informacionForm.register('jefe_centro_nombre')}
                  placeholder="Nombre del jefe de centro"
                />
                {informacionForm.formState.errors.jefe_centro_nombre && (
                  <p className="text-sm text-red-600">{informacionForm.formState.errors.jefe_centro_nombre.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buzo_o_empresa_nombre">Buzo o Empresa de Buceo *</Label>
                <Input
                  id="buzo_o_empresa_nombre"
                  {...identificacionForm.register('buzo_o_empresa_nombre')}
                  placeholder="Nombre del buzo o empresa"
                />
                {identificacionForm.formState.errors.buzo_o_empresa_nombre && (
                  <p className="text-sm text-red-600">{identificacionForm.formState.errors.buzo_o_empresa_nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buzo_matricula">Matrícula del Buzo</Label>
                <Input
                  id="buzo_matricula"
                  {...identificacionForm.register('buzo_matricula')}
                  placeholder="Matrícula"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autorizacion_armada"
                  checked={identificacionForm.watch('autorizacion_armada')}
                  onCheckedChange={(checked) => identificacionForm.setValue('autorizacion_armada', checked)}
                />
                <Label htmlFor="autorizacion_armada">
                  Autorización de la Autoridad Marítima
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asistente_buzo_nombre">Asistente de Buzo</Label>
                <Input
                  id="asistente_buzo_nombre"
                  {...identificacionForm.register('asistente_buzo_nombre')}
                  placeholder="Nombre del asistente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asistente_buzo_matricula">Matrícula del Asistente</Label>
                <Input
                  id="asistente_buzo_matricula"
                  {...identificacionForm.register('asistente_buzo_matricula')}
                  placeholder="Matrícula del asistente"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        const equipos = [
          { key: 'compresor', label: 'Compresor (estanque de reserva)' },
          { key: 'regulador_aire', label: 'Regulador de aire c/ arnés de afirm.' },
          { key: 'traje_neopreno', label: 'Traje de Neopreno' },
          { key: 'aletas', label: 'Aletas de propulsión' },
          { key: 'cinturon_lastre', label: 'Cinturón Lastre c/ escape rápido' },
          { key: 'mascarilla', label: 'Mascarilla' },
          { key: 'punal_buceo', label: 'Puñal de Buceo' },
          { key: 'profundimetro', label: 'Profundímetro' },
          { key: 'salvavidas', label: 'Salvavidas tipo chaleco (buceo autónomo)' },
          { key: 'tablas_descompresion', label: 'Tablas de descompresión plastificadas' },
          { key: 'botiquin', label: 'Botiquín primeros auxilios' },
          { key: 'cabo_vida', label: 'Cabo de vida' },
          { key: 'cabo_descenso', label: 'Cabo de descenso' },
          { key: 'manguera_plastica', label: 'Manguera plástica (mín. 250 lbs) marcada c/ 10m' },
          { key: 'equipo_comunicacion', label: 'Equipo de comunicación en lugar de faena' }
        ];

        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Marque los equipos disponibles y agregue observaciones si es necesario:
            </p>
            {equipos.map((equipo) => (
              <div key={equipo.key} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={equipo.key}
                    checked={equiposForm.watch(equipo.key)}
                    onCheckedChange={(checked) => equiposForm.setValue(equipo.key, checked)}
                  />
                  <Label htmlFor={equipo.key} className="font-medium">
                    {equipo.label}
                  </Label>
                </div>
                <div className="ml-6">
                  <Label htmlFor={`${equipo.key}_obs`} className="text-sm text-gray-600">
                    Observaciones:
                  </Label>
                  <Input
                    id={`${equipo.key}_obs`}
                    {...equiposForm.register(`${equipo.key}_obs`)}
                    placeholder="Observaciones opcionales..."
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora de Inicio</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  {...bitacoraForm.register('hora_inicio')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_termino">Hora de Término</Label>
                <Input
                  id="hora_termino"
                  type="time"
                  {...bitacoraForm.register('hora_termino')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_buceo">Fecha de Buceo</Label>
                <Input
                  id="fecha_buceo"
                  type="date"
                  {...bitacoraForm.register('fecha_buceo')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relator">Relator</Label>
                <Input
                  id="relator"
                  {...bitacoraForm.register('relator')}
                  placeholder="Nombre del relator"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Registre los trabajadores participantes:
            </p>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor={`trabajador${num}_nombre`}>Trabajador {num} - Nombre</Label>
                  <Input
                    id={`trabajador${num}_nombre`}
                    {...trabajadoresForm.register(`trabajador${num}_nombre`)}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`trabajador${num}_rut`}>Trabajador {num} - RUT</Label>
                  <Input
                    id={`trabajador${num}_rut`}
                    {...trabajadoresForm.register(`trabajador${num}_rut`)}
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supervisor_servicio_nombre">Nombre del Supervisor del Servicio</Label>
                <Input
                  id="supervisor_servicio_nombre"
                  {...firmasForm.register('supervisor_servicio_nombre')}
                  placeholder="Nombre y cargo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor_blumar_nombre">Nombre del Supervisor de BLUMAR</Label>
                <Input
                  id="supervisor_blumar_nombre"
                  {...firmasForm.register('supervisor_blumar_nombre')}
                  placeholder="Nombre y cargo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
                <Textarea
                  id="observaciones_generales"
                  {...firmasForm.register('observaciones_generales')}
                  placeholder="Observaciones adicionales..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Notas Importantes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Esta lista debe ser llenada por el Jefe de Centro en el lugar de la faena</li>
                <li>• Debe completarse en presencia del buzo y su asistente</li>
                <li>• Se debe realizar antes de cada faena de buceo</li>
                <li>• Los buzos deben cumplir estrictamente con el Reglamento de Buceo</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="ios-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Anexo Bravo - Paso {currentStep} de {steps.length}</CardTitle>
              <p className="text-sm text-zinc-500">
                {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderCurrentStep()}
          
          <div className="flex justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={currentStep === 1 ? onCancel : handlePrevious}
            >
              {currentStep === 1 ? 'Cancelar' : (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Procesando...
                </>
              ) : currentStep === steps.length ? (
                'Crear Anexo Bravo'
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
