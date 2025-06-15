
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export const StepPersonal = ({ formData, handleInputChange, isFieldDisabled }) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          Personal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="supervisor">Supervisor *</Label>
          <Input id="supervisor" value={formData.supervisor} onChange={(e) => handleInputChange('supervisor', e.target.value)} placeholder="Nombre del supervisor" disabled={isFieldDisabled('supervisor')} />
        </div>
        <div>
          <Label htmlFor="buzo_principal">Buzo Principal *</Label>
          <Input id="buzo_principal" value={formData.buzo_principal} onChange={(e) => handleInputChange('buzo_principal', e.target.value)} placeholder="Nombre del buzo principal" disabled={isFieldDisabled('buzo_principal')} />
        </div>
        <div>
          <Label htmlFor="buzo_asistente">Buzo Asistente (Opcional)</Label>
          <Input id="buzo_asistente" value={formData.buzo_asistente} onChange={(e) => handleInputChange('buzo_asistente', e.target.value)} placeholder="Nombre del buzo asistente" disabled={isFieldDisabled('buzo_asistente')} />
        </div>
      </CardContent>
    </Card>
  );
};
