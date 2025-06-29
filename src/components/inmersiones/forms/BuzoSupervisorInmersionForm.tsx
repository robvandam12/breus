import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { EnhancedCuadrillaSelector } from '@/components/cuadrillas/EnhancedCuadrillaSelector';
import type { Inmersion } from '@/hooks/useInmersiones';

interface BuzoSupervisorInmersionFormProps {
  onSubmit: (data: any) => Promise<void>; // Cambiar a Promise<void>
  onCancel: () => void;
  initialData?: Inmersion;
}

interface Centro {
  id: string;
  nombre: string;
  salmonera_id: string;
}

export const BuzoSupervisorInmersionForm = ({ onSubmit, onCancel, initialData }: BuzoSupervisorInmersionFormProps) => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const getInitialCuadrillaId = () => {
    if (!initialData?.metadata) return null;
    try {
      const metadata = typeof initialData.metadata === 'string' 
        ? JSON.parse(initialData.metadata) 
        : initialData.metadata;
      return metadata?.cuadrilla_id || null;
    } catch {
      return null;
    }
  };
  
  const [selectedCuadrillaId, setSelectedCuadrillaId] = useState<string | null>(getInitialCuadrillaId());
  
  const [formData, setFormData] = useState({
    codigo_operacion_externa: initialData?.external_operation_code || '',
    objetivo: initialData?.objetivo || '',
    fecha_inmersion: initialData?.fecha_inmersion || '',
    profundidad_max: initialData?.profundidad_max?.toString() || '',
    observaciones: initialData?.observaciones || '',
    centro_id: initialData?.centro_id || ''
  });

  const [centros, setCentros] = useState<Centro[]>([]);

  useEffect(() => {
    loadCentros();
  }, []);

  const loadCentros = async () => {
    try {
      const { data } = await supabase
        .from('centros')
        .select('id, nombre, salmonera_id')
        .eq('estado', 'activo')
        .order('nombre');

      setCentros(data || []);
    } catch (error) {
      console.error('Error loading centros:', error);
      setCentros([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo_operacion_externa) {
      toast({
        title: "Error",
        description: "Debe ingresar un código de operación", 
        variant: "destructive",
      });
      return;
    }

    if (!formData.centro_id) {
      toast({
        title: "Error",
        description: "Debe seleccionar un centro para la inmersión",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCuadrillaId) {
      toast({
        title: "Error",
        description: "Debe seleccionar una cuadrilla de buceo",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const currentMetadata = initialData?.metadata ? 
        (typeof initialData.metadata === 'string' ? JSON.parse(initialData.metadata) : initialData.metadata) : 
        {};

      const selectedCentro = centros.find(c => c.id === formData.centro_id);

      const inmersionData = {
        ...formData,
        profundidad_max: parseFloat(formData.profundidad_max),
        is_independent: true,
        operacion_id: null,
        external_operation_code: formData.codigo_operacion_externa,
        estado: initialData?.estado || 'planificada',
        company_id: profile?.servicio_id,
        salmonera_id: selectedCentro?.salmonera_id,
        requiere_validacion_previa: false,
        anexo_bravo_validado: true,
        hpt_validado: true,
        centro_id: formData.centro_id,
        metadata: {
          ...currentMetadata,
          cuadrilla_id: selectedCuadrillaId,
          created_by_role: profile?.role,
          enterprise_context: {
            contratista_id: profile?.servicio_id,
            context_metadata: {
              selection_mode: profile?.role === 'supervisor' ? 'supervisor' : 'buzo',
              empresa_origen_tipo: 'contratista'
            }
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

  const userRoleDisplay = profile?.role === 'supervisor' ? 'Supervisor' : 'Buzo';
  const userRoleColor = profile?.role === 'supervisor' ? 'text-purple-600 border-purple-200' : 'text-cyan-600 border-cyan-200';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <Users className="w-4 h-4 text-gray-600" />
        <span>Modo {userRoleDisplay} - Inmersión de Campo</span>
        <Badge variant="outline" className={`ml-auto ${userRoleColor}`}>
          {userRoleDisplay}
        </Badge>
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? 'Editar Inmersión' : 'Nueva Inmersión de Campo'}</span>
            <div className="flex gap-2">
              <Badge variant="default">Independiente</Badge>
              <Badge variant="outline" className={userRoleColor}>
                {userRoleDisplay}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Advertencia para buzos */}
            {profile?.role === 'buzo' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Importante</h4>
                    <p className="text-sm text-amber-700">
                      Como buzo, esta inmersión requerirá aprobación del supervisor antes de ejecutarse.
                      Asegúrese de coordinar previamente con su equipo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Código de operación */}
            <div>
              <Label htmlFor="codigo_externo">Código de Operación *</Label>
              <Input
                id="codigo_externo"
                value={formData.codigo_operacion_externa}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo_operacion_externa: e.target.value }))}
                placeholder="Ej: CAMPO-2024-001"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Identifique la operación con un código descriptivo
              </p>
            </div>

            {/* Campos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
                <Input
                  id="objetivo"
                  value={formData.objetivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                  placeholder="Ej: Inspección de redes, mantenimiento"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha Programada *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha_inmersion}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_inmersion: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profundidad">Profundidad Máxima Estimada (m) *</Label>
                <Input
                  id="profundidad"
                  type="number"
                  step="0.1"
                  value={formData.profundidad_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, profundidad_max: e.target.value }))}
                  placeholder="Ej: 15.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="centro">Sitio de Trabajo *</Label>
                <Select
                  value={formData.centro_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, centro_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sitio" />
                  </SelectTrigger>
                  <SelectContent>
                    {centros.map(centro => (
                      <SelectItem key={centro.id} value={centro.id}>
                        {centro.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selector de Cuadrilla - Obligatorio - Remover prop onCuadrillaCreated */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Cuadrilla de Buceo *</Label>
                <Badge variant="outline" className="text-xs">Obligatoria</Badge>
              </div>
              <EnhancedCuadrillaSelector
                selectedCuadrillaId={selectedCuadrillaId}
                onCuadrillaChange={setSelectedCuadrillaId}
                fechaInmersion={formData.fecha_inmersion}
                centroId={formData.centro_id}
              />
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones y Detalles</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Condiciones especiales, equipos requeridos, riesgos identificados..."
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Recordatorio de Seguridad</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Verifique condiciones meteorológicas antes de la inmersión</li>
                <li>• Confirme disponibilidad y estado de equipos de seguridad</li>
                <li>• Coordine con el equipo de superficie y emergencias</li>
                <li>• Complete las bitácoras correspondientes post-inmersión</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (initialData ? 'Actualizando...' : 'Creando...') : (initialData ? 'Actualizar Inmersión' : 'Programar Inmersión')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
