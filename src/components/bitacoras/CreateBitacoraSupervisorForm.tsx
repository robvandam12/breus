
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Calendar, Users, MapPin, Clock } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { BitacoraSupervisorFormData } from "@/hooks/useBitacoras";

interface CreateBitacoraSupervisorFormProps {
  inmersionId: string;
  onSubmit: (data: BitacoraSupervisorFormData) => void;
  onCancel: () => void;
}

export const CreateBitacoraSupervisorForm = ({ inmersionId, onSubmit, onCancel }: CreateBitacoraSupervisorFormProps) => {
  const { inmersiones } = useInmersiones();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<BitacoraSupervisorFormData>({
    codigo: '',
    inmersion_id: inmersionId,
    supervisor: '',
    fecha: new Date().toISOString().split('T')[0],
    desarrollo_inmersion: '',
    incidentes: '',
    evaluacion_general: '',
    // Campos del wizard
    fecha_inicio_faena: '',
    hora_inicio_faena: '',
    hora_termino_faena: '',
    lugar_trabajo: '',
    supervisor_nombre_matricula: '',
    estado_mar: 'calmo',
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
  });

  const inmersion = inmersiones.find(i => i.inmersion_id === inmersionId);

  useEffect(() => {
    if (inmersion) {
      const timestamp = Date.now().toString().slice(-4);
      setFormData(prev => ({
        ...prev,
        codigo: `BIT-SUP-${inmersion.codigo}-${timestamp}`,
        supervisor: inmersion.supervisor,
        fecha: inmersion.fecha_inmersion,
        lugar_trabajo: `Sitio de inmersión: ${inmersion.codigo}`,
        trabajo_a_realizar: inmersion.objetivo,
        descripcion_trabajo: inmersion.objetivo,
        visibilidad_fondo: inmersion.visibilidad,
        inmersiones_buzos: [
          {
            buzo_nombre: inmersion.buzo_principal,
            profundidad_max: inmersion.profundidad_max,
            tiempo_fondo: '00:00',
            temperatura_agua: inmersion.temperatura_agua,
            observaciones: ''
          }
        ]
      }));
    }
  }, [inmersion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting bitácora supervisor:', formData);
    onSubmit(formData);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Información General
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="codigo">Código de Bitácora</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              placeholder="BIT-SUP-001"
            />
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="supervisor">Supervisor</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
              placeholder="Nombre del supervisor"
            />
          </div>

          <div>
            <Label htmlFor="supervisor_matricula">Supervisor Nombre/Matrícula</Label>
            <Input
              id="supervisor_matricula"
              value={formData.supervisor_nombre_matricula}
              onChange={(e) => setFormData({...formData, supervisor_nombre_matricula: e.target.value})}
              placeholder="Matrícula del supervisor"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="lugar_trabajo">Lugar de Trabajo</Label>
          <Input
            id="lugar_trabajo"
            value={formData.lugar_trabajo}
            onChange={(e) => setFormData({...formData, lugar_trabajo: e.target.value})}
            placeholder="Ubicación específica del trabajo"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Horarios y Condiciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fecha_inicio">Fecha Inicio Faena</Label>
            <Input
              id="fecha_inicio"
              type="date"
              value={formData.fecha_inicio_faena}
              onChange={(e) => setFormData({...formData, fecha_inicio_faena: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="hora_inicio">Hora Inicio</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={formData.hora_inicio_faena}
              onChange={(e) => setFormData({...formData, hora_inicio_faena: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="hora_termino">Hora Término</Label>
            <Input
              id="hora_termino"
              type="time"
              value={formData.hora_termino_faena}
              onChange={(e) => setFormData({...formData, hora_termino_faena: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estado_mar">Estado del Mar</Label>
            <Select 
              value={formData.estado_mar} 
              onValueChange={(value) => setFormData({...formData, estado_mar: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calmo">Calmo</SelectItem>
                <SelectItem value="marejadilla">Marejadilla</SelectItem>
                <SelectItem value="marejada">Marejada</SelectItem>
                <SelectItem value="fuerte_marejada">Fuerte Marejada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="visibilidad">Visibilidad Fondo (metros)</Label>
            <Input
              id="visibilidad"
              type="number"
              value={formData.visibilidad_fondo}
              onChange={(e) => setFormData({...formData, visibilidad_fondo: parseFloat(e.target.value) || 0})}
              placeholder="0"
              step="0.1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="embarcacion">Embarcación de Apoyo</Label>
          <Input
            id="embarcacion"
            value={formData.embarcacion_apoyo}
            onChange={(e) => setFormData({...formData, embarcacion_apoyo: e.target.value})}
            placeholder="Nombre de la embarcación"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Trabajo Realizado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="trabajo_realizar">Trabajo a Realizar</Label>
          <Textarea
            id="trabajo_realizar"
            value={formData.trabajo_a_realizar}
            onChange={(e) => setFormData({...formData, trabajo_a_realizar: e.target.value})}
            placeholder="Descripción del trabajo planificado"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="descripcion_trabajo">Descripción del Trabajo</Label>
          <Textarea
            id="descripcion_trabajo"
            value={formData.descripcion_trabajo}
            onChange={(e) => setFormData({...formData, descripcion_trabajo: e.target.value})}
            placeholder="Descripción detallada del trabajo realizado"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión</Label>
          <Textarea
            id="desarrollo_inmersion"
            value={formData.desarrollo_inmersion}
            onChange={(e) => setFormData({...formData, desarrollo_inmersion: e.target.value})}
            placeholder="Descripción detallada del desarrollo de la inmersión"
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="incidentes">Incidentes</Label>
          <Textarea
            id="incidentes"
            value={formData.incidentes}
            onChange={(e) => setFormData({...formData, incidentes: e.target.value})}
            placeholder="Descripción de incidentes ocurridos (si los hubo)"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Evaluación y Validación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="evaluacion_general">Evaluación General</Label>
          <Textarea
            id="evaluacion_general"
            value={formData.evaluacion_general}
            onChange={(e) => setFormData({...formData, evaluacion_general: e.target.value})}
            placeholder="Evaluación general de la inmersión"
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
          <Textarea
            id="observaciones_generales"
            value={formData.observaciones_generales_texto}
            onChange={(e) => setFormData({...formData, observaciones_generales_texto: e.target.value})}
            placeholder="Observaciones adicionales"
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="validacion"
            checked={formData.validacion_contratista}
            onCheckedChange={(checked) => setFormData({...formData, validacion_contratista: checked as boolean})}
          />
          <Label htmlFor="validacion">Validación del Contratista</Label>
        </div>

        {formData.validacion_contratista && (
          <div>
            <Label htmlFor="comentarios_validacion">Comentarios de Validación</Label>
            <Textarea
              id="comentarios_validacion"
              value={formData.comentarios_validacion}
              onChange={(e) => setFormData({...formData, comentarios_validacion: e.target.value})}
              placeholder="Comentarios adicionales de validación"
              rows={3}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!inmersion) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600">No se encontró la inmersión seleccionada.</p>
          <Button onClick={onCancel} className="mt-4">Volver</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información de la Inmersión */}
      <Card className="border-blue-100 bg-blue-25">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-blue-800 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Bitácora para: {inmersion.codigo}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs font-medium text-blue-600">Fecha</p>
              <p className="text-blue-800">{new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600">Buzo Principal</p>
              <p className="text-blue-800">{inmersion.buzo_principal}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600">Supervisor</p>
              <p className="text-blue-800">{inmersion.supervisor}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-16 h-1 ml-4 ${
                currentStep > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div>
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          
          {currentStep < 4 ? (
            <Button type="button" onClick={nextStep}>
              Siguiente
            </Button>
          ) : (
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Crear Bitácora
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
