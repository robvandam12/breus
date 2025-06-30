
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { Inmersion } from '@/hooks/useInmersiones';

interface BuzoSupervisorInmersionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: Inmersion;
}

export const BuzoSupervisorInmersionForm = ({ onSubmit, onCancel, initialData }: BuzoSupervisorInmersionFormProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    objetivo: initialData?.objetivo || '',
    observaciones: initialData?.observaciones || '',
    profundidad_max: initialData?.profundidad_max?.toString() || '',
    fecha_inmersion: initialData?.fecha_inmersion || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.objetivo.trim()) {
      toast({
        title: "Error",
        description: "El objetivo es requerido",
        variant: "destructive",
      });
      return;
    }

    if (!formData.profundidad_max || parseFloat(formData.profundidad_max) <= 0) {
      toast({
        title: "Error",
        description: "La profundidad máxima debe ser mayor a 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const inmersionData = {
        ...formData,
        profundidad_max: parseFloat(formData.profundidad_max),
        is_independent: true,
        estado: initialData?.estado || 'planificada',
        company_id: profile?.servicio_id || profile?.salmonera_id,
        empresa_creadora_id: profile?.servicio_id || profile?.salmonera_id,
        empresa_creadora_tipo: profile?.servicio_id ? 'contratista' : 'salmonera',
        contexto_operativo: 'independiente',
        requiere_validacion_previa: false,
        anexo_bravo_validado: true,
        hpt_validado: true,
        metadata: {
          created_by_role: profile?.role,
          enterprise_context: {
            user_role: profile?.role,
            company_id: profile?.servicio_id || profile?.salmonera_id,
            company_type: profile?.servicio_id ? 'contratista' : 'salmonera'
          }
        }
      };

      await onSubmit(inmersionData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: `No se pudo ${initialData ? 'actualizar' : 'crear'} la inmersión`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const userTypeLabel = profile?.role === 'buzo' ? 'Buzo' : 'Supervisor';
  const canOnlyView = profile?.role === 'buzo' && initialData?.estado !== 'planificada';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <User className="w-4 h-4 text-orange-600" />
        <span>Modo {userTypeLabel}</span>
        <Badge variant="outline" className="ml-auto text-orange-600 border-orange-200">
          Acceso Limitado
        </Badge>
      </div>

      {canOnlyView && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">
              Como buzo, solo puedes editar inmersiones en estado planificada. Esta inmersión ya no puede ser modificada.
            </p>
          </div>
        </div>
      )}

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? 'Ver/Editar Inmersión' : 'Nueva Inmersión Simple'}</span>
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              {userTypeLabel}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
              <Input
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                placeholder="Descripción del objetivo"
                required
                disabled={canOnlyView}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profundidad">Profundidad Máxima (m) *</Label>
                <Input
                  id="profundidad"
                  type="number"
                  step="0.1"
                  value={formData.profundidad_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, profundidad_max: e.target.value }))}
                  placeholder="Ej: 15.5"
                  required
                  disabled={canOnlyView}
                />
              </div>

              <div>
                <Label htmlFor="fecha">Fecha de Inmersión</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha_inmersion}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_inmersion: e.target.value }))}
                  disabled={canOnlyView}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Observaciones adicionales..."
                rows={3}
                disabled={canOnlyView}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Información Importante</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Esta inmersión se creará como independiente</li>
                <li>• No requiere documentación previa (HPT/Anexo Bravo)</li>
                <li>• Debes completar las bitácoras después de la inmersión</li>
              </ul>
            </div>

            {!canOnlyView && (
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (initialData ? 'Actualizando...' : 'Creando...') : (initialData ? 'Actualizar Inmersión' : 'Crear Inmersión')}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </div>
            )}

            {canOnlyView && (
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Volver
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
