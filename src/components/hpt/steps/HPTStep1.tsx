
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Building, MapPin } from 'lucide-react';
import { HPTWizardData } from '@/hooks/useHPTWizard';

interface HPTStep1Props {
  data: HPTWizardData;
  updateData: (updates: Partial<HPTWizardData>) => void;
  operaciones: any[];
  selectedOperacion: any;
  setSelectedOperacion: (operacion: any) => void;
}

export const HPTStep1: React.FC<HPTStep1Props> = ({ 
  data, 
  updateData, 
  operaciones, 
  selectedOperacion,
  setSelectedOperacion 
}) => {
  
  // Auto-populate fields when operation is selected
  useEffect(() => {
    if (selectedOperacion) {
      // Populate company name from contractor
      if (selectedOperacion.contratistas) {
        updateData({ 
          empresa_servicio_nombre: selectedOperacion.contratistas.nombre || ''
        });
      }
      
      // Populate supervisor - need to get from assigned supervisor or team
      if (selectedOperacion.supervisor_asignado_id) {
        // We'll need to fetch supervisor name from usuario table or equipo_buceo
        updateData({ 
          supervisor_nombre: '' // This should be populated from the team or assigned supervisor
        });
      }
      
      // Populate work center from site
      if (selectedOperacion.sitios) {
        updateData({ 
          centro_trabajo_nombre: selectedOperacion.sitios.nombre || '',
          lugar_especifico: selectedOperacion.sitios.nombre || ''
        });
      }
    }
  }, [selectedOperacion, updateData]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Datos Generales de la Tarea</h2>
        <p className="mt-2 text-gray-600">
          Información básica y detalles de la operación de buceo
        </p>
      </div>

      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operacion_id">Operación *</Label>
              <Select 
                value={data.operacion_id} 
                onValueChange={(value) => {
                  updateData({ operacion_id: value });
                  const operacion = operaciones.find(op => op.id === value);
                  setSelectedOperacion(operacion);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar operación" />
                </SelectTrigger>
                <SelectContent>
                  {operaciones.map((operacion) => (
                    <SelectItem key={operacion.id} value={operacion.id}>
                      {operacion.codigo} - {operacion.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="folio">Folio *</Label>
              <Input
                id="folio"
                value={data.folio}
                onChange={(e) => updateData({ folio: e.target.value })}
                placeholder="Ej: HPT-2024-001"
              />
            </div>

            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha}
                onChange={(e) => updateData({ fecha: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={data.hora_inicio}
                onChange={(e) => updateData({ hora_inicio: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_termino">Hora de Término</Label>
              <Input
                id="hora_termino"
                type="time"
                value={data.hora_termino}
                onChange={(e) => updateData({ hora_termino: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            Personal y Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa_servicio_nombre">Empresa de Servicio</Label>
              <Input
                id="empresa_servicio_nombre"
                value={data.empresa_servicio_nombre}
                onChange={(e) => updateData({ empresa_servicio_nombre: e.target.value })}
                placeholder="Nombre de la empresa de buceo"
              />
            </div>

            <div>
              <Label htmlFor="supervisor_nombre">Supervisor</Label>
              <Input
                id="supervisor_nombre"
                value={data.supervisor_nombre}
                onChange={(e) => updateData({ supervisor_nombre: e.target.value })}
                placeholder="Nombre del supervisor"
              />
            </div>

            <div>
              <Label htmlFor="centro_trabajo_nombre">Centro de Trabajo</Label>
              <Input
                id="centro_trabajo_nombre"
                value={data.centro_trabajo_nombre}
                onChange={(e) => updateData({ centro_trabajo_nombre: e.target.value })}
                placeholder="Nombre del centro"
              />
            </div>

            <div>
              <Label htmlFor="jefe_mandante_nombre">Jefe Mandante</Label>
              <Input
                id="jefe_mandante_nombre"
                value={data.jefe_mandante_nombre}
                onChange={(e) => updateData({ jefe_mandante_nombre: e.target.value })}
                placeholder="Nombre del jefe mandante"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descripción de la Tarea */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Descripción de la Tarea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="descripcion_tarea">Descripción del Trabajo *</Label>
            <Textarea
              id="descripcion_tarea"
              value={data.descripcion_tarea}
              onChange={(e) => updateData({ descripcion_tarea: e.target.value })}
              placeholder="Describa detalladamente el trabajo a realizar..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lugar_especifico">Lugar Específico</Label>
              <Input
                id="lugar_especifico"
                value={data.lugar_especifico}
                onChange={(e) => updateData({ lugar_especifico: e.target.value })}
                placeholder="Ubicación exacta del trabajo"
              />
            </div>

            <div>
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select 
                value={data.estado_puerto} 
                onValueChange={(value) => updateData({ estado_puerto: value as 'abierto' | 'cerrado' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abierto">Abierto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Información:</strong> Los campos marcados con (*) son obligatorios. 
            Complete toda la información antes de continuar al siguiente paso.
          </div>
        </div>
      </div>
    </div>
  );
};
