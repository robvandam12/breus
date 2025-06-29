
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wrench, Calendar } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { EnhancedCuadrillaSelector } from '@/components/cuadrillas/EnhancedCuadrillaSelector';
import type { Inmersion } from '@/hooks/useInmersiones';

interface ContratistaInmersionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Inmersion;
}

interface Centro {
  id: string;
  nombre: string;
  salmonera_id: string;
}

export const ContratistaInmersionForm = ({ onSubmit, onCancel, initialData }: ContratistaInmersionFormProps) => {
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
        description: "Debe ingresar un código de operación externa", 
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

    setLoading(true);

    try {
      const currentMetadata = initialData?.metadata ? 
        (typeof initialData.metadata === 'string' ? JSON.parse(initialData.metadata) : initialData.metadata) : 
        {};

      const selectedCentro = centros.find(c => c.id === formData.centro_id);

      const inmersionData = {
        ...formData,
        profundidad_max: parseFloat(formData.profundidad_max),
        is_independent: true, // Contratistas crean inmersiones independientes
        operacion_id: null,
        external_operation_code: formData.codigo_operacion_externa,
        estado: initialData?.estado || 'planificada',
        company_id: profile?.servicio_id,
        salmonera_id: selectedCentro?.salmonera_id,
        requiere_validacion_previa: false, // Operaciones directas no requieren validación previa
        anexo_bravo_validado: true,
        hpt_validado: true,
        centro_id: formData.centro_id,
        metadata: {
          ...currentMetadata,
          cuadrilla_id: selectedCuadrillaId,
          enterprise_context: {
            contratista_id: profile?.servicio_id,
            context_metadata: {
              selection_mode: 'contratista_admin',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-green-50 rounded-lg border border-green-200">
        <Wrench className="w-4 h-4 text-green-600" />
        <span>Modo Contratista - Operaciones Directas</span>
        <Badge variant="outline" className="ml-auto text-green-600 border-green-200">
          Ejecución Directa
        </Badge>
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? 'Editar Inmersión' : 'Nueva Inmersión Operativa'}</span>
            <div className="flex gap-2">
              <Badge variant="default">Independiente</Badge>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Contratista
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Código de operación externa - obligatorio para contratistas */}
            <div>
              <Label htmlFor="codigo_externo">Código de Operación *</Label>
              <Input
                id="codigo_externo"
                value={formData.codigo_operacion_externa}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo_operacion_externa: e.target.value }))}
                placeholder="Ej: CONT-2024-001"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Identifique la operación con un código único de su empresa
              </p>
            </div>

            {/* Campos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="objetivo">Objetivo *</Label>
                <Input
                  id="objetivo"
                  value={formData.objetivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                  placeholder="Objetivo de la inmersión"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha de Inmersión *</Label>
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
                <Label htmlFor="profundidad">Profundidad Máxima (m) *</Label>
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
                <Label htmlFor="centro">Centro de Trabajo *</Label>
                <Select
                  value={formData.centro_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, centro_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar centro" />
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

            {/* Selector de Cuadrilla */}
            <EnhancedCuadrillaSelector
              selectedCuadrillaId={selectedCuadrillaId}
              onCuadrillaChange={setSelectedCuadrillaId}
              fechaInmersion={formData.fecha_inmersion}
              onCuadrillaCreated={(cuadrilla) => setSelectedCuadrillaId(cuadrilla.id)}
            />

            <div>
              <Label htmlFor="observaciones">Observaciones Operacionales</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Detalles específicos de la operación, equipos, condiciones, etc..."
                rows={3}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Información Importante</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Esta inmersión se ejecutará de forma independiente</li>
                <li>• No requiere HPT ni Anexo Bravo previos</li>
                <li>• Asegúrese de completar las bitácoras post-inmersión</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (initialData ? 'Actualizando...' : 'Creando...') : (initialData ? 'Actualizar Inmersión' : 'Crear Inmersión')}
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
