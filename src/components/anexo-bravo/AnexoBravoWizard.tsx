
import { useState, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Building,
  User,
  Shield,
  Wrench,
  Clock,
  Users,
  PenTool
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";

interface AnexoBravoWizardProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultOperacionId?: string;
}

export const AnexoBravoWizard = ({ onSubmit, onCancel, defaultOperacionId }: AnexoBravoWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { operaciones, isLoading: loadingOperaciones } = useOperaciones();
  const { equipos } = useEquiposBuceo();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();

  // Get operation data for pre-filling
  const operacion = operaciones.find(op => op.id === defaultOperacionId);
  const contratista = contratistas.find(c => c.id === operacion?.contratista_id);
  const sitio = sitios.find(s => s.id === operacion?.sitio_id);
  const equipoBuceo = equipos.find(eq => eq.id === operacion?.equipo_buceo_id);

  const [formData, setFormData] = useState({
    informacionGeneral: {
      operacion_id: defaultOperacionId || "",
      empresa_nombre: contratista?.nombre || "",
      lugar_faena: sitio?.nombre || "",
      fecha: new Date().toISOString().split('T')[0],
      jefe_centro_nombre: "",
    },
    identificacionBuzo: {
      buzo_o_empresa_nombre: contratista?.nombre || "",
      asistente_buzo_nombre: ""
    },
    equipos: {},
    bitacora: {},
    participantes: equipoBuceo?.miembros || [],
    firmas: {}
  });

  const totalSteps = 6;

  const steps = [
    { number: 1, title: "Información General", icon: Building },
    { number: 2, title: "Identificación del Buzo", icon: User },
    { number: 3, title: "Chequeo de Equipos", icon: Wrench },
    { number: 4, title: "Bitácora de Buceo", icon: Clock },
    { number: 5, title: "Trabajadores Participantes", icon: Users },
    { number: 6, title: "Firmas", icon: PenTool }
  ];

  const informacionForm = useForm({
    defaultValues: {
      operacion_id: defaultOperacionId || "",
      empresa_nombre: contratista?.nombre || "",
      lugar_faena: sitio?.nombre || "",
      fecha: new Date().toISOString().split('T')[0],
      jefe_centro_nombre: ""
    }
  });

  // Update form when operation data loads
  useEffect(() => {
    if (operacion && contratista && sitio) {
      informacionForm.setValue('empresa_nombre', contratista.nombre || '');
      informacionForm.setValue('lugar_faena', sitio.nombre || '');
      setFormData(prev => ({
        ...prev,
        informacionGeneral: {
          ...prev.informacionGeneral,
          empresa_nombre: contratista.nombre || '',
          lugar_faena: sitio.nombre || '',
        },
        identificacionBuzo: {
          ...prev.identificacionBuzo,
          buzo_o_empresa_nombre: contratista.nombre || '',
        }
      }));
    }
  }, [operacion, contratista, sitio, informacionForm]);

  const identificacionForm = useForm();
  const equiposForm = useForm();
  const bitacoraForm = useForm({
    defaultValues: {
      bitacora_fecha: new Date().toISOString().split('T')[0],
      bitacora_hora_inicio: "",
      bitacora_hora_termino: "",
      bitacora_relator: ""
    }
  });
  const participantesForm = useForm();
  const firmasForm = useForm();

  const operacionOptions = operaciones.map(op => ({
    value: op.id,
    label: `${op.codigo} - ${op.nombre}`
  }));

  const equipos_lista = [
    { key: 'compresor', label: 'Compresor (estanque de reserva)' },
    { key: 'regulador_aire', label: 'Regulador de aire c/ arnés de afirm.' },
    { key: 'traje_neopren', label: 'Traje de Neoprén' },
    { key: 'aletas_propulsion', label: 'Aletas de propulsión' },
    { key: 'cinturon_lastre', label: 'Cinturón Lastre c/ escape rápido' },
    { key: 'mascarilla', label: 'Mascarilla' },
    { key: 'punal_buceo', label: 'Puñal de Buceo' },
    { key: 'profundimetro', label: 'Profundímetro' },
    { key: 'salvavidas_chaleco', label: 'Salvavidas tipo chaleco (buceo autónomo)' },
    { key: 'tablas_descompresion', label: 'Tablas de descompresión plastificadas' },
    { key: 'botiquin_primeros_auxilios', label: 'Botiquín primeros auxilios' },
    { key: 'cabo_vida', label: 'Cabo de vida' },
    { key: 'cabo_descenso', label: 'Cabo de descenso' },
    { key: 'manguera_plastica', label: 'Manguera plástica (mín. 250 lbs) marcada c/ 10m' },
    { key: 'equipo_comunicacion', label: 'Equipo de comunicación en lugar de faena' },
    { key: 'matricula_buzo', label: 'Matrícula de buzo mariscador' },
    { key: 'matricula_asistente', label: 'Matrícula de quien asiste al buzo (igual o superior)' },
    { key: 'certificado_mantencion', label: 'Certificado de mantención y vigencia de equipos' },
    { key: 'filtro_aire', label: 'Filtro de aire (salida compresor)' },
    { key: 'nivel_aceite_motor', label: 'Nivel de aceite (mineral) motor del compresor' },
    { key: 'nivel_aceite_cabezal', label: 'Nivel de aceite (vegetal) cabezal del compresor' },
    { key: 'valvula_retencion', label: 'Válvula de retención operativa' },
    { key: 'proteccion_partes', label: 'Protección de partes y piezas en movimiento del compresor' },
    { key: 'botella_aire_auxiliar', label: 'Botella de aire auxiliar' }
  ];

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

  const handleFinalSubmit = async () => {
    try {
      const finalData = {
        ...informacionForm.getValues(),
        ...identificacionForm.getValues(),
        equipos: equiposForm.getValues(),
        bitacora: bitacoraForm.getValues(),
        participantes: participantesForm.getValues(),
        firmas: firmasForm.getValues(),
        codigo: `AB-${Date.now()}`,
        estado: 'borrador',
        firmado: false,
        progreso: 100,
        checklist_completo: true
      };
      
      await onSubmit(finalData);
    } catch (error) {
      console.error('Error submitting anexo bravo:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="operacion_id">Operación *</Label>
              <EnhancedSelect
                options={operacionOptions}
                value={informacionForm.watch('operacion_id')}
                onValueChange={(value) => informacionForm.setValue('operacion_id', value)}
                placeholder="Seleccione una operación"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="empresa_nombre">Empresa</Label>
              <Input
                {...informacionForm.register('empresa_nombre')}
                placeholder="Nombre de la empresa"
                value={contratista?.nombre || informacionForm.watch('empresa_nombre')}
                readOnly={!!contratista?.nombre}
              />
            </div>

            <div>
              <Label htmlFor="lugar_faena">Lugar de Faena (Centro)</Label>
              <Input
                {...informacionForm.register('lugar_faena')}
                placeholder="Centro de trabajo"
                value={sitio?.nombre || informacionForm.watch('lugar_faena')}
                readOnly={!!sitio?.nombre}
              />
            </div>

            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                type="date"
                {...informacionForm.register('fecha')}
              />
            </div>

            <div>
              <Label htmlFor="jefe_centro_nombre">Jefe de Centro</Label>
              <Input
                {...informacionForm.register('jefe_centro_nombre')}
                placeholder="Nombre del jefe de centro"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="buzo_o_empresa_nombre">Buzo o Empresa de Buceo</Label>
              <Input
                {...identificacionForm.register('buzo_o_empresa_nombre')}
                placeholder="Nombre del buzo o empresa"
                value={contratista?.nombre || identificacionForm.watch('buzo_o_empresa_nombre')}
                readOnly={!!contratista?.nombre}
              />
            </div>

            <div>
              <Label htmlFor="buzo_matricula">Matrícula</Label>
              <Input
                {...identificacionForm.register('buzo_matricula')}
                placeholder="Número de matrícula"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="autorizacion_armada"
                checked={identificacionForm.watch('autorizacion_armada') || false}
                onCheckedChange={(checked) => identificacionForm.setValue('autorizacion_armada', !!checked)}
              />
              <Label htmlFor="autorizacion_armada">
                Autorización de la Autoridad Marítima
              </Label>
            </div>

            <div>
              <Label htmlFor="asistente_buzo_nombre">Asistente de Buzo (Nombre)</Label>
              <Input
                {...identificacionForm.register('asistente_buzo_nombre')}
                placeholder="Nombre del asistente de buzo"
              />
            </div>

            <div>
              <Label htmlFor="asistente_buzo_matricula">Matrícula del Asistente</Label>
              <Input
                {...identificacionForm.register('asistente_buzo_matricula')}
                placeholder="Número de matrícula del asistente"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Marque los equipos e insumos verificados:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipos_lista.map((equipo) => (
                <div key={equipo.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={equipo.key}
                    checked={equiposForm.watch(equipo.key) || false}
                    onCheckedChange={(checked) => equiposForm.setValue(equipo.key, !!checked)}
                  />
                  <Label htmlFor={equipo.key} className="font-medium">
                    {equipo.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bitacora_hora_inicio">Hora de Inicio</Label>
                <Input
                  type="time"
                  {...bitacoraForm.register('bitacora_hora_inicio')}
                />
              </div>
              <div>
                <Label htmlFor="bitacora_hora_termino">Hora de Término</Label>
                <Input
                  type="time"
                  {...bitacoraForm.register('bitacora_hora_termino')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bitacora_fecha">Fecha</Label>
              <Input
                type="date"
                {...bitacoraForm.register('bitacora_fecha')}
              />
            </div>

            <div>
              <Label htmlFor="bitacora_relator">Relator</Label>
              <Input
                {...bitacoraForm.register('bitacora_relator')}
                placeholder="Nombre del relator"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Trabajadores del equipo de buceo asignado:
            </p>
            {equipoBuceo?.miembros?.map((miembro, index) => (
              <div key={miembro.id} className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={`${miembro.usuario?.nombre} ${miembro.usuario?.apellido}`}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Input
                    value={miembro.rol_equipo}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={miembro.usuario?.email || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">
                No hay miembros en el equipo de buceo asignado
              </p>
            )}
            
            {/* Additional manual workers */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`trabajador_adicional_${index}_nombre`}>
                    Trabajador Adicional {index}
                  </Label>
                  <Input
                    {...participantesForm.register(`trabajador_adicional_${index}_nombre`)}
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor={`trabajador_adicional_${index}_rut`}>RUT</Label>
                  <Input
                    {...participantesForm.register(`trabajador_adicional_${index}_rut`)}
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
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">
                <strong>Nota:</strong> Las firmas se agregarán después de que el Anexo Bravo sea creado y revisado.
              </p>
            </div>

            <div>
              <Label htmlFor="supervisor_servicio_nombre">
                Nombre del Supervisor del servicio a cargo del trabajo
              </Label>
              <Input
                {...firmasForm.register('supervisor_servicio_nombre')}
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <Label htmlFor="supervisor_mandante_nombre">
                Nombre del Supervisor de la Salmonera
              </Label>
              <Input
                {...firmasForm.register('supervisor_mandante_nombre')}
                placeholder="Nombre completo"
              />
            </div>

            <div>
              <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
              <Textarea
                {...firmasForm.register('observaciones_generales')}
                placeholder="Observaciones adicionales..."
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Anexo Bravo
          </h2>
          <p className="text-gray-600">Lista de chequeo para faenas de buceo</p>
        </div>
        <Badge variant="outline">
          Paso {currentStep} de {totalSteps}
        </Badge>
      </div>

      {/* Steps Navigation */}
      <div className="flex items-center justify-between py-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center ${
              step.number < steps.length ? 'flex-1' : ''
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.number === currentStep
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : step.number < currentStep
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                React.createElement(step.icon, { className: "w-5 h-5" })
              )}
            </div>
            {step.number < steps.length && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
        </div>

        <div>
          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleFinalSubmit} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completar Anexo Bravo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
