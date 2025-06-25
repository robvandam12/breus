
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import type { FishingNetworkMaintenanceData } from '@/types/fishing-networks';

interface Step7TotalesProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Step7Totales = ({ formData, updateFormData, readOnly = false }: Step7TotalesProps) => {
  const handleChange = (field: string, value: number | string) => {
    updateFormData({
      totales: {
        ...formData.totales,
        [field]: value
      }
    });
  };

  const totalesData = formData.totales || {
    horas_inmersion: 0,
    horas_trabajo: 0,
    total_horas: 0,
    jaulas_intervenidas: ''
  };

  // Cálculo automático del total de horas
  useEffect(() => {
    const total = totalesData.horas_inmersion + totalesData.horas_trabajo;
    if (total !== totalesData.total_horas) {
      handleChange('total_horas', total);
    }
  }, [totalesData.horas_inmersion, totalesData.horas_trabajo]);

  // Calcular horas desde datos generales si están disponibles
  useEffect(() => {
    if (formData.datos_generales?.hora_inicio_faena && formData.datos_generales?.hora_termino_faena) {
      const inicio = formData.datos_generales.hora_inicio_faena;
      const termino = formData.datos_generales.hora_termino_faena;
      
      // Convertir horas a minutos y calcular diferencia
      const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
      const [horaTermino, minutoTermino] = termino.split(':').map(Number);
      
      const minutosInicio = horaInicio * 60 + minutoInicio;
      const minutosTermino = horaTermino * 60 + minutoTermino;
      
      let diferenciaMinutos = minutosTermino - minutosInicio;
      
      // Si el término es menor que el inicio, asumimos que cruzó medianoche
      if (diferenciaMinutos < 0) {
        diferenciaMinutos += 24 * 60;
      }
      
      const horasTotales = Math.round((diferenciaMinutos / 60) * 100) / 100;
      
      if (horasTotales > 0 && horasTotales !== totalesData.horas_trabajo) {
        handleChange('horas_trabajo', horasTotales);
      }
    }
  }, [formData.datos_generales?.hora_inicio_faena, formData.datos_generales?.hora_termino_faena]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Totales de la Jornada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="horas_inmersion">H.I. (Horas inmersión)</Label>
            <Input
              id="horas_inmersion"
              type="number"
              step="0.01"
              value={totalesData.horas_inmersion}
              onChange={(e) => handleChange('horas_inmersion', Number(e.target.value))}
              placeholder="0.00"
              min="0"
              max="24"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horas_trabajo">H.T. (Horas trabajo)</Label>
            <Input
              id="horas_trabajo"
              type="number"
              step="0.01"
              value={totalesData.horas_trabajo}
              onChange={(e) => handleChange('horas_trabajo', Number(e.target.value))}
              placeholder="0.00"
              min="0"
              max="24"
              disabled={readOnly}
            />
            {formData.datos_generales?.hora_inicio_faena && formData.datos_generales?.hora_termino_faena && (
              <p className="text-xs text-gray-500">
                Calculado automáticamente desde horarios de faena
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_horas">Total horas</Label>
            <Input
              id="total_horas"
              type="number"
              step="0.01"
              value={totalesData.total_horas}
              placeholder="0.00"
              className="bg-gray-50"
              disabled={true} // Siempre calculado automáticamente
            />
            <p className="text-xs text-gray-500">
              Suma automática: H.I. + H.T.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jaulas_intervenidas">Nº jaula(s) intervenidas</Label>
          <Textarea
            id="jaulas_intervenidas"
            value={totalesData.jaulas_intervenidas}
            onChange={(e) => handleChange('jaulas_intervenidas', e.target.value)}
            placeholder="Ejemplo: Jaulas 1, 2, 3, 5-8, 10..."
            className="min-h-[80px]"
            disabled={readOnly}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Resumen de la Jornada</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700 font-medium">Horas inmersión:</span>
              <div className="text-lg font-bold text-blue-900">{totalesData.horas_inmersion}h</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Horas trabajo:</span>
              <div className="text-lg font-bold text-blue-900">{totalesData.horas_trabajo}h</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Total:</span>
              <div className="text-lg font-bold text-blue-900">{totalesData.total_horas}h</div>
            </div>
            <div>
              <span className="text-blue-700 font-medium">Buzos activos:</span>
              <div className="text-lg font-bold text-blue-900">{formData.fichas_buzos?.length || 0}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
