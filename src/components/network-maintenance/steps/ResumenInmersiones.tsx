import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Timer, Navigation } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface ResumenInmersionesProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const ResumenInmersiones = ({ formData, updateFormData, readOnly = false }: ResumenInmersionesProps) => {
  const resumen = formData.resumen_inmersiones || {
    id: '',
    nombre_piloto: '',
    horas_piloto: 0,
    tipo_nave: '',
    obs_inmersiones: '',
    total_inmersiones: 0,
    horas_navegacion: 0,
    cabotaje_perdida: 0,
    rev_documental: 0,
    relevo: 0
  };

  const updateResumen = (campo: keyof typeof resumen, valor: number | string) => {
    updateFormData({
      resumen_inmersiones: {
        ...resumen,
        [campo]: valor
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Resumen de Inmersiones y Navegaciones
        </h3>
        <p className="text-sm text-gray-600">
          Totales y estadísticas de la jornada de trabajo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información del Piloto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre_piloto">Nombre del Piloto</Label>
              <Input
                id="nombre_piloto"
                value={resumen.nombre_piloto}
                onChange={(e) => updateResumen('nombre_piloto', e.target.value)}
                placeholder="Nombre completo"
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="tipo_nave">Tipo de Nave</Label>
              <Input
                id="tipo_nave"
                value={resumen.tipo_nave}
                onChange={(e) => updateResumen('tipo_nave', e.target.value)}
                placeholder="Tipo de embarcación"
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estadísticas de Operación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_inmersiones" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Nº Total de Inmersiones
              </Label>
              <Input
                id="total_inmersiones"
                type="number"
                value={resumen.total_inmersiones}
                onChange={(e) => updateResumen('total_inmersiones', Number(e.target.value))}
                placeholder="0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="horas_navegacion" className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Horas de Navegación por Relevo
              </Label>
              <Input
                id="horas_navegacion"
                type="number"
                step="0.1"
                value={resumen.horas_navegacion}
                onChange={(e) => updateResumen('horas_navegacion', Number(e.target.value))}
                placeholder="0.0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="horas_piloto">Horas de Piloto</Label>
              <Input
                id="horas_piloto"
                type="number"
                step="0.1"
                value={resumen.horas_piloto}
                onChange={(e) => updateResumen('horas_piloto', Number(e.target.value))}
                placeholder="0.0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="cabotaje_perdida">Cabotaje con Pérdida de Buceo</Label>
              <Input
                id="cabotaje_perdida"
                type="number"
                step="0.1"
                value={resumen.cabotaje_perdida}
                onChange={(e) => updateResumen('cabotaje_perdida', Number(e.target.value))}
                placeholder="0.0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="rev_documental" className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Revisión Documental (horas)
              </Label>
              <Input
                id="rev_documental"
                type="number"
                step="0.1"
                value={resumen.rev_documental}
                onChange={(e) => updateResumen('rev_documental', Number(e.target.value))}
                placeholder="0.0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="relevo">Relevo (horas)</Label>
              <Input
                id="relevo"
                type="number"
                step="0.1"
                value={resumen.relevo}
                onChange={(e) => updateResumen('relevo', Number(e.target.value))}
                placeholder="0.0"
                disabled={readOnly}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="obs_inmersiones">Observaciones</Label>
            <Input
              id="obs_inmersiones"
              value={resumen.obs_inmersiones}
              onChange={(e) => updateResumen('obs_inmersiones', e.target.value)}
              placeholder="Observaciones generales..."
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumen Visual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen Visual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{resumen.total_inmersiones}</div>
              <div className="text-sm text-blue-600">Inmersiones Totales</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{resumen.horas_navegacion.toFixed(1)}h</div>
              <div className="text-sm text-green-600">Horas Navegación</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {(resumen.rev_documental + resumen.relevo).toFixed(1)}h
              </div>
              <div className="text-sm text-purple-600">Horas Administrativas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
