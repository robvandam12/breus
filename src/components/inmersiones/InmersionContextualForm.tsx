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
import { useCompanyContext } from "@/hooks/useCompanyContext";
import { UniversalCompanySelector } from "@/components/common/UniversalCompanySelector";
import { AlertCircle, CheckCircle, Info, Waves } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InmersionContextualFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  operacionId?: string;
  editingInmersion?: any;
}

export const InmersionContextualForm = ({ 
  onSuccess, 
  onCancel, 
  operacionId,
  editingInmersion 
}: InmersionContextualFormProps) => {
  const { profile } = useAuth();
  const { context, requiresCompanySelection, canCreateRecords } = useCompanyContext();
  
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    loading, 
    operationalContext, 
    createIndependentInmersion, 
    canAccessFeature 
  } = useIndependentOperations();

  // Validación mejorada que incluye validación de empresa
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

    // Validación especial para superuser - debe tener empresa seleccionada
    if (requiresCompanySelection()) {
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
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!canCreateRecords()) {
      toast({
        title: "Empresa requerida",
        description: "Debes seleccionar una empresa antes de crear la inmersión",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
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
        // Usar empresa seleccionada o empresa del usuario
        company_id: context.selectedCompany?.id || context.companyId,
        company_type: context.selectedCompany?.tipo || context.companyType
      };

      console.log('Submitting clean inmersion data:', cleanFormData);
      
      // Usar el método apropiado según el contexto
      if (cleanFormData.is_independent) {
        await createIndependentInmersion(cleanFormData);
      } else {
        // Para inmersiones con operación, crear a través de Supabase directamente
        const { data, error } = await supabase
          .from('inmersion')
          .insert([cleanFormData])
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
          throw error;
        }
        
        toast({
          title: "Inmersión creada",
          description: "La inmersión ha sido creada exitosamente.",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error creating inmersion:', error);
      
      let errorMessage = "No se pudo crear la inmersión.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  if (context.isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6 text-center">
          <p>Cargando contexto empresarial...</p>
        </CardContent>
      </Card>
    );
  }

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
              Contexto: {getContextBadge()}
            </p>
          </div>
          
          {showModeSwitch && !context.isSuperuser && (
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
        {/* Selector de empresa universal */}
        <div className="mb-6">
          <UniversalCompanySelector 
            title="Empresa para esta Inmersión"
            description="Especifica la empresa para la cual se realizará esta inmersión"
          />
        </div>

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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo" className={!formData.codigo ? 'text-red-600' : ''}>
                Código de Inmersión *
              </Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({...prev, codigo: e.target.value}))}
                placeholder="Ej: INM-2024-001"
                className={!formData.codigo ? 'border-red-300' : ''}
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha" className={!formData.fecha_inmersion ? 'text-red-600' : ''}>
                Fecha de Inmersión *
              </Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha_inmersion}
                onChange={(e) => setFormData(prev => ({...prev, fecha_inmersion: e.target.value}))}
                className={!formData.fecha_inmersion ? 'border-red-300' : ''}
                required
              />
            </div>
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hora_inicio" className={!formData.hora_inicio ? 'text-red-600' : ''}>
                Hora de Inicio *
              </Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({...prev, hora_inicio: e.target.value}))}
                className={!formData.hora_inicio ? 'border-red-300' : ''}
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
              <Label htmlFor="buzo_principal" className={!formData.buzo_principal ? 'text-red-600' : ''}>
                Buzo Principal *
              </Label>
              <Input
                id="buzo_principal"
                value={formData.buzo_principal}
                onChange={(e) => setFormData(prev => ({...prev, buzo_principal: e.target.value}))}
                placeholder="Nombre del buzo principal"
                className={!formData.buzo_principal ? 'border-red-300' : ''}
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
              <Label htmlFor="supervisor" className={!formData.supervisor ? 'text-red-600' : ''}>
                Supervisor *
              </Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => setFormData(prev => ({...prev, supervisor: e.target.value}))}
                placeholder="Nombre del supervisor"
                className={!formData.supervisor ? 'border-red-300' : ''}
                required
              />
            </div>
          </div>

          {/* Work Details */}
          <div>
            <Label htmlFor="objetivo" className={!formData.objetivo ? 'text-red-600' : ''}>
              Objetivo de la Inmersión *
            </Label>
            <Select 
              value={formData.objetivo} 
              onValueChange={(value) => setFormData(prev => ({...prev, objetivo: value}))}
            >
              <SelectTrigger className={!formData.objetivo ? 'border-red-300' : ''}>
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
              <Label htmlFor="profundidad" className={formData.profundidad_max <= 0 ? 'text-red-600' : ''}>
                Profundidad Máxima (m) *
              </Label>
              <Input
                id="profundidad"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.profundidad_max}
                onChange={(e) => setFormData(prev => ({...prev, profundidad_max: parseFloat(e.target.value) || 0}))}
                className={formData.profundidad_max <= 0 ? 'border-red-300' : ''}
                required
              />
            </div>

            <div>
              <Label htmlFor="temperatura" className={formData.temperatura_agua <= 0 ? 'text-red-600' : ''}>
                Temperatura del Agua (°C) *
              </Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.temperatura_agua}
                onChange={(e) => setFormData(prev => ({...prev, temperatura_agua: parseFloat(e.target.value) || 0}))}
                className={formData.temperatura_agua <= 0 ? 'border-red-300' : ''}
                required
              />
            </div>

            <div>
              <Label htmlFor="visibilidad" className={formData.visibilidad <= 0 ? 'text-red-600' : ''}>
                Visibilidad (m) *
              </Label>
              <Input
                id="visibilidad"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.visibilidad}
                onChange={(e) => setFormData(prev => ({...prev, visibilidad: parseFloat(e.target.value) || 0}))}
                className={formData.visibilidad <= 0 ? 'border-red-300' : ''}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="corriente" className={!formData.corriente ? 'text-red-600' : ''}>
              Condiciones de Corriente *
            </Label>
            <Select 
              value={formData.corriente} 
              onValueChange={(value) => setFormData(prev => ({...prev, corriente: value}))}
            >
              <SelectTrigger className={!formData.corriente ? 'border-red-300' : ''}>
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
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !validation.isValid || isSubmitting || !canCreateRecords()}
              className={validation.isValid && canCreateRecords() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
            >
              {isSubmitting ? 'Creando...' : (editingInmersion ? 'Actualizar' : 'Crear Inmersión')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
