
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Building, MapPin } from 'lucide-react';
import { HPTWizardData } from '@/hooks/useHPTWizard';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useSitios } from '@/hooks/useSitios';

interface HPTStep1Props {
  data: HPTWizardData;
  onUpdate: (updates: Partial<HPTWizardData>) => void;
}

export const HPTStep1: React.FC<HPTStep1Props> = ({ data, onUpdate }) => {
  const { operaciones } = useOperaciones();
  const { sitios } = useSitios();
  
  // Si hay operación_id, cargar datos de esa operación
  useEffect(() => {
    if (data.operacion_id && operaciones.length > 0) {
      const operacion = operaciones.find(op => op.id === data.operacion_id);
      if (operacion) {
        // Poblar datos de la operación seleccionada
        if (operacion.contratista) {
          onUpdate({ empresa_servicio_nombre: operacion.contratista.nombre || '' });
        }
        
        if (operacion.supervisor_asignado_nombre) {
          onUpdate({ supervisor_nombre: operacion.supervisor_asignado_nombre });
          onUpdate({ supervisor: operacion.supervisor_asignado_nombre });
        }
        
        if (operacion.sitio) {
          onUpdate({ centro_trabajo_nombre: operacion.sitio.nombre || '' });
          
          // Si el sitio tiene ubicación, usarla como lugar_especifico
          if (operacion.sitio.ubicacion) {
            onUpdate({ lugar_especifico: operacion.sitio.ubicacion });
          }
        }
      }
    }
  }, [data.operacion_id, operaciones, onUpdate]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
        <p className="mt-2 text-gray-600">
          Complete la información básica para la Hoja de Planificación de Tarea
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Datos Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="folio">Folio</Label>
              <Input
                id="folio"
                value={data.folio || ''}
                onChange={(e) => onUpdate({ folio: e.target.value })}
                placeholder="Ingrese el folio"
              />
            </div>
            
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha || ''}
                onChange={(e) => onUpdate({ fecha: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={data.hora_inicio || ''}
                onChange={(e) => onUpdate({ hora_inicio: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="hora_termino">Hora de Término (estimada)</Label>
              <Input
                id="hora_termino"
                type="time"
                value={data.hora_termino || ''}
                onChange={(e) => onUpdate({ hora_termino: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="empresa_servicio_nombre">Empresa de Servicio</Label>
              <Input
                id="empresa_servicio_nombre"
                value={data.empresa_servicio_nombre || ''}
                onChange={(e) => onUpdate({ empresa_servicio_nombre: e.target.value })}
                placeholder="Nombre de la empresa"
              />
            </div>

            <div>
              <Label htmlFor="supervisor_nombre">Supervisor</Label>
              <Input
                id="supervisor_nombre"
                value={data.supervisor_nombre || ''}
                onChange={(e) => onUpdate({ 
                  supervisor_nombre: e.target.value,
                  supervisor: e.target.value 
                })}
                placeholder="Nombre del supervisor"
              />
            </div>

            <div>
              <Label htmlFor="centro_trabajo_nombre">Centro de Trabajo</Label>
              <Input
                id="centro_trabajo_nombre"
                value={data.centro_trabajo_nombre || ''}
                onChange={(e) => onUpdate({ centro_trabajo_nombre: e.target.value })}
                placeholder="Centro de trabajo"
              />
            </div>

            <div>
              <Label htmlFor="jefe_mandante_nombre">Jefe Mandante</Label>
              <Input
                id="jefe_mandante_nombre"
                value={data.jefe_mandante_nombre || ''}
                onChange={(e) => onUpdate({ jefe_mandante_nombre: e.target.value })}
                placeholder="Nombre del jefe mandante"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Detalles de la Tarea
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="descripcion_tarea">Descripción de la Tarea</Label>
              <Input
                id="descripcion_tarea"
                value={data.descripcion_tarea || ''}
                onChange={(e) => onUpdate({ descripcion_tarea: e.target.value })}
                placeholder="Describa la tarea a realizar"
              />
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="es_rutinaria"
                checked={data.es_rutinaria || false}
                onCheckedChange={(checked) => onUpdate({ es_rutinaria: !!checked })}
              />
              <Label htmlFor="es_rutinaria" className="cursor-pointer">
                La tarea es rutinaria
              </Label>
            </div>

            <div>
              <Label htmlFor="lugar_especifico">Lugar Específico</Label>
              <Input
                id="lugar_especifico"
                value={data.lugar_especifico || ''}
                onChange={(e) => onUpdate({ lugar_especifico: e.target.value })}
                placeholder="Ubicación específica donde se realizará la tarea"
              />
            </div>

            <div>
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select
                value={data.estado_puerto || 'abierto'}
                onValueChange={(value) => onUpdate({ estado_puerto: value as 'abierto' | 'cerrado' })}
              >
                <SelectTrigger id="estado_puerto">
                  <SelectValue placeholder="Seleccione estado del puerto" />
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
    </div>
  );
};
