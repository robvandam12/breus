
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useInmersiones } from "@/hooks/useInmersiones";
import { useAuth } from "@/hooks/useAuth";
import { BitacoraSupervisorFormData } from '@/hooks/useBitacoras';

interface BitacoraSupervisorFormEnhancedProps {
  onSubmit: (data: BitacoraSupervisorFormData) => void;
  onCancel: () => void;
}

interface PersonalItem {
  nombre: string;
  matricula_cargo: string;
  serie_profundimetro: string;
  color_profundimetro: string;
}

interface EquipoItem {
  equipo: string;
  numero_registro: string;
}

interface BuzoPrincipalData {
  apellido_paterno: string;
  apellido_materno: string;
  nombres: string;
  run: string;
}

export const BitacoraSupervisorFormEnhanced: React.FC<BitacoraSupervisorFormEnhancedProps> = ({
  onSubmit,
  onCancel
}) => {
  const { inmersiones } = useInmersiones();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    inmersion_id: '',
    supervisor: user?.email || '',
    fecha_inicio: '',
    hora_inicio: '',
    fecha_termino: '',
    hora_termino: '',
    lugar_trabajo: '',
    tipo_trabajo: '',
    supervisor_matricula: '',
    personal: [] as PersonalItem[],
    equipos: [] as EquipoItem[],
    observaciones_previas: '',
    embarcacion_nombre_matricula: '',
    tiempo_total_buceo: '',
    incluye_descompresion: false,
    contratista_nombre: '',
    buzo_principal: {
      apellido_paterno: '',
      apellido_materno: '',
      nombres: '',
      run: ''
    } as BuzoPrincipalData,
    profundidad_trabajo: 0,
    profundidad_maxima: 0,
    requiere_camara_hiperbarica: false,
    gestion_preventiva: {
      eval_riesgos_actualizada: false,
      procedimientos_disponibles: false,
      capacitacion_previa: false,
      identif_peligros_realizados: false,
      registro_incidentes: false
    },
    medidas_correctivas: '',
    observaciones_generales: ''
  });

  // Filter completed immersions
  const inmersionesCompletadas = inmersiones.filter(i => i.estado === 'completada');

  const addPersonal = () => {
    if (formData.personal.length < 6) {
      setFormData({
        ...formData,
        personal: [...formData.personal, {
          nombre: '',
          matricula_cargo: '',
          serie_profundimetro: '',
          color_profundimetro: ''
        }]
      });
    }
  };

  const removePersonal = (index: number) => {
    const newPersonal = formData.personal.filter((_, i) => i !== index);
    setFormData({ ...formData, personal: newPersonal });
  };

  const updatePersonal = (index: number, field: string, value: string) => {
    const newPersonal = [...formData.personal];
    newPersonal[index] = { ...newPersonal[index], [field]: value };
    setFormData({ ...formData, personal: newPersonal });
  };

  const addEquipo = () => {
    if (formData.equipos.length < 3) {
      setFormData({
        ...formData,
        equipos: [...formData.equipos, { equipo: '', numero_registro: '' }]
      });
    }
  };

  const removeEquipo = (index: number) => {
    const newEquipos = formData.equipos.filter((_, i) => i !== index);
    setFormData({ ...formData, equipos: newEquipos });
  };

  const updateEquipo = (index: number, field: string, value: string) => {
    const newEquipos = [...formData.equipos];
    newEquipos[index] = { ...newEquipos[index], [field]: value };
    setFormData({ ...formData, equipos: newEquipos });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the development description from all the fields
    const desarrollo_inmersion = `
IDENTIFICACIÓN:
Lugar: ${formData.lugar_trabajo}
Tipo: ${formData.tipo_trabajo}
Fechas: ${formData.fecha_inicio} ${formData.hora_inicio} - ${formData.fecha_termino} ${formData.hora_termino}

PERSONAL (${formData.personal.length}):
${formData.personal.map(p => `- ${p.nombre} (${p.matricula_cargo})`).join('\n')}

EQUIPOS:
${formData.equipos.map(e => `- ${e.equipo} (${e.numero_registro})`).join('\n')}

EMBARCACIÓN: ${formData.embarcacion_nombre_matricula}
TIEMPO TOTAL: ${formData.tiempo_total_buceo}
PROFUNDIDADES: Trabajo ${formData.profundidad_trabajo}m, Máxima ${formData.profundidad_maxima}m
`.trim();

    const evaluacion_general = `
GESTIÓN PREVENTIVA:
- Evaluación riesgos: ${formData.gestion_preventiva.eval_riesgos_actualizada ? 'SÍ' : 'NO'}
- Procedimientos: ${formData.gestion_preventiva.procedimientos_disponibles ? 'SÍ' : 'NO'}
- Capacitación: ${formData.gestion_preventiva.capacitacion_previa ? 'SÍ' : 'NO'}
- Control riesgos: ${formData.gestion_preventiva.identif_peligros_realizados ? 'SÍ' : 'NO'}
- Registro incidentes: ${formData.gestion_preventiva.registro_incidentes ? 'SÍ' : 'NO'}

MEDIDAS CORRECTIVAS:
${formData.medidas_correctivas}

OBSERVACIONES GENERALES:
${formData.observaciones_generales}
`.trim();

    const bitacoraData: BitacoraSupervisorFormData = {
      inmersion_id: formData.inmersion_id,
      supervisor: formData.supervisor,
      desarrollo_inmersion,
      evaluacion_general,
      incidentes: formData.observaciones_previas,
      fecha: formData.fecha_inicio || new Date().toISOString().split('T')[0]
    };

    onSubmit(bitacoraData);
  };

  // Check if profundidad_maxima > 40 to show hyperbaric chamber warning
  useEffect(() => {
    if (formData.profundidad_maxima > 40) {
      setFormData(prev => ({ ...prev, requiere_camara_hiperbarica: true }));
    } else {
      setFormData(prev => ({ ...prev, requiere_camara_hiperbarica: false }));
    }
  }, [formData.profundidad_maxima]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Save className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Bitácora del Supervisor de Buceo</CardTitle>
                <p className="text-sm text-zinc-500">Registro completo según normativa</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Identificación de la Faena */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">1. Identificación de la Faena</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inmersion_id">Inmersión</Label>
                  <Select onValueChange={(value) => setFormData({...formData, inmersion_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar inmersión..." />
                    </SelectTrigger>
                    <SelectContent>
                      {inmersionesCompletadas.map((inmersion) => (
                        <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                          {inmersion.codigo} - {inmersion.objetivo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="supervisor_matricula">Supervisor y Matrícula</Label>
                  <Input
                    id="supervisor_matricula"
                    value={formData.supervisor_matricula}
                    onChange={(e) => setFormData({...formData, supervisor_matricula: e.target.value})}
                    placeholder="Nombre completo - Matrícula"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                  <Input
                    id="fecha_inicio"
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hora_inicio">Hora Inicio</Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fecha_termino">Fecha Término</Label>
                  <Input
                    id="fecha_termino"
                    type="date"
                    value={formData.fecha_termino}
                    onChange={(e) => setFormData({...formData, fecha_termino: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hora_termino">Hora Término</Label>
                  <Input
                    id="hora_termino"
                    type="time"
                    value={formData.hora_termino}
                    onChange={(e) => setFormData({...formData, hora_termino: e.target.value})}
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
              </div>
            </div>

            {/* 2. Buzos y Asistentes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b pb-2">2. Buzos y Asistentes (hasta 6)</h3>
                <Button type="button" onClick={addPersonal} variant="outline" size="sm" disabled={formData.personal.length >= 6}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Personal
                </Button>
              </div>
              {formData.personal.map((persona, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        value={persona.matricula_cargo}
                        onChange={(e) => updatePersonal(index, 'matricula_cargo', e.target.value)}
                        placeholder="Matrícula - Cargo"
                      />
                    </div>
                    <div>
                      <Label>Serie Profundímetro</Label>
                      <Input
                        value={persona.serie_profundimetro}
                        onChange={(e) => updatePersonal(index, 'serie_profundimetro', e.target.value)}
                        placeholder="N° Serie"
                      />
                    </div>
                    <div>
                      <Label>Color/Acc.</Label>
                      <div className="flex gap-2">
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
                <h3 className="text-lg font-semibold border-b pb-2">3. Equipos Usados (hasta 3)</h3>
                <Button type="button" onClick={addEquipo} variant="outline" size="sm" disabled={formData.equipos.length >= 3}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Equipo
                </Button>
              </div>
              {formData.equipos.map((equipo, index) => (
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

            {/* 8. Datos del Buzo Principal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">8. Datos del Buzo Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
                  <Input
                    id="apellido_paterno"
                    value={formData.buzo_principal.apellido_paterno}
                    onChange={(e) => setFormData({
                      ...formData, 
                      buzo_principal: { 
                        ...formData.buzo_principal, 
                        apellido_paterno: e.target.value 
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="apellido_materno">Apellido Materno</Label>
                  <Input
                    id="apellido_materno"
                    value={formData.buzo_principal.apellido_materno}
                    onChange={(e) => setFormData({
                      ...formData, 
                      buzo_principal: { 
                        ...formData.buzo_principal, 
                        apellido_materno: e.target.value 
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    value={formData.buzo_principal.nombres}
                    onChange={(e) => setFormData({
                      ...formData, 
                      buzo_principal: { 
                        ...formData.buzo_principal, 
                        nombres: e.target.value 
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="run">RUN</Label>
                  <Input
                    id="run"
                    value={formData.buzo_principal.run}
                    onChange={(e) => setFormData({
                      ...formData, 
                      buzo_principal: { 
                        ...formData.buzo_principal, 
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
                    value={formData.profundidad_trabajo}
                    onChange={(e) => setFormData({...formData, profundidad_trabajo: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="profundidad_maxima">Profundidad Máxima (mts)</Label>
                  <Input
                    id="profundidad_maxima"
                    type="number"
                    step="0.1"
                    value={formData.profundidad_maxima}
                    onChange={(e) => setFormData({...formData, profundidad_maxima: parseFloat(e.target.value) || 0})}
                  />
                </div>
                {formData.requiere_camara_hiperbarica && (
                  <div className="md:col-span-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-700 text-sm font-medium">
                      ⚠️ Profundidad sobre 40 metros: Se requiere cámara hiperbárica disponible (adjuntar documentos)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 10. Gestión Preventiva */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">10. Gestión Preventiva Según Decreto N°44</h3>
              <div className="space-y-3">
                {[
                  { key: 'eval_riesgos_actualizada', label: 'Evaluación de riesgos específica del buceo actualizada' },
                  { key: 'procedimientos_disponibles', label: 'Procedimientos escritos disponibles y conocidos' },
                  { key: 'capacitacion_previa', label: 'Capacitación previa al buceo realizada' },
                  { key: 'identif_peligros_realizados', label: 'Identificación de peligros y control de riesgos del entorno subacuático realizados' },
                  { key: 'registro_incidentes', label: 'Registro de incidentes, cuasi accidentes o condiciones inseguras reportadas' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={item.key}
                      checked={formData.gestion_preventiva[item.key as keyof typeof formData.gestion_preventiva]}
                      onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        gestion_preventiva: {
                          ...formData.gestion_preventiva,
                          [item.key]: !!checked
                        }
                      })}
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
                  value={formData.medidas_correctivas}
                  onChange={(e) => setFormData({...formData, medidas_correctivas: e.target.value})}
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
                  value={formData.observaciones_generales}
                  onChange={(e) => setFormData({...formData, observaciones_generales: e.target.value})}
                  placeholder="Observaciones generales..."
                  rows={4}
                />
              </div>
            </div>

            {/* 13. Firma */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">13. Firma del Supervisor de Buceo</h3>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  Al enviar este formulario, confirmo que toda la información proporcionada es correcta y completa.
                  La firma digital se aplicará automáticamente al crear la bitácora.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Crear Bitácora Supervisor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
