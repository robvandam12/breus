
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Zap, AlertCircle, AlertTriangle } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useEnterpriseModuleAccess } from '@/hooks/useEnterpriseModuleAccess';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CuadrillaSelector } from '@/components/cuadrillas/CuadrillaSelector';
import { EnterpriseSelector } from '@/components/common/EnterpriseSelector';
import type { Inmersion } from '@/hooks/useInmersiones';

interface UnifiedInmersionFormProps {
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

export const UnifiedInmersionForm = ({ onSubmit, onCancel, initialData }: UnifiedInmersionFormProps) => {
  const { profile } = useAuth();
  const { getModulesForCompany } = useEnterpriseModuleAccess();
  
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null);
  const [enterpriseModules, setEnterpriseModules] = useState<any>(null);
  const [canShowPlanningToggle, setCanShowPlanningToggle] = useState(false);
  const [isPlanned, setIsPlanned] = useState(
    initialData ? (!initialData.is_independent && canShowPlanningToggle) : false
  );
  const [loading, setLoading] = useState(false);
  
  // Manejo seguro del metadata para cuadrilla_id
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
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    operacion_id: initialData?.operacion_id || '',
    codigo_operacion_externa: initialData?.external_operation_code || '',
    objetivo: initialData?.objetivo || '',
    fecha_inmersion: initialData?.fecha_inmersion || '',
    profundidad_max: initialData?.profundidad_max?.toString() || '',
    observaciones: initialData?.observaciones || '',
    centro_id: initialData?.centro_id || ''
  });

  // Datos para selects
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [centros, setCentros] = useState<Centro[]>([]);

  // Para usuarios no superuser, configurar empresa automáticamente
  useEffect(() => {
    if (profile && profile.role !== 'superuser') {
      const autoEnterprise = {
        salmonera_id: profile.salmonera_id,
        contratista_id: profile.servicio_id,
        context_metadata: {
          selection_mode: profile.salmonera_id ? 'salmonera_admin' : 'contratista_admin',
          empresa_origen_tipo: profile.salmonera_id ? 'salmonera' : 'contratista'
        }
      };
      setSelectedEnterprise(autoEnterprise);
      loadEnterpriseModules(autoEnterprise);
    }
  }, [profile]);

  // Cargar operaciones y centros cuando cambia la empresa
  useEffect(() => {
    if (selectedEnterprise && canShowPlanningToggle) {
      if (isPlanned) {
        const contratistaId = selectedEnterprise.contratista_id;
        if (contratistaId) {
          loadOperaciones(contratistaId);
        }
      }
      loadCentros();
    }
  }, [selectedEnterprise, canShowPlanningToggle, isPlanned]);

  // Auto-seleccionar centro si viene de operación planificada
  useEffect(() => {
    if (isPlanned && formData.operacion_id) {
      const selectedOperacion = operaciones.find(op => op.id === formData.operacion_id);
      if (selectedOperacion?.centro_id) {
        setFormData(prev => ({ ...prev, centro_id: selectedOperacion.centro_id || '' }));
      }
    }
  }, [isPlanned, formData.operacion_id, operaciones]);

  const loadEnterpriseModules = async (enterprise: any) => {
    if (!enterprise) return;

    try {
      const companyId = enterprise.salmonera_id || enterprise.contratista_id;
      const companyType = enterprise.salmonera_id ? 'salmonera' : 'contratista';
      
      const modules = await getModulesForCompany(companyId, companyType);
      setEnterpriseModules(modules);
      setCanShowPlanningToggle(modules.hasPlanning);
      
      // Si no tiene planning y estaba en modo planificado, cambiar a independiente
      if (!modules.hasPlanning && isPlanned) {
        setIsPlanned(false);
      }
    } catch (error) {
      console.error('Error loading enterprise modules:', error);
      setCanShowPlanningToggle(false);
    }
  };

  const loadOperaciones = async (contratistaId: string) => {
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
        .eq('contratista_id', contratistaId)
        .eq('estado', 'activa')
        .order('fecha_inicio', { ascending: true });

      setOperaciones(data || []);
    } catch (error) {
      console.error('Error loading operaciones:', error);
      setOperaciones([]);
    }
  };

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

  const handleCuadrillaChange = (cuadrillaId: string | null) => {
    setSelectedCuadrillaId(cuadrillaId);
  };

  const handleCuadrillaCreated = (newCuadrilla: any) => {
    setSelectedCuadrillaId(newCuadrilla.id);
  };

  const handleEnterpriseChange = (result: any) => {
    setSelectedEnterprise(result);
    loadEnterpriseModules(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado empresa (para superusers)
    if (profile?.role === 'superuser' && !selectedEnterprise) {
      toast({
        title: "Error",
        description: "Debe seleccionar una empresa antes de continuar",
        variant: "destructive",
      });
      return;
    }

    // Validar que si está en modo planificado, tenga operación
    if (isPlanned && !formData.operacion_id) {
      toast({
        title: "Error", 
        description: "Debe seleccionar una operación para inmersiones planificadas",
        variant: "destructive",
      });
      return;
    }

    // Validar que si está en modo independiente, tenga código externo
    if (!isPlanned && !formData.codigo_operacion_externa) {
      toast({
        title: "Error",
        description: "Debe ingresar un código de operación externa para inmersiones independientes", 
        variant: "destructive",
      });
      return;
    }

    // Validar que tenga centro seleccionado
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
      // Manejo seguro del metadata
      const currentMetadata = initialData?.metadata ? 
        (typeof initialData.metadata === 'string' ? JSON.parse(initialData.metadata) : initialData.metadata) : 
        {};

      const selectedCentro = centros.find(c => c.id === formData.centro_id);

      const inmersionData = {
        ...formData,
        is_independent: !isPlanned,
        operacion_id: isPlanned ? formData.operacion_id : null,
        external_operation_code: !isPlanned ? formData.codigo_operacion_externa : null,
        profundidad_max: parseFloat(formData.profundidad_max),
        estado: initialData?.estado || 'planificada',
        company_id: selectedEnterprise?.salmonera_id || selectedEnterprise?.contratista_id,
        salmonera_id: selectedCentro?.salmonera_id,
        requiere_validacion_previa: true,
        anexo_bravo_validado: false,
        hpt_validado: false,
        metadata: {
          ...currentMetadata,
          cuadrilla_id: selectedCuadrillaId,
          enterprise_context: selectedEnterprise
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

  const canShowOperacionSelector = isPlanned && selectedEnterprise?.contratista_id && operaciones.length > 0;
  const shouldShowOperacionWarning = isPlanned && selectedEnterprise?.contratista_id && operaciones.length === 0;

  // Mostrar selector de empresa para superusers (sin doble botón)
  if (profile?.role === 'superuser' && !selectedEnterprise) {
    return (
      <div className="space-y-4">
        <EnterpriseSelector
          onSelectionChange={handleEnterpriseChange}
          showCard={false}
          title="Contexto Empresarial"
          description="Seleccione la empresa para la cual crear la inmersión"
          requiredModule="planning_operations"
          showModuleInfo={true}
          autoSubmit={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mostrar botón para cambiar empresa solo para superuser */}
      {profile?.role === 'superuser' && selectedEnterprise && (
        <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
          <span>
            Empresa: {selectedEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEnterprise(null)}
            className="text-blue-600 hover:text-blue-800 h-auto p-1"
          >
            Cambiar
          </Button>
        </div>
      )}

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{initialData ? 'Editar Inmersión' : 'Nueva Inmersión'}</span>
            {/* Solo mostrar toggle si la empresa tiene módulo de planning */}
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
            {enterpriseModules && !enterpriseModules.hasPlanning && (
              <Badge variant="secondary">
                Modo Core
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Alerta si no tiene módulo de planning */}
          {enterpriseModules && !enterpriseModules.hasPlanning && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription>
                Esta empresa no tiene el módulo de planificación activo. 
                Solo se pueden crear inmersiones independientes (modo core).
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Solo mostrar selector de operación si puede planificar */}
            {canShowPlanningToggle && isPlanned ? (
              <div>
                <Label htmlFor="operacion">Operación *</Label>
                {canShowOperacionSelector ? (
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
                ) : shouldShowOperacionWarning ? (
                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">No hay operaciones disponibles</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-2">
                      No se encontraron operaciones planificadas para este contratista.
                    </p>
                  </div>
                ) : (
                  <Input disabled placeholder="Selecciona un contratista primero" />
                )}
              </div>
            ) : (!canShowPlanningToggle || !isPlanned) ? (
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
            ) : null}

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

            {/* Selector de Cuadrilla */}
            <CuadrillaSelector
              selectedCuadrillaId={selectedCuadrillaId}
              onCuadrillaChange={handleCuadrillaChange}
              fechaInmersion={formData.fecha_inmersion}
              onCuadrillaCreated={handleCuadrillaCreated}
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

            {/* Botones */}
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
