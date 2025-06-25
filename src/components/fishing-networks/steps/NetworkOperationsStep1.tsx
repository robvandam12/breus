
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import type { NetworkOperationsData } from '@/types/fishing-networks';

interface NetworkOperationsStep1Props {
  formData: NetworkOperationsData;
  updateFormData: (updates: Partial<NetworkOperationsData>) => void;
  readOnly?: boolean;
}

export const NetworkOperationsStep1 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkOperationsStep1Props) => {
  const handleInputChange = (field: keyof typeof formData.datos_generales, value: string | number) => {
    updateFormData({
      datos_generales: {
        ...formData.datos_generales,
        [field]: value
      }
    });
  };

  const estadosPuerto = [
    'Bueno',
    'Regular',
    'Malo',
    'Cerrado por condiciones climáticas',
    'Operativo con restricciones'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Datos Generales de la Faena
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="lugar_trabajo">Lugar de trabajo (centro u otro)</Label>
              <Input
                id="lugar_trabajo"
                value={formData.datos_generales.lugar_trabajo}
                onChange={(e) => handleInputChange('lugar_trabajo', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                value={formData.datos_generales.supervisor}
                onChange={(e) => handleInputChange('supervisor', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hora_inicio_faena">Hora inicio faena</Label>
                <Input
                  id="hora_inicio_faena"
                  type="time"
                  value={formData.datos_generales.hora_inicio_faena}
                  onChange={(e) => handleInputChange('hora_inicio_faena', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="hora_termino_faena">Hora término faena</Label>
                <Input
                  id="hora_termino_faena"
                  type="time"
                  value={formData.datos_generales.hora_termino_faena}
                  onChange={(e) => handleInputChange('hora_termino_faena', e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="profundidad_maxima">Profundidad máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                min="0"
                step="0.1"
                value={formData.datos_generales.profundidad_maxima}
                onChange={(e) => handleInputChange('profundidad_maxima', parseFloat(e.target.value) || 0)}
                disabled={readOnly}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="team_s">Team - S</Label>
                <Input
                  id="team_s"
                  type="number"
                  min="0"
                  value={formData.datos_generales.team_s}
                  onChange={(e) => handleInputChange('team_s', parseInt(e.target.value) || 0)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="team_e">Team - E</Label>
                <Input
                  id="team_e"
                  type="number"
                  min="0"
                  value={formData.datos_generales.team_e}
                  onChange={(e) => handleInputChange('team_e', parseInt(e.target.value) || 0)}
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="team_b">Team - B</Label>
                <Input
                  id="team_b"
                  type="number"
                  min="0"
                  value={formData.datos_generales.team_b}
                  onChange={(e) => handleInputChange('team_b', parseInt(e.target.value) || 0)}
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.datos_generales.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                value={formData.datos_generales.temperatura}
                onChange={(e) => handleInputChange('temperatura', parseFloat(e.target.value) || 0)}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="nave_maniobras">Nave maniobras</Label>
              <Input
                id="nave_maniobras"
                value={formData.datos_generales.nave_maniobras}
                onChange={(e) => handleInputChange('nave_maniobras', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="matricula_nave">Matrícula nave</Label>
              <Input
                id="matricula_nave"
                value={formData.datos_generales.matricula_nave}
                onChange={(e) => handleInputChange('matricula_nave', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="estado_puerto">Estado de puerto</Label>
              <Select
                value={formData.datos_generales.estado_puerto}
                onValueChange={(value) => handleInputChange('estado_puerto', value)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado del puerto" />
                </SelectTrigger>
                <SelectContent>
                  {estadosPuerto.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
