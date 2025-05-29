
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, User, Thermometer, Waves, Clock } from "lucide-react";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoras";

interface CreateBitacoraBuzoFormEnhancedProps {
  onSubmit: (data: BitacoraBuzoFormData) => void;
  onCancel: () => void;
  inmersionId?: string;
}

export const CreateBitacoraBuzoFormEnhanced = ({ onSubmit, onCancel, inmersionId }: CreateBitacoraBuzoFormEnhancedProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<BitacoraBuzoFormData>({
    codigo: '',
    inmersion_id: inmersionId || '',
    buzo: '',
    fecha: new Date().toISOString().split('T')[0],
    trabajos_realizados: '',
    observaciones_tecnicas: '',
    estado_fisico_post: 'excelente',
    profundidad_maxima: 0,
    // Campos adicionales del formulario completo
    folio: '',
    codigo_verificacion: '',
    empresa_nombre: '',
    centro_nombre: '',
    buzo_rut: '',
    supervisor_nombre: '',
    supervisor_rut: '',
    supervisor_correo: '',
    jefe_centro_correo: '',
    contratista_nombre: '',
    contratista_rut: '',
    // Condiciones ambientales
    condamb_estado_puerto: 'bueno',
    condamb_estado_mar: 'calmo',
    condamb_temp_aire_c: 20,
    condamb_temp_agua_c: 15,
    condamb_visibilidad_fondo_mts: 10,
    condamb_corriente_fondo_nudos: 0,
    // Datos técnicos del buceo
    datostec_equipo_usado: '',
    datostec_traje: '',
    datostec_hora_dejo_superficie: '',
    datostec_hora_llegada_fondo: '',
    datostec_hora_salida_fondo: '',
    datostec_hora_llegada_superficie: '',
    // Tiempos y tabulación
    tiempos_total_fondo: '',
    tiempos_total_descompresion: '',
    tiempos_total_buceo: '',
    tiempos_tabulacion_usada: '',
    tiempos_intervalo_superficie: '',
    tiempos_nitrogeno_residual: '',
    tiempos_grupo_repetitivo_anterior: '',
    tiempos_nuevo_grupo_repetitivo: '',
    // Objetivo del buceo
    objetivo_proposito: '',
    objetivo_tipo_area: '',
    objetivo_caracteristicas_dimensiones: '',
    // Condiciones y certificaciones
    condcert_buceo_altitud: false,
    condcert_certificados_equipos_usados: false,
    condcert_buceo_areas_confinadas: false,
    condcert_observaciones: '',
    // Firma final
    validador_nombre: ''
  });

  useEffect(() => {
    // Generate codigo when component mounts
    const timestamp = Date.now().toString().slice(-4);
    setFormData(prev => ({
      ...prev,
      codigo: `BIT-BUZ-${timestamp}`,
      folio: `F-${timestamp}`
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting bitácora buzo:', formData);
    onSubmit(formData);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
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
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              placeholder="BIT-BUZ-001"
            />
          </div>

          <div>
            <Label htmlFor="folio">Folio</Label>
            <Input
              id="folio"
              value={formData.folio}
              onChange={(e) => setFormData({...formData, folio: e.target.value})}
              placeholder="F-001"
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
            <Label htmlFor="codigo_verificacion">Código de Verificación</Label>
            <Input
              id="codigo_verificacion"
              value={formData.codigo_verificacion}
              onChange={(e) => setFormData({...formData, codigo_verificacion: e.target.value})}
              placeholder="CV-001"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="empresa_nombre">Empresa</Label>
            <Input
              id="empresa_nombre"
              value={formData.empresa_nombre}
              onChange={(e) => setFormData({...formData, empresa_nombre: e.target.value})}
              placeholder="Nombre de la empresa"
            />
          </div>

          <div>
            <Label htmlFor="centro_nombre">Centro de Trabajo</Label>
            <Input
              id="centro_nombre"
              value={formData.centro_nombre}
              onChange={(e) => setFormData({...formData, centro_nombre: e.target.value})}
              placeholder="Nombre del centro"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Involucrado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="buzo">Buzo</Label>
            <Input
              id="buzo"
              value={formData.buzo}
              onChange={(e) => setFormData({...formData, buzo: e.target.value})}
              placeholder="Nombre del buzo"
              required
            />
          </div>

          <div>
            <Label htmlFor="buzo_rut">RUT del Buzo</Label>
            <Input
              id="buzo_rut"
              value={formData.buzo_rut}
              onChange={(e) => setFormData({...formData, buzo_rut: e.target.value})}
              placeholder="12.345.678-9"
            />
          </div>

          <div>
            <Label htmlFor="supervisor_nombre">Supervisor</Label>
            <Input
              id="supervisor_nombre"
              value={formData.supervisor_nombre}
              onChange={(e) => setFormData({...formData, supervisor_nombre: e.target.value})}
              placeholder="Nombre del supervisor"
            />
          </div>

          <div>
            <Label htmlFor="supervisor_rut">RUT del Supervisor</Label>
            <Input
              id="supervisor_rut"
              value={formData.supervisor_rut}
              onChange={(e) => setFormData({...formData, supervisor_rut: e.target.value})}
              placeholder="12.345.678-9"
            />
          </div>

          <div>
            <Label htmlFor="supervisor_correo">Correo del Supervisor</Label>
            <Input
              id="supervisor_correo"
              type="email"
              value={formData.supervisor_correo}
              onChange={(e) => setFormData({...formData, supervisor_correo: e.target.value})}
              placeholder="supervisor@empresa.com"
            />
          </div>

          <div>
            <Label htmlFor="jefe_centro_correo">Correo Jefe de Centro</Label>
            <Input
              id="jefe_centro_correo"
              type="email"
              value={formData.jefe_centro_correo}
              onChange={(e) => setFormData({...formData, jefe_centro_correo: e.target.value})}
              placeholder="jefe@empresa.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contratista_nombre">Contratista</Label>
            <Input
              id="contratista_nombre"
              value={formData.contratista_nombre}
              onChange={(e) => setFormData({...formData, contratista_nombre: e.target.value})}
              placeholder="Nombre del contratista"
            />
          </div>

          <div>
            <Label htmlFor="contratista_rut">RUT del Contratista</Label>
            <Input
              id="contratista_rut"
              value={formData.contratista_rut}
              onChange={(e) => setFormData({...formData, contratista_rut: e.target.value})}
              placeholder="12.345.678-9"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          Condiciones Ambientales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="estado_puerto">Estado del Puerto</Label>
            <Select 
              value={formData.condamb_estado_puerto} 
              onValueChange={(value) => setFormData({...formData, condamb_estado_puerto: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excelente">Excelente</SelectItem>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="malo">Malo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="estado_mar">Estado del Mar</Label>
            <Select 
              value={formData.condamb_estado_mar} 
              onValueChange={(value) => setFormData({...formData, condamb_estado_mar: value})}
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
            <Label htmlFor="temp_aire">Temperatura del Aire (°C)</Label>
            <Input
              id="temp_aire"
              type="number"
              value={formData.condamb_temp_aire_c}
              onChange={(e) => setFormData({...formData, condamb_temp_aire_c: parseFloat(e.target.value) || 0})}
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="temp_agua">Temperatura del Agua (°C)</Label>
            <Input
              id="temp_agua"
              type="number"
              value={formData.condamb_temp_agua_c}
              onChange={(e) => setFormData({...formData, condamb_temp_agua_c: parseFloat(e.target.value) || 0})}
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="visibilidad">Visibilidad en el Fondo (metros)</Label>
            <Input
              id="visibilidad"
              type="number"
              value={formData.condamb_visibilidad_fondo_mts}
              onChange={(e) => setFormData({...formData, condamb_visibilidad_fondo_mts: parseFloat(e.target.value) || 0})}
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="corriente">Corriente del Fondo (nudos)</Label>
            <Input
              id="corriente"
              type="number"
              value={formData.condamb_corriente_fondo_nudos}
              onChange={(e) => setFormData({...formData, condamb_corriente_fondo_nudos: parseFloat(e.target.value) || 0})}
              step="0.1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="w-5 h-5" />
          Datos Técnicos del Buceo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equipo_usado">Equipo Usado</Label>
            <Input
              id="equipo_usado"
              value={formData.datostec_equipo_usado}
              onChange={(e) => setFormData({...formData, datostec_equipo_usado: e.target.value})}
              placeholder="Tipo de equipo de buceo"
            />
          </div>

          <div>
            <Label htmlFor="traje">Tipo de Traje</Label>
            <Input
              id="traje"
              value={formData.datostec_traje}
              onChange={(e) => setFormData({...formData, datostec_traje: e.target.value})}
              placeholder="Tipo de traje usado"
            />
          </div>

          <div>
            <Label htmlFor="profundidad_maxima">Profundidad Máxima (metros)</Label>
            <Input
              id="profundidad_maxima"
              type="number"
              value={formData.profundidad_maxima}
              onChange={(e) => setFormData({...formData, profundidad_maxima: parseFloat(e.target.value) || 0})}
              step="0.1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="hora_superficie">Hora Dejó Superficie</Label>
            <Input
              id="hora_superficie"
              type="time"
              value={formData.datostec_hora_dejo_superficie}
              onChange={(e) => setFormData({...formData, datostec_hora_dejo_superficie: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="hora_fondo">Hora Llegada Fondo</Label>
            <Input
              id="hora_fondo"
              type="time"
              value={formData.datostec_hora_llegada_fondo}
              onChange={(e) => setFormData({...formData, datostec_hora_llegada_fondo: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="hora_salida">Hora Salida Fondo</Label>
            <Input
              id="hora_salida"
              type="time"
              value={formData.datostec_hora_salida_fondo}
              onChange={(e) => setFormData({...formData, datostec_hora_salida_fondo: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="hora_superficie_final">Hora Llegada Superficie</Label>
            <Input
              id="hora_superficie_final"
              type="time"
              value={formData.datostec_hora_llegada_superficie}
              onChange={(e) => setFormData({...formData, datostec_hora_llegada_superficie: e.target.value})}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Trabajos y Observaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="objetivo_proposito">Propósito del Buceo</Label>
          <Textarea
            id="objetivo_proposito"
            value={formData.objetivo_proposito}
            onChange={(e) => setFormData({...formData, objetivo_proposito: e.target.value})}
            placeholder="Descripción del propósito"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="trabajos_realizados">Trabajos Realizados</Label>
          <Textarea
            id="trabajos_realizados"
            value={formData.trabajos_realizados}
            onChange={(e) => setFormData({...formData, trabajos_realizados: e.target.value})}
            placeholder="Descripción detallada de los trabajos realizados"
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="observaciones_tecnicas">Observaciones Técnicas</Label>
          <Textarea
            id="observaciones_tecnicas"
            value={formData.observaciones_tecnicas}
            onChange={(e) => setFormData({...formData, observaciones_tecnicas: e.target.value})}
            placeholder="Observaciones técnicas relevantes"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="estado_fisico">Estado Físico Post-Inmersión</Label>
          <Select 
            value={formData.estado_fisico_post} 
            onValueChange={(value) => setFormData({...formData, estado_fisico_post: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excelente">Excelente</SelectItem>
              <SelectItem value="bueno">Bueno</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="malo">Malo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep6 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Certificaciones y Validación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="buceo_altitud"
              checked={formData.condcert_buceo_altitud}
              onCheckedChange={(checked) => setFormData({...formData, condcert_buceo_altitud: checked as boolean})}
            />
            <Label htmlFor="buceo_altitud">Buceo en Altitud</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="certificados_equipos"
              checked={formData.condcert_certificados_equipos_usados}
              onCheckedChange={(checked) => setFormData({...formData, condcert_certificados_equipos_usados: checked as boolean})}
            />
            <Label htmlFor="certificados_equipos">Equipos Certificados</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="areas_confinadas"
              checked={formData.condcert_buceo_areas_confinadas}
              onCheckedChange={(checked) => setFormData({...formData, condcert_buceo_areas_confinadas: checked as boolean})}
            />
            <Label htmlFor="areas_confinadas">Buceo en Áreas Confinadas</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="observaciones_cert">Observaciones de Certificación</Label>
          <Textarea
            id="observaciones_cert"
            value={formData.condcert_observaciones}
            onChange={(e) => setFormData({...formData, condcert_observaciones: e.target.value})}
            placeholder="Observaciones adicionales sobre certificaciones"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="validador">Nombre del Validador</Label>
          <Input
            id="validador"
            value={formData.validador_nombre}
            onChange={(e) => setFormData({...formData, validador_nombre: e.target.value})}
            placeholder="Nombre de quien valida la bitácora"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 6 && (
              <div className={`w-12 h-1 ml-2 ${
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
      {currentStep === 5 && renderStep5()}
      {currentStep === 6 && renderStep6()}

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
          
          {currentStep < 6 ? (
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
