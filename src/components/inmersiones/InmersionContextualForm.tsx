
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useIndependentOperations } from "@/hooks/useIndependentOperations";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, CheckCircle, Info, Waves } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InmersionContextualFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  operacionId?: string;
  editingInmersion?: any;
}

interface CompanyOption {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
  modulos: string[];
}

export const InmersionContextualForm = ({ 
  onSuccess, 
  onCancel, 
  operacionId,
  editingInmersion 
}: InmersionContextualFormProps) => {
  const [formData, setFormData] = useState({
    codigo: editingInmersion?.codigo || '',
    fecha_inmersion: editingInmersion?.fecha_inmersion || new Date().toISOString().split('T')[0],
    hora_inicio: editingInmersion?.hora_inicio || '',
    hora_fin: editingInmersion?.hora_fin || '',
    buzo_principal: editingInmersion?.buzo_principal || '',
    buzo_asistente: editingInmersion?.buzo_asistente || '',
    supervisor: editingInmersion?.supervisor || '',
    objetivo: editingInmersion?.objetivo || '',
    profundidad_max: editingInmersion?.profundidad_max || 0,
    temperatura_agua: editingInmersion?.temperatura_agua || 0,
    visibilidad: editingInmersion?.visibilidad || 0,
    corriente: editingInmersion?.corriente || '',
    observaciones: editingInmersion?.observaciones || '',
    context_type: (editingInmersion?.context_type || 'direct') as 'planned' | 'direct',
    operacion_id: operacionId || editingInmersion?.operacion_id || null,
    planned_bottom_time: editingInmersion?.planned_bottom_time || 0
  });

  const [isDirectMode, setIsDirectMode] = useState(formData.context_type === 'direct');
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const { profile } = useAuth();
  const { 
    loading, 
    operationalContext, 
    createIndependentInmersion, 
    canAccessFeature 
  } = useIndependentOperations();

  // Cargar empresas disponibles para superuser
  useEffect(() => {
    if (profile?.role === 'superuser') {
      loadAvailableCompanies();
    }
  }, [profile]);

  const loadAvailableCompanies = async () => {
    setLoadingCompanies(true);
    try {
      // Cargar salmoneras
      const { data: salmoneras } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa');

      // Cargar contratistas
      const { data: contratistas } = await supabase
        .from('contratistas')
        .select('id, nombre')
        .eq('estado', 'activo');

      const companyList: CompanyOption[] = [
        ...(salmoneras?.map(s => ({
          id: s.id,
          nombre: s.nombre,
          tipo: 'salmonera' as const,
          modulos: ['planning_operations', 'core_immersions'] // Por defecto para salmoneras
        })) || []),
        ...(contratistas?.map(c => ({
          id: c.id,
          nombre: c.nombre,
          tipo: 'contratista' as const,
          modulos: ['core_immersions'] // Solo core para contratistas
        })) || [])
      ];

      setCompanies(companyList);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // Validación mejorada que no incluye campos inexistentes
  const validateForm = () => {
    console.log('Validating form data:', formData);
    
    const requiredFields = [
      { field: 'codigo', value: formData.codigo, label: 'Código' },
      { field: 'fecha_inmersion', value: formData.fecha_inmersion, label: 'Fecha' },
      { field: 'hora_inicio', value: formData.hora_inicio, label: 'Hora de inicio' },
      { field: 'buzo_principal', value: formData.buzo_principal, label: 'Buzo principal' },
      { field: 'supervisor', value: formData.supervisor, label: 'Supervisor' },
      { field: 'objetivo', value: formData.objetivo, label: 'Objetivo' },
      { field: 'corriente', value: formData.corriente, label: 'Corriente' }
    ];

    const emptyFields = requiredFields.filter(field => {
      if (typeof field.value === 'string') {
        return !field.value.trim();
      }
      return !field.value;
    });

    const numericFields = [
      { field: 'profundidad_max', value: formData.profundidad_max, label: 'Profundidad máxima' },
      { field: 'temperatura_agua', value: formData.temperatura_agua, label: 'Temperatura del agua' },
      { field: 'visibilidad', value: formData.visibilidad, label: 'Visibilidad' }
    ];

    const invalidNumericFields = numericFields.filter(field => field.value <= 0);

    // Validación especial para superuser
    if (profile?.role === 'superuser' && !selectedCompany) {
      emptyFields.push({ field: 'company', value: '', label: 'Empresa destino' });
    }

    const allErrors = [...emptyFields, ...invalidNumericFields];
    
    console.log('Validation errors:', allErrors);
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors.map(field => `${field.label} es requerido`)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    
    if (!validation.isValid) {
      console.log('Form validation failed:', validation.errors);
      return;
    }
    
    try {
      // Preparar datos limpios solo con campos que existen en la tabla
      const cleanFormData = {
        codigo: formData.codigo,
        fecha_inmersion: formData.fecha_inmersion,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin || null,
        buzo_principal: formData.buzo_principal,
        buzo_asistente: formData.buzo_asistente || null,
        supervisor: formData.supervisor,
        objetivo: formData.objetivo,
        profundidad_max: formData.profundidad_max,
        temperatura_agua: formData.temperatura_agua,
        visibilidad: formData.visibilidad,
        corriente: formData.corriente,
        observaciones: formData.observaciones || '',
        estado: 'planificada',
        planned_bottom_time: formData.planned_bottom_time || null,
        context_type: isDirectMode ? 'direct' as const : 'planned' as const,
        operacion_id: formData.operacion_id || null,
        is_independent: !formData.operacion_id,
        // Campos para superuser
        company_id: selectedCompany?.id || null,
        company_type: selectedCompany?.tipo || null
      };

      console.log('Submitting clean inmersion data:', cleanFormData);
      
      // Usar el método apropiado según el contexto
      if (cleanFormData.is_independent) {
        await createIndependentInmersion(cleanFormData);
      } else {
        // Para inmersiones con operación, usar el hook de inmersiones normal
        const { createInmersion } = await import('@/hooks/useInmersiones');
        // Crear a través de Supabase directamente ya que los hooks pueden tener validaciones adicionales
        const { data, error } = await supabase
          .from('inmersion')
          .insert([cleanFormData])
          .select()
          .single();

        if (error) throw error;
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  };

  const getContextBadge = () => {
    if (!operationalContext) return null;

    switch (operationalContext.context_type) {
      case 'planned':
        return <Badge className="bg-blue-100 text-blue-800">Planificado</Badge>;
      case 'direct':
        return <Badge className="bg-green-100 text-green-800">Directo</Badge>;
      case 'mixed':
        return <Badge className="bg-purple-100 text-purple-800">Mixto</Badge>;
      default:
        return null;
    }
  };

  const validation = validateForm();
  const canCreateDirect = canAccessFeature('create_direct_inmersions');
  const canCreatePlanned = canAccessFeature('create_operations');
  const showModeSwitch = operationalContext?.context_type === 'mixed';
  const isSuperuser = profile?.role === 'superuser';

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Waves className="w-6 h-6 text-blue-600" />
              {editingInmersion ? 'Editar Inmersión' : 'Nueva Inmersión'}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Contexto: {getContextBadge()} • Empresa: {isSuperuser ? 'Superuser' : (profile?.salmonera_id ? 'Salmonera' : 'Contratista')}
            </p>
          </div>
          
          {showModeSwitch && !isSuperuser && (
            <div className="flex items-center gap-2">
              <Label htmlFor="mode-switch" className="text-sm">
                {isDirectMode ? 'Directo' : 'Planificado'}
              </Label>
              <Switch
                id="mode-switch"
                checked={!isDirectMode}
                onCheckedChange={(checked) => {
                  setIsDirectMode(!checked);
                  setFormData(prev => ({
                    ...prev,
                    context_type: checked ? 'planned' : 'direct'
                  }));
                }}
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!validation.isValid && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <p className="font-medium text-red-800 mb-2">Por favor complete los siguientes campos:</p>
              <ul className="space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">• {error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de empresa para superuser */}
          {isSuperuser && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Label className="text-sm font-medium text-yellow-800">Empresa Destino *</Label>
              <Select onValueChange={(value) => {
                const company = companies.find(c => c.id === value);
                setSelectedCompany(company || null);
              }}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecciona la empresa para la cual crear la inmersión" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant={company.tipo === 'salmonera' ? 'default' : 'secondary'}>
                          {company.tipo}
                        </Badge>
                        {company.nombre}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCompany && (
                <p className="text-xs text-yellow-700 mt-1">
                  Módulos disponibles: {selectedCompany.modulos.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código de Inmersión *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({...prev, codigo: e.target.value}))}
                placeholder="Ej: INM-2024-001"
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha">Fecha de Inmersión *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha_inmersion}
                onChange={(e) => setFormData(prev => ({...prev, fecha_inmersion: e.target.value}))}
                required
              />
            </div>
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({...prev, hora_inicio: e.target.value}))}
                required
              />
            </div>

            <div>
              <Label htmlFor="hora_fin">Hora de Fin (Estimada)</Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) => setFormData(prev => ({...prev, hora_fin: e.target.value}))}
              />
            </div>

            <div>
              <Label htmlFor="planned_bottom_time">Tiempo Fondo Planificado (min)</Label>
              <Input
                id="planned_bottom_time"
                type="number"
                min="0"
                value={formData.planned_bottom_time}
                onChange={(e) => setFormData(prev => ({...prev, planned_bottom_time: parseInt(e.target.value) || 0}))}
              />
            </div>
          </div>

          {/* Personnel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <Input
                id="buzo_principal"
                value={formData.buzo_principal}
                onChange={(e) => setFormData(prev => ({...prev, buzo_principal: e.target.value}))}
                placeholder="Nombre del buzo principal"
                required
              />
            </div>

            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <Input
                id="buzo_asistente"
                value={formData.buzo_asistente}
                onChange={(e) => setFormData(prev => ({...prev, buzo_asistente: e.target.value}))}
                placeholder="Nombre del buzo asistente"
              />
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => setFormData(prev => ({...prev, supervisor: e.target.value}))}
                placeholder="Nombre del supervisor"
                required
              />
            </div>
          </div>

          {/* Work Details */}
          <div>
            <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
            <Select 
              value={formData.objetivo} 
              onValueChange={(value) => setFormData(prev => ({...prev, objetivo: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="inspeccion">Inspección</SelectItem>
                <SelectItem value="reparacion">Reparación</SelectItem>
                <SelectItem value="instalacion">Instalación</SelectItem>
                <SelectItem value="limpieza">Limpieza</SelectItem>
                <SelectItem value="soldadura">Soldadura</SelectItem>
                <SelectItem value="corte">Corte</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Environmental Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="profundidad">Profundidad Máxima (m) *</Label>
              <Input
                id="profundidad"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.profundidad_max}
                onChange={(e) => setFormData(prev => ({...prev, profundidad_max: parseFloat(e.target.value) || 0}))}
                required
              />
            </div>

            <div>
              <Label htmlFor="temperatura">Temperatura del Agua (°C) *</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.temperatura_agua}
                onChange={(e) => setFormData(prev => ({...prev, temperatura_agua: parseFloat(e.target.value) || 0}))}
                required
              />
            </div>

            <div>
              <Label htmlFor="visibilidad">Visibilidad (m) *</Label>
              <Input
                id="visibilidad"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.visibilidad}
                onChange={(e) => setFormData(prev => ({...prev, visibilidad: parseFloat(e.target.value) || 0}))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="corriente">Condiciones de Corriente *</Label>
            <Select 
              value={formData.corriente} 
              onValueChange={(value) => setFormData(prev => ({...prev, corriente: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona las condiciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nula">Nula</SelectItem>
                <SelectItem value="leve">Leve</SelectItem>
                <SelectItem value="moderada">Moderada</SelectItem>
                <SelectItem value="fuerte">Fuerte</SelectItem>
                <SelectItem value="muy_fuerte">Muy Fuerte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observations */}
          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({...prev, observaciones: e.target.value}))}
              placeholder="Observaciones adicionales sobre la inmersión..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !validation.isValid}
              className={validation.isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
            >
              {loading ? 'Creando...' : editingInmersion ? 'Actualizar' : 'Crear Inmersión'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
