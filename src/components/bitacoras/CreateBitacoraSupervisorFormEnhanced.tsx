
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Calendar, User, FileText, X } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useInmersiones } from "@/hooks/useInmersiones";

interface CreateBitacoraSupervisorFormEnhancedProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultInmersionId?: string;
}

export const CreateBitacoraSupervisorFormEnhanced = ({ 
  onSubmit, 
  onCancel, 
  defaultInmersionId 
}: CreateBitacoraSupervisorFormEnhancedProps) => {
  const { operaciones } = useOperaciones();
  const { inmersiones } = useInmersiones();
  
  const [formData, setFormData] = useState({
    inmersion_id: defaultInmersionId || '',
    fecha: new Date().toISOString().split('T')[0],
    supervisor: '',
    desarrollo_inmersion: '',
    evaluacion_general: '',
    incidentes: ''
  });

  const operacionOptions = operaciones.map(op => ({
    value: op.id,
    label: `${op.codigo} - ${op.nombre}`
  }));

  const inmersionOptions = inmersiones.map(inm => ({
    value: inm.id,
    label: `${inm.codigo} - ${inm.objetivo}`
  }));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const codigo = `BS-${Date.now().toString().slice(-6)}`;
    
    await onSubmit({
      ...formData,
      codigo,
      estado_aprobacion: 'pendiente',
      firmado: false
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Nueva Bitácora de Supervisor</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Registre el desarrollo y evaluación de la inmersión
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inmersion_id">Inmersión *</Label>
                <EnhancedSelect
                  options={inmersionOptions}
                  value={formData.inmersion_id}
                  onValueChange={(value) => handleInputChange('inmersion_id', value)}
                  placeholder="Seleccione una inmersión"
                />
              </div>
              
              <div>
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                value={formData.supervisor}
                onChange={(e) => handleInputChange('supervisor', e.target.value)}
                placeholder="Nombre del supervisor"
                required
              />
            </div>

            <div>
              <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión *</Label>
              <Textarea
                value={formData.desarrollo_inmersion}
                onChange={(e) => handleInputChange('desarrollo_inmersion', e.target.value)}
                placeholder="Describa el desarrollo de la inmersión..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="evaluacion_general">Evaluación General *</Label>
              <Textarea
                value={formData.evaluacion_general}
                onChange={(e) => handleInputChange('evaluacion_general', e.target.value)}
                placeholder="Evaluación general de la inmersión..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="incidentes">Incidentes</Label>
              <Textarea
                value={formData.incidentes}
                onChange={(e) => handleInputChange('incidentes', e.target.value)}
                placeholder="Registre cualquier incidente ocurrido..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Crear Bitácora
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
