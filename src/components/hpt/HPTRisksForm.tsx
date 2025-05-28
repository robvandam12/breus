
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HPTRisksFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const HPTRisksForm: React.FC<HPTRisksFormProps> = ({ data, onChange }) => {
  const handleRiskChange = (riskId: string, checked: boolean) => {
    const riesgos = { ...(data.riesgos_identificados || {}) };
    riesgos[riskId] = checked;
    onChange({ riesgos_identificados: riesgos });
  };

  const handleMedidaChange = (medidaId: string, checked: boolean) => {
    const medidas = { ...(data.medidas_control || {}) };
    medidas[medidaId] = checked;
    onChange({ medidas_control: medidas });
  };

  const riesgos = [
    { id: 'enredos', label: 'Enredos de líneas' },
    { id: 'corrientes', label: 'Corrientes marinas' },
    { id: 'visibilidad', label: 'Baja visibilidad' },
    { id: 'fauna_marina', label: 'Fauna marina' },
    { id: 'hipotermia', label: 'Hipotermia' },
    { id: 'narcosis', label: 'Narcosis por nitrógeno' }
  ];

  const medidas = [
    { id: 'comunicacion', label: 'Sistema de comunicación' },
    { id: 'emergencia', label: 'Plan de emergencia activado' },
    { id: 'supervision', label: 'Supervisión constante' },
    { id: 'equipos_respaldo', label: 'Equipos de respaldo' },
    { id: 'camara_hiperbarica', label: 'Cámara hiperbárica disponible' }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Riesgos Identificados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {riesgos.map((riesgo) => (
            <div key={riesgo.id} className="flex items-center space-x-2">
              <Checkbox
                id={riesgo.id}
                checked={data.riesgos_identificados?.[riesgo.id] || false}
                onCheckedChange={(checked) => handleRiskChange(riesgo.id, checked as boolean)}
              />
              <Label htmlFor={riesgo.id}>{riesgo.label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Medidas de Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medidas.map((medida) => (
            <div key={medida.id} className="flex items-center space-x-2">
              <Checkbox
                id={medida.id}
                checked={data.medidas_control?.[medida.id] || false}
                onCheckedChange={(checked) => handleMedidaChange(medida.id, checked as boolean)}
              />
              <Label htmlFor={medida.id}>{medida.label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Observaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.observaciones || ''}
            onChange={(e) => onChange({ observaciones: e.target.value })}
            placeholder="Observaciones adicionales sobre riesgos y medidas de control"
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
};
