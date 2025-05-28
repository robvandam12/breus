
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Building, MapPin, FileText, User } from "lucide-react";
import { HPTFormData } from "@/hooks/useHPTFormData";

interface HPTFormStep1Props {
  formData: HPTFormData;
  onUpdate: (updates: Partial<HPTFormData>) => void;
}

export const HPTFormStep1: React.FC<HPTFormStep1Props> = ({ formData, onUpdate }) => {
  const handleInputChange = (field: keyof HPTFormData, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Información General de la Tarea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="folio">Folio *</Label>
              <Input
                id="folio"
                value={formData.folio}
                onChange={(e) => handleInputChange('folio', e.target.value)}
                placeholder="Número de folio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora_termino">Hora de Término</Label>
              <Input
                id="hora_termino"
                type="time"
                value={formData.hora_termino}
                onChange={(e) => handleInputChange('hora_termino', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Información de la Empresa y Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa_servicio_nombre">Empresa de Servicio</Label>
              <Input
                id="empresa_servicio_nombre"
                value={formData.empresa_servicio_nombre}
                onChange={(e) => handleInputChange('empresa_servicio_nombre', e.target.value)}
                placeholder="Nombre de la empresa de servicio"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor_nombre">Supervisor</Label>
              <Input
                id="supervisor_nombre"
                value={formData.supervisor_nombre}
                onChange={(e) => handleInputChange('supervisor_nombre', e.target.value)}
                placeholder="Nombre del supervisor"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="centro_trabajo_nombre">Centro de Trabajo</Label>
              <Input
                id="centro_trabajo_nombre"
                value={formData.centro_trabajo_nombre}
                onChange={(e) => handleInputChange('centro_trabajo_nombre', e.target.value)}
                placeholder="Nombre del centro de trabajo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jefe_mandante_nombre">Jefe Mandante</Label>
              <Input
                id="jefe_mandante_nombre"
                value={formData.jefe_mandante_nombre}
                onChange={(e) => handleInputChange('jefe_mandante_nombre', e.target.value)}
                placeholder="Nombre del jefe mandante"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Ubicación y Descripción del Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion_tarea">Descripción de la Tarea *</Label>
            <Textarea
              id="descripcion_tarea"
              value={formData.descripcion_tarea}
              onChange={(e) => handleInputChange('descripcion_tarea', e.target.value)}
              placeholder="Describa detalladamente la tarea a realizar"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lugar_especifico">Lugar Específico</Label>
              <Input
                id="lugar_especifico"
                value={formData.lugar_especifico}
                onChange={(e) => handleInputChange('lugar_especifico', e.target.value)}
                placeholder="Ubicación específica del trabajo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.estado_puerto}
                onChange={(e) => handleInputChange('estado_puerto', e.target.value)}
              >
                <option value="abierto">Abierto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="es_rutinaria"
              checked={formData.es_rutinaria}
              onCheckedChange={(checked) => handleInputChange('es_rutinaria', checked)}
            />
            <Label htmlFor="es_rutinaria">¿Es una tarea rutinaria?</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
