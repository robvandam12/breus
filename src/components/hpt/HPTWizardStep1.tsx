
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Calendar, Clock, MapPin } from 'lucide-react';
import { HPTWizardData } from '@/hooks/useHPTWizard';
import { useOperacionFormData } from '@/hooks/useOperacionFormData';

interface HPTWizardStep1Props {
  data: HPTWizardData;
  updateData: (updates: Partial<HPTWizardData>) => void;
}

export const HPTWizardStep1: React.FC<HPTWizardStep1Props> = ({ data, updateData }) => {
  const operacionData = useOperacionFormData(data.operacion_id);

  // Auto-poblar datos cuando se carga la información de la operación
  useEffect(() => {
    if (operacionData?.hptDefaults && !data.folio) {
      updateData({
        ...operacionData.hptDefaults,
        folio: `HPT-${Date.now().toString().slice(-6)}`,
        hora_inicio: '08:00',
        hora_termino: '17:00',
      });
    }
  }, [operacionData, data.folio, updateData]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Datos Generales de la HPT</h2>
        <p className="mt-2 text-gray-600">
          Información básica de la Hoja de Planificación de Tarea
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Identificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="folio">Folio HPT *</Label>
              <Input
                id="folio"
                value={data.folio}
                onChange={(e) => updateData({ folio: e.target.value })}
                placeholder="HPT-XXXXXX"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={data.fecha}
                  onChange={(e) => updateData({ fecha: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>
                  <Checkbox
                    checked={data.es_rutinaria}
                    onCheckedChange={(checked) => updateData({ es_rutinaria: Boolean(checked) })}
                  />
                  <span className="ml-2">Tarea Rutinaria</span>
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hora_inicio">Hora Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={data.hora_inicio}
                  onChange={(e) => updateData({ hora_inicio: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="hora_termino">Hora Término *</Label>
                <Input
                  id="hora_termino"
                  type="time"
                  value={data.hora_termino}
                  onChange={(e) => updateData({ hora_termino: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Ubicación y Responsables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="empresa_servicio">Empresa de Servicio *</Label>
              <Input
                id="empresa_servicio"
                value={data.empresa_servicio_nombre}
                onChange={(e) => updateData({ empresa_servicio_nombre: e.target.value })}
                placeholder="Nombre de la empresa contratista"
                required
              />
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor de Servicio *</Label>
              <Input
                id="supervisor"
                value={data.supervisor_nombre}
                onChange={(e) => updateData({ supervisor_nombre: e.target.value })}
                placeholder="Nombre del supervisor"
                required
              />
            </div>

            <div>
              <Label htmlFor="centro_trabajo">Centro de Trabajo *</Label>
              <Input
                id="centro_trabajo"
                value={data.centro_trabajo_nombre}
                onChange={(e) => updateData({ centro_trabajo_nombre: e.target.value })}
                placeholder="Nombre del sitio/centro"
                required
              />
            </div>

            <div>
              <Label htmlFor="jefe_mandante">Jefe/Supervisor Mandante *</Label>
              <Input
                id="jefe_mandante"
                value={data.jefe_mandante_nombre}
                onChange={(e) => updateData({ jefe_mandante_nombre: e.target.value })}
                placeholder="Nombre del responsable mandante"
                required
              />
            </div>

            <div>
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select value={data.estado_puerto} onValueChange={(value: 'abierto' | 'cerrado') => updateData({ estado_puerto: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abierto">Abierto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descripción del Trabajo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="descripcion_tarea">Descripción de la Tarea *</Label>
            <Textarea
              id="descripcion_tarea"
              value={data.descripcion_tarea}
              onChange={(e) => updateData({ descripcion_tarea: e.target.value })}
              placeholder="Descripción detallada de la tarea a realizar..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="lugar_especifico">Lugar Específico *</Label>
            <Input
              id="lugar_especifico"
              value={data.lugar_especifico}
              onChange={(e) => updateData({ lugar_especifico: e.target.value })}
              placeholder="Ubicación específica donde se realizará el trabajo"
              required
            />
          </div>
        </CardContent>
      </Card>

      {operacionData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm text-blue-800">
                <strong>Operación:</strong> {operacionData.operacion.nombre} ({operacionData.operacion.codigo})
                <br />
                <strong>Sitio:</strong> {operacionData.sitio?.nombre || 'Sin asignar'}
                <br />
                <strong>Empresa:</strong> {operacionData.contratista?.nombre || 'Sin asignar'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
