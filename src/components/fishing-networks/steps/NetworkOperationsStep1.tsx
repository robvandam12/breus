
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, MapPin, Thermometer, Ship } from "lucide-react";
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
    'Excelente',
    'Bueno',
    'Regular',
    'Malo',
    'Cerrado'
  ];

  return (
    <div className="space-y-6">
      {/* Información Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4" />
            Información Principal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lugar_trabajo">Lugar de trabajo (centro u otro)</Label>
              <Input
                id="lugar_trabajo"
                value={formData.datos_generales.lugar_trabajo}
                onChange={(e) => handleInputChange('lugar_trabajo', e.target.value)}
                placeholder="Ej: Centro Acuícola Norte"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                value={formData.datos_generales.supervisor}
                onChange={(e) => handleInputChange('supervisor', e.target.value)}
                placeholder="Nombre del supervisor"
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fecha y Horarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="w-4 h-4" />
            Fecha y Horarios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.datos_generales.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora_inicio_faena">Hora inicio faena</Label>
              <Input
                id="hora_inicio_faena"
                type="time"
                value={formData.datos_generales.hora_inicio_faena}
                onChange={(e) => handleInputChange('hora_inicio_faena', e.target.value)}
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
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
        </CardContent>
      </Card>

      {/* Condiciones Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Thermometer className="w-4 h-4" />
            Condiciones Técnicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profundidad_maxima">Profundidad máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                value={formData.datos_generales.profundidad_maxima}
                onChange={(e) => handleInputChange('profundidad_maxima', Number(e.target.value))}
                min="0"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team_s">Team - S</Label>
              <Input
                id="team_s"
                type="number"
                value={formData.datos_generales.team_s}
                onChange={(e) => handleInputChange('team_s', Number(e.target.value))}
                min="0"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team_e">Team - E</Label>
              <Input
                id="team_e"
                type="number"
                value={formData.datos_generales.team_e}
                onChange={(e) => handleInputChange('team_e', Number(e.target.value))}
                min="0"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team_b">Team - B</Label>
              <Input
                id="team_b"
                type="number"
                value={formData.datos_generales.team_b}
                onChange={(e) => handleInputChange('team_b', Number(e.target.value))}
                min="0"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                value={formData.datos_generales.temperatura}
                onChange={(e) => handleInputChange('temperatura', Number(e.target.value))}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Nave */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Ship className="w-4 h-4" />
            Información de Nave
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nave_maniobras">Nave maniobras</Label>
              <Input
                id="nave_maniobras"
                value={formData.datos_generales.nave_maniobras}
                onChange={(e) => handleInputChange('nave_maniobras', e.target.value)}
                placeholder="Nombre de la nave"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula_nave">Matrícula nave</Label>
              <Input
                id="matricula_nave"
                value={formData.datos_generales.matricula_nave}
                onChange={(e) => handleInputChange('matricula_nave', e.target.value)}
                placeholder="Matrícula"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado_puerto">Estado de puerto</Label>
              <Select
                value={formData.datos_generales.estado_puerto}
                onValueChange={(value) => handleInputChange('estado_puerto', value)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
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
        </CardContent>
      </Card>
    </div>
  );
};

