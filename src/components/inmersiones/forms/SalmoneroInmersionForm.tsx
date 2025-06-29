import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Building, Calendar, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useEnterpriseModuleAccess } from '@/hooks/useEnterpriseModuleAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { EnhancedCuadrillaSelector } from '@/components/cuadrillas/EnhancedCuadrillaSelector';
import type { Inmersion } from '@/hooks/useInmersiones';

interface SalmoneroInmersionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: Inmersion;
}

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  fecha_inicio: string;
  centro_id?: string;
  centros?: { nombre: string };
}

interface Centro {
  id: string;
  nombre: string;
  salmonera_id: string;
}

export const SalmoneroInmersionForm = ({ onSubmit, onCancel, initialData }: SalmoneroInmersionFormProps) => {
  const { profile } = useAuth();
  const { getModulesForCompany } = useEnterpriseModuleAccess();
  
  const [enterpriseModules, setEnterpriseModules] = useState<any>(null);
  const [canShowPlanningToggle, setCanShowPlanningToggle] = useState(false);
  const [isPlanned, setIsPlanned] = useState(false);
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
    operacion_id: initialData?.operacion_id || '',
    codigo_operacion_externa: initialData?.external_operation_code || '',
    objetivo: initialData?.objetivo || '',
    fecha_inmersion: initialData?.fecha_inmersion || '',
    profundidad_max: initialData?.profundidad_max?.toString() || '',
    observaciones: initialData?.observaciones || '',
    centro_id: initialData?.centro_id || ''
  });

  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [centros, setCentros] = useState<Centro[]>([]);

  useEffect(() => {
    if (profile?.salmonera_id) {
      loadEnterpriseModules();
      loadCentros();
    }
  }, [profile?.salmonera_id]);

  useEffect(() => {
    if (canShowPlanningToggle && isPlanned && profile?.salmonera_id) {
      loadOperaciones();
    }
  }, [canShowPlanningToggle, isPlanned, profile?.salmonera_id]);

  const loadEnterpriseModules = async () => {
    if (!profile?.salmonera_id) return;

    try {
      const modules = await getModulesForCompany(profile.salmonera_id, 'salmonera');
      setEnterpriseModules(modules);
      // Verificar si tiene planning activo (puede ser boolean o string)
      const hasPlanning = modules?.hasPlanning === true || String(modules?.hasPlanning) === 'true';
      setCanShowPlanningToggle(hasPlanning);
      setIsPlanned(hasPlanning && Boolean(initialData?.operacion_id));
    } catch (error) {
      console.error('Error loading enterprise modules:', error);
      setCanShowPlanningToggle(false);
      setIsPlanned(false);
    }
  };

  const loadOperaciones = async () => {
    if (!profile?.salmonera_id) return;

    try {
      const { data } = await supabase
        .from('operacion')
        .select(`
          id, 
          codigo, 
          nombre, 
          fecha_inicio,
          centro_id,
          centros:centro_id(nombre)
        `)
        .eq('salmonera_id', profile.salmonera_id)
        .eq('estado', 'activa')
        .order('fecha_inicio', { ascending: true });

      setOperaciones(data || []);
    } catch (error) {
      console.error('Error loading operaciones:', error);
      setOperaciones([]);
    }
  };

  const loadCentros = async () => {
    if (!profile?.salmonera_id) return;

    try {
      const { data } = await supabase
        .from('centros')
        .select('id, nombre, salmonera_id')
        .eq('salmonera_id', profile.salmonera_id)
        .eq('estado', 'activo')
        .order('nombre');

      setCentros(data || []);
    } catch (error) {
      console.error('Error loading centros:', error);
      setCentros([]);
    }
  };

  useEffect(() => {
    if (isPlanned && formData.operacion_id) {
      const selectedOperacion = operaciones.find(op => op.id === formData.operacion_id);
      if (selectedOperacion?.centro_id) {
        setFormData(prev => ({ ...prev, centro_id: selectedOperacion.centro_id || '' }));
      }
    }
  }, [isPlanned, formData.operacion_id, operaciones]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPlanned && !formData.operacion_id) {
      toast({
        title: "Error", 
        description: "Debe seleccionar una operación para inmersiones planificadas",
        variant: "destructive",
      });
      return;
    }

    if (!isPlanned && !formData.codigo_operacion_externa) {
      toast({
        title: "Error",
        description: "Debe ingresar un código de operación externa para inmersiones independientes", 
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

    if (!formData.objetivo.trim()) {
      toast({
        title: "Error",
        description: "Debe especificar el objetivo de la inmersión",
        variant: "destructive",
      });
      return;
    }

    if (!formData.fecha_inmersion) {
      toast({
        title: "Error",
        description: "Debe seleccionar la fecha de inmersión",
        variant: "destructive",
      });
      return;
    }

    if (!formData.profundidad_max || parseFloat(formData.profundidad_max) <= 0) {
      toast({
        title: "Error",
        description: "Debe especificar una profundidad máxima válida",
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
        is_independent: !isPlanned,
        operacion_id: isPlanned ? formData.operacion_id : null,
        external_operation_code: !isPlanned ? formData.codigo_operacion_externa : null,
        estado: initialData?.estado || 'planificada',
        company_id: profile?.salmonera_id,
        salmonera_id: selectedCentro?.salmonera_id,
        requiere_validacion_previa: isPlanned,
        // Asegurar que estos campos sean boolean
        anexo_bravo_validado: Boolean(!isPlanned),
        hpt_validado: Boolean(!isPlanned),
        centro_id: formData.centro_id,
        metadata: {
          ...currentMetadata,
          cuadrilla_id: selectedCuadrillaId,
          enterprise_context: {
            salmonera_id: profile?.salmonera_id,
            context_metadata: {
              selection_mode: 'salmonera_admin',
              empresa_origen_tipo: 'salmonera'
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

  // Crear contexto empresarial para pasar al selector de cuadrilla
  const enterpriseContext = {
    salmonera_id: profile?.salmonera_id,
    context_metadata: {
      selection_mode: 'salmonera_admin',
      empresa_origen_tipo: 'salmonera'
    }
  };

  return (
    <div className="space-y-6">
      {/* Info contextual */}
      <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Building className="w-4 h-4 text-blue-600" />
        <span>Gestión de Inmersiones</span>
        {canShowPlanningToggle && (
          <Badge variant="outline" className="ml-auto">
            <CheckCircle className="w-3 h-3 mr-1" />
            Planning Activo
          </Badge>
        )}
        {!canShowPlanningToggle && (
          <Badge variant="outline" className="ml-auto text-amber-600 border-amber-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Solo Independientes
          </Badge>
        )}
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? 'Editar Inmersión' : 'Nueva Inmersión'}</span>
            {canShowPlanningToggle && !initialData && (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <Switch
                  checked={isPlanned}
                  onCheckedChange={setIsPlanned}
                  id="inmersion-type"
                />
                <Calendar className="w-4 h-4" />
              </div>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={!isPlanned ? "default" : "secondary"}>
              {!isPlanned ? "Independiente" : "Planificada"}
            </Badge>
            {isPlanned && (
              <Badge variant="outline">
                Asociada a Operación
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de operación para modo planificado */}
            {canShowPlanningToggle && isPlanned && operaciones.length > 0 && (
              <div>
                <Label htmlFor="operacion">Operación *</Label>
                <Select
                  value={formData.operacion_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, operacion_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación" />
                  </SelectTrigger>
                  <SelectContent>
                    {operaciones.map(operacion => (
                      <SelectItem key={operacion.id} value={operacion.id}>
                        <div>
                          <div>{operacion.codigo} - {operacion.nombre}</div>
                          <div className="text-sm text-gray-500">
                            Centro: {operacion.centros?.nombre || 'No asignado'}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Código externo para inmersiones independientes */}
            {(!canShowPlanningToggle || !isPlanned) && (
              <div>
                <Label htmlFor="codigo_externo">Código de Operación Externa *</Label>
                <Input
                  id="codigo_externo"
                  value={formData.codigo_operacion_externa}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo_operacion_externa: e.target.value }))}
                  placeholder="Ej: EXT-2024-001"
                  required
                />
              </div>
            )}

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
                <Label htmlFor="centro">Centro *</Label>
                <Select
                  value={formData.centro_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, centro_id: value }))}
                  disabled={isPlanned && formData.operacion_id && operaciones.find(op => op.id === formData.operacion_id)?.centro_id}
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
                {isPlanned && formData.operacion_id && operaciones.find(op => op.id === formData.operacion_id)?.centro_id && (
                  <p className="text-sm text-gray-600 mt-1">
                    Centro heredado de la operación seleccionada
                  </p>
                )}
              </div>
            </div>

            {/* Selector de Cuadrilla con contexto empresarial */}
            <EnhancedCuadrillaSelector
              selectedCuadrillaId={selectedCuadrillaId}
              onCuadrillaChange={setSelectedCuadrillaId}
              fechaInmersion={formData.fecha_inmersion}
              onCuadrillaCreated={(cuadrilla) => setSelectedCuadrillaId(cuadrilla.id)}
              enterpriseContext={enterpriseContext}
            />

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Observaciones adicionales..."
                rows={3}
              />
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
