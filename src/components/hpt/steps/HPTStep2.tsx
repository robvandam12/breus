
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HPTWizardData } from "@/hooks/useHPTWizard";
import { Shield, Plus, X } from "lucide-react";

interface HPTStep2Props {
  data: HPTWizardData;
  onUpdate: (updates: Partial<HPTWizardData>) => void;
  operacionId: string;
}

export const HPTStep2: React.FC<HPTStep2Props> = ({ data, onUpdate, operacionId }) => {
  const [newAsistente, setNewAsistente] = useState('');

  const handleEPPChange = (field: keyof typeof data.hpt_epp, checked: boolean) => {
    onUpdate({
      hpt_epp: {
        ...data.hpt_epp,
        [field]: checked
      }
    });
  };

  const handleOtrosChange = (value: string) => {
    onUpdate({
      hpt_epp: {
        ...data.hpt_epp,
        otros: value
      }
    });
  };

  const addAsistente = () => {
    if (newAsistente.trim()) {
      const currentAsistentes = data.hpt_conocimiento_asistentes || [];
      onUpdate({
        hpt_conocimiento_asistentes: [
          ...currentAsistentes,
          {
            nombre: newAsistente.trim(),
            rut: '',
            empresa: data.empresa_servicio_nombre || '',
            firma_url: ''
          }
        ]
      });
      setNewAsistente('');
    }
  };

  const removeAsistente = (index: number) => {
    const currentAsistentes = data.hpt_conocimiento_asistentes || [];
    const updatedAsistentes = currentAsistentes.filter((_, i) => i !== index);
    onUpdate({
      hpt_conocimiento_asistentes: updatedAsistentes
    });
  };

  const eppItems = [
    { key: 'casco', label: 'Casco de Seguridad' },
    { key: 'lentes', label: 'Lentes de Seguridad' },
    { key: 'guantes', label: 'Guantes de Trabajo' },
    { key: 'botas', label: 'Botas de Seguridad' },
    { key: 'chaleco', label: 'Chaleco Salvavidas' },
    { key: 'respirador', label: 'Respirador/Máscaras' },
    { key: 'arnes', label: 'Arnés de Seguridad' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Equipo de Protección Personal (EPP)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eppItems.map((item) => (
              <div key={item.key} className="flex items-center space-x-2">
                <Checkbox
                  id={item.key}
                  checked={Boolean(data.hpt_epp[item.key as keyof typeof data.hpt_epp])}
                  onCheckedChange={(checked) => handleEPPChange(item.key as keyof typeof data.hpt_epp, Boolean(checked))}
                />
                <Label htmlFor={item.key} className="text-sm font-medium">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="otros_epp">Otros EPP</Label>
            <Input
              id="otros_epp"
              value={data.hpt_epp.otros || ''}
              onChange={(e) => handleOtrosChange(e.target.value)}
              placeholder="Especifique otros equipos de protección personal"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Asistentes del Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newAsistente}
              onChange={(e) => setNewAsistente(e.target.value)}
              placeholder="Nombre del asistente"
              onKeyPress={(e) => e.key === 'Enter' && addAsistente()}
            />
            <Button onClick={addAsistente} disabled={!newAsistente.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {(data.hpt_conocimiento_asistentes || []).map((asistente, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{asistente.nombre}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAsistente(index)}
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          {(data.hpt_conocimiento_asistentes || []).length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No hay asistentes agregados
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
