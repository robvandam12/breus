
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';

interface HPTWizardStep1Props {
  data: any;
  updateData: (updates: any) => void;
}

export const HPTWizardStep1: React.FC<HPTWizardStep1Props> = ({ data, updateData }) => {
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();

  const currentOperation = operaciones.find(op => op.id === data.operacion_id);
  // Since operations no longer have direct team assignments, get available teams
  const availableTeams = equipos || [];
  const assignedTeam = availableTeams.length > 0 ? availableTeams[0] : null;

  const handleInputChange = (field: string, value: any) => {
    updateData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información General del HPT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="folio">Folio HPT *</Label>
              <Input
                id="folio"
                value={data.folio || ''}
                onChange={(e) => handleInputChange('folio', e.target.value)}
                placeholder="HPT-001"
              />
            </div>
            
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha || ''}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa_servicio">Empresa/Servicio *</Label>
              <Input
                id="empresa_servicio"
                value={data.empresa_servicio_nombre || ''}
                onChange={(e) => handleInputChange('empresa_servicio_nombre', e.target.value)}
                placeholder="Nombre de la empresa"
              />
            </div>
            
            <div>
              <Label htmlFor="centro_trabajo">Centro de Trabajo *</Label>
              <Input
                id="centro_trabajo"
                value={data.centro_trabajo_nombre || ''}
                onChange={(e) => handleInputChange('centro_trabajo_nombre', e.target.value)}
                placeholder="Ubicación del trabajo"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lugar_especifico">Lugar Específico</Label>
            <Input
              id="lugar_especifico"
              value={data.lugar_especifico || ''}
              onChange={(e) => handleInputChange('lugar_especifico', e.target.value)}
              placeholder="Descripción específica del lugar"
            />
          </div>

          <div>
            <Label htmlFor="descripcion_tarea">Descripción de la Tarea *</Label>
            <Textarea
              id="descripcion_tarea"
              value={data.descripcion_tarea || ''}
              onChange={(e) => handleInputChange('descripcion_tarea', e.target.value)}
              placeholder="Describa detalladamente la tarea a realizar"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="plan_trabajo">Plan de Trabajo *</Label>
            <Textarea
              id="plan_trabajo"
              value={data.plan_trabajo || ''}
              onChange={(e) => handleInputChange('plan_trabajo', e.target.value)}
              placeholder="Describa el plan de trabajo detallado"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {assignedTeam && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Asignado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Equipo:</strong> {assignedTeam.nombre}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Personal del equipo será auto-poblado en los siguientes pasos
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
