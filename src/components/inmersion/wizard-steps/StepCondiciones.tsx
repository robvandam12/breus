
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

export const StepCondiciones = ({ formData, handleInputChange }) => {
  return (
    <div className="w-full animate-fade-in space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-purple-600" />Detalles Técnicos</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profundidad_max">Profundidad Máx. (m)</Label>
              <Input id="profundidad_max" type="number" value={formData.profundidad_max} onChange={(e) => handleInputChange('profundidad_max', Number(e.target.value))} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="temperatura_agua">Temp. Agua (°C)</Label>
              <Input id="temperatura_agua" type="number" value={formData.temperatura_agua} onChange={(e) => handleInputChange('temperatura_agua', Number(e.target.value))} placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visibilidad">Visibilidad (m)</Label>
              <Input id="visibilidad" type="number" value={formData.visibilidad} onChange={(e) => handleInputChange('visibilidad', Number(e.target.value))} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="corriente">Corriente</Label>
              <Select value={formData.corriente} onValueChange={(value) => handleInputChange('corriente', value)}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sin_corriente">Sin corriente</SelectItem>
                  <SelectItem value="ligera">Ligera</SelectItem>
                  <SelectItem value="moderada">Moderada</SelectItem>
                  <SelectItem value="fuerte">Fuerte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-600" />Observaciones</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hora_fin">Hora Fin (Opcional)</Label>
            <Input id="hora_fin" type="time" value={formData.hora_fin} onChange={(e) => handleInputChange('hora_fin', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="observaciones">Observaciones Adicionales</Label>
            <Textarea id="observaciones" value={formData.observaciones} onChange={(e) => handleInputChange('observaciones', e.target.value)} placeholder="Observaciones adicionales..." rows={3} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
