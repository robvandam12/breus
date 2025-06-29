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
}

export const UnifiedInmersionForm = ({ onSubmit, onCancel, initialData }: UnifiedInmersionFormProps) => {
  const { profile } = useAuth();
  const { getModulesForCompany } = useEnterpriseModuleAccess();
  
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null);
  const [showEnterpriseSelector, setShowEnterpriseSelector] = useState(true);
  const [enterpriseModules, setEnterpriseModules] = useState<any>(null);
  const [canShowPlanningToggle, setCanShowPlanningToggle] = useState(false);
  
  // Solo permitir toggle a planificada si tiene access al módulo de planning y la empresa lo tiene activo
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
    salmonera_id: initialData?.company_id || '',
    contratista_id: initialData?.operacion_id ? '' : '', // Will be loaded from operacion
    operacion_id: initialData?.operacion_id || '',
    codigo_operacion_externa: initialData?.external_operation_code || '',
    objetivo: initialData?.objetivo || '',
    fecha_inmersion: initialData?.fecha_inmersion || '',
    profundidad_max: initialData?.profundidad_max?.toString() || '',
    observaciones: initialData?.observaciones || ''
  });

  // Datos para selects
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);

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
      setShowEnterpriseSelector(false);
    }
  }, [profile]);

  // Cargar módulos cuando se selecciona empresa
  useEffect(() => {
    if (selectedEnterprise && !showEnterpriseSelector) {
      loadEnterpriseModules();
    }
  }, [selectedEnterprise, showEnterpriseSelector]);

  // Cargar operaciones cuando cambia contratista y se puede planificar
  useEffect(() => {
    if (selectedEnterprise && !showEnterpriseSelector && canShowPlanningToggle && isPlanned) {
      const contratistaId = selectedEnterprise.contratista_id;
      if (contratistaId) {
        loadOperaciones(contratistaId);
      }
    }
  }, [selectedEnterprise, showEnterpriseSelector, canShowPlanningToggle, isPlanned]);

  const loadEnterpriseModules = async () => {
    if (!selectedEnterprise) return;

    try {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      
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
        .select('id, codigo, nombre, fecha_inicio')
        .eq('contratista_id', contratistaId)
        .eq('estado', 'activa')
        .order('fecha_inicio', { ascending: true });

      setOperaciones(data || []);
    } catch (error) {
      console.error('Error loading operaciones:', error);
      setOperaciones([]);
    }
  };

  const handleCuadrillaChange = (cuadrillaId: string | null) => {
    setSelectedCuadrillaId(cuadrillaId);
  };

  const handleCuadrillaCreated = (newCuadrilla: any) => {
    setSelectedCuadrillaId(newCuadrilla.id);
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

    setLoading(true);

    try {
      // Manejo seguro del metadata
      const currentMetadata = initialData?.metadata ? 
        (typeof initialData.metadata === 'string' ? JSON.parse(initialData.metadata) : initialData.metadata) : 
        {};

      const inmersionData = {
        ...formData,
        is_independent: !isPlanned,
        operacion_id: isPlanned ? formData.operacion_id : null,
        codigo_operacion_externa: !isPlanned ? formData.codigo_operacion_externa : null,
        profundidad_max: parseFloat(formData.profundidad_max),
        estado: initialData?.estado || 'planificada',
        cuadrilla_id: selectedCuadrillaId,
        company_id: selectedEnterprise?.salmonera_id || selectedEnterprise?.contratista_id,
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

  // Mostrar selector de empresa para superusers
  if (profile?.role === 'superuser' && showEnterpriseSelector) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Seleccionar Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <EnterpriseSelector
            onSelectionChange={(result) => {
              setSelectedEnterprise(result);
            }}
            showCard={false}
            title="Contexto Empresarial"
            description="Seleccione la empresa para la cual crear la inmersión"
            requiredModule="planning_operations"
            showModuleInfo={true}
            autoSubmit={false}
          />
          {selectedEnterprise && (
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={() => setShowEnterpriseSelector(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continuar con {selectedEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
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
        {/* Mostrar botón para cambiar empresa solo para superuser */}
        {profile?.role === 'superuser' && selectedEnterprise && !showEnterpriseSelector && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Empresa: {selectedEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEnterpriseSelector(true);
                  setSelectedEnterprise(null);
                }}
                className="text-blue-600 hover:text-blue-800 h-auto p-1"
              >
                Cambiar
              </Button>
            </div>
          </div>
        )}

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
                        {operacion.codigo} - {operacion.nombre}
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open('/operaciones', '_blank')}
                  >
                    Crear Operación
                  </Button>
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
  );
};
