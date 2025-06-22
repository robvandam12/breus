
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
    context_type: (editingInmersion?.contexto_operativo || 'direct') as 'planned' | 'direct',
    operacion_id: operacionId || editingInmersion?.operacion_id || null
  });

  const [isDirectMode, setIsDirectMode] = useState(formData.context_type === 'direct');
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const { profile } = useAuth();
  const { 
    loading, 
    operationalContext, 
    createIndependentInmersion, 
    canAccessFeature 
  } = useIndependentOperations();

  useEffect(() => {
    validateForm();
  }, [formData, operationalContext]);

  const validateForm = () => {
    const messages: string[] = [];

    if (!operationalContext) {
      messages.push('Cargando contexto operativo...');
      setValidationMessages(messages);
      return;
    }

    // Validaciones según contexto
    if (operationalContext.context_type === 'planned' && !formData.operacion_id) {
      messages.push('Se requiere una operación planificada para crear inmersiones');
    }

    if (formData.context_type === 'planned' && operationalContext.requires_documents && !formData.operacion_id) {
      messages.push('Operaciones planificadas requieren documentos HPT y Anexo Bravo');
    }

    if (operationalContext.context_type === 'direct' && formData.operacion_id) {
      messages.push('Modo directo: La inmersión se creará independientemente');
    }

    setValidationMessages(messages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const inmersionData = {
        ...formData,
        context_type: isDirectMode ? 'direct' as const : 'planned' as const,
        estado: 'planificada'
      };

      await createIndependentInmersion(inmersionData);
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

  const canCreateDirect = canAccessFeature('create_direct_inmersions');
  const canCreatePlanned = canAccessFeature('create_operations');
  const showModeSwitch = operationalContext?.context_type === 'mixed';

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
              Contexto: {getContextBadge()} • Empresa: {profile?.salmonera_id ? 'Salmonera' : 'Contratista'}
            </p>
          </div>
          
          {showModeSwitch && (
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
        {/* Validation Messages */}
        {validationMessages.length > 0 && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <ul className="space-y-1">
                {validationMessages.map((message, index) => (
                  <li key={index} className="text-sm">• {message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código de Inmersión</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e)=>setFormData(prev=>({...prev,codigo:e.target.value}))}
                placeholder="Ej: INM-2024-001"
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha">Fecha de Inmersión</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha_inmersion}
                onChange={(e)=>setFormData(prev=>({...prev,fecha_inmersion:e.target.value}))}
                required
              />
            </div>
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e)=>setFormData(prev=>({...prev,hora_inicio:e.target.value}))}
                required
              />
            </div>

            <div>
              <Label htmlFor="hora_fin">Hora de Fin (Estimada)</Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e)=>setFormData(prev=>({...prev,hora_fin:e.target.value}))}
              />
            </div>
          </div>

          {/* Personnel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="buzo_principal">Buzo Principal</Label>
              <Input
                id="buzo_principal"
                value={formData.buzo_principal}
                onChange={(e)=>setFormData(prev=>({...prev,buzo_principal:e.target.value}))}
                placeholder="Nombre del buzo principal"
                required
              />
            </div>

            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <Input
                id="buzo_asistente"
                value={formData.buzo_asistente}
                onChange={(e)=>setFormData(prev=>({...prev,buzo_asistente:e.target.value}))}
                placeholder="Nombre del buzo asistente"
              />
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e)=>setFormData(prev=>({...prev,supervisor:e.target.value}))}
                placeholder="Nombre del supervisor"
                required
              />
            </div>
          </div>

          {/* Work Details */}
          <div>
            <Label htmlFor="objetivo">Objetivo de la Inmersión</Label>
            <Select 
              value={formData.objetivo} 
              onValueChange={(value)=>setFormData(prev=>({...prev,objetivo:value}))}
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
              <Label htmlFor="profundidad">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad"
                type="number"
                step="0.1"
                value={formData.profundidad_max}
                onChange={(e)=>setFormData(prev=>({...prev,profundidad_max:parseFloat(e.target.value)||0}))}
                required
              />
            </div>

            <div>
              <Label htmlFor="temperatura">Temperatura del Agua (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                value={formData.temperatura_agua}
                onChange={(e)=>setFormData(prev=>({...prev,temperatura_agua:parseFloat(e.target.value)||0}))}
                required
              />
            </div>

            <div>
              <Label htmlFor="visibilidad">Visibilidad (m)</Label>
              <Input
                id="visibilidad"
                type="number"
                step="0.1"
                value={formData.visibilidad}
                onChange={(e)=>setFormData(prev=>({...prev,visibilidad:parseFloat(e.target.value)||0}))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="corriente">Condicioncipales de Corriente</Label>
            <Select 
              value={formData.corriente} 
              onValueChange={(value)=>setFormData(prev=>({...prev,corriente:value}))}
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
              onChange={(e)=>setFormData(prev=>({...prev,observaciones:e.target.value}))}
              placeholder="Observaciones adicionales sobre la inmersión..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || validationMessages.some(m=>m.includes('requiere'))}>
              {loading ? 'Creando...' : editingInmersion ? 'Actualizar' : 'Crear Inmersión'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
