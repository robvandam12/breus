
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-right">{value || 'No especificado'}</span>
  </div>
);

export const StepResumen = ({ formData, selectedOperation }) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Resumen de la Inmersión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <DetailItem label="Operación" value={selectedOperation ? `${selectedOperation.codigo} - ${selectedOperation.nombre}` : 'N/A'} />
        <DetailItem label="Código Inmersión" value={formData.codigo} />
        <DetailItem label="Fecha" value={new Date(formData.fecha_inmersion + 'T00:00:00').toLocaleDateString()} />
        <DetailItem label="Hora Inicio" value={formData.hora_inicio} />
        <DetailItem label="Objetivo" value={formData.objetivo} />
        <DetailItem label="Supervisor" value={formData.supervisor} />
        <DetailItem label="Buzo Principal" value={formData.buzo_principal} />
        <DetailItem label="Buzo Asistente" value={formData.buzo_asistente} />
        <DetailItem label="Profundidad Máxima" value={`${formData.profundidad_max}m`} />
        <DetailItem label="Temperatura Agua" value={`${formData.temperatura_agua}°C`} />
        <DetailItem label="Visibilidad" value={`${formData.visibilidad}m`} />
        <DetailItem label="Corriente" value={formData.corriente} />
        <DetailItem label="Hora Fin" value={formData.hora_fin} />
        <DetailItem label="Observaciones" value={formData.observaciones} />
      </CardContent>
    </Card>
  );
};
