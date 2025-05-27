
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

interface HPTStep1Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep1 = ({ data, onUpdate }: HPTStep1Props) => {
  const { operaciones } = useOperaciones();

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Datos Generales de la Tarea</h2>
        <p className="mt-2 text-gray-600">
          Información básica sobre la planificación de la tarea de buceo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Folio */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Folio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.folio || ''}
              onChange={(e) => handleInputChange('folio', e.target.value)}
              placeholder="Ej: HPT-2024-001"
            />
          </CardContent>
        </Card>

        {/* Operación */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Operación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={data.operacion_id || ''} 
              onValueChange={(value) => handleInputChange('operacion_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar operación..." />
              </SelectTrigger>
              <SelectContent>
                {operaciones.map((operacion) => (
                  <SelectItem key={operacion.id} value={operacion.id}>
                    {operacion.codigo} - {operacion.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Fecha */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={data.fecha || ''}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Hora Inicio */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hora Inicio Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="time"
              value={data.hora_inicio || ''}
              onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Hora Término */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hora Término Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="time"
              value={data.hora_termino || ''}
              onChange={(e) => handleInputChange('hora_termino', e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Empresa Servicio */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Empresa Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.empresa_servicio_nombre || ''}
              onChange={(e) => handleInputChange('empresa_servicio_nombre', e.target.value)}
              placeholder="Nombre de la empresa de servicios"
            />
          </CardContent>
        </Card>

        {/* Supervisor */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Supervisor</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.supervisor_nombre || ''}
              onChange={(e) => handleInputChange('supervisor_nombre', e.target.value)}
              placeholder="Nombre del supervisor"
            />
          </CardContent>
        </Card>

        {/* Centro de Trabajo */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Centro de Trabajo</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.centro_trabajo_nombre || ''}
              onChange={(e) => handleInputChange('centro_trabajo_nombre', e.target.value)}
              placeholder="Nombre del centro de trabajo"
            />
          </CardContent>
        </Card>

        {/* Jefe Mandante */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Jefe Mandante</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.jefe_mandante_nombre || ''}
              onChange={(e) => handleInputChange('jefe_mandante_nombre', e.target.value)}
              placeholder="Nombre del jefe mandante"
            />
          </CardContent>
        </Card>

        {/* Lugar Específico */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lugar Específico</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.lugar_especifico || ''}
              onChange={(e) => handleInputChange('lugar_especifico', e.target.value)}
              placeholder="Ubicación específica del trabajo"
            />
          </CardContent>
        </Card>

        {/* Estado del Puerto */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Estado del Puerto</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={data.estado_puerto || ''} 
              onValueChange={(value) => handleInputChange('estado_puerto', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abierto">Abierto</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Tarea Rutinaria */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">¿Tarea Rutinaria?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="es_rutinaria"
                checked={data.es_rutinaria || false}
                onCheckedChange={(checked) => handleInputChange('es_rutinaria', checked)}
              />
              <Label htmlFor="es_rutinaria">Sí, es una tarea rutinaria</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descripción de la Tarea */}
      <Card>
        <CardHeader>
          <CardTitle>Identificación/Descripción del Trabajo</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.descripcion_tarea || ''}
            onChange={(e) => handleInputChange('descripcion_tarea', e.target.value)}
            placeholder="Describa detalladamente el trabajo a realizar..."
            rows={4}
            maxLength={300}
          />
          <div className="text-sm text-gray-500 mt-1">
            {(data.descripcion_tarea || '').length}/300 caracteres
          </div>
        </CardContent>
      </Card>

      {/* Plan de Trabajo */}
      <Card>
        <CardHeader>
          <CardTitle>Plan de Trabajo</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.plan_trabajo || ''}
            onChange={(e) => handleInputChange('plan_trabajo', e.target.value)}
            placeholder="Detalle el plan de trabajo completo..."
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );
};
