
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, X } from 'lucide-react';
import { BitacoraSupervisorFormData } from '@/hooks/useBitacorasSupervisor';
import { useAuth } from '@/hooks/useAuth';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useInmersiones } from '@/hooks/useInmersiones';
import type { Inmersion } from '@/types/inmersion';

interface CreateBitacoraSupervisorFormCompleteProps {
  onSubmit: (data: Partial<BitacoraSupervisorFormData>) => void;
  onCancel: () => void;
  inmersion?: Inmersion;
}

export const CreateBitacoraSupervisorFormComplete: React.FC<CreateBitacoraSupervisorFormCompleteProps> = ({
  onSubmit,
  onCancel,
  inmersion
}) => {
  const { profile } = useAuth();
  const { operaciones } = useOperaciones();
  
  const [formData, setFormData] = useState({
    desarrollo_inmersion: '',
    incidentes: '',
    evaluacion_general: ''
  });

  const operacionData = inmersion?.operacion_id 
    ? operaciones.find(op => op.id === inmersion.operacion_id)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inmersion || !formData.desarrollo_inmersion || !formData.evaluacion_general) {
      return;
    }

    const submitData: Partial<BitacoraSupervisorFormData> = {
      codigo: `BIT-SUP-${Date.now()}`,
      inmersion_id: inmersion.inmersion_id,
      supervisor: (profile?.nombre || '') + ' ' + (profile?.apellido || ''),
      desarrollo_inmersion: formData.desarrollo_inmersion,
      incidentes: formData.incidentes || '',
      evaluacion_general: formData.evaluacion_general,
      fecha: inmersion.fecha_inmersion,
      firmado: false,
      estado_aprobacion: 'pendiente',
      lugar_trabajo: operacionData?.sitio?.nombre || 'N/A',
    };

    onSubmit(submitData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Bitácora de Supervisor - {inmersion?.codigo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {inmersion && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="font-medium">Inmersión:</Label>
                  <Badge variant="outline">{inmersion.codigo}</Badge>
                </div>
                <div>
                  <Label className="font-medium">Fecha:</Label>
                  <span className="text-sm">{new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                </div>
                <div>
                  <Label className="font-medium">Objetivo:</Label>
                  <p className="text-sm text-gray-600">{inmersion.objetivo}</p>
                </div>
                <div>
                  <Label className="font-medium">Buzo Principal:</Label>
                  <span className="text-sm">{inmersion.buzo_principal}</span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión *</Label>
              <Textarea
                id="desarrollo_inmersion"
                value={formData.desarrollo_inmersion}
                onChange={(e) => setFormData({...formData, desarrollo_inmersion: e.target.value})}
                placeholder="Describa cómo se desarrolló la inmersión..."
                className="min-h-[120px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="incidentes">Incidentes (Opcional)</Label>
              <Textarea
                id="incidentes"
                value={formData.incidentes}
                onChange={(e) => setFormData({...formData, incidentes: e.target.value})}
                placeholder="Describa cualquier incidente ocurrido..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="evaluacion_general">Evaluación General *</Label>
              <Textarea
                id="evaluacion_general"
                value={formData.evaluacion_general}
                onChange={(e) => setFormData({...formData, evaluacion_general: e.target.value})}
                placeholder="Evaluación general de la inmersión..."
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button 
                type="submit" 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={!formData.desarrollo_inmersion || !formData.evaluacion_general}
              >
                <Save className="w-4 h-4 mr-2" />
                Crear Bitácora
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
