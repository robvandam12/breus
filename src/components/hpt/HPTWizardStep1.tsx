
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HPTWizardData } from '@/hooks/useHPTWizard';

interface HPTWizardStep1Props {
  data: HPTWizardData;
  updateData: (updates: Partial<HPTWizardData>) => void;
}

export const HPTWizardStep1: React.FC<HPTWizardStep1Props> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos Generales de la Tarea</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folio">Folio *</Label>
              <Input
                id="folio"
                value={data.folio}
                onChange={(e) => updateData({ folio: e.target.value })}
                placeholder="Ingrese el folio"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha}
                onChange={(e) => updateData({ fecha: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora Inicio Tarea *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={data.hora_inicio}
                onChange={(e) => updateData({ hora_inicio: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hora_termino">Hora Término Tarea</Label>
              <Input
                id="hora_termino"
                type="time"
                value={data.hora_termino}
                onChange={(e) => updateData({ hora_termino: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa_servicio">Nombre Empresa Servicio</Label>
              <Input
                id="empresa_servicio"
                value={data.empresa_servicio_nombre}
                onChange={(e) => updateData({ empresa_servicio_nombre: e.target.value })}
                placeholder="Nombre de la empresa de servicio"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supervisor">Nombre Supervisor</Label>
              <Input
                id="supervisor"
                value={data.supervisor_nombre}
                onChange={(e) => updateData({ supervisor_nombre: e.target.value })}
                placeholder="Nombre del supervisor"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="centro_trabajo">Nombre Centro Trabajo</Label>
              <Input
                id="centro_trabajo"
                value={data.centro_trabajo_nombre}
                onChange={(e) => updateData({ centro_trabajo_nombre: e.target.value })}
                placeholder="Nombre del centro de trabajo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jefe_mandante">Nombre Jefe Mandante</Label>
              <Input
                id="jefe_mandante"
                value={data.jefe_mandante_nombre}
                onChange={(e) => updateData({ jefe_mandante_nombre: e.target.value })}
                placeholder="Nombre del jefe mandante"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion_tarea">Identificación/Descripción del Trabajo *</Label>
            <Textarea
              id="descripcion_tarea"
              value={data.descripcion_tarea}
              onChange={(e) => updateData({ descripcion_tarea: e.target.value })}
              placeholder="Describa detalladamente el trabajo a realizar"
              rows={3}
              maxLength={300}
              required
            />
            <p className="text-sm text-gray-500">
              {data.descripcion_tarea.length}/300 caracteres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lugar_especifico">Lugar Específico</Label>
              <Input
                id="lugar_especifico"
                value={data.lugar_especifico}
                onChange={(e) => updateData({ lugar_especifico: e.target.value })}
                placeholder="Ubicación específica del trabajo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select 
                value={data.estado_puerto} 
                onValueChange={(value: 'abierto' | 'cerrado') => updateData({ estado_puerto: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abierto">Abierto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="es_rutinaria"
              checked={data.es_rutinaria}
              onCheckedChange={(checked) => updateData({ es_rutinaria: checked })}
            />
            <Label htmlFor="es_rutinaria">¿Es una tarea rutinaria?</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
