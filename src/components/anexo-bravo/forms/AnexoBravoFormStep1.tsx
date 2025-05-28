
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Building, MapPin, FileText, User, Anchor } from "lucide-react";
import { AnexoBravoFormData } from "@/hooks/useAnexoBravoFormData";

interface AnexoBravoFormStep1Props {
  formData: AnexoBravoFormData;
  onUpdate: (updates: Partial<AnexoBravoFormData>) => void;
}

export const AnexoBravoFormStep1: React.FC<AnexoBravoFormStep1Props> = ({ formData, onUpdate }) => {
  const handleInputChange = (field: keyof AnexoBravoFormData, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-blue-600" />
            Información General del Anexo Bravo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="Código del anexo bravo"
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
              <Label htmlFor="empresa_nombre">Empresa</Label>
              <Input
                id="empresa_nombre"
                value={formData.empresa_nombre}
                onChange={(e) => handleInputChange('empresa_nombre', e.target.value)}
                placeholder="Nombre de la empresa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lugar_faena">Lugar de Faena</Label>
              <Input
                id="lugar_faena"
                value={formData.lugar_faena}
                onChange={(e) => handleInputChange('lugar_faena', e.target.value)}
                placeholder="Ubicación de la faena"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Responsable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => handleInputChange('supervisor', e.target.value)}
                placeholder="Nombre del supervisor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jefe_centro">Jefe de Centro</Label>
              <Input
                id="jefe_centro"
                value={formData.jefe_centro}
                onChange={(e) => handleInputChange('jefe_centro', e.target.value)}
                placeholder="Nombre del jefe de centro"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buzo_o_empresa_nombre">Buzo Principal</Label>
              <Input
                id="buzo_o_empresa_nombre"
                value={formData.buzo_o_empresa_nombre}
                onChange={(e) => handleInputChange('buzo_o_empresa_nombre', e.target.value)}
                placeholder="Nombre del buzo principal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buzo_matricula">Matrícula Buzo Principal</Label>
              <Input
                id="buzo_matricula"
                value={formData.buzo_matricula}
                onChange={(e) => handleInputChange('buzo_matricula', e.target.value)}
                placeholder="Número de matrícula"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asistente_buzo_nombre">Buzo Asistente</Label>
              <Input
                id="asistente_buzo_nombre"
                value={formData.asistente_buzo_nombre}
                onChange={(e) => handleInputChange('asistente_buzo_nombre', e.target.value)}
                placeholder="Nombre del buzo asistente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asistente_buzo_matricula">Matrícula Buzo Asistente</Label>
              <Input
                id="asistente_buzo_matricula"
                value={formData.asistente_buzo_matricula}
                onChange={(e) => handleInputChange('asistente_buzo_matricula', e.target.value)}
                placeholder="Número de matrícula"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Información de Bitácora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bitacora_fecha">Fecha de Bitácora</Label>
              <Input
                id="bitacora_fecha"
                type="date"
                value={formData.bitacora_fecha}
                onChange={(e) => handleInputChange('bitacora_fecha', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bitacora_hora_inicio">Hora de Inicio</Label>
              <Input
                id="bitacora_hora_inicio"
                type="time"
                value={formData.bitacora_hora_inicio}
                onChange={(e) => handleInputChange('bitacora_hora_inicio', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bitacora_hora_termino">Hora de Término</Label>
              <Input
                id="bitacora_hora_termino"
                type="time"
                value={formData.bitacora_hora_termino}
                onChange={(e) => handleInputChange('bitacora_hora_termino', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bitacora_relator">Relator de Bitácora</Label>
            <Input
              id="bitacora_relator"
              value={formData.bitacora_relator}
              onChange={(e) => handleInputChange('bitacora_relator', e.target.value)}
              placeholder="Nombre del relator"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autorizacion_armada"
              checked={formData.autorizacion_armada}
              onCheckedChange={(checked) => handleInputChange('autorizacion_armada', checked)}
            />
            <Label htmlFor="autorizacion_armada">¿Cuenta con autorización de la Armada?</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
            <Textarea
              id="observaciones_generales"
              value={formData.observaciones_generales}
              onChange={(e) => handleInputChange('observaciones_generales', e.target.value)}
              placeholder="Observaciones generales del trabajo"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
