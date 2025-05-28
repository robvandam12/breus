
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

interface FullAnexoBravoFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  operacionId?: string;
}

export const FullAnexoBravoForm = ({ onSubmit, onCancel, operacionId }: FullAnexoBravoFormProps) => {
  const { operaciones } = useOperaciones();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Información básica
    operacion_id: operacionId || '',
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    lugar_faena: '',
    empresa_nombre: '',
    
    // Supervisores y firmas
    supervisor_mandante_nombre: '',
    supervisor_servicio_nombre: '',
    jefe_centro_nombre: '',
    
    // Información de buceo
    buzo_matricula: '',
    buzo_o_empresa_nombre: '',
    asistente_buzo_matricula: '',
    asistente_buzo_nombre: '',
    
    // Bitácora
    bitacora_relator: '',
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_hora_inicio: '',
    bitacora_hora_termino: '',
    
    // Checklist de equipos (ejemplo)
    equipos_revision: {
      mascara_buceo: false,
      regulador_principal: false,
      regulador_emergencia: false,
      chaleco_compensador: false,
      traje_buceo: false,
      aletas: false,
      lastre: false,
      profundimetro: false,
      manometro: false,
      computadora_buceo: false,
      linterna_principal: false,
      linterna_respaldo: false,
      cuchillo_buceo: false,
      bolsa_emergencia: false,
      silbato: false
    },
    
    // Participantes
    participantes: [
      { nombre: '', rut: '' }
    ],
    
    // Observaciones finales
    observaciones_generales: '',
    autorizacion_armada: false,
    
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

  const updateEquipoRevision = (equipo: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipos_revision: {
        ...prev.equipos_revision,
        [equipo]: checked
      }
    }));
  };

  const addParticipante = () => {
    setFormData(prev => ({
      ...prev,
      participantes: [...prev.participantes, { nombre: '', rut: '' }]
    }));
  };

  const updateParticipante = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      participantes: prev.participantes.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const removeParticipante = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participantes: prev.participantes.filter((_, i) => i !== index)
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Información Básica
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => updateFormData('fecha', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lugar_faena">Lugar de Faena *</Label>
                  <Input
                    id="lugar_faena"
                    value={formData.lugar_faena}
                    onChange={(e) => updateFormData('lugar_faena', e.target.value)}
                    placeholder="Ubicación específica"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="empresa_nombre">Empresa Ejecutora *</Label>
                <Input
                  id="empresa_nombre"
                  value={formData.empresa_nombre}
                  onChange={(e) => updateFormData('empresa_nombre', e.target.value)}
                  placeholder="Nombre de la empresa"
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
                Personal y Supervisión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supervisor_mandante">Supervisor Mandante *</Label>
                  <Input
                    id="supervisor_mandante"
                    value={formData.supervisor_mandante_nombre}
                    onChange={(e) => updateFormData('supervisor_mandante_nombre', e.target.value)}
                    placeholder="Nombre del supervisor mandante"
                  />
                </div>
                <div>
                  <Label htmlFor="supervisor_servicio">Supervisor Servicio *</Label>
                  <Input
                    id="supervisor_servicio"
                    value={formData.supervisor_servicio_nombre}
                    onChange={(e) => updateFormData('supervisor_servicio_nombre', e.target.value)}
                    placeholder="Nombre del supervisor de servicio"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buzo_matricula">Matrícula Buzo Principal *</Label>
                  <Input
                    id="buzo_matricula"
                    value={formData.buzo_matricula}
                    onChange={(e) => updateFormData('buzo_matricula', e.target.value)}
                    placeholder="Número de matrícula"
                  />
                </div>
                <div>
                  <Label htmlFor="buzo_nombre">Nombre Buzo Principal *</Label>
                  <Input
                    id="buzo_nombre"
                    value={formData.buzo_o_empresa_nombre}
                    onChange={(e) => updateFormData('buzo_o_empresa_nombre', e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="asistente_matricula">Matrícula Asistente</Label>
                  <Input
                    id="asistente_matricula"
                    value={formData.asistente_buzo_matricula}
                    onChange={(e) => updateFormData('asistente_buzo_matricula', e.target.value)}
                    placeholder="Número de matrícula"
                  />
                </div>
                <div>
                  <Label htmlFor="asistente_nombre">Nombre Asistente</Label>
                  <Input
                    id="asistente_nombre"
                    value={formData.asistente_buzo_nombre}
                    onChange={(e) => updateFormData('asistente_buzo_nombre', e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Bitácora de Trabajo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bitacora_relator">Relator de Bitácora *</Label>
                <Input
                  id="bitacora_relator"
                  value={formData.bitacora_relator}
                  onChange={(e) => updateFormData('bitacora_relator', e.target.value)}
                  placeholder="Persona responsable del relato"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bitacora_fecha">Fecha de Bitácora *</Label>
                  <Input
                    id="bitacora_fecha"
                    type="date"
                    value={formData.bitacora_fecha}
                    onChange={(e) => updateFormData('bitacora_fecha', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hora_inicio">Hora Inicio *</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={formData.bitacora_hora_inicio}
                    onChange={(e) => updateFormData('bitacora_hora_inicio', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hora_termino">Hora Término</Label>
                  <Input
                    id="hora_termino"
                    type="time"
                    value={formData.bitacora_hora_termino}
                    onChange={(e) => updateFormData('bitacora_hora_termino', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                Revisión de Equipos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData.equipos_revision).map(([equipo, checked]) => (
                  <div key={equipo} className="flex items-center space-x-2">
                    <Checkbox
                      id={equipo}
                      checked={checked}
                      onCheckedChange={(checked) => updateEquipoRevision(equipo, !!checked)}
                    />
                    <Label htmlFor={equipo} className="text-sm">
                      {equipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
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
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.participantes.map((participante, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor={`nombre_${index}`}>Nombre Completo *</Label>
                    <Input
                      id={`nombre_${index}`}
                      value={participante.nombre}
                      onChange={(e) => updateParticipante(index, 'nombre', e.target.value)}
                      placeholder="Nombre y apellido"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`rut_${index}`}>RUT *</Label>
                      <Input
                        id={`rut_${index}`}
                        value={participante.rut}
                        onChange={(e) => updateParticipante(index, 'rut', e.target.value)}
                        placeholder="12.345.678-9"
                      />
                    </div>
                    {formData.participantes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeParticipante(index)}
                        className="mt-6"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button type="button" variant="outline" onClick={addParticipante}>
                Agregar Participante
              </Button>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Observaciones y Autorización
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="observaciones">Observaciones Generales</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones_generales}
                  onChange={(e) => updateFormData('observaciones_generales', e.target.value)}
                  placeholder="Observaciones adicionales..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autorizacion_armada"
                  checked={formData.autorizacion_armada}
                  onCheckedChange={(checked) => updateFormData('autorizacion_armada', !!checked)}
                />
                <Label htmlFor="autorizacion_armada">
                  Autorización de la Armada obtenida
                </Label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Resumen del Formulario</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p><strong>Código:</strong> {formData.codigo}</p>
                  <p><strong>Operación:</strong> {operaciones.find(op => op.id === formData.operacion_id)?.nombre}</p>
                  <p><strong>Fecha:</strong> {formData.fecha}</p>
                  <p><strong>Lugar:</strong> {formData.lugar_faena}</p>
                  <p><strong>Equipos revisados:</strong> {Object.values(formData.equipos_revision).filter(Boolean).length} de {Object.keys(formData.equipos_revision).length}</p>
                  <p><strong>Participantes:</strong> {formData.participantes.filter(p => p.nombre && p.rut).length}</p>
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
    <div className="max-w-4xl mx-auto space-y-6">
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
      <div className="flex justify-between pt-6">
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
            <Button onClick={nextStep}>
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
