
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Users, Clock, CheckCircle, AlertTriangle, Building, Settings } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

interface FullAnexoBravoFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  operacionId?: string;
}

interface EquipoItem {
  nombre: string;
  verificado: boolean;
  observaciones: string;
}

interface Trabajador {
  nombre: string;
  rut: string;
}

export const FullAnexoBravoForm = ({ onSubmit, onCancel, operacionId }: FullAnexoBravoFormProps) => {
  const { operaciones } = useOperaciones();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const [formData, setFormData] = useState({
    // 1. Información General
    operacion_id: operacionId || '',
    codigo: '',
    empresa_nombre: '',
    lugar_faena: '',
    fecha: new Date().toISOString().split('T')[0],
    jefe_centro_nombre: '',
    
    // 2. Identificación del Buzo o Empresa de Buceo
    buzo_o_empresa_nombre: '',
    buzo_matricula: '',
    autorizacion_armada: false,
    asistente_buzo_nombre: '',
    asistente_buzo_matricula: '',
    
    // 3. Chequeo de Equipos e Insumos
    equipos_revision: {
      'compresor_estanque_reserva': { verificado: false, observaciones: '' },
      'regulador_aire_arnes': { verificado: false, observaciones: '' },
      'traje_neopren': { verificado: false, observaciones: '' },
      'aletas_propulsion': { verificado: false, observaciones: '' },
      'cinturon_lastre_escape': { verificado: false, observaciones: '' },
      'mascarilla': { verificado: false, observaciones: '' },
      'pufal_buceo': { verificado: false, observaciones: '' },
      'profundimetro': { verificado: false, observaciones: '' },
      'salvavidas_chaleco': { verificado: false, observaciones: '' },
      'tablas_descompresion': { verificado: false, observaciones: '' },
      'botiquin_primeros_auxilios': { verificado: false, observaciones: '' },
      'cabo_vida': { verificado: false, observaciones: '' },
      'cabo_descenso': { verificado: false, observaciones: '' },
      'manguera_plastica_250lbs': { verificado: false, observaciones: '' },
      'equipo_comunicacion': { verificado: false, observaciones: '' },
      'matricula_buzo_mariscador': { verificado: false, observaciones: '' },
      'matricula_asistente': { verificado: false, observaciones: '' },
      'certificado_mantencion': { verificado: false, observaciones: '' },
      'filtro_aire_compresor': { verificado: false, observaciones: '' },
      'nivel_aceite_mineral': { verificado: false, observaciones: '' },
      'nivel_aceite_vegetal': { verificado: false, observaciones: '' },
      'valvula_retencion': { verificado: false, observaciones: '' },
      'proteccion_partes_movimiento': { verificado: false, observaciones: '' },
      'botella_aire_auxiliar': { verificado: false, observaciones: '' }
    } as Record<string, { verificado: boolean; observaciones: string }>,
    
    // 4. Bitácora de Buceo
    bitacora_hora_inicio: '',
    bitacora_hora_termino: '',
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_relator: '',
    
    // 5. Trabajadores Participantes
    anexo_bravo_trabajadores: [
      { nombre: '', rut: '' },
      { nombre: '', rut: '' },
      { nombre: '', rut: '' },
      { nombre: '', rut: '' },
      { nombre: '', rut: '' },
      { nombre: '', rut: '' }
    ] as Trabajador[],
    
    // 6. Firmas
    supervisor_servicio_nombre: '',
    supervisor_servicio_firma: '',
    supervisor_mandante_nombre: '',
    supervisor_mandante_firma: '',
    
    // 7. Observaciones finales
    observaciones_generales: '',
    
    // Estado del formulario
    estado: 'borrador',
    firmado: false
  });

  // Auto-generar código cuando se selecciona operación
  useEffect(() => {
    if (formData.operacion_id && !formData.codigo) {
      const operacion = operaciones.find(op => op.id === formData.operacion_id);
      if (operacion) {
        const timestamp = Date.now().toString().slice(-6);
        setFormData(prev => ({
          ...prev,
          codigo: `AB-${operacion.codigo}-${timestamp}`,
          lugar_faena: operacion.sitios?.nombre || '',
          empresa_nombre: operacion.contratistas?.nombre || operacion.salmoneras?.nombre || ''
        }));
      }
    }
  }, [formData.operacion_id, operaciones]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateEquipoRevision = (equipo: string, field: 'verificado' | 'observaciones', value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      equipos_revision: {
        ...prev.equipos_revision,
        [equipo]: {
          ...prev.equipos_revision[equipo],
          [field]: value
        }
      }
    }));
  };

  const updateTrabajador = (index: number, field: 'nombre' | 'rut', value: string) => {
    setFormData(prev => ({
      ...prev,
      anexo_bravo_trabajadores: prev.anexo_bravo_trabajadores.map((t, i) => 
        i === index ? { ...t, [field]: value } : t
      )
    }));
  };

  const getStepProgress = () => {
    return Math.round((currentStep / totalSteps) * 100);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting anexo bravo:', error);
    } finally {
      setIsSubmitting(false);
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

  const equiposLabels = {
    'compresor_estanque_reserva': 'Compresor (estanque de reserva)',
    'regulador_aire_arnes': 'Regulador de aire c/ arnés de afirm.',
    'traje_neopren': 'Traje de Neopren',
    'aletas_propulsion': 'Aletas de propulsión',
    'cinturon_lastre_escape': 'Cinturón Lastre c/ escape rápido',
    'mascarilla': 'Mascarilla',
    'pufal_buceo': 'Pufal de Buceo',
    'profundimetro': 'Profundímetro',
    'salvavidas_chaleco': 'Salvavidas tipo chaleco (buceo autónomo)',
    'tablas_descompresion': 'Tablas de descompresión plastificadas',
    'botiquin_primeros_auxilios': 'Botiquín primeros auxilios',
    'cabo_vida': 'Cabo de vida',
    'cabo_descenso': 'Cabo de descenso',
    'manguera_plastica_250lbs': 'Manguera plástica (mín. 250 lbs) marcada c/ 10m',
    'equipo_comunicacion': 'Equipo de comunicación en lugar de faena',
    'matricula_buzo_mariscador': 'Matrícula de buzo mariscador',
    'matricula_asistente': 'Matrícula de quien asiste al buzo (igual o superior)',
    'certificado_mantencion': 'Certificado de mantención y vigencia de equipos',
    'filtro_aire_compresor': 'Filtro de aire (salida compresor)',
    'nivel_aceite_mineral': 'Nivel de aceite (mineral) motor del compresor',
    'nivel_aceite_vegetal': 'Nivel de aceite (vegetal) cabezal del compresor',
    'valvula_retencion': 'Válvula de retención operativa',
    'proteccion_partes_movimiento': 'Protección de partes y piezas en movimiento del compresor',
    'botella_aire_auxiliar': 'Botella de aire auxiliar'
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                1. Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="operacion">Operación *</Label>
                  <Select
                    value={formData.operacion_id}
                    onValueChange={(value) => updateFormData('operacion_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar operación..." />
                    </SelectTrigger>
                    <SelectContent>
                      {operaciones.map((op) => (
                        <SelectItem key={op.id} value={op.id}>
                          {op.codigo} - {op.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="codigo">Código Anexo Bravo</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => updateFormData('codigo', e.target.value)}
                    placeholder="AB-XXX-XXXXXX"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="empresa_nombre">Empresa *</Label>
                <Input
                  id="empresa_nombre"
                  value={formData.empresa_nombre}
                  onChange={(e) => updateFormData('empresa_nombre', e.target.value)}
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lugar_faena">Lugar de Faena (Centro) *</Label>
                  <Input
                    id="lugar_faena"
                    value={formData.lugar_faena}
                    onChange={(e) => updateFormData('lugar_faena', e.target.value)}
                    placeholder="Ubicación específica del centro"
                  />
                </div>
                <div>
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => updateFormData('fecha', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="jefe_centro">Jefe de Centro *</Label>
                <Input
                  id="jefe_centro"
                  value={formData.jefe_centro_nombre}
                  onChange={(e) => updateFormData('jefe_centro_nombre', e.target.value)}
                  placeholder="Nombre del jefe de centro"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                2. Identificación del Buzo o Empresa de Buceo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buzo_empresa">Buzo o Empresa de Buceo *</Label>
                  <Input
                    id="buzo_empresa"
                    value={formData.buzo_o_empresa_nombre}
                    onChange={(e) => updateFormData('buzo_o_empresa_nombre', e.target.value)}
                    placeholder="Nombre del buzo o empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="buzo_matricula">Matrícula *</Label>
                  <Input
                    id="buzo_matricula"
                    value={formData.buzo_matricula}
                    onChange={(e) => updateFormData('buzo_matricula', e.target.value)}
                    placeholder="Número de matrícula"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-yellow-50">
                <Checkbox
                  id="autorizacion_armada"
                  checked={formData.autorizacion_armada}
                  onCheckedChange={(checked) => updateFormData('autorizacion_armada', !!checked)}
                />
                <Label htmlFor="autorizacion_armada" className="font-medium">
                  Autorización de la Autoridad Marítima: (Sí / No)
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="asistente_nombre">Asistente de Buzo</Label>
                  <Input
                    id="asistente_nombre"
                    value={formData.asistente_buzo_nombre}
                    onChange={(e) => updateFormData('asistente_buzo_nombre', e.target.value)}
                    placeholder="Nombre del asistente"
                  />
                </div>
                <div>
                  <Label htmlFor="asistente_matricula">Matrícula del Asistente</Label>
                  <Input
                    id="asistente_matricula"
                    value={formData.asistente_buzo_matricula}
                    onChange={(e) => updateFormData('asistente_buzo_matricula', e.target.value)}
                    placeholder="Número de matrícula del asistente"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium">
                  <strong>Nota:</strong> Anexar copia de autorización a esta lista de chequeo.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                3. Chequeo de Equipos e Insumos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {Object.entries(equiposLabels).map(([key, label]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={key}
                        checked={formData.equipos_revision[key]?.verificado || false}
                        onCheckedChange={(checked) => updateEquipoRevision(key, 'verificado', !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={key} className="text-sm font-medium leading-relaxed">
                          {label}
                        </Label>
                        <Input
                          placeholder="Observaciones..."
                          value={formData.equipos_revision[key]?.observaciones || ''}
                          onChange={(e) => updateEquipoRevision(key, 'observaciones', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-green-700 font-medium">
                  <strong>Nota:</strong> Debe llevarse una bitácora de buceo conforme al Reglamento de Buceo Profesional.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                4. Bitácora de Buceo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-700 font-medium">
                  <strong>Nota:</strong> Incluir tiempo de fondo, traslado, tiempo fuera del agua entre inmersiones
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={formData.bitacora_hora_inicio}
                    onChange={(e) => updateFormData('bitacora_hora_inicio', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hora_termino">Hora de Término *</Label>
                  <Input
                    id="hora_termino"
                    type="time"
                    value={formData.bitacora_hora_termino}
                    onChange={(e) => updateFormData('bitacora_hora_termino', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bitacora_fecha">Fecha *</Label>
                  <Input
                    id="bitacora_fecha"
                    type="date"
                    value={formData.bitacora_fecha}
                    onChange={(e) => updateFormData('bitacora_fecha', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="relator">Relator *</Label>
                  <Input
                    id="relator"
                    value={formData.bitacora_relator}
                    onChange={(e) => updateFormData('bitacora_relator', e.target.value)}
                    placeholder="Persona responsable del relato"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                5. Trabajadores Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {formData.anexo_bravo_trabajadores.map((trabajador, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`trabajador_nombre_${index}`}>
                          Nombre del Trabajador {index + 1}
                        </Label>
                        <Input
                          id={`trabajador_nombre_${index}`}
                          value={trabajador.nombre}
                          onChange={(e) => updateTrabajador(index, 'nombre', e.target.value)}
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`trabajador_rut_${index}`}>RUT</Label>
                        <Input
                          id={`trabajador_rut_${index}`}
                          value={trabajador.rut}
                          onChange={(e) => updateTrabajador(index, 'rut', e.target.value)}
                          placeholder="12.345.678-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                6. Firmas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="supervisor_servicio">Nombre del Supervisor del servicio a cargo del trabajo *</Label>
                  <Input
                    id="supervisor_servicio"
                    value={formData.supervisor_servicio_nombre}
                    onChange={(e) => updateFormData('supervisor_servicio_nombre', e.target.value)}
                    placeholder="Nombre completo del supervisor del servicio"
                  />
                </div>

                <div>
                  <Label htmlFor="supervisor_servicio_firma">Firma del Supervisor del servicio</Label>
                  <Textarea
                    id="supervisor_servicio_firma"
                    value={formData.supervisor_servicio_firma}
                    onChange={(e) => updateFormData('supervisor_servicio_firma', e.target.value)}
                    placeholder="Firma digital o espacio para firma física"
                    rows={3}
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div>
                  <Label htmlFor="supervisor_blumar">Nombre del Supervisor de BLUMAR *</Label>
                  <Input
                    id="supervisor_blumar"
                    value={formData.supervisor_mandante_nombre}
                    onChange={(e) => updateFormData('supervisor_mandante_nombre', e.target.value)}
                    placeholder="Nombre completo del supervisor de BLUMAR"
                  />
                </div>

                <div>
                  <Label htmlFor="supervisor_blumar_firma">Firma del Supervisor de BLUMAR</Label>
                  <Textarea
                    id="supervisor_blumar_firma"
                    value={formData.supervisor_mandante_firma}
                    onChange={(e) => updateFormData('supervisor_mandante_firma', e.target.value)}
                    placeholder="Firma digital o espacio para firma física"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                7. Notas Finales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="observaciones">Observaciones Generales</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones_generales}
                  onChange={(e) => updateFormData('observaciones_generales', e.target.value)}
                  placeholder="Observaciones adicionales sobre la faena de buceo..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-blue-800">Notas Importantes:</h4>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Esta lista debe ser llenada por el Jefe de Centro en el lugar de la faena en presencia del buzo y su asistente, antes de cada faena de buceo.</li>
                  <li>• Los buzos de cualquier categoría deben cumplir estrictamente con el Reglamento de Buceo antes señalado.</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">Resumen del Formulario</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Código:</strong> {formData.codigo}</p>
                  <p><strong>Empresa:</strong> {formData.empresa_nombre}</p>
                  <p><strong>Lugar de Faena:</strong> {formData.lugar_faena}</p>
                  <p><strong>Fecha:</strong> {formData.fecha}</p>
                  <p><strong>Jefe de Centro:</strong> {formData.jefe_centro_nombre}</p>
                  <p><strong>Buzo Principal:</strong> {formData.buzo_o_empresa_nombre}</p>
                  <p><strong>Equipos verificados:</strong> {Object.values(formData.equipos_revision).filter(item => item.verificado).length} de {Object.keys(formData.equipos_revision).length}</p>
                  <p><strong>Trabajadores registrados:</strong> {formData.anexo_bravo_trabajadores.filter(t => t.nombre && t.rut).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Nuevo Anexo Bravo</h2>
          <p className="text-zinc-500">Paso {currentStep} de {totalSteps}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
          <Badge variant="outline">
            {getStepProgress()}%
          </Badge>
        </div>
      </div>

      {/* Form Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          )}
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>

        <div className="flex gap-3">
          {currentStep < totalSteps ? (
            <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
              Siguiente
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Creando...' : 'Crear Anexo Bravo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
