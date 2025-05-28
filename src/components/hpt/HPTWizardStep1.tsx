
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarDays, Clock, Building, User } from 'lucide-react';
import { HPTFormData } from '@/hooks/useHPTWizard';

interface HPTWizardStep1Props {
  data: HPTFormData;
  updateData: (updates: Partial<HPTFormData>) => void;
}

export const HPTWizardStep1: React.FC<HPTWizardStep1Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
        <p className="mt-2 text-gray-600">
          Datos básicos del trabajo a realizar y responsables
        </p>
      </div>

      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="folio">
                Folio HPT <span className="text-red-500">*</span>
              </Label>
              <Input
                id="folio"
                value={data.folio || ''}
                onChange={(e) => updateData({ folio: e.target.value })}
                placeholder="Código único del HPT"
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="fecha">
                Fecha <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha || ''}
                onChange={(e) => updateData({ fecha: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_inicio">
                Hora de Inicio
              </Label>
              <Input
                id="hora_inicio"
                type="time"
                value={data.hora_inicio || ''}
                onChange={(e) => updateData({ hora_inicio: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_termino">
                Hora de Término
              </Label>
              <Input
                id="hora_termino"
                type="time"
                value={data.hora_termino || ''}
                onChange={(e) => updateData({ hora_termino: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de la empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            Información de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa_servicio_nombre">
                Empresa de Servicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="empresa_servicio_nombre"
                value={data.empresa_servicio_nombre || ''}
                onChange={(e) => updateData({ empresa_servicio_nombre: e.target.value })}
                placeholder="Nombre de la empresa contratista"
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-blue-600 mt-1">Auto-poblado desde operación</p>
            </div>

            <div>
              <Label htmlFor="centro_trabajo_nombre">
                Centro de Trabajo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="centro_trabajo_nombre"
                value={data.centro_trabajo_nombre || ''}
                onChange={(e) => updateData({ centro_trabajo_nombre: e.target.value })}
                placeholder="Sitio o centro de trabajo"
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-blue-600 mt-1">Auto-poblado desde operación</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal responsable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Personal Responsable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supervisor_nombre">
                Supervisor <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supervisor_nombre"
                value={data.supervisor_nombre || ''}
                onChange={(e) => updateData({ supervisor_nombre: e.target.value })}
                placeholder="Nombre del supervisor"
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-blue-600 mt-1">Auto-poblado desde equipo de buceo</p>
            </div>

            <div>
              <Label htmlFor="jefe_mandante_nombre">
                Jefe Mandante
              </Label>
              <Input
                id="jefe_mandante_nombre"
                value={data.jefe_mandante_nombre || ''}
                onChange={(e) => updateData({ jefe_mandante_nombre: e.target.value })}
                placeholder="Nombre del jefe mandante"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción del trabajo */}
      <Card>
        <CardHeader>
          <CardTitle>Descripción del Trabajo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="descripcion_tarea">
              Descripción de la Tarea <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion_tarea"
              value={data.descripcion_tarea || ''}
              onChange={(e) => updateData({ descripcion_tarea: e.target.value })}
              placeholder="Describa detalladamente la tarea a realizar..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="lugar_especifico">
              Lugar Específico
            </Label>
            <Input
              id="lugar_especifico"
              value={data.lugar_especifico || ''}
              onChange={(e) => updateData({ lugar_especifico: e.target.value })}
              placeholder="Ubicación específica del trabajo"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="es_rutinaria"
              checked={data.es_rutinaria || false}
              onCheckedChange={(checked) => updateData({ es_rutinaria: checked as boolean })}
            />
            <Label htmlFor="es_rutinaria">
              Tarea rutinaria
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo_trabajo">
                Tipo de Trabajo
              </Label>
              <Input
                id="tipo_trabajo"
                value={data.tipo_trabajo || ''}
                onChange={(e) => updateData({ tipo_trabajo: e.target.value })}
                placeholder="Tipo o categoría del trabajo"
              />
            </div>

            <div>
              <Label htmlFor="descripcion_trabajo">
                Descripción Adicional
              </Label>
              <Input
                id="descripcion_trabajo"
                value={data.descripcion_trabajo || ''}
                onChange={(e) => updateData({ descripcion_trabajo: e.target.value })}
                placeholder="Información adicional del trabajo"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
