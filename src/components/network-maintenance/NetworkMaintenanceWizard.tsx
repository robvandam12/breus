import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, ArrowLeft } from "lucide-react";
import { useMaintenanceNetworks } from '@/hooks/useMaintenanceNetworks';

interface NetworkMaintenanceWizardProps {
  operacionId: string;
  tipoFormulario: 'mantencion' | 'faena_redes';
  onComplete: () => void;
  onCancel: () => void;
  editingFormId?: string | null;
  readOnly?: boolean;
}

export const NetworkMaintenanceWizard = ({
  operacionId,
  tipoFormulario,
  onComplete,
  onCancel,
  editingFormId,
  readOnly = false
}: NetworkMaintenanceWizardProps) => {
  const { createMaintenanceForm, isCreating } = useMaintenanceNetworks();
  
  const [formData, setFormData] = useState({
    codigo: `MAN-${Date.now().toString().slice(-6)}`,
    tipo_formulario: tipoFormulario,
    fecha: new Date().toISOString().split('T')[0],
    lugar_trabajo: '',
    nave_maniobras: '',
    matricula_nave: '',
    estado_puerto: 'calmo',
    team_s: '',
    team_be: '',
    team_bi: '',
    hora_inicio: '',
    hora_termino: '',
    profundidad_max: 0,
    temperatura: 0,
    multix_data: {}
  });

  const [dotacion, setDotacion] = useState([{
    nombre: '',
    apellido: '',
    matricula: '',
    rol: 'buzo',
    equipo: '',
    contratista: false
  }]);

  const [equiposSuperficie, setEquiposSuperficie] = useState([{
    equipo_sup: '',
    matricula_eq: '',
    horometro_ini: 0,
    horometro_fin: 0
  }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) return;
    
    try {
      await createMaintenanceForm({
        ...formData,
        dotacion,
        equipos_superficie: equiposSuperficie,
        multix_data: {
          dotacion,
          equipos_superficie: equiposSuperficie,
          tipo_formulario: tipoFormulario
        }
      });
      onComplete();
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const addDotacionMember = () => {
    if (readOnly) return;
    setDotacion([...dotacion, {
      nombre: '',
      apellido: '',
      matricula: '',
      rol: 'buzo',
      equipo: '',
      contratista: false
    }]);
  };

  const removeDotacionMember = (index: number) => {
    if (readOnly) return;
    setDotacion(dotacion.filter((_, i) => i !== index));
  };

  const addEquipoSuperficie = () => {
    if (readOnly) return;
    setEquiposSuperficie([...equiposSuperficie, {
      equipo_sup: '',
      matricula_eq: '',
      horometro_ini: 0,
      horometro_fin: 0
    }]);
  };

  const removeEquipoSuperficie = (index: number) => {
    if (readOnly) return;
    setEquiposSuperficie(equiposSuperficie.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {readOnly ? 'Ver ' : ''}
            {tipoFormulario === 'mantencion' ? 'Formulario de Mantención' : 'Formulario de Faena de Redes'}
          </h2>
          <p className="text-gray-600">
            {readOnly ? 'Visualizar datos del formulario operativo' : 'Complete los datos del formulario operativo'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {readOnly ? 'Cerrar' : 'Cancelar'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Generales */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Generales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => !readOnly && setFormData({...formData, codigo: e.target.value})}
                  required
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => !readOnly && setFormData({...formData, fecha: e.target.value})}
                  required
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="lugar_trabajo">Lugar de Trabajo</Label>
                <Input
                  id="lugar_trabajo"
                  value={formData.lugar_trabajo}
                  onChange={(e) => !readOnly && setFormData({...formData, lugar_trabajo: e.target.value})}
                  required
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="nave_maniobras">Nave/Maniobras</Label>
                <Input
                  id="nave_maniobras"
                  value={formData.nave_maniobras}
                  onChange={(e) => !readOnly && setFormData({...formData, nave_maniobras: e.target.value})}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="matricula_nave">Matrícula Nave</Label>
                <Input
                  id="matricula_nave"
                  value={formData.matricula_nave}
                  onChange={(e) => !readOnly && setFormData({...formData, matricula_nave: e.target.value})}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="estado_puerto">Estado Puerto</Label>
                <Select value={formData.estado_puerto} onValueChange={(value) => !readOnly && setFormData({...formData, estado_puerto: value})} disabled={readOnly}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calmo">Calmo</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                    <SelectItem value="agitado">Agitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dotación */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Dotación</CardTitle>
              {!readOnly && (
                <Button type="button" onClick={addDotacionMember} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Persona
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dotacion.map((member, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Persona {index + 1}</Badge>
                    {dotacion.length > 1 && !readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDotacionMember(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={member.nombre}
                        onChange={(e) => {
                          if (readOnly) return;
                          const newDotacion = [...dotacion];
                          newDotacion[index].nombre = e.target.value;
                          setDotacion(newDotacion);
                        }}
                        disabled={readOnly}
                      />
                    </div>
                    <div>
                      <Label>Apellido</Label>
                      <Input
                        value={member.apellido}
                        onChange={(e) => {
                          if (readOnly) return;
                          const newDotacion = [...dotacion];
                          newDotacion[index].apellido = e.target.value;
                          setDotacion(newDotacion);
                        }}
                        disabled={readOnly}
                      />
                    </div>
                    <div>
                      <Label>Matrícula</Label>
                      <Input
                        value={member.matricula}
                        onChange={(e) => {
                          if (readOnly) return;
                          const newDotacion = [...dotacion];
                          newDotacion[index].matricula = e.target.value;
                          setDotacion(newDotacion);
                        }}
                        disabled={readOnly}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipos de Superficie */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Equipos de Superficie</CardTitle>
              {!readOnly && (
                <Button type="button" onClick={addEquipoSuperficie} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Equipo
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equiposSuperficie.map((equipo, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Equipo {index + 1}</Badge>
                    {equiposSuperficie.length > 1 && !readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEquipoSuperficie(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Equipo</Label>
                      <Input
                        value={equipo.equipo_sup}
                        onChange={(e) => {
                          if (readOnly) return;
                          const newEquipos = [...equiposSuperficie];
                          newEquipos[index].equipo_sup = e.target.value;
                          setEquiposSuperficie(newEquipos);
                        }}
                        disabled={readOnly}
                      />
                    </div>
                    <div>
                      <Label>Matrícula</Label>
                      <Input
                        value={equipo.matricula_eq}
                        onChange={(e) => {
                          if (readOnly) return;
                          const newEquipos = [...equiposSuperficie];
                          newEquipos[index].matricula_eq = e.target.value;
                          setEquiposSuperficie(newEquipos);
                        }}
                        disabled={readOnly}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}  
        {!readOnly && (
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Guardando...' : 'Guardar Formulario'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
