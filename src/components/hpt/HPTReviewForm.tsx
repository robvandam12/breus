
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface HPTReviewFormProps {
  data: any;
  operacionData?: any;
  onChange: (data: any) => void;
}

export const HPTReviewForm: React.FC<HPTReviewFormProps> = ({ data, operacionData, onChange }) => {
  const isFieldComplete = (field: any): boolean => {
    if (typeof field === 'string') return field.trim() !== '';
    if (typeof field === 'object' && field !== null) {
      return Object.keys(field).length > 0;
    }
    if (Array.isArray(field)) return field.length > 0;
    return field !== undefined && field !== null;
  };

  const sections = [
    {
      title: 'Información Básica',
      fields: [
        { label: 'Código HPT', value: data.codigo, required: true },
        { label: 'Fecha', value: data.fecha, required: true },
        { label: 'Supervisor', value: data.supervisor_nombre, required: true },
        { label: 'Centro de Trabajo', value: data.centro_trabajo_nombre, required: false },
        { label: 'Descripción de Tarea', value: data.descripcion_tarea, required: true }
      ]
    },
    {
      title: 'Detalles de Tarea',
      fields: [
        { label: 'Hora de Inicio', value: data.hora_inicio, required: false },
        { label: 'Hora de Término', value: data.hora_termino, required: false },
        { label: 'Plan de Emergencia', value: data.plan_emergencia, required: false }
      ]
    },
    {
      title: 'Equipo y Riesgos',
      fields: [
        { label: 'Riesgos Identificados', value: data.riesgos_identificados, required: false },
        { label: 'Medidas de Control', value: data.medidas_control, required: false },
        { label: 'Equipo de Buceo', value: data.equipo_buceo, required: false }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Revisión de HPT</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Revise toda la información antes de finalizar la HPT. Los campos marcados como requeridos deben estar completos.
          </p>

          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
              <div className="space-y-3">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">{field.label}</span>
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {isFieldComplete(field.value) ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            Completo
                          </Badge>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            {field.required ? 'Requerido' : 'Opcional'}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {operacionData && (
            <Card className="border border-blue-100 bg-blue-50/50 mt-6">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Operación Asociada</h4>
                <div className="text-sm text-blue-700">
                  <p><strong>Código:</strong> {operacionData.codigo}</p>
                  <p><strong>Nombre:</strong> {operacionData.nombre}</p>
                  <p><strong>Salmonera:</strong> {operacionData.salmonera}</p>
                  <p><strong>Sitio:</strong> {operacionData.sitio}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
