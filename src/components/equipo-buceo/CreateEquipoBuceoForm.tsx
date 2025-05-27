
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Users, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CreateEquipoBuceoFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateEquipoBuceoForm = ({ onSubmit, onCancel }: CreateEquipoBuceoFormProps) => {
  const { profile } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    empresa_id: profile?.salmonera_id || profile?.servicio_id || '',
    tipo_empresa: profile?.role === 'admin_salmonera' ? 'salmonera' : 'servicio'
  });

  const tipoEmpresaOptions = [
    { value: 'salmonera', label: 'Salmonera' },
    { value: 'servicio', label: 'Servicio de Buceo' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle>Nuevo Equipo de Buceo</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Equipo *</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Equipo Alpha"
                required
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Descripción del equipo..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tipo_empresa">Tipo de Empresa</Label>
              <EnhancedSelect
                options={tipoEmpresaOptions}
                value={formData.tipo_empresa}
                onValueChange={(value) => handleInputChange('tipo_empresa', value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Crear Equipo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
