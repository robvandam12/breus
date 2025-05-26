
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { BitacoraSupervisorData } from '@/types/auth';

interface BitacoraSupervisorFormEnhancedProps {
  initialData?: Partial<BitacoraSupervisorData>;
  onSubmit: (data: BitacoraSupervisorData) => void;
  onCancel: () => void;
}

export const BitacoraSupervisorFormEnhanced: React.FC<BitacoraSupervisorFormEnhancedProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<BitacoraSupervisorData>>({
    fecha_inicio_faena: '',
    hora_inicio_faena: '',
    fecha_termino_faena: '',
    hora_termino_faena: '',
    lugar_trabajo: '',
    tipo_trabajo: '',
    supervisor_nombre_matricula: '',
    bs_personal: [],
    bs_equipos_usados: [],
    observaciones_previas: '',
    embarcacion_nombre_matricula: '',
    tiempo_total_buceo: '',
    incluye_descompresion: false,
    contratista_nombre: '',
    buzo_principal_datos: {
      apellido_paterno: '',
      apellido_materno: '',
      nombres: '',
      run: ''
    },
    profundidad_trabajo_mts: 0,
    profundidad_maxima_mts: 0,
    requiere_camara_hiperbarica: false,
    gestprev_eval_riesgos_actualizada: false,
    gestprev_procedimientos_disponibles_conocidos: false,
    gestprev_capacitacion_previa_realizada: false,
    gestprev_identif_peligros_control_riesgos_subacuaticos_realizados: false,
    gestprev_registro_incidentes_reportados: false,
    medidas_correctivas_texto: '',
    observaciones_generales_texto: '',
    supervisor_buceo_firma: null,
    ...initialData
  });

  const addPersonal = () => {
    const newPersonal = [...(formData.bs_personal || []), {
      nombre: '',
      matricula: '',
      cargo: '',
      serie_profundimetro: '',
      color_profundimetro: ''
    }];
    setFormData({ ...formData, bs_personal: newPersonal });
  };

  const removePersonal = (index: number) => {
    const newPersonal = (formData.bs_personal || []).filter((_, i) => i !== index);
    setFormData({ ...formData, bs_personal: newPersonal });
  };

  const updatePersonal = (index: number, field: string, value: string) => {
    const newPersonal = [...(formData.bs_personal || [])];
    newPersonal[index] = { ...newPersonal[index], [field]: value };
    setFormData({ ...formData, bs_personal: newPersonal });
  };

  const addEquipo = () => {
    const newEquipos = [...(formData.bs_equipos_usados || []), {
      equipo: '',
      numero_registro: ''
    }];
    setFormData({ ...formData, bs_equipos_usados: newEquipos });
  };

  const removeEquipo = (index: number) => {
    const newEquipos = (formData.bs_equipos_usados || []).filter((_, i) => i !== index);
    setFormData({ ...formData, bs_equipos_usados: newEquipos });
  };

  const updateEquipo = (index: number, field: string, value: string) => {
    const newEquipos = [...(formData.bs_equipos_usados || [])];
    newEquipos[index] = { ...newEquipos[index], [field]: value };
    setFormData({ ...formData, bs_equipos_usados: newEquipos });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as BitacoraSupervisorData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bitácora del Supervisor de Buceo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Identificación de la Faena */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">1. Identificación de la Faena</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={formData.fecha_inicio_faena}
                    onChange={(e) => setFormData({...formData, fecha_inicio_faena: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hora_inicio">Hora Inicio</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={formData.hora_inicio_faena}
                    onChange={(e) => setFormData({...formData, hora_inicio_faena: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fecha_termino">Fecha Término</Label>
                  <Input
                    id="fecha_termino"
                    type="date"
                    value={formData.fecha_termino_faena}
                    onChange={(e) => setFormData({...formData, fecha_termino_faena: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hora_termino">Hora Término</Label>
                  <Input
                    id="hora_termino"
                    type="time"
                    value={formData.hora_termino_faena}
                    onChange={(e) => setFormData({...formData, hora_termino_faena: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lugar_trabajo">Lugar de Trabajo</Label>
                  <Input
                    id="lugar_trabajo"
                    value={formData.lugar_trabajo}
                    onChange={(e) => setFormData({...formData, lugar_trabajo: e.target.value})}
                    placeholder="Indicar lugar específico"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_trabajo">Tipo de Trabajo</Label>
                  <Input
                    id="tipo_trabajo"
                    value={formData.tipo_trabajo}
                    onChange={(e) => setFormData({...formData, tipo_trabajo: e.target.value})}
                    placeholder="Indicar tipo de trabajo"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="supervisor_matricula">Nombre y N° de Matrícula del Supervisor</Label>
                  <Input
                    id="supervisor_matricula"
                    value={formData.supervisor_nombre_matricula}
                    onChange={(e) => setFormData({...formData, supervisor_nombre_matricula: e.target.value})}
                    placeholder="Nombre completo - Matrícula"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Buzos y Asistentes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b pb-2">2. Buzos y Asistentes (hasta 6)</h3>
                <Button type="button" onClick={addPersonal} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Personal
                </Button>
              </div>
              {formData.bs_personal?.map((persona, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={persona.nombre}
                        onChange={(e) => updatePersonal(index, 'nombre', e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label>Matrícula y Cargo</Label>
                      <Input
                        value={persona.matricula}
                        onChange={(e) => updatePersonal(index, 'matricula', e.target.value)}
                        placeholder="Matrícula - Cargo"
                      />
                    </div>
                    <div>
                      <Label>Serie/Color Profundímetro</Label>
                      <div className="flex gap-2">
                        <Input
                          value={persona.serie_profundimetro}
                          onChange={(e) => updatePersonal(index, 'serie_profundimetro', e.target.value)}
                          placeholder="Serie"
                          className="flex-1"
                        />
                        <Input
                          value={persona.color_profundimetro}
                          onChange={(e) => updatePersonal(index, 'color_profundimetro', e.target.value)}
                          placeholder="Color"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => removePersonal(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 3. Equipos Usados */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b pb-2">3. Equipos Usados</h3>
                <Button type="button" onClick={addEquipo} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Equipo
                </Button>
              </div>
              {formData.bs_equipos_usados?.map((equipo, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Equipo Usado</Label>
                      <Input
                        value={equipo.equipo}
                        onChange={(e) => updateEquipo(index, 'equipo', e.target.value)}
                        placeholder="Descripción del equipo"
                      />
                    </div>
                    <div>
                      <Label>Número de Registro</Label>
                      <div className="flex gap-2">
                        <Input
                          value={equipo.numero_registro}
                          onChange={(e) => updateEquipo(index, 'numero_registro', e.target.value)}
                          placeholder="Número de registro"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => removeEquipo(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 4. Observaciones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">4. Observaciones</h3>
              <div>
                <Label htmlFor="observaciones_previas">Condiciones Físicas del Buzo Previas a la Inmersión</Label>
                <Textarea
                  id="observaciones_previas"
                  value={formData.observaciones_previas}
                  onChange={(e) => setFormData({...formData, observaciones_previas: e.target.value})}
                  placeholder="Describir condiciones físicas, incidentes menores, etc."
                  rows={3}
                />
              </div>
            </div>

            {/* 5. Embarcación de Apoyo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">5. Embarcación de Apoyo</h3>
              <div>
                <Label htmlFor="embarcacion">Nombre y Matrícula</Label>
                <Input
                  id="embarcacion"
                  value={formData.embarcacion_nombre_matricula}
                  onChange={(e) => setFormData({...formData, embarcacion_nombre_matricula: e.target.value})}
                  placeholder="Nombre - Matrícula"
                />
              </div>
            </div>

            {/* 6. Tiempo de Buceo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">6. Tiempo de Buceo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiempo_total">Tiempo Total</Label>
                  <Input
                    id="tiempo_total"
                    value={formData.tiempo_total_buceo}
                    onChange={(e) => setFormData({...formData, tiempo_total_buceo: e.target.value})}
                    placeholder="ej: 2 horas 30 minutos"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="incluye_descompresion"
                    checked={formData.incluye_descompresion}
                    onCheckedChange={(checked) => setFormData({...formData, incluye_descompresion: !!checked})}
                  />
                  <Label htmlFor="incluye_descompresion">Incluye descompresión (adjuntar programa)</Label>
                </div>
              </div>
            </div>

            {/* 7. Contratista */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">7. Contratista de Buceo</h3>
              <div>
                <Label htmlFor="contratista">Nombre del Contratista</Label>
                <Input
                  id="contratista"
                  value={formData.contratista_nombre}
                  onChange={(e) => setFormData({...formData, contratista_nombre: e.target.value})}
                  placeholder="Nombre de la empresa contratista"
                />
              </div>
            </div>

            {/* 8. Datos del Buzo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">8. Datos del Buzo Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
                  <Input
                    id="apellido_paterno"
                    value={formData.buzo_principal_datos?.apellido_paterno}
                    onChange={(e) => setFormData({
                      ...formData, 
                      buzo_principal_datos: { 
                        ...formData.buzo_principal_datos, 
                        apellido_paterno: e.target.value 
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="apellido_materno">Apellido Materno</Label>
                  <Input
                    id="apellido_materno"
                    value={formData.buzo_principal_datos?.apellido_materno}
                    onChange={(e) => setFormData({
                      ...formData, 
                      buzo_principal_datos: { 
                        ...formData.buzo_principal_datos, 
                        apellido_materno: e.target.value 
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    value={formData.buzo_principal_datos?.nombres}
                    onChange={(e) => setFormData({
                      ...formData, 
                      buzo_principal_datos: { 
                        ...formData.buzo_principal_datos, 
                        nombres: e.target.value 
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="run">RUN</Label>
                  <Input
                    id="run"
                    value={formData.buzo_principal_datos?.run}
                    onChange={(e) => setFormData({
                      ...formData, 
                      buzo_principal_datos: { 
                        ...formData.buzo_principal_datos, 
                        run: e.target.value 
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* 9. Profundidades */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">9. Profundidades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profundidad_trabajo">Profundidad de Trabajo (mts)</Label>
                  <Input
                    id="profundidad_trabajo"
                    type="number"
                    step="0.1"
                    value={formData.profundidad_trabajo_mts}
                    onChange={(e) => setFormData({...formData, profundidad_trabajo_mts: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="profundidad_maxima">Profundidad Máxima (mts)</Label>
                  <Input
                    id="profundidad_maxima"
                    type="number"
                    step="0.1"
                    value={formData.profundidad_maxima_mts}
                    onChange={(e) => setFormData({...formData, profundidad_maxima_mts: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="md:col-span-2 flex items-center space-x-2">
                  <Checkbox
                    id="requiere_camara"
                    checked={formData.requiere_camara_hiperbarica}
                    onCheckedChange={(checked) => setFormData({...formData, requiere_camara_hiperbarica: !!checked})}
                  />
                  <Label htmlFor="requiere_camara">Requiere cámara hiperbárica (sobre 40 metros - adjuntar documentos)</Label>
                </div>
              </div>
            </div>

            {/* 10. Gestión Preventiva */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">10. Gestión Preventiva Según Decreto N°44</h3>
              <div className="space-y-3">
                {[
                  { key: 'gestprev_eval_riesgos_actualizada', label: 'Evaluación de riesgos específica del buceo actualizada' },
                  { key: 'gestprev_procedimientos_disponibles_conocidos', label: 'Procedimientos escritos disponibles y conocidos' },
                  { key: 'gestprev_capacitacion_previa_realizada', label: 'Capacitación previa al buceo realizada' },
                  { key: 'gestprev_identif_peligros_control_riesgos_subacuaticos_realizados', label: 'Identificación de peligros y control de riesgos del entorno subacuático realizados' },
                  { key: 'gestprev_registro_incidentes_reportados', label: 'Registro de incidentes, cuasi accidentes o condiciones inseguras reportadas' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.key}
                      checked={formData[item.key as keyof typeof formData] as boolean}
                      onCheckedChange={(checked) => setFormData({...formData, [item.key]: !!checked})}
                    />
                    <Label htmlFor={item.key} className="text-sm">{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 11. Medidas Correctivas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">11. Medidas Correctivas Implementadas</h3>
              <div>
                <Textarea
                  value={formData.medidas_correctivas_texto}
                  onChange={(e) => setFormData({...formData, medidas_correctivas_texto: e.target.value})}
                  placeholder="Describir medidas correctivas implementadas..."
                  rows={4}
                />
              </div>
            </div>

            {/* 12. Observaciones Generales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">12. Observaciones Generales</h3>
              <div>
                <Textarea
                  value={formData.observaciones_generales_texto}
                  onChange={(e) => setFormData({...formData, observaciones_generales_texto: e.target.value})}
                  placeholder="Observaciones generales..."
                  rows={4}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Guardar Bitácora
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
